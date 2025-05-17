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
import { Progress } from "@/components/ui/progress";
import { 
  Filter, 
  PlusCircle,
  Plus,
  Minus
} from "lucide-react";
import { useForum } from "@/hooks/use-forum";
import ForumPostCard from "@/components/forum/forum-post";
import { ForumPost } from "@shared/schema";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const CATEGORIES = [
  "All Posts",
  "Cognitive Enhancement",
  "Sleep Optimization",
  "Nutrition",
  "Fitness",
  "Supplements"
];

// Define the biomarker and protocol interfaces for the form
interface BiomarkerField {
  name: string;
  value: number;
  change: "up" | "down" | "neutral";
}

interface ProtocolField {
  name: string;
  icon: string;
}

interface PostFormData {
  title: string;
  content: string;
  category: string;
  biomarkers: BiomarkerField[];
  protocols: ProtocolField[];
}

const Community = () => {
  const { forumPosts, isLoading, createPost, isCreatingPost } = useForum();
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const form = useForm<PostFormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
      biomarkers: [
        { name: "Biomarker 1", value: 70, change: "up" },
        { name: "Biomarker 2", value: 55, change: "down" }
      ],
      protocols: [
        { name: "Acetyl Protein", icon: "💊" },
        { name: "Ashwagandha", icon: "🌿" }
      ]
    }
  });

  // Use fieldArray to handle dynamic addition of biomarkers and protocols
  const { fields: biomarkerFields, append: appendBiomarker, remove: removeBiomarker } = 
    useFieldArray({ control: form.control, name: "biomarkers" });

  const { fields: protocolFields, append: appendProtocol, remove: removeProtocol } = 
    useFieldArray({ control: form.control, name: "protocols" });
  
  const handleCreatePost = (data: PostFormData) => {
    // In a real implementation, you would save biomarkers and protocols
    // For now, let's stringify them and include in the content
    const biomarkerText = data.biomarkers.map(b => 
      `${b.name}: ${b.value} ${b.change === 'up' ? '↑' : '↓'}`
    ).join('\n');
    
    const protocolText = data.protocols.map(p => 
      `${p.icon} ${p.name}`
    ).join('\n');
    
    const enhancedContent = `${data.content}\n\n**Biomarkers**:\n${biomarkerText}\n\n**Active Protocol**:\n${protocolText}`;
    
    createPost({
      title: data.title,
      content: enhancedContent,
      category: data.category
    });
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
            <DialogContent className="sm:max-w-[700px]">
              <form onSubmit={form.handleSubmit(handleCreatePost)}>
                <DialogHeader>
                  <DialogTitle>Create a new post</DialogTitle>
                  <DialogDescription>
                    Share your biomarkers, protocols, and experiences with the community.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
                  {/* Title and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input 
                        id="title" 
                        placeholder="Enter a descriptive title" 
                        {...form.register("title", { required: true })}
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-red-500">Title is required</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Controller
                        control={form.control}
                        name="category"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
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
                        )}
                      />
                      {form.formState.errors.category && (
                        <p className="text-sm text-red-500">Category is required</p>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="grid gap-2">
                    <label htmlFor="content" className="text-sm font-medium">Post Content</label>
                    <Textarea 
                      id="content" 
                      placeholder="Describe what you're tracking and why..." 
                      rows={4}
                      {...form.register("content", { required: true })}
                    />
                    {form.formState.errors.content && (
                      <p className="text-sm text-red-500">Content is required</p>
                    )}
                  </div>

                  {/* Biomarkers Section */}
                  <div className="grid gap-4 border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Biomarkers</h3>
                      <Button 
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => appendBiomarker({ name: `Biomarker ${biomarkerFields.length + 1}`, value: 50, change: "neutral" })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Biomarker
                      </Button>
                    </div>
                    
                    {biomarkerFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-5">
                          <Input 
                            placeholder="Biomarker name"
                            {...form.register(`biomarkers.${index}.name` as const, { required: true })}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Input 
                            type="number"
                            placeholder="Value"
                            min={0}
                            max={999}
                            {...form.register(`biomarkers.${index}.value` as const, { 
                              required: true,
                              valueAsNumber: true
                            })}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Controller
                            control={form.control}
                            name={`biomarkers.${index}.change` as const}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="up">Increasing ↑</SelectItem>
                                  <SelectItem value="down">Decreasing ↓</SelectItem>
                                  <SelectItem value="neutral">No Change</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          {biomarkerFields.length > 1 && (
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeBiomarker(index)}
                            >
                              <Minus className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Protocols Section */}
                  <div className="grid gap-4 border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Active Protocol</h3>
                      <Button 
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => appendProtocol({ name: "", icon: "💊" })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Protocol Item
                      </Button>
                    </div>
                    
                    {protocolFields.map((field, index) => (
                      <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-2">
                          <Controller
                            control={form.control}
                            name={`protocols.${index}.icon` as const}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="💊">💊 Supplement</SelectItem>
                                  <SelectItem value="🌿">🌿 Herb</SelectItem>
                                  <SelectItem value="🍎">🍎 Diet</SelectItem>
                                  <SelectItem value="🏋️">🏋️ Exercise</SelectItem>
                                  <SelectItem value="😴">😴 Sleep</SelectItem>
                                  <SelectItem value="🧘">🧘 Meditation</SelectItem>
                                  <SelectItem value="🚿">🚿 Cold Shower</SelectItem>
                                  <SelectItem value="🔆">🔆 Light Therapy</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="md:col-span-9">
                          <Input 
                            placeholder="Protocol name"
                            {...form.register(`protocols.${index}.name` as const, { required: true })}
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          {protocolFields.length > 1 && (
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeProtocol(index)}
                            >
                              <Minus className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
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
          <ForumPostCard 
            post={selectedPost} 
            showContent={true} 
            expanded={true} 
          />
        )}
      </div>
    </div>
  );
};

export default Community;