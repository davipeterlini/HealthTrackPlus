import { Video, VideoProgress } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Play } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoCardProps {
  video: Video;
}

export const VideoCard = React.memo(({ video }: VideoCardProps) => {
  const { t } = useTranslation();
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

  const handleVideoEnd = () => {
    // Add logic to handle video completion here.  This is a placeholder.
    setWatchProgress(100);
    setVideoOpen(false);
  };


  const getProgressLabel = (progress: number): string => {
    if (progress === 0) return t('common.notStarted');
    if (progress === 100) return t('common.completed');
    return t('common.inProgress');
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
    <Card className="overflow-hidden responsive-shadow responsive-transition hover:shadow-md border-emerald-100 dark:border-gray-700">
      <div className="relative pb-[56.25%] bg-slate-100 dark:bg-gray-800">
        <div className={`absolute inset-0 flex items-center justify-center ${video.thumbnailUrl ? '' : bgColor}`}>
          {video.thumbnailUrl ? (
            <OptimizedImage 
              src={video.thumbnailUrl}
              alt={video.title}
              className="absolute inset-0"
              objectFit="cover"
              loading="lazy"
              placeholderColor="#e2e8f0"
            />
          ) : null}
          <button 
            className="responsive-button-icon-lg bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 hover:bg-opacity-90 dark:hover:bg-opacity-90 responsive-transition"
            onClick={handleWatchVideo}
          >
            <Play className="responsive-icon text-emerald-600 dark:text-emerald-400 ml-1" />
          </button>
          {currentProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-600">
              <div className="h-full bg-emerald-500 dark:bg-emerald-400" style={{ width: `${currentProgress}%` }}></div>
            </div>
          )}
        </div>
      </div>
      <CardContent>
        <div className="flex items-start justify-between responsive-gap-xs">
          <div>
            <h4 className="responsive-title-sm text-slate-800 dark:text-white truncate">{video.title}</h4>
            <div className="responsive-mt-xs flex items-center">
              <span className="responsive-text-xs text-slate-600 dark:text-slate-400">{video.duration}</span>
              <span className="mx-1 text-gray-300 dark:text-gray-600">•</span>
              <span className="responsive-text-xs text-slate-600 dark:text-slate-400">{video.category}</span>
            </div>
          </div>
          <Badge className={getProgressColor(currentProgress)}>
            {getProgressLabel(currentProgress)}
          </Badge>
        </div>
        <p className="responsive-mt-xs responsive-text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{video.description}</p>
        <div className="responsive-mt-sm">
          <button 
            className={`responsive-text-sm font-medium responsive-transition ${
              currentProgress === 100 
                ? "text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300" 
                : currentProgress > 0 
                ? "text-amber-600 hover:text-amber-500 dark:text-amber-400 dark:hover:text-amber-300"
                : "text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            }`}
            onClick={handleWatchVideo}
          >
            {currentProgress === 100 
              ? t('videos.rewatchVideo') 
              : currentProgress > 0 
              ? t('videos.continueVideo') 
              : t('videos.watchVideo')}
          </button>
        </div>
      </CardContent>

      {/* Video Player Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl dark:bg-[#1a2127] dark:border-gray-700 responsive-p xs:p-6">
          <DialogHeader>
            <DialogTitle className="responsive-title-md text-slate-800 dark:text-white">{video.title}</DialogTitle>
          </DialogHeader>
          <div className="relative bg-black aspect-video rounded-md overflow-hidden responsive-mt-xs">
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
                <div className="text-white text-center responsive-p">
                  <div className="responsive-text-lg mb-4">🎬</div>
                  <p className="responsive-text">{t('videos.demoVideoPlaceholder')}</p>
                  <p className="responsive-text-sm text-gray-400 responsive-mt-xs">{t('videos.simulationNote')}</p>
                  <Progress 
                    value={watchProgress} 
                    className="responsive-mt bg-emerald-600" 
                  />
                  <p className="responsive-text-sm responsive-mt-xs">{t('common.progress')}: {watchProgress}%</p>
                  <button
                    className="responsive-mt responsive-button bg-emerald-600 text-white rounded hover:bg-emerald-700 responsive-transition"
                    onClick={handleVideoEnd}
                  >
                    {t('videos.completeVideo')}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="responsive-mt-sm">
            <h3 className="responsive-text-sm font-medium text-slate-800 dark:text-white">{t('videos.videoDescription')}</h3>
            <p className="responsive-mt-xs responsive-text-sm text-slate-600 dark:text-slate-400">{video.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
});

VideoCard.displayName = "VideoCard";