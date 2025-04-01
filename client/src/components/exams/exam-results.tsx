import { useQuery } from "@tanstack/react-query";
import { MedicalExam } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ExamResultsProps {
  examId?: number;
}

// Sample blood test result structure for demo purposes
interface BloodTestResult {
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: "Normal" | "High" | "Low";
}

export function ExamResults({ examId }: ExamResultsProps) {
  const { data: exam, isLoading } = useQuery<MedicalExam>({
    queryKey: ["/api/exams", examId],
    enabled: !!examId,
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-green-600 dark:text-green-400";
      case "High":
        return "text-red-600 dark:text-red-400";
      case "Low":
        return "text-amber-600 dark:text-amber-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };
  
  // Display empty state if no exam is selected
  if (!examId) {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
            <AlertCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No Exam Selected</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a medical exam from the list above to view results.
          </p>
        </div>
      </div>
    );
  }
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Display "No results" state if exam doesn't have results
  if (!exam?.results) {
    return (
      <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{exam?.name}</h3>
        <Alert className="mt-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Results Pending</AlertTitle>
          <AlertDescription>
            This exam is still being analyzed. Results will be available soon.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // For demonstration, use sample blood test results
  // In a real app, we would use exam.results
  const sampleResults: BloodTestResult[] = [
    { name: "Hemoglobin", value: 14.2, unit: "g/dL", referenceRange: "12.0 - 15.5", status: "Normal" },
    { name: "White Blood Cells", value: 6.2, unit: "K/μL", referenceRange: "4.5 - 11.0", status: "Normal" },
    { name: "Platelets", value: 210, unit: "K/μL", referenceRange: "150 - 450", status: "Normal" },
    { name: "Hematocrit", value: 42.1, unit: "%", referenceRange: "35.5 - 44.9", status: "Normal" },
    { name: "Red Blood Cells", value: 4.7, unit: "M/μL", referenceRange: "4.2 - 5.4", status: "Normal" },
    { name: "MCV", value: 89.6, unit: "fL", referenceRange: "80.0 - 100.0", status: "Normal" }
  ];
  
  return (
    <div className="px-4 py-5 sm:p-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{exam.name} (Results)</h3>
      
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sampleResults.map((result, index) => (
          <Card key={index} className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="px-4 py-5">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{result.name}</h4>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {result.value} {result.unit}
                </div>
                <div className={`text-sm font-medium ${getStatusColor(result.status)}`}>{result.status}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reference range: {result.referenceRange} {result.unit}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400 dark:text-blue-300" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Analysis</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>All values are within normal range, indicating good overall blood health. Your hemoglobin and red blood cell count are excellent, suggesting good oxygen-carrying capacity. Continue with your current nutrition plan and regular exercise routine.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
