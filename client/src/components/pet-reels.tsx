import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Upload, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const API_BASE = "";

interface Reel {
  id: number;
  filename: string;
  caption: string;
  uploaderName: string;
  uploadedAt: string;
}

export default function PetReels() {
  const queryClient = useQueryClient();
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const { data: reels = [] } = useQuery<Reel[]>({
    queryKey: ["reels"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/reels`);
      if (!res.ok) throw new Error("Failed to fetch reels");
      return res.json();
    },
    refetchInterval: 30000,
  });

  // IntersectionObserver for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );

    const currentRefs = videoRefs.current;
    currentRefs.forEach((video) => {
      observer.observe(video);
    });

    return () => {
      currentRefs.forEach((video) => {
        observer.unobserve(video);
      });
    };
  }, [reels]);

  const setVideoRef = useCallback(
    (id: number, el: HTMLVideoElement | null) => {
      if (el) {
        videoRefs.current.set(id, el);
      } else {
        videoRefs.current.delete(id);
      }
    },
    []
  );

  const handleLike = (id: number) => {
    setLiked((prev) => {
      const wasLiked = prev[id] || false;
      return { ...prev, [id]: !wasLiked };
    });
    setLikes((prev) => {
      const currentCount = prev[id] || 0;
      const wasLiked = liked[id] || false;
      return { ...prev, [id]: wasLiked ? currentCount - 1 : currentCount + 1 };
    });
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("caption", caption);
      formData.append("uploaderName", uploaderName || "Anonymous");

      const res = await fetch(`${API_BASE}/api/reels`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      queryClient.invalidateQueries({ queryKey: ["reels"] });
      setDialogOpen(false);
      setFile(null);
      setCaption("");
      setUploaderName("");
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <section id="pet-reels" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Pet Reels 🐾</h2>
          <p className="text-xl text-gray-600">
            Watch &amp; share adorable pet moments
          </p>
        </div>

        {/* Share Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Upload className="w-4 h-4 mr-2" />
            Share Your Reel +
          </Button>
        </div>

        {/* Reels Feed */}
        {reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-7xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No reels yet</h3>
            <p className="text-gray-500 text-lg">
              Be the first to share an adorable pet moment!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {reels.map((reel) => (
              <Card
                key={reel.id}
                className="w-full max-w-[420px] overflow-hidden shadow-lg border-0 bg-white"
              >
                <div className="relative bg-black">
                  <video
                    ref={(el) => setVideoRef(reel.id, el)}
                    src={`${API_BASE}/uploads/${reel.filename}`}
                    muted
                    loop
                    playsInline
                    className="w-full aspect-[9/16] max-h-[520px] object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {reel.uploaderName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-gray-900 truncate">
                          {reel.uploaderName}
                        </span>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTime(reel.uploadedAt)}
                        </span>
                      </div>
                      {reel.caption && (
                        <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                          {reel.caption}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleLike(reel.id)}
                      className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-1"
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${
                          liked[reel.id]
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {likes[reel.id] || 0}
                      </span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Pet Reel 🎬</DialogTitle>
            <DialogDescription>
              Upload a video of your adorable pet moment (max 50MB)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Video
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
              />
              {file && (
                <p className="text-xs text-gray-500 mt-1">
                  {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Caption
              </label>
              <Textarea
                placeholder="Describe your adorable pet moment..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Your Name
              </label>
              <Input
                placeholder="Enter your name"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="w-full bg-primary text-white hover:bg-orange-600"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Reel
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
