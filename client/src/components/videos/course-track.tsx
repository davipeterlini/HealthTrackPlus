import { CourseTrack as CourseTrackType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Video } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseTrackProps {
  track: CourseTrackType;
}

export function CourseTrack({ track }: CourseTrackProps) {
  const [expanded, setExpanded] = useState(false);
  
  // For demo purposes, we'll use a fixed progress percentage
  const trackProgress = 50; // 50% complete
  
  // Fetch track videos
  const { data: trackVideos, isLoading } = useQuery<(Video & { order: number })[]>({
    queryKey: [`/api/course-tracks/${track.id}/videos`],
    enabled: expanded,
  });
  
  // Sort videos by order
  const sortedVideos = trackVideos?.sort((a, b) => a.order - b.order) || [];
  
  return (
    <Card className="bg-gray-50 dark:bg-gray-800 shadow-sm overflow-hidden dark:border-gray-700">
      <div className="px-4 py-5 sm:px-6 bg-primary-50 dark:bg-primary-900 border-b border-primary-100 dark:border-primary-800">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-primary-900 dark:text-primary-100">{track.title}</h4>
            <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">{track.description}</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200">
            {track.videoCount} Videos
          </span>
        </div>
        <div className="mt-3">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-primary-700 dark:text-primary-300">
                  {trackProgress}% Complete
                </span>
              </div>
            </div>
            <Progress value={trackProgress} className="bg-primary-600" />
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 py-5 sm:p-6 divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-4">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="ml-3 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/3 mt-1" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))
          ) : (
            sortedVideos.map((video, index) => {
              // For demo purposes, determine video status
              let status: "completed" | "inProgress" | "locked" = "locked";
              let progress = 0;
              
              if (index < Math.floor(sortedVideos.length * (trackProgress / 100))) {
                status = "completed";
                progress = 100;
              } else if (index === Math.floor(sortedVideos.length * (trackProgress / 100))) {
                status = "inProgress";
                progress = 35; // For the one in progress
              }
              
              return (
                <div key={video.id} className="py-4">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      status === "completed" ? "bg-green-100 dark:bg-green-900" : 
                      status === "inProgress" ? "bg-yellow-100 dark:bg-yellow-900" : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      {status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : status === "inProgress" ? (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <LockIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{video.title} ({video.duration})</p>
                      {status === "completed" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Completed on Oct 15, 2023</p>
                      )}
                      {status === "inProgress" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">In progress - {progress}% complete</p>
                      )}
                      {status === "locked" && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">Complete previous videos to unlock</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={status === "locked"}
                      className="ml-3 text-sm"
                    >
                      {status === "completed" ? "Rewatch" : 
                       status === "inProgress" ? "Continue" : "Locked"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      
      <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          {expanded ? "Hide details" : "Show all videos"} {expanded ? "↑" : "↓"}
        </Button>
      </div>
    </Card>
  );
}
