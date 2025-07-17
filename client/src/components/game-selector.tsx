import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Game } from "@shared/schema";

interface GameSelectorProps {
  games: Game[];
  selectedGame: string;
  onGameSelect: (gameSlug: string) => void;
}

export default function GameSelector({ games, selectedGame, onGameSelect }: GameSelectorProps) {
  return (
    <div className="relative">
      <Select value={selectedGame} onValueChange={onGameSelect}>
        <SelectTrigger className="w-full bg-card-bg border-gray-600 text-white focus:ring-gaming-accent">
          <SelectValue placeholder="Select Your Game" />
        </SelectTrigger>
        <SelectContent className="bg-card-bg border-gray-600">
          {games.map((game) => (
            <SelectItem 
              key={game.id} 
              value={game.slug}
              className="text-white hover:bg-card-hover focus:bg-card-hover"
            >
              {game.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
