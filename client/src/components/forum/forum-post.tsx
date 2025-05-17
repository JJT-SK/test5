import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FaComment, FaThumbsUp, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ForumPost, ForumComment } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pill } from "@/components/ui/pill";
import { Progress } from "@/components/ui/progress";

interface ForumPostProps {
  post: ForumPost;
  onClick?: (post: ForumPost) => void;
  showContent?: boolean;
  expanded?: boolean;
}

// Mock biomarker data for the new post format
interface Biomarker {
  name: string;
  value: number;
  change: "up" | "down" | "neutral";
  percentage: number;
}

// Mock protocol item
interface ProtocolItem {
  name: string;
  icon: string;
}

const ForumPostCard = ({ post, onClick, showContent = false, expanded = false }: ForumPostProps) => {
  const [showComments, setShowComments] = useState(expanded);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [visibleComments, setVisibleComments] = useState(10);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  
  const handleClick = () => {
    if (onClick) {
      onClick(post);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!commentsLoaded && !showComments) {
      // Mock loading comments - in real app would fetch from API
      // This would be replaced with an actual API call
      setTimeout(() => {
        const mockComments: ForumComment[] = Array(30).fill(null).map((_, index) => ({
          id: index + 1,
          postId: post.id,
          userId: Math.floor(Math.random() * 100) + 1,
          parentId: index > 25 ? 1 : null, // Make some comments replies to first comment
          content: `This is a sample comment ${index + 1}. I'd recommend checking your protocol timing.`,
          likeCount: Math.floor(Math.random() * 20),
          createdAt: new Date(Date.now() - Math.random() * 10000000000)
        }));
        
        setComments(mockComments);
        setCommentsLoaded(true);
      }, 500);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments(prevVisible => prevVisible + 10);
  };

  const submitComment = () => {
    if (newComment.trim() === "") return;
    
    const newCommentObj: ForumComment = {
      id: comments.length + 1,
      postId: post.id,
      userId: 1, // Current user ID
      parentId: replyingTo,
      content: newComment,
      likeCount: 0,
      createdAt: new Date()
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment("");
    setReplyingTo(null);
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    // Focus on comment input
    document.getElementById('comment-input')?.focus();
  };

  // Mock data based on the provided design
  const biomarkers: Biomarker[] = [
    { name: "Biomarker 1", value: 72, change: "up", percentage: 60 },
    { name: "Biomarker 2", value: 56, change: "down", percentage: 40 },
    { name: "Biomarker 3", value: 198, change: "up", percentage: 80 }
  ];

  const protocols: ProtocolItem[] = [
    { name: "Acetyl Protein", icon: "💊" },
    { name: "Ashwagandha", icon: "🌿" },
    { name: "Cold shower", icon: "🚿" }
  ];

  const likeCount = 20;

  // For standard post card format (in the feed view)
  if (!expanded && !showContent) {
    return (
      <div 
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4 ${
          onClick ? 'cursor-pointer hover:border-gray-300 transition-colors' : ''
        }`}
        onClick={handleClick}
      >
        <div className="flex justify-between mb-2">
          <span className="text-xs bg-blue-50 text-primary px-2 py-1 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center text-xs text-dark-light">
            <FaComment className="mr-1" />
            <span>{post.commentCount}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-dark mb-1">{post.title}</h3>
        
        {showContent && (
          <div className="text-dark-medium text-sm mb-3">{post.content}</div>
        )}
        
        <div className="flex items-center text-xs text-dark-light mt-2">
          <span>by @user{post.userId}</span>
          <span className="mx-2">•</span>
          <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt)), { addSuffix: true }) : 'recently'}</span>
        </div>
      </div>
    );
  }

  // Enhanced post card format based on the provided design
  return (
    <Card className="w-full overflow-hidden mb-6">
      <div className="p-6">
        {/* User Header */}
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${post.userId}`} />
            <AvatarFallback>U{post.userId}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-2xl font-bold mr-3">User {post.userId}</h3>
              <Pill className="bg-gray-200 text-gray-800">{likeCount}</Pill>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>

        {/* Post Content */}
        <p className="text-lg mb-8">{post.content}</p>

        {/* Biomarkers and Protocol Section */}
        <div className="flex flex-col md:flex-row">
          {/* Left Column - Biomarkers */}
          <div className="flex-1 pr-4">
            {biomarkers.map((biomarker, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-lg font-medium">{biomarker.name}</div>
                  <div className="flex items-center">
                    <span className="text-xl font-semibold mr-2">{biomarker.value}</span>
                    {biomarker.change === "up" ? (
                      <FaArrowUp className="text-green-500" />
                    ) : biomarker.change === "down" ? (
                      <FaArrowDown className="text-red-500" />
                    ) : null}
                  </div>
                </div>
                <Progress value={biomarker.percentage} className="h-2 bg-gray-200" />
              </div>
            ))}
          </div>

          {/* Right Column - Active Protocol */}
          <div className="flex-1 pl-0 md:pl-8 md:border-l border-gray-200 mt-4 md:mt-0">
            <h3 className="text-lg font-medium mb-4">Active Protocol</h3>
            {protocols.map((protocol, index) => (
              <div key={index} className="flex items-center mb-3">
                <span className="text-2xl mr-3">{protocol.icon}</span>
                <span className="text-lg">{protocol.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interaction Footer */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Button variant="ghost" className="flex items-center text-gray-500 hover:text-primary">
              <FaThumbsUp className="mr-2" />
              <span className="font-medium">{likeCount}</span>
            </Button>
          </div>
          <Button 
            variant="ghost" 
            onClick={toggleComments}
            className="flex items-center text-gray-500 hover:text-primary"
          >
            <FaComment className="mr-2" />
            <span className="font-medium">{post.commentCount} comments</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-gray-100">
            {/* New Comment Input */}
            <div className="mb-4">
              <Textarea 
                id="comment-input"
                placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
              />
              <div className="flex justify-between mt-2">
                {replyingTo && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel Reply
                  </Button>
                )}
                <Button 
                  onClick={submitComment}
                  className="ml-auto"
                >
                  {replyingTo ? "Reply" : "Comment"}
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {!commentsLoaded ? (
              <div className="text-center p-4">Loading comments...</div>
            ) : (
              <>
                {/* Top-level comments */}
                {comments
                  .filter(comment => comment.parentId === null)
                  .slice(0, visibleComments)
                  .map(comment => (
                    <div key={comment.id} className="mb-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.userId}`} />
                          <AvatarFallback>U{comment.userId}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-medium mr-2">User {comment.userId}</span>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt instanceof Date ? comment.createdAt : new Date(comment.createdAt)), { addSuffix: true }) : 'recently'}
                            </span>
                          </div>
                          <div className="text-gray-800 mb-2">{comment.content}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-0 h-auto mr-4 hover:bg-transparent hover:text-primary"
                              onClick={() => handleReply(comment.id)}
                            >
                              Reply
                            </Button>
                            <span className="flex items-center">
                              <FaThumbsUp className="mr-1" size={12} />
                              <span>{comment.likeCount}</span>
                            </span>
                          </div>

                          {/* Nested comments/replies */}
                          {comments
                            .filter(reply => reply.parentId === comment.id)
                            .map(reply => (
                              <div key={reply.id} className="ml-6 mt-3 p-3 bg-white rounded-lg">
                                <div className="flex items-start">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${reply.userId}`} />
                                    <AvatarFallback>U{reply.userId}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                      <span className="font-medium text-sm mr-2">User {reply.userId}</span>
                                      <span className="text-xs text-gray-500">
                                        {reply.createdAt ? formatDistanceToNow(new Date(reply.createdAt instanceof Date ? reply.createdAt : new Date(reply.createdAt)), { addSuffix: true }) : 'recently'}
                                      </span>
                                    </div>
                                    <div className="text-gray-800 text-sm">{reply.content}</div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-0 h-auto mr-4 hover:bg-transparent hover:text-primary"
                                        onClick={() => handleReply(comment.id)}
                                      >
                                        Reply
                                      </Button>
                                      <span className="flex items-center">
                                        <FaThumbsUp className="mr-1" size={10} />
                                        <span>{reply.likeCount}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Load More Button */}
                {comments.filter(comment => comment.parentId === null).length > visibleComments && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={loadMoreComments}
                    >
                      Show More Comments
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ForumPostCard;