import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Define the schema for sign in
const signInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define the schema for registration
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
});

type SignInFormData = z.infer<typeof signInSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const SignIn = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { loginMutation, registerMutation, user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleSignIn = (data: SignInFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have been signed in successfully",
        });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Account created successfully. You've been signed in.",
        });
        setLocation("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
      <h1 className="mb-8 text-4xl font-bold text-center">
        {isSignIn ? "Sign In" : "Create Account"}
      </h1>

      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
        {isSignIn ? (
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
            <div>
              <Input
                placeholder="Username"
                {...signInForm.register("username")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {signInForm.formState.errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {signInForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...signInForm.register("password")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {signInForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {signInForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full p-4 text-lg font-medium text-white bg-black hover:bg-gray-800"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline"
                onClick={() => alert("Password reset functionality coming soon!")}
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div>
              <Input
                placeholder="Username"
                {...registerForm.register("username")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {registerForm.formState.errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {registerForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Email"
                {...registerForm.register("email")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {registerForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="First Name"
                {...registerForm.register("firstName")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {registerForm.formState.errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {registerForm.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Last Name (Optional)"
                {...registerForm.register("lastName")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {registerForm.formState.errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {registerForm.formState.errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...registerForm.register("password")}
                className="w-full p-4 text-lg border-gray-200"
              />
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full p-4 text-lg font-medium text-white bg-black hover:bg-gray-800"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}
      </Card>

      <div className="mt-6 text-center">
        {isSignIn ? (
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="font-bold hover:underline"
              onClick={toggleMode}
            >
              Create one.
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="font-bold hover:underline"
              onClick={toggleMode}
            >
              Sign in.
            </button>
          </p>
        )}
      </div>

      {/* Test account information */}
      <div className="mt-12 p-4 bg-gray-100 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Test Accounts</h3>
        <p className="text-sm mb-2">Use any of these accounts to test the application:</p>
        <ul className="text-sm space-y-1">
          <li><b>Username:</b> sarah_biohacker &nbsp; <b>Password:</b> password123</li>
          <li><b>Username:</b> max_wellness &nbsp; <b>Password:</b> password123</li>
          <li><b>Username:</b> emma_nutrition &nbsp; <b>Password:</b> password123</li>
          <li><b>Username:</b> alex_fitness &nbsp; <b>Password:</b> password123</li>
          <li><b>Username:</b> jamie_sleep &nbsp; <b>Password:</b> password123</li>
        </ul>
      </div>
    </div>
  );
};

export default SignIn;