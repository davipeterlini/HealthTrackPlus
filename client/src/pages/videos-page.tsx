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
import { useTranslation } from "react-i18next";

export default function VideosPage() {
  const { t } = useTranslation();
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
    <MainLayout>
      <div className="flex flex-row items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
          {t('navigation.videos')}
        </h1>
      </div>
      
      <Card className="overflow-hidden bg-white border-emerald-100 dark:bg-[#1a2127] dark:border-[#2b353e]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-slate-800 dark:text-white mb-3 sm:mb-0">
              {t('videos.educationalContent')}
            </h3>
            <div>
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px] border-emerald-100 dark:border-gray-700">
                  <SelectValue placeholder={t('videos.allCategories')} />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1a2127] dark:border-gray-700">
                  <SelectItem value="all">{t('videos.allCategories')}</SelectItem>
                  <SelectItem value="mental health">{t('videos.mentalHealth')}</SelectItem>
                  <SelectItem value="nutrition">{t('videos.nutrition')}</SelectItem>
                  <SelectItem value="exercise">{t('videos.exercise')}</SelectItem>
                  <SelectItem value="medical">{t('videos.medical')}</SelectItem>
                  <SelectItem value="sleep">{t('videos.sleep')}</SelectItem>
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
                  <p className="text-slate-600 dark:text-slate-400">{t('videos.noVideosFound')}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-12">
            <h3 className="text-lg leading-6 font-medium text-slate-800 dark:text-white mb-6">
              {t('videos.courseTracks')}
            </h3>
            
            {tracksLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full dark:bg-gray-700" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {courseTracks?.map(track => (
                  <CourseTrack key={track.id} track={track} />
                ))}
                
                {courseTracks?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">{t('videos.noCourseTracks')}</p>
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
