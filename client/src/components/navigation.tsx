import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem } =
    useCart();
  const totalItems = getTotalItems();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">🐾 AniCare</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => scrollToSection("profile")}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Pet Profile
                  </button>
                  <button
                    onClick={() => scrollToSection("care-tips")}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Care Tips
                  </button>
                  <button
                    onClick={() => scrollToSection("products")}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => scrollToSection("training")}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Training
                  </button>
                  <button
                    onClick={() => scrollToSection("pet-reels")}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Reels
                  </button>
                  <button
                    onClick={() => scrollToSection("chatbot")}
                    className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  >
                    ChatBot
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsCartOpen(true)}
                className="bg-primary text-white hover:bg-orange-600 transition-colors relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({totalItems})
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <button
                onClick={() => scrollToSection("home")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("profile")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left cursor-pointer"
              >
                Pet Profile
              </button>
              <button
                onClick={() => scrollToSection("care-tips")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left cursor-pointer"
              >
                Care Tips
              </button>
              <button
                onClick={() => scrollToSection("products")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("training")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left"
              >
                Training
              </button>
              <button
                onClick={() => scrollToSection("pet-reels")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left"
              >
                Reels
              </button>
              <button
                onClick={() => scrollToSection("chatbot")}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 w-full text-left"
              >
                ChatBot
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Your Cart
            </SheetTitle>
            <SheetDescription>
              {totalItems === 0
                ? "Your cart is empty"
                : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
            </SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 text-lg font-medium">
                Your cart is empty
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Add some products to get started!
              </p>
              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  scrollToSection("products");
                }}
                className="mt-6 bg-primary text-white hover:bg-orange-600"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 bg-gray-50 rounded-xl p-3 relative group"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/64x64?text=🐾";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-primary font-bold text-sm mt-0.5">
                          ₹{item.price}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-gray-700">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t pt-4 space-y-4 mt-auto">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-primary">
                    ₹{Math.round(getTotalPrice())}
                  </span>
                </div>
                <Button className="w-full bg-primary text-white hover:bg-orange-600 py-6 text-base font-semibold rounded-xl">
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
