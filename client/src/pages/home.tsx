import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import PetProfileForm from "@/components/pet-profile-form";
import CareRecommendations from "@/components/care-recommendations";
import ProductCatalog from "@/components/product-catalog";
import TrainingSection from "@/components/training-section";
import CompanyShowcase from "@/components/company-showcase";
import AiChat from "@/components/ai-chat";
import PetReels from "@/components/pet-reels";
import Footer from "@/components/footer";
import FloatingChatButton from "@/components/floating-chat-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <PetProfileForm />
      <CareRecommendations />
      <ProductCatalog />
      <TrainingSection />
      <CompanyShowcase />
      <AiChat />
      <PetReels />
      <Footer />
      <FloatingChatButton />
    </div>
  );
}
