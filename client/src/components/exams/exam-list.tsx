import { useState } from "react";
import { MedicalExam } from "@shared/schema";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamListProps {
  exams: MedicalExam[];
  isLoading: boolean;
  onSelectExam: (id: number) => void;
}

export function ExamList({ exams, isLoading, onSelectExam }: ExamListProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "analyzed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
      case "uploaded":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  };
  
  if (isLoading) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Exams</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  if (exams.length === 0) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Exams</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No medical exams uploaded yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Upload your first exam to get started.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 py-5 sm:p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Exams</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="font-medium dark:text-gray-100">{exam.name}</TableCell>
                <TableCell>{formatDate(exam.date)}</TableCell>
                <TableCell>
                  {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(exam.status)} variant="outline">
                    {exam.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onSelectExam(exam.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
