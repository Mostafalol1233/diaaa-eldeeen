export default function PaymentMethods() {
  const paymentMethods = [
    { name: "Vodafone Cash", icon: "📱", color: "text-red-500" },
    { name: "Etisalat Cash", icon: "📱", color: "text-orange-500" },
    { name: "NBE", icon: "🏦", color: "text-blue-500" },
    { name: "CIB", icon: "🏦", color: "text-green-500" },
    { name: "ADCB", icon: "🏦", color: "text-purple-500" },
  ];

  return (
    <section className="bg-gaming-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gaming-text mb-4">Payment Methods</h3>
          <p className="text-gaming-text-secondary">Choose your preferred payment method</p>
        </div>
        
        {/* Sliding animation container */}
        <div className="overflow-hidden relative">
          <div className="flex animate-slide-right whitespace-nowrap">
            {[...paymentMethods, ...paymentMethods].map((method, index) => (
              <div 
                key={index}
                className="bg-gaming-card border border-gaming-border rounded-lg p-6 text-center hover:bg-gaming-card-hover transition-colors mx-4 min-w-[150px] flex-shrink-0"
              >
                <div className={`${method.color} text-3xl mb-2`}>{method.icon}</div>
                <p className="text-gaming-text font-semibold">{method.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reverse sliding animation */}
        <div className="overflow-hidden relative mt-8">
          <div className="flex animate-slide-left whitespace-nowrap">
            {[...paymentMethods.reverse(), ...paymentMethods].map((method, index) => (
              <div 
                key={index}
                className="bg-gaming-card border border-gaming-border rounded-lg p-6 text-center hover:bg-gaming-card-hover transition-colors mx-4 min-w-[150px] flex-shrink-0"
              >
                <div className={`${method.color} text-3xl mb-2`}>{method.icon}</div>
                <p className="text-gaming-text font-semibold">{method.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}