import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GameSelector from "@/components/game-selector";
import GameCards from "@/components/game-cards";
import CommentsSection from "@/components/comments-section";
import WhatsAppButton from "@/components/whatsapp-button";
import AdminLogin from "@/components/admin-login";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Shield, Headphones, Zap } from "lucide-react";
import type { Game } from "@shared/schema";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <WhatsAppButton />

      {/* Navigation */}
      <nav className="bg-dark-bg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-nav-text">Diaa Eldeen Sadek</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#games" className="text-nav-text hover:text-gaming-accent transition-colors">Games</a>
              <a href="#pricing" className="text-nav-text hover:text-gaming-accent transition-colors">Pricing</a>
              <a href="#contact" className="text-nav-text hover:text-gaming-accent transition-colors">Contact</a>
              <Button 
                onClick={() => setShowAdminLogin(true)}
                className="bg-gaming-accent hover:bg-green-600 text-white"
              >
                Admin
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-dark-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Top-Up Your Favorite Game
              <span className="text-gaming-accent block mt-2">Instantly!</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Buy prepaid game cards for CrossFire, Free Fire, and PUBG with bonus deals and instant delivery
            </p>
            
            <div className="max-w-md mx-auto mb-12">
              <GameSelector 
                games={games || []}
                selectedGame={selectedGame}
                onGameSelect={setSelectedGame}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Game Cards Section */}
      {selectedGame && (
        <GameCards gameSlug={selectedGame} />
      )}

      {/* Features Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why Choose Us?</h3>
            <p className="text-gray-300">Experience the best gaming top-up service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gaming-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Instant Delivery</h4>
              <p className="text-gray-300">Get your game cards delivered instantly via WhatsApp</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gaming-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Secure Payment</h4>
              <p className="text-gray-300">Safe transactions with Vodafone Cash, Etisalat Cash, and NBE</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gaming-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-white" size={24} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-gray-300">Get help anytime through our WhatsApp support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Payment Methods</h3>
            <p className="text-gray-300">Choose your preferred payment method</p>
          </div>
          
          <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
            <div className="bg-card-bg p-6 rounded-lg text-center hover:bg-card-hover transition-colors">
              <div className="text-red-500 text-3xl mb-2">📱</div>
              <p className="text-white font-semibold">Vodafone Cash</p>
            </div>
            <div className="bg-card-bg p-6 rounded-lg text-center hover:bg-card-hover transition-colors">
              <div className="text-orange-500 text-3xl mb-2">📱</div>
              <p className="text-white font-semibold">Etisalat Cash</p>
            </div>
            <div className="bg-card-bg p-6 rounded-lg text-center hover:bg-card-hover transition-colors">
              <div className="text-blue-500 text-3xl mb-2">🏦</div>
              <p className="text-white font-semibold">NBE</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <CommentsSection />

      {/* Contact Section */}
      <section id="contact" className="bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Get in Touch</h3>
            <p className="text-gray-300">Have questions? Contact us directly</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-card-bg p-8 rounded-lg text-center">
              <div className="text-green-500 text-6xl mb-4">💬</div>
              <h4 className="text-2xl font-semibold text-white mb-2">WhatsApp Support</h4>
              <p className="text-gray-300 mb-6">Get instant help and purchase your game cards</p>
              <a 
                href="https://wa.me/201011696196" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors inline-block"
              >
                💬 Chat Now: 01011696196
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-4">Diaa Eldeen Sadek</h3>
            <p className="text-gray-400 mb-4">Your trusted source for gaming top-ups</p>
            <div className="flex justify-center space-x-6">
              <a 
                href="https://wa.me/201011696196" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                💬
              </a>
            </div>
            <p className="text-gray-500 mt-4">&copy; 2024 Diaa Eldeen Sadek. All rights reserved.</p>
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
