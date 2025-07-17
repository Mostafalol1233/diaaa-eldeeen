import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameWithCards } from "@shared/schema";

interface GameCardsProps {
  gameSlug: string;
}

export default function GameCards({ gameSlug }: GameCardsProps) {
  const { data: game, isLoading } = useQuery<GameWithCards>({
    queryKey: ["/api/games", gameSlug],
    enabled: !!gameSlug,
  });

  const buyCard = (gameName: string, points: string, price: number) => {
    const message = `Hi! I want to buy ${gameName} ${points} points for EGP ${price}. Please provide payment instructions.`;
    const whatsappUrl = `https://wa.me/201011696196?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <section className="bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4 bg-gray-700" />
            <Skeleton className="h-4 w-96 mx-auto bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card-bg border-gray-600">
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4 bg-gray-700" />
                  <Skeleton className="h-6 w-32 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-24 mb-4 bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <section id="gameCards" className="bg-dark-bg py-16 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">Choose Your {game.name} Package</h3>
          <p className="text-gray-300">Select the perfect package for your gaming needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {game.cards.map((card) => (
            <Card 
              key={card.id} 
              className="bg-card-bg hover:bg-card-hover transition-all duration-300 border-gray-600 transform hover:scale-105 overflow-hidden"
            >
              <div className="h-48 bg-gradient-to-br from-gaming-accent/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎮</div>
                  <div className="text-white font-bold text-lg">{game.name}</div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">{card.points} Points</h4>
                    {card.bonus && (
                      <p className="text-gaming-accent">{card.bonus}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">EGP {card.price}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => buyCard(game.name, card.points, card.price)}
                  className="w-full bg-gaming-accent hover:bg-green-600 text-white transition-colors"
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
