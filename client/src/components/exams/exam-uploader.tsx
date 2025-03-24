import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function ExamUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !examName || !examType) {
        throw new Error("Please provide all required information");
      }
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", examName);
      formData.append("type", examType);
      
      const res = await fetch("/api/exams", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || res.statusText);
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Exam uploaded successfully",
        description: "Your medical exam has been uploaded for analysis.",
      });
      setFile(null);
      setExamName("");
      setExamType("");
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };
  
  return (
    <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-0">Upload Medical Exam</h3>
        <div>
          <Button
            disabled={uploadMutation.isPending || !file || !examName || !examType}
            onClick={handleSubmit}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload New Exam
              </>
            )}
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">Upload your medical exam files for AI analysis and personalized insights.</p>
      
      <form className="mt-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="exam-name" className="block text-sm font-medium text-gray-700">Exam Name</label>
            <input
              type="text"
              id="exam-name"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="e.g., Complete Blood Count"
            />
          </div>
          
          <div>
            <label htmlFor="exam-type" className="block text-sm font-medium text-gray-700">Exam Type</label>
            <select
              id="exam-type"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Select type</option>
              <option value="blood">Blood Test</option>
              <option value="imaging">Imaging</option>
              <option value="urine">Urine Test</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            {file && (
              <p className="text-sm text-primary font-medium mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
