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
import GameCardsManager from "@/components/game-cards-manager";

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

  // Edit states
  const [editingCard, setEditingCard] = useState<any>(null);
  const [editingGame, setEditingGame] = useState<any>(null);

  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [showEditCardDialog, setShowEditCardDialog] = useState(false);
  const [showEditGameDialog, setShowEditGameDialog] = useState(false);

  // Queries
  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/admin/games"],
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
      queryClient.invalidateQueries({ queryKey: ["/api/admin/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setGameForm({ name: "", slug: "", description: "" });
      setShowGameDialog(false);
      toast({ title: "Game created successfully" });
    },
  });

  const createCardMutation = useMutation({
    mutationFn: (data: typeof cardForm) => apiRequest("POST", `/api/admin/games/${data.gameId}/cards`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/games"] });
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

  const updateGameMutation = useMutation({
    mutationFn: (data: { id: number; game: any }) => apiRequest("PATCH", `/api/admin/games/${data.id}`, data.game),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setEditingGame(null);
      setShowEditGameDialog(false);
      toast({ title: "Game updated successfully" });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: (data: { id: number; card: any }) => apiRequest("PATCH", `/api/admin/cards/${data.id}`, data.card),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setEditingCard(null);
      setShowEditCardDialog(false);
      toast({ title: "Card updated successfully" });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/games/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "Game deleted" });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/cards/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({ title: "Card deleted" });
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
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-gaming-text">{game.name}</CardTitle>
                        <p className="text-gaming-text-secondary text-sm">Slug: {game.slug}</p>
                        {game.description && <p className="text-gaming-text-secondary mt-2">{game.description}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={game.isActive ? "default" : "secondary"}>
                          {game.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGame(game);
                            setShowEditGameDialog(true);
                          }}
                          className="border-gaming-border"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteGameMutation.mutate(game.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Game Cards Section */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gaming-text">Game Cards</h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            setCardForm({ gameId: game.id, points: "", bonus: "", price: 0 });
                            setShowCardDialog(true);
                          }}
                          className="bg-gaming-accent hover:bg-gaming-accent/90"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Card
                        </Button>
                      </div>
                      
                      <div className="grid gap-2">
                        {/* Show game cards here */}
                        <GameCardsManager 
                          gameId={game.id} 
                          onEditCard={(card) => {
                            setEditingCard(card);
                            setShowEditCardDialog(true);
                          }} 
                          onDeleteCard={(id) => deleteCardMutation.mutate(id)} 
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Add Card Dialog */}
            <Dialog open={showCardDialog} onOpenChange={setShowCardDialog}>
              <DialogContent className="bg-gaming-card border-gaming-border text-gaming-text">
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCard} className="space-y-4">
                  <div>
                    <Label htmlFor="cardPoints">Points</Label>
                    <Input
                      id="cardPoints"
                      value={cardForm.points}
                      onChange={(e) => setCardForm({ ...cardForm, points: e.target.value })}
                      className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      placeholder="e.g., 180 + 18"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardBonus">Bonus (optional)</Label>
                    <Input
                      id="cardBonus"
                      value={cardForm.bonus}
                      onChange={(e) => setCardForm({ ...cardForm, bonus: e.target.value })}
                      className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      placeholder="e.g., Exclusive skin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardPrice">Price (EGP)</Label>
                    <Input
                      id="cardPrice"
                      type="number"
                      value={cardForm.price}
                      onChange={(e) => setCardForm({ ...cardForm, price: parseFloat(e.target.value) || 0 })}
                      className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                    />
                  </div>
                  <Button type="submit" disabled={createCardMutation.isPending} className="bg-gaming-accent hover:bg-gaming-accent/90">
                    {createCardMutation.isPending ? "Creating..." : "Create Card"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {/* Edit Card Dialog */}
            <Dialog open={showEditCardDialog} onOpenChange={setShowEditCardDialog}>
              <DialogContent className="bg-gaming-card border-gaming-border text-gaming-text">
                <DialogHeader>
                  <DialogTitle>Edit Card</DialogTitle>
                </DialogHeader>
                {editingCard && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateCardMutation.mutate({
                      id: editingCard.id,
                      card: {
                        points: editingCard.points,
                        bonus: editingCard.bonus,
                        price: editingCard.price,
                        isActive: editingCard.isActive
                      }
                    });
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="editCardPoints">Points</Label>
                      <Input
                        id="editCardPoints"
                        value={editingCard.points}
                        onChange={(e) => setEditingCard({ ...editingCard, points: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCardBonus">Bonus (optional)</Label>
                      <Input
                        id="editCardBonus"
                        value={editingCard.bonus || ""}
                        onChange={(e) => setEditingCard({ ...editingCard, bonus: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editCardPrice">Price (EGP)</Label>
                      <Input
                        id="editCardPrice"
                        type="number"
                        value={editingCard.price}
                        onChange={(e) => setEditingCard({ ...editingCard, price: parseFloat(e.target.value) || 0 })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editCardActive"
                        checked={editingCard.isActive}
                        onChange={(e) => setEditingCard({ ...editingCard, isActive: e.target.checked })}
                        className="rounded border-gaming-border"
                      />
                      <Label htmlFor="editCardActive">Active</Label>
                    </div>
                    <Button type="submit" disabled={updateCardMutation.isPending} className="bg-gaming-accent hover:bg-gaming-accent/90">
                      {updateCardMutation.isPending ? "Updating..." : "Update Card"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Edit Game Dialog */}
            <Dialog open={showEditGameDialog} onOpenChange={setShowEditGameDialog}>
              <DialogContent className="bg-gaming-card border-gaming-border text-gaming-text">
                <DialogHeader>
                  <DialogTitle>Edit Game</DialogTitle>
                </DialogHeader>
                {editingGame && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateGameMutation.mutate({
                      id: editingGame.id,
                      game: {
                        name: editingGame.name,
                        slug: editingGame.slug,
                        description: editingGame.description,
                        isActive: editingGame.isActive
                      }
                    });
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="editGameName">Game Name</Label>
                      <Input
                        id="editGameName"
                        value={editingGame.name}
                        onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editGameSlug">Slug</Label>
                      <Input
                        id="editGameSlug"
                        value={editingGame.slug}
                        onChange={(e) => setEditingGame({ ...editingGame, slug: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editGameDescription">Description</Label>
                      <Textarea
                        id="editGameDescription"
                        value={editingGame.description || ""}
                        onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                        className="bg-gaming-card-hover border-gaming-border text-gaming-text"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editGameActive"
                        checked={editingGame.isActive}
                        onChange={(e) => setEditingGame({ ...editingGame, isActive: e.target.checked })}
                        className="rounded border-gaming-border"
                      />
                      <Label htmlFor="editGameActive">Active</Label>
                    </div>
                    <Button type="submit" disabled={updateGameMutation.isPending} className="bg-gaming-accent hover:bg-gaming-accent/90">
                      {updateGameMutation.isPending ? "Updating..." : "Update Game"}
                    </Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
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
