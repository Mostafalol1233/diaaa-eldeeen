import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import GameCards from "@/components/game-cards";
import CommentsSection from "@/components/comments-section";
import WhatsAppButton from "@/components/whatsapp-button";
import AdminLogin from "@/components/admin-login";
import PaymentMethods from "@/components/payment-methods";
import { Gamepad2, ShoppingCart, Shield, Headphones, Zap } from "lucide-react";
import type { Game } from "@shared/schema";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  return (
    <div className="min-h-screen bg-gaming-bg text-gaming-text">
      <WhatsAppButton />

      {/* Navigation */}
      <nav className="bg-gaming-nav border-b border-gaming-border sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="text-gaming-primary" size={28} />
                <h1 className="text-xl font-bold text-gaming-text">Diaa Eldeen Sadek</h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-6">
                <a href="#games" className="text-gaming-text-secondary hover:text-gaming-primary transition-colors">
                  Games
                </a>
                <a href="#features" className="text-gaming-text-secondary hover:text-gaming-primary transition-colors">
                  Features
                </a>
                <a href="#comments" className="text-gaming-text-secondary hover:text-gaming-primary transition-colors">
                  Reviews
                </a>
                <a href="#contact" className="text-gaming-text-secondary hover:text-gaming-primary transition-colors">
                  Contact
                </a>
              </nav>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Button 
                  onClick={() => setShowAdminLogin(true)}
                  className="bg-gaming-accent hover:bg-gaming-accent/90 text-white text-sm px-4 py-2"
                  title="Admin Login - Username: admin, Password: admin123"
                >
                  🔐 Admin Panel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gaming-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Top-Up Your Favorite Game
              <span className="text-yellow-300 block mt-2">Instantly!</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Buy prepaid game cards for CrossFire, Free Fire, and PUBG with bonus deals and instant delivery
            </p>
          </div>
        </div>
      </section>

      {/* Games Catalog Section */}
      <section id="games" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gaming-text mb-4">Choose Your Game</h3>
            <p className="text-gaming-text-secondary">Select a game to view available packages</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {games?.map((game) => (
              <Card 
                key={game.id} 
                className={`bg-gaming-card border-gaming-border cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedGame === game.slug ? 'ring-2 ring-gaming-primary' : ''
                }`}
                onClick={() => setSelectedGame(selectedGame === game.slug ? "" : game.slug)}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-gaming-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="text-white" size={32} />
                  </div>
                  <h4 className="text-xl font-semibold text-gaming-text mb-2">{game.name}</h4>
                  {game.description && (
                    <p className="text-gaming-text-secondary text-sm">{game.description}</p>
                  )}
                  <div className="mt-4">
                    <Button 
                      variant={selectedGame === game.slug ? "default" : "outline"}
                      className={selectedGame === game.slug ? "bg-gaming-primary text-white" : "border-gaming-border text-gaming-text hover:bg-gaming-card-hover"}
                    >
                      {selectedGame === game.slug ? "Selected" : "Select Game"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Game Cards Section */}
          {selectedGame && (
            <div className="animate-in slide-in-from-bottom duration-500">
              <GameCards gameSlug={selectedGame} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gaming-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gaming-text mb-4">Why Choose Us?</h3>
            <p className="text-gaming-text-secondary">Experience the best gaming top-up service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gaming-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-gaming-text mb-2">Instant Delivery</h4>
              <p className="text-gaming-text-secondary">Get your game cards delivered instantly via WhatsApp</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gaming-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-gaming-text mb-2">Secure Payment</h4>
              <p className="text-gaming-text-secondary">Safe transactions with multiple payment methods</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gaming-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-gaming-text mb-2">24/7 Support</h4>
              <p className="text-gaming-text-secondary">Get help anytime through our WhatsApp support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <PaymentMethods />

      {/* Comments Section */}
      <div id="comments">
        <CommentsSection />
      </div>

      {/* Contact Section */}
      <section id="contact" className="bg-gaming-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gaming-text mb-4">Get in Touch</h3>
            <p className="text-gaming-text-secondary">Have questions? Contact us directly</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gaming-gradient p-1">
              <div className="bg-gaming-card rounded-lg p-8 text-center">
                <div className="text-green-500 text-6xl mb-4">💬</div>
                <h4 className="text-2xl font-semibold text-gaming-text mb-2">WhatsApp Support</h4>
                <p className="text-gaming-text-secondary mb-6">Get instant help and purchase your game cards</p>
                <a 
                  href="https://wa.me/201011696196" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors inline-block"
                >
                  💬 Chat Now: 01011696196
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gaming-nav py-8 border-t border-gaming-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Gamepad2 className="text-gaming-primary" size={24} />
              <h3 className="text-xl font-bold text-gaming-text">Diaa Eldeen Sadek</h3>
            </div>
            <p className="text-gaming-text-secondary mb-4">Your trusted source for gaming top-ups</p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://wa.me/201011696196" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gaming-text-secondary hover:text-green-500 transition-colors"
              >
                💬
              </a>
            </div>
            <p className="text-gaming-text-secondary/60 mt-4">&copy; 2024 Diaa Eldeen Sadek. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLogin 
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
      />
    </div>
  );
}