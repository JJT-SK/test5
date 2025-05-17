import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Filter, 
  PlusCircle
} from "lucide-react";
import { useForum } from "@/hooks/use-forum";
import ForumPostCard from "@/components/forum/forum-post";
import { ForumPost } from "@shared/schema";
import { useForm } from "react-hook-form";

const CATEGORIES = [
  "All Posts",
  "Cognitive Enhancement",
  "Sleep Optimization",
  "Nutrition",
  "Fitness",
  "Supplements"
];

const Community = () => {
  const { forumPosts, isLoading, createPost, isCreatingPost } = useForum();
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      category: ""
    }
  });
  
  const handleCreatePost = (data: { title: string; content: string; category: string }) => {
    createPost(data);
    setIsCreateDialogOpen(false);
    form.reset();
  };
  
  const filteredPosts = activeCategory === "All Posts" 
    ? forumPosts 
    : forumPosts.filter(post => post.category === activeCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-dark">Community Forum</h1>
        <p className="text-dark-light">Connect with fellow biohackers and share your experiences.</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              {CATEGORIES.slice(0, 3).map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category === "All Posts" ? "all" : category.toLowerCase().replace(/\s+/g, '-')}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={form.handleSubmit(handleCreatePost)}>
                <DialogHeader>
                  <DialogTitle>Create a new post</DialogTitle>
                  <DialogDescription>
                    Share your knowledge, questions, or experiences with the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <Input 
                      id="title" 
                      placeholder="Enter a descriptive title" 
                      {...form.register("title", { required: true })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select 
                      onValueChange={(value) => form.setValue("category", value)} 
                      defaultValue=""
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.slice(1).map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="content" className="text-sm font-medium">Content</label>
                    <Textarea 
                      id="content" 
                      placeholder="Write your post content here..." 
                      rows={5}
                      {...form.register("content", { required: true })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreatingPost}>
                    {isCreatingPost ? "Posting..." : "Post"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Forum Posts */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Trending Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-dark-light">Loading forum posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-dark-light">No posts found in this category.</p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  Create the first post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <ForumPostCard 
                    key={post.id} 
                    post={post} 
                    onClick={(post) => setSelectedPost(post)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {selectedPost && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ForumPostCard post={selectedPost} showContent={true} />
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Comments</h4>
                <div className="bg-light p-4 rounded-lg text-center">
                  <p className="text-dark-light">Coming soon: comment functionality</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Community;
