import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LogOut, Plus, Edit, Trash2, Check, X } from "lucide-react";
import type { User, Game, Comment } from "@shared/schema";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Game form state
  const [gameForm, setGameForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  // Card form state
  const [cardForm, setCardForm] = useState({
    gameId: 0,
    points: "",
    bonus: "",
    price: 0,
  });

  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);

  // Queries
  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["/api/admin/comments"],
  });

  // Mutations
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout", {}),
    onSuccess: () => {
      queryClient.clear();
      setLocation("/");
    },
  });

  const createGameMutation = useMutation({
    mutationFn: (data: typeof gameForm) => apiRequest("POST", "/api/admin/games", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setGameForm({ name: "", slug: "", description: "" });
      setShowGameDialog(false);
      toast({ title: "Game created successfully" });
    },
  });

  const createCardMutation = useMutation({
    mutationFn: (data: typeof cardForm) => apiRequest("POST", `/api/admin/games/${data.gameId}/cards`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setCardForm({ gameId: 0, points: "", bonus: "", price: 0 });
      setShowCardDialog(false);
      toast({ title: "Card created successfully" });
    },
  });

  const approveCommentMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/comments/${id}/approve`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      toast({ title: "Comment approved" });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/comments/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/comments"] });
      toast({ title: "Comment deleted" });
    },
  });

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameForm.name || !gameForm.slug) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createGameMutation.mutate(gameForm);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.gameId || !cardForm.points || !cardForm.price) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createCardMutation.mutate(cardForm);
  };

  return (
    <div className="min-h-screen bg-gaming-bg text-gaming-text">
      {/* Header */}
      <header className="bg-gaming-nav border-b border-gaming-border py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gaming-text-secondary">Welcome back, {user.email}</p>
          </div>
          <Button
            onClick={() => logoutMutation.mutate()}
            variant="outline"
            className="border-gaming-border text-gaming-text hover:bg-gaming-card-hover"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="bg-gaming-card border-gaming-border">
            <TabsTrigger value="games" className="data-[state=active]:bg-gaming-accent">Games</TabsTrigger>
            <TabsTrigger value="comments" className="data-[state=active]:bg-gaming-accent">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Games</h2>
              <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gaming-accent hover:bg-green-600">
                    <Plus size={16} className="mr-2" />
                    Add Game
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gaming-card border-gaming-border text-gaming-text">
                  <DialogHeader>
                    <DialogTitle>Add New Game</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateGame} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Game Name</Label>
                      <Input
                        id="name"
                        value={gameForm.name}
                        onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={gameForm.slug}
                        onChange={(e) => setGameForm({ ...gameForm, slug: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={gameForm.description}
                        onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <Button type="submit" disabled={createGameMutation.isPending} className="bg-gaming-accent hover:bg-gaming-accent/90">
                      {createGameMutation.isPending ? "Creating..." : "Create Game"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {games.map((game) => (
                <Card key={game.id} className="bg-gaming-card border-gaming-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-gaming-text">{game.name}</CardTitle>
                        <p className="text-gaming-text-secondary text-sm">Slug: {game.slug}</p>
                        {game.description && <p className="text-gaming-text-secondary mt-2">{game.description}</p>}
                      </div>
                      <Badge variant={game.isActive ? "default" : "secondary"}>
                        {game.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <h2 className="text-xl font-semibold">Manage Comments</h2>
            
            <div className="grid gap-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-gaming-card border-gaming-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gaming-text">{comment.name}</h4>
                          <div className="flex">
                            {Array.from({ length: comment.rating }, (_, i) => (
                              <span key={i} className="text-yellow-400">⭐</span>
                            ))}
                          </div>
                          <Badge variant={comment.isApproved ? "default" : "secondary"}>
                            {comment.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                        <p className="text-gaming-text-secondary">{comment.comment}</p>
                        <p className="text-gaming-text-secondary/60 text-sm mt-2">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!comment.isApproved && (
                          <Button
                            onClick={() => approveCommentMutation.mutate(comment.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check size={16} />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteCommentMutation.mutate(comment.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
