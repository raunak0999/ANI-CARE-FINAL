import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, X } from "lucide-react";
import type { TrainingProgram } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

// --- Breed → YouTube Video IDs Map ---
const BREED_VIDEOS: Record<string, { id: string; title: string }[]> = {
  labrador: [
    { id: "gYSPBBGmNy4", title: "Labrador Basics" },
    { id: "9NnFfGFbhEE", title: "Labrador Obedience" },
    { id: "I7bB7E7bpxU", title: "Labrador Tricks" },
    { id: "sFDlWJL5UQk", title: "Labrador Socialization" },
  ],
  "golden retriever": [
    { id: "vHeSlDgxU4Y", title: "Golden Retriever Basics" },
    { id: "ovxABFoU6Lc", title: "Golden Retriever Obedience" },
    { id: "Og5oQMkDBgs", title: "Golden Retriever Tricks" },
    { id: "GE6NAVS3OWA", title: "Golden Retriever Socialization" },
  ],
  "german shepherd": [
    { id: "2bVPECEEP8M", title: "German Shepherd Basics" },
    { id: "m6_a8MjPWE0", title: "German Shepherd Obedience" },
    { id: "tJIAGZEfBrY", title: "German Shepherd Tricks" },
    { id: "K3mGIomPeuo", title: "German Shepherd Socialization" },
  ],
  beagle: [
    { id: "ijqnwrA7e4Q", title: "Beagle Basics" },
    { id: "nrOAsM_LBEM", title: "Beagle Obedience" },
    { id: "Ixz64yADmiI", title: "Beagle Tricks" },
    { id: "Pg0ABDI6UyQ", title: "Beagle Socialization" },
  ],
  poodle: [
    { id: "OsIIWzCsYEQ", title: "Poodle Basics" },
    { id: "3FTkPzA8l10", title: "Poodle Obedience" },
    { id: "YrEOl1mJKTA", title: "Poodle Tricks" },
    { id: "3qHkgCNO0Yw", title: "Poodle Socialization" },
  ],
  husky: [
    { id: "GIZHkEHMVUg", title: "Husky Basics" },
    { id: "qVUDBG5dlhA", title: "Husky Obedience" },
    { id: "Ic5_l9fMZnQ", title: "Husky Tricks" },
    { id: "TlIFT1qUiWs", title: "Husky Socialization" },
  ],
  bulldog: [
    { id: "9kFnHpzixOw", title: "Bulldog Basics" },
    { id: "bO6sPYuU9Us", title: "Bulldog Obedience" },
    { id: "MrNa8YRQF8Q", title: "Bulldog Tricks" },
    { id: "9wHF_DPzTTM", title: "Bulldog Socialization" },
  ],
  "shih tzu": [
    { id: "rIaGMBpGwSU", title: "Shih Tzu Basics" },
    { id: "6X0JFP0bHO4", title: "Shih Tzu Obedience" },
    { id: "VWJFTIb3YHs", title: "Shih Tzu Tricks" },
    { id: "vn2cFhCPqp4", title: "Shih Tzu Socialization" },
  ],
  "persian cat": [
    { id: "uGlNGHoHSHo", title: "Persian Cat Basics" },
    { id: "3V3HfNzKVBo", title: "Persian Cat Obedience" },
    { id: "ozQqzWoJFxQ", title: "Persian Cat Tricks" },
    { id: "MVoMaGMIECk", title: "Persian Cat Socialization" },
  ],
  default: [
    { id: "IGMnMDY6G6Y", title: "House Training Basics" },
    { id: "MCzVf6SL0CU", title: "Leash Training Guide" },
    { id: "7sQhRzNEMFg", title: "Advanced Tricks" },
    { id: "Og5oQMkDBgs", title: "Socialization Tips" },
  ],
};

function getBreedVideos(breed?: string) {
  if (!breed) return BREED_VIDEOS["default"];
  const normalised = breed.toLowerCase().trim();
  for (const key of Object.keys(BREED_VIDEOS)) {
    if (key === "default") continue;
    if (normalised.includes(key) || key.includes(normalised)) {
      return BREED_VIDEOS[key];
    }
  }
  return BREED_VIDEOS["default"];
}

export default function TrainingSection() {
  const [videoModalId, setVideoModalId] = useState<string | null>(null);

  const { data: trainingPrograms, isLoading } = useQuery({
    queryKey: ["/api/training-programs"],
  });

  // Read breed from React Query cache
  const petProfileData = queryClient.getQueryData<any>(["/api/pet-profiles"]) ??
    queryClient.getQueryData<any>(["pet-profile"]);
  const breed: string | undefined = petProfileData?.profile?.breed;

  const activeVideos = getBreedVideos(breed);

  const thumbnailImages = [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&h=250&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=250&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=250&fit=crop&auto=format",
  ];

  const getIconColor = (category: string) => {
    switch (category) {
      case "obedience":
        return "bg-accent text-white";
      case "exercise":
        return "bg-secondary text-white";
      case "behavioral":
        return "bg-primary text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (isLoading) {
    return (
      <section id="training" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart Pet Training</h2>
            <p className="text-xl text-gray-600">Loading training programs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="training" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Smart Pet Training</h2>
            <p className="text-xl text-gray-600">
              AI-powered training routines customized for your pet's breed and age
            </p>
            {breed && (
              <p className="text-sm text-orange-600 font-medium mt-2">
                🐾 Showing videos for: {breed}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop&auto=format"
                alt="Professional dog trainer working with golden retriever"
                className="rounded-2xl shadow-lg w-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/300x200?text=🐾";
                }}
              />
            </div>

            <div className="space-y-6">
              {trainingPrograms?.slice(0, 3).map((program: TrainingProgram) => (
                <Card key={program.id} className="bg-white shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div
                        className={`${getIconColor(program.category)} rounded-full w-12 h-12 flex items-center justify-center mr-4`}
                      >
                        <i className={program.icon}></i>
                      </div>
                      <h3 className="text-xl font-bold">{program.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    <ul className="space-y-2 text-gray-700">
                      {program.tips.slice(0, 3).map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                    <Button
                      variant="link"
                      className="mt-4 text-primary font-semibold hover:text-orange-600 p-0"
                    >
                      Start Training <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Training Videos Section */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-center mb-8">
              Training Videos &amp; Tutorials
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeVideos.map((video, index) => (
                <Card key={video.id} className="bg-white overflow-hidden card-hover">
                  <div className="relative">
                    <img
                      src={thumbnailImages[index % thumbnailImages.length]}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/300x200?text=🐾";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        className="bg-white text-primary rounded-full"
                        onClick={() => setVideoModalId(video.id)}
                      >
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2">{video.title}</h4>
                    <p className="text-gray-600 text-sm">Training video</p>
                    <Button
                      variant="link"
                      className="mt-3 text-primary font-semibold p-0"
                      onClick={() => setVideoModalId(video.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Watch Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModalId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
          onClick={() => setVideoModalId(null)}
        >
          <div
            className="relative w-full max-w-3xl mx-4 bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalId(null)}
              className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoModalId}?autoplay=1`}
                title="Training Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
