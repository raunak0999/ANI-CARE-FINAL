import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingChatButton() {
  const scrollToChat = () => {
    const element = document.getElementById('chatbot');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="floating-chat">
      <Button
        onClick={scrollToChat}
        size="lg"
        className="bg-primary text-white rounded-full w-16 h-16 shadow-lg hover:bg-orange-600 transition-all hover:scale-105"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
