import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">🐾 AniCare</h3>
            <p className="text-gray-400 mb-6">
              Intelligent pet care platform providing personalized recommendations for your furry friends.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => scrollToSection('profile')}
                  className="hover:text-primary transition-colors"
                >
                  Pet Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('care-tips')}
                  className="hover:text-primary transition-colors"
                >
                  AI Care Tips
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="hover:text-primary transition-colors"
                >
                  Product Catalog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('training')}
                  className="hover:text-primary transition-colors"
                >
                  Training Guides
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('chatbot')}
                  className="hover:text-primary transition-colors"
                >
                  AI Assistant
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-primary transition-colors">Help Center</button></li>
              <li><button className="hover:text-primary transition-colors">Contact Us</button></li>
              <li><button className="hover:text-primary transition-colors">Vet Directory</button></li>
              <li><button className="hover:text-primary transition-colors">Emergency Care</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button className="hover:text-primary transition-colors">About Us</button></li>
              <li><button className="hover:text-primary transition-colors">Careers</button></li>
              <li><button className="hover:text-primary transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-primary transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AniCare. All rights reserved. Powered by AI for better pet care.</p>
        </div>
      </div>
    </footer>
  );
}
