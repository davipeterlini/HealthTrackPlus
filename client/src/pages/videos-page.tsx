import { MainLayout } from "@/components/layout/main-layout";
import { VideoCard } from "@/components/videos/video-card";
import { CourseTrack } from "@/components/videos/course-track";
import { useQuery } from "@tanstack/react-query";
import { Video, CourseTrack as CourseTrackType, TrackVideo } from "@shared/schema";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: videos, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });
  
  const { data: courseTracks, isLoading: tracksLoading } = useQuery<CourseTrackType[]>({
    queryKey: ["/api/course-tracks"],
  });
  
  const filteredVideos = videos?.filter(video => 
    selectedCategory === "all" || video.category.toLowerCase() === selectedCategory.toLowerCase()
  );
  
  return (
    <MainLayout title="Medicine Subscription Club">
      <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-3 sm:mb-0">Educational Content</h3>
            <div>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="mental health">Mental Health</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {videosLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos?.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
              
              {filteredVideos?.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No videos found in this category</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-12">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-6">Course Tracks</h3>
            
            {tracksLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {courseTracks?.map(track => (
                  <CourseTrack key={track.id} track={track} />
                ))}
                
                {courseTracks?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No course tracks available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
