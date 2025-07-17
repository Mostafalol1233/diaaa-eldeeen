import instaPayImg from "@assets/image_29_1752789719574.png";
import cibImg from "@assets/image_30_1752789719574.png";
import masterCardImg from "@assets/image_31_1752789719574.png";
import visaImg from "@assets/image_32_1752789719574.png";
import vodafoneImg from "@assets/image_33_1752789719574.png";
import etisalatImg from "@assets/image_34_1752789719574.png";
import wePayImg from "@assets/image_35_1752789719574.png";
import orangeImg from "@assets/image_36_1752789719574.png";

export default function PaymentMethods() {
  const paymentMethods = [
    { name: "InstaPay", image: instaPayImg, bgColor: "bg-purple-600" },
    { name: "CIB", image: cibImg, bgColor: "bg-blue-600" },
    { name: "MasterCard", image: masterCardImg, bgColor: "bg-red-500" },
    { name: "Visa", image: visaImg, bgColor: "bg-blue-700" },
    { name: "Vodafone Cash", image: vodafoneImg, bgColor: "bg-red-600" },
    { name: "Etisalat Cash", image: etisalatImg, bgColor: "bg-green-600" },
    { name: "WE Pay", image: wePayImg, bgColor: "bg-purple-700" },
    { name: "Orange Money", image: orangeImg, bgColor: "bg-orange-500" },
  ];

  return (
    <section className="bg-gaming-bg py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gaming-text mb-4">Payment Methods</h3>
          <p className="text-gaming-text-secondary">Choose your preferred payment method</p>
        </div>
        
        {/* Infinite sliding animation container */}
        <div className="overflow-hidden relative">
          <div className="flex animate-slide-right">
            {/* Duplicate methods 4 times for seamless infinite loop */}
            {[...paymentMethods, ...paymentMethods, ...paymentMethods, ...paymentMethods].map((method, index) => (
              <div 
                key={`right-${index}`}
                className="bg-gaming-card border border-gaming-border rounded-lg p-4 text-center hover:bg-gaming-card-hover transition-colors mx-3 min-w-[120px] flex-shrink-0"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${method.bgColor} flex items-center justify-center p-2`}>
                  <img 
                    src={method.image} 
                    alt={method.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gaming-text font-medium text-sm">{method.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Reverse infinite sliding animation */}
        <div className="overflow-hidden relative mt-8">
          <div className="flex animate-slide-left">
            {/* Duplicate reversed methods 4 times for seamless infinite loop */}
            {[...paymentMethods.slice().reverse(), ...paymentMethods.slice().reverse(), ...paymentMethods.slice().reverse(), ...paymentMethods.slice().reverse()].map((method, index) => (
              <div 
                key={`left-${index}`}
                className="bg-gaming-card border border-gaming-border rounded-lg p-4 text-center hover:bg-gaming-card-hover transition-colors mx-3 min-w-[120px] flex-shrink-0"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${method.bgColor} flex items-center justify-center p-2`}>
                  <img 
                    src={method.image} 
                    alt={method.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gaming-text font-medium text-sm">{method.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}