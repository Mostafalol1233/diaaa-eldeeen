import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { GameCard } from "@shared/schema";

interface GameCardsManagerProps {
  gameId: number;
  onEditCard: (card: GameCard) => void;
  onDeleteCard: (cardId: number) => void;
}

export default function GameCardsManager({ gameId, onEditCard, onDeleteCard }: GameCardsManagerProps) {
  const { data: game } = useQuery({
    queryKey: ["/api/admin/games"],
    select: (games: any[]) => games.find(g => g.id === gameId)
  });

  if (!game?.cards) {
    return <p className="text-gaming-text-secondary text-sm">No cards found for this game.</p>;
  }

  return (
    <div className="space-y-2">
      {game.cards.map((card: GameCard) => (
        <div key={card.id} className="flex items-center justify-between p-3 bg-gaming-card-hover rounded-lg border border-gaming-border">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gaming-text">{card.points}</span>
              {card.bonus && (
                <Badge variant="secondary" className="text-xs">
                  +{card.bonus}
                </Badge>
              )}
              <span className="text-gaming-accent font-semibold">EGP {card.price}</span>
              <Badge variant={card.isActive ? "default" : "secondary"} className="text-xs">
                {card.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditCard(card)}
              className="border-gaming-border"
            >
              <Edit size={12} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeleteCard(card.id)}
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}