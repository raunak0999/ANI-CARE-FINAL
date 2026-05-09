"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ✅ FIXED: Corrected import path
import {
  insertPetProfileSchema,
  type InsertPetProfile,
} from "../../../shared/schema";

import { apiRequest } from "@/lib/queryClient";

export default function PetProfileForm() {
  const { toast } = useToast();
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success">("idle");
  const [recommendationData, setRecommendationData] = useState<any>(null);

  const form = useForm<InsertPetProfile>({
    resolver: zodResolver(insertPetProfileSchema),
    defaultValues: {
      name: "",
      age: "",
      breed: "",
      size: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: InsertPetProfile) => {
      const res = await apiRequest("POST", "/api/pet-profiles", data);
      if (!res.ok) throw new Error("Failed to create profile");
      return res.json();
    },
    onSuccess: (data) => {
      setFormStatus("success");
      setRecommendationData(data);

      toast({
        title: "Profile Created!",
        description: "Personalized recommendations generated!",
      });

      setTimeout(() => {
        const tipsSection = document.getElementById("care-tips");
        if (tipsSection) tipsSection.scrollIntoView({ behavior: "smooth" });
      }, 500);

      setTimeout(() => {
        setFormStatus("idle");
        form.reset();
      }, 3000);
    },
    onError: () => {
      setFormStatus("idle");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPetProfile) => {
    setFormStatus("loading");
    createProfileMutation.mutate(data);
  };

  return (
    <>
      <section id="profile" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Pet's Profile
            </h2>
            <p className="text-xl text-gray-600">
              Tell us about your furry friend to get personalized recommendations
            </p>
          </div>

          <Card className="warm-bg shadow-lg">
            <CardContent className="pt-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-6"
              >
                <div>
                  <Label htmlFor="name">Pet's Name</Label>
                  <Input placeholder="e.g., Buddy" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Select onValueChange={(val) => form.setValue("age", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Puppy (0-1 years)">Puppy (0-1 years)</SelectItem>
                      <SelectItem value="Young (1-3 years)">Young (1-3 years)</SelectItem>
                      <SelectItem value="Adult (3-7 years)">Adult (3-7 years)</SelectItem>
                      <SelectItem value="Senior (7+ years)">Senior (7+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.age && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Input placeholder="e.g., Golden Retriever" {...form.register("breed")} />
                  {form.formState.errors.breed && (
                    <p className="text-sm text-red-600 mt-1">
                      {form.formState.errors.breed.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="size">Size (Optional)</Label>
                  <Select onValueChange={(val) => form.setValue("size", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small (0-25 lbs)">Small (0-25 lbs)</SelectItem>
                      <SelectItem value="Medium (25-60 lbs)">Medium (25-60 lbs)</SelectItem>
                      <SelectItem value="Large (60-100 lbs)">Large (60-100 lbs)</SelectItem>
                      <SelectItem value="Extra Large (100+ lbs)">Extra Large (100+ lbs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="w-full"
                  >
                    {formStatus === "loading" && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {formStatus === "success" && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {formStatus === "idle" && (
                      <Heart className="w-4 h-4 mr-2" />
                    )}
                    {formStatus === "loading"
                      ? "Generating Recommendations..."
                      : formStatus === "success"
                      ? "Recommendations Ready!"
                      : "Get AI Recommendations"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {recommendationData && (
        <section id="care-tips" className="py-12 bg-gray-50 mt-8">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-6">
              Care Recommendations for {recommendationData.profile.name}
            </h3>

            {["nutrition", "grooming", "health"].map((cat) => (
              <div key={cat} className="mb-8">
                <h4 className="text-xl font-semibold text-orange-600">
                  {recommendationData.recommendations[cat].title}
                </h4>
                <p className="text-gray-700 mt-2">
                  {recommendationData.recommendations[cat].description}
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-800">
                  {recommendationData.recommendations[cat].tips.map(
                    (tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
