import { MainLayout } from "@/components/layout/main-layout";
import { ExamUploader } from "@/components/exams/exam-uploader";
import { ExamList } from "@/components/exams/exam-list";
import { ExamResults } from "@/components/exams/exam-results";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { MedicalExam } from "@shared/schema";
import { useState } from "react";

export default function ExamsPage() {
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  
  const { data: exams, isLoading } = useQuery<MedicalExam[]>({
    queryKey: ["/api/exams"],
  });
  
  return (
    <MainLayout title="Medical Exams">
      <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        <ExamUploader />
        <ExamList 
          exams={exams || []} 
          isLoading={isLoading} 
          onSelectExam={(id) => setSelectedExamId(id)}
        />
        
        {selectedExamId ? (
          <ExamResults examId={selectedExamId} />
        ) : (
          <ExamResults />
        )}
      </Card>
    </MainLayout>
  );
}
