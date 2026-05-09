import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());
  const { addItem } = useCart();
  const { toast } = useToast();

  const API_BASE_URL = "";

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory],
    queryFn: async () => {
      const url =
        selectedCategory !== "all"
          ? `${API_BASE_URL}/api/products?category=${encodeURIComponent(selectedCategory)}`
          : `${API_BASE_URL}/api/products`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const categories = [
    "all",
    "Food & Treats",
    "Toys & Accessories",
    "Health & Medicine",
    "Grooming",
  ];

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setAddedProducts((prev) => new Set([...prev, product.id]));

    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });

    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  const getProductBadge = (product: Product) => {
    if (product.isRecommended) {
      return <Badge className="bg-accent text-white">AI Recommended</Badge>;
    }
    if (product.isBestseller) {
      return <Badge className="bg-secondary text-white">Bestseller</Badge>;
    }
    if (product.isVetApproved) {
      return <Badge className="bg-primary text-white">Vet Approved</Badge>;
    }
    return null;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recommended Products</h2>
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recommended Products</h2>
            <p className="text-xl text-gray-600">
              Curated for your pet&apos;s specific needs
            </p>
          </div>
          <div className="flex gap-4">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: Product) => (
            <Card key={product.id} className="bg-gray-50 overflow-hidden card-hover">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/300x200?text=🐾";
                }}
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  {getProductBadge(product)}
                  <div className="text-yellow-400 text-sm">
                    {renderStars(product.rating)}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="bg-primary text-white hover:bg-orange-600 transition-colors"
                    disabled={addedProducts.has(product.id)}
                  >
                    {addedProducts.has(product.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-secondary text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition-colors">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
