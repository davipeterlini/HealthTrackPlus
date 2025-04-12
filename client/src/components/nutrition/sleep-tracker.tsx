import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SleepRecord } from "@shared/schema";
import { Moon, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SleepTrackerProps {
  sleepRecords: SleepRecord[];
}

// Sleep form schema
const sleepFormSchema = z.object({
  hours: z.coerce.number().min(0).max(24),
  quality: z.string().min(1),
  deepSleep: z.coerce.number().min(0),
  lightSleep: z.coerce.number().min(0),
  rem: z.coerce.number().min(0)
}).refine(data => {
  const total = data.deepSleep + data.lightSleep + data.rem;
  return total <= data.hours;
}, {
  message: "Deep sleep + light sleep + REM cannot exceed total sleep hours",
  path: ["deepSleep"]
});

type SleepFormValues = z.infer<typeof sleepFormSchema>;

export function SleepTracker({ sleepRecords }: SleepTrackerProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const recommendedHours = 8;
  
  // Get latest sleep record
  const lastSleep = sleepRecords.length > 0 
    ? sleepRecords[0] 
    : { hours: 0, quality: "N/A", deepSleep: 0, lightSleep: 0, rem: 0 };
  
  const sleepPercentage = Math.min((lastSleep.hours / recommendedHours) * 100, 100);
  
  // Recent sleep history (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });
  
  const sleepHistory = last7Days.map(day => {
    const record = sleepRecords.find(record => 
      new Date(record.date).toDateString() === day
    );
    return {
      date: day,
      hours: record?.hours || 0,
      quality: record?.quality || "N/A"
    };
  }).reverse();
  
  // Sleep logging form
  const form = useForm<SleepFormValues>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: {
      hours: 7.5,
      quality: "Good",
      deepSleep: 2.0,
      lightSleep: 4.0,
      rem: 1.5
    }
  });
  
  // Add sleep mutation
  const addSleepMutation = useMutation({
    mutationFn: async (values: SleepFormValues) => {
      return await apiRequest("POST", "/api/sleep", values);
    },
    onSuccess: () => {
      toast({
        title: "Sleep record added",
        description: "Your sleep data has been recorded successfully."
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/sleep"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to record sleep",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (values: SleepFormValues) => {
    addSleepMutation.mutate(values);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  };
  
  return (
    <Card className="bg-white dark:bg-[#1a2127] border dark:border-0 shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-slate-800 dark:text-white">Sleep</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="relative w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{lastSleep.hours}</div>
            <span className="absolute top-1 right-0 text-xs font-medium text-purple-600 dark:text-purple-400">hrs</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Night</div>
            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {lastSleep.hours} hours ({lastSleep.quality})
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  <Moon className="mr-1 h-4 w-4" /> Log Sleep
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Sleep</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Sleep Hours</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your total sleep time in hours
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sleep Quality</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select sleep quality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Poor">Poor</SelectItem>
                              <SelectItem value="Fair">Fair</SelectItem>
                              <SelectItem value="Good">Good</SelectItem>
                              <SelectItem value="Excellent">Excellent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="deepSleep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Deep Sleep</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lightSleep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Light Sleep</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>REM</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={addSleepMutation.isPending}>
                        {addSleepMutation.isPending ? "Saving..." : "Save Sleep Record"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sleep Composition</h4>
          <div className="bg-gray-100 dark:bg-[#242c35] rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Deep Sleep</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {lastSleep.deepSleep} h ({Math.round((lastSleep.deepSleep / lastSleep.hours) * 100) || 0}%)
              </span>
            </div>
            <Progress 
              value={(lastSleep.deepSleep / lastSleep.hours) * 100} 
              className="bg-purple-600 dark:bg-purple-500 h-2 mb-3" 
            />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light Sleep</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {lastSleep.lightSleep} h ({Math.round((lastSleep.lightSleep / lastSleep.hours) * 100) || 0}%)
              </span>
            </div>
            <Progress 
              value={(lastSleep.lightSleep / lastSleep.hours) * 100} 
              className="bg-purple-400 dark:bg-purple-400 h-2 mb-3" 
            />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">REM</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {lastSleep.rem} h ({Math.round((lastSleep.rem / lastSleep.hours) * 100) || 0}%)
              </span>
            </div>
            <Progress 
              value={(lastSleep.rem / lastSleep.hours) * 100} 
              className="bg-purple-300 dark:bg-purple-300 h-2" 
            />
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Sleep History</h4>
          <div className="grid grid-cols-7 gap-2">
            {sleepHistory.map((sleep, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-full h-16 bg-gray-100 dark:bg-[#242c35] rounded-t-sm overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-purple-500 dark:bg-purple-400" 
                    style={{height: `${(sleep.hours / 10) * 100}%`}}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(sleep.date).split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
