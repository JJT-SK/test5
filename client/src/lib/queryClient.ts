import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockApi } from "./mockApi";

// Check if we're in GitHub Pages environment
// This checks if we're in production mode and BASE_URL is set to GitHub Pages path
const isGitHubPages = import.meta.env.PROD;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Mock API request function for GitHub Pages
async function mockApiRequest(url: string, userId = 1) {
  const path = url.split("/");
  const endpoint = path[path.length - 1];
  const parentEndpoint = path.length > 2 ? path[path.length - 2] : null;
  
  // Extract query params if they exist
  const queryParams: Record<string, any> = {};
  if (url.includes("?")) {
    const queryString = url.split("?")[1];
    queryString.split("&").forEach(param => {
      const [key, value] = param.split("=");
      queryParams[key] = value;
    });
  }
  
  // Handle various API endpoints
  switch (true) {
    case url.includes(`/api/users/${userId}`):
      return await mockApi.getUser(userId);
      
    case url.includes("/api/protocols/active"):
      return await mockApi.getActiveProtocols(userId);
      
    case url.includes("/api/biometrics/recent"):
      const days = queryParams.days ? parseInt(queryParams.days) : 30;
      return await mockApi.getBiometrics(userId, days);
      
    case url.includes("/api/achievements"):
      return await mockApi.getAchievements(userId);
      
    case url.includes("/api/forum-posts"):
      // Check if category is specified
      if (queryParams.category) {
        return await mockApi.getForumPostsByCategory(queryParams.category);
      }
      return await mockApi.getForumPosts();
      
    default:
      throw new Error(`Unhandled mock endpoint: ${url}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response | any> {
  // For GitHub Pages, use mock API
  if (isGitHubPages) {
    try {
      let result;
      const userId = 1; // Default user ID
      
      switch (true) {
        case method === "POST" && url.includes("/api/protocols"):
          result = await mockApi.createProtocol(data as any);
          break;
        
        case method === "POST" && url.includes("/api/protocol-check-ins"):
          result = await mockApi.checkInProtocol((data as any).protocolId);
          break;
          
        case method === "POST" && url.includes("/api/forum-posts"):
          result = await mockApi.createForumPost(data as any);
          break;
          
        case method === "POST" && url.includes("/api/check-in"):
          result = await mockApi.checkIn(data as any);
          break;
          
        default:
          throw new Error(`Unhandled mock API request: ${method} ${url}`);
      }
      
      // Create a mock Response object
      return {
        json: async () => result,
        ok: true
      };
    } catch (error) {
      console.error("Mock API error:", error);
      throw error;
    }
  }
  
  // Regular API request for development
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // For GitHub Pages, use mock API
    if (isGitHubPages) {
      try {
        return await mockApiRequest(queryKey[0] as string);
      } catch (error) {
        console.error("Mock query error:", error);
        throw error;
      }
    }
    
    // Regular API request for development
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
