import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, User } from "lucide-react";
import type { Comment } from "@shared/schema";

export default function CommentsSection() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/comments"],
  });

  const submitComment = useMutation({
    mutationFn: async (data: { name: string; rating: number; comment: string }) => {
      return apiRequest("POST", "/api/comments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      setName("");
      setRating("");
      setComment("");
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted and is pending approval.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rating || !comment) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    submitComment.mutate({ name, rating: parseInt(rating), comment });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-400"}`}
      />
    ));
  };

  return (
    <section className="bg-gaming-card py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gaming-text mb-4">What Our Customers Say</h3>
          <p className="text-gaming-text-secondary">Read reviews from satisfied gamers</p>
        </div>
        
        <div className="space-y-6 mb-8">
          {comments.length === 0 ? (
            <Card className="bg-gaming-card border-gaming-border">
              <CardContent className="p-6 text-center">
                <p className="text-gaming-text-secondary">No reviews yet. Be the first to leave a review!</p>
              </CardContent>
            </Card>
          ) : (
            comments.map((review) => (
              <Card key={review.id} className="bg-gaming-card border-gaming-border">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gaming-accent w-12 h-12 rounded-full flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gaming-text">{review.name}</h4>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gaming-text-secondary">{review.comment}</p>
                      <p className="text-gaming-text-secondary/60 text-sm mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Add Comment Form */}
        <Card className="bg-gaming-card border-gaming-border">
          <CardContent className="p-6">
            <h4 className="text-xl font-semibold text-gaming-text mb-4">Leave a Review</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gaming-card-hover border-gaming-border text-gaming-text focus:ring-gaming-accent"
                />
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="bg-gaming-card-hover border-gaming-border text-gaming-text focus:ring-gaming-accent">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-gaming-card border-gaming-border">
                    <SelectItem value="5" className="text-gaming-text hover:bg-gaming-card-hover">5 Stars</SelectItem>
                    <SelectItem value="4" className="text-gaming-text hover:bg-gaming-card-hover">4 Stars</SelectItem>
                    <SelectItem value="3" className="text-gaming-text hover:bg-gaming-card-hover">3 Stars</SelectItem>
                    <SelectItem value="2" className="text-gaming-text hover:bg-gaming-card-hover">2 Stars</SelectItem>
                    <SelectItem value="1" className="text-gaming-text hover:bg-gaming-card-hover">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Your Review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="bg-gaming-card-hover border-gaming-border text-gaming-text focus:ring-gaming-accent resize-none"
              />
              <Button 
                type="submit" 
                disabled={submitComment.isPending}
                className="bg-gaming-accent hover:bg-gaming-accent/90 text-white"
              >
                {submitComment.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
