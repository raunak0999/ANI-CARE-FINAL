import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToProfile = () => {
    const element = document.getElementById('profile');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="gradient-bg py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Smart Pet Care Made Simple
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              Get personalized AI-powered recommendations for your furry friends. From nutrition to training, we've got everything covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToProfile}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Create Pet Profile
              </Button>
              <Button 
                onClick={scrollToProducts}
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors bg-transparent"
              >
                Explore Products
              </Button>
            </div>
          </div>
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&auto=format" 
              alt="Happy dog and owner playing together" 
              className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto" 
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/300x200?text=🐾";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
