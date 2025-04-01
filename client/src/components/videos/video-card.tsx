import { Video, VideoProgress } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Get video progress
  const { data: videoProgress } = useQuery<VideoProgress>({
    queryKey: [`/api/video-progress/${video.id}`],
    enabled: !!user && !!video.id,
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progress: number) => {
      return await apiRequest("POST", "/api/video-progress", { 
        videoId: video.id, 
        progress
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/video-progress/${video.id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Store current progress value
  const currentProgress = videoProgress?.progress ?? 0;
  
  const handleWatchVideo = () => {
    setVideoOpen(true);
    // Simulate progress update when video is watched
    if (currentProgress < 100) {
      const newProgress = Math.min(currentProgress + 25, 100);
      setWatchProgress(newProgress);
      
      // Only update in the backend if the user is logged in
      if (user) {
        updateProgressMutation.mutate(newProgress);
      }
    }
  };
  
  const getProgressLabel = (progress: number): string => {
    if (progress === 0) return "Not Started";
    if (progress === 100) return "Completed";
    return "In Progress";
  };
  
  const getProgressColor = (progress: number): string => {
    if (progress === 0) return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    if (progress === 100) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
    return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
  };
  
  // For video thumbnail, we'll use a color background since we can't load images
  const colorMap: Record<string, string> = {
    "Mental Health": "bg-blue-600",
    "Nutrition": "bg-green-600",
    "Exercise": "bg-amber-600",
    "Medical": "bg-red-600",
    "Sleep": "bg-purple-600"
  };
  
  const bgColor = colorMap[video.category] || "bg-gray-600";
  
  return (
    <Card className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 dark:border-gray-700">
      <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
        <div className={`absolute inset-0 flex items-center justify-center ${video.thumbnailUrl ? '' : bgColor}`} style={video.thumbnailUrl ? { backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          <button 
            className="w-16 h-16 rounded-full bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center z-10 hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-all duration-200"
            onClick={handleWatchVideo}
          >
            <Play className="h-8 w-8 text-primary-600 dark:text-primary-400 ml-1" />
          </button>
          {currentProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600">
              <div className="h-full bg-primary-500 dark:bg-primary-400" style={{ width: `${currentProgress}%` }}></div>
            </div>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">{video.title}</h4>
            <div className="mt-1 flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">{video.duration}</span>
              <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{video.category}</span>
            </div>
          </div>
          <Badge className={getProgressColor(currentProgress)}>
            {getProgressLabel(currentProgress)}
          </Badge>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{video.description}</p>
        <div className="mt-4">
          <button 
            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            onClick={handleWatchVideo}
          >
            {currentProgress === 100 ? "Rewatch video" : "Watch video"}
          </button>
        </div>
      </CardContent>
      
      {/* Video Player Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{video.title}</DialogTitle>
          </DialogHeader>
          <div className="relative bg-black aspect-video rounded-md overflow-hidden">
            {video.id === 1 ? (
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/0F9szTYowN0?autoplay=1" 
                title={video.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-white text-center px-4">
                  <div className="text-4xl mb-4">🎬</div>
                  <p>This is where the actual video would play.</p>
                  <p className="text-sm text-gray-400 mt-2">For this demo, we're simulating video playback.</p>
                  <Progress 
                    value={watchProgress} 
                    className="mt-6 bg-primary-600" 
                  />
                  <p className="text-sm mt-2">Progress: {watchProgress}%</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Video Description</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{video.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
