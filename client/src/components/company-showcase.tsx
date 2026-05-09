import { Card, CardContent } from "@/components/ui/card";
import { Award, Shield, Heart } from "lucide-react";

export default function CompanyShowcase() {
  const companies = [
    "Purina", 
    "Hill's", 
    "Royal Canin", 
    "Petco", 
    "Chewy"
  ];

  const trustPoints = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Veterinarian Approved",
      description: "All recommendations reviewed by certified veterinarians",
      color: "text-primary"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guaranteed", 
      description: "Only premium, tested products for your pet's safety",
      color: "text-accent"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Pet Parent Trusted",
      description: "Loved by over 50,000 pet families worldwide", 
      color: "text-secondary"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted By Leading Pet Care Companies</h2>
          <p className="text-xl text-gray-600">Partnering with industry leaders to bring you the best care</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 items-center opacity-60 mb-16">
          {companies.map((company, index) => (
            <div key={index} className="text-center">
              <div className="bg-gray-100 rounded-lg p-6 h-20 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">{company}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Card className="warm-bg">
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {trustPoints.map((point, index) => (
                <div key={index} className="text-center">
                  <div className={`${point.color} mb-4 flex justify-center`}>
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                  <p className="text-gray-600">{point.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
