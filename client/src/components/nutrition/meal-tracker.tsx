import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Meal } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PlusCircle, Utensils, Coffee, Sun, Cloud, Moon } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface MealTrackerProps {
  meals: Meal[];
}

// Meal form schema
const mealFormSchema = z.object({
  mealType: z.string().min(1, "Meal type is required"),
  description: z.string().min(3, "Description is required"),
  calories: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  fat: z.coerce.number().min(0).optional()
});

type MealFormValues = z.infer<typeof mealFormSchema>;

export function MealTracker({ meals }: MealTrackerProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Sort by date (latest first) and meal type
  const mealTypeOrder = { "breakfast": 1, "lunch": 2, "snack": 3, "dinner": 4 };
  const sortedMeals = [...meals].sort((a, b) => {
    // First by date
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) return dateB - dateA;
    
    // Then by meal type
    return (mealTypeOrder[a.mealType as keyof typeof mealTypeOrder] || 99) - 
           (mealTypeOrder[b.mealType as keyof typeof mealTypeOrder] || 99);
  });
  
  // Group meals by date
  const mealsByDate = sortedMeals.reduce((acc, meal) => {
    const date = new Date(meal.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);
  
  // Meal form
  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      mealType: "",
      description: "",
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0
    }
  });
  
  // Add meal mutation
  const addMealMutation = useMutation({
    mutationFn: async (values: MealFormValues) => {
      return await apiRequest("POST", "/api/meals", values);
    },
    onSuccess: () => {
      toast({
        title: "Meal added successfully",
        description: "Your meal has been recorded."
      });
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add meal",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (values: MealFormValues) => {
    addMealMutation.mutate(values);
  };
  
  // Calculate daily nutrition totals for the latest day
  const today = new Date().toDateString();
  const todayMeals = mealsByDate[today] || [];
  
  const dailyTotals = {
    calories: todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
    carbs: todayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
    protein: todayMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0),
    fat: todayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0)
  };
  
  const dailyGoals = {
    calories: 2100,
    carbs: 250,
    protein: 120,
    fat: 70
  };
  
  // Helper for meal icon
  const getMealIcon = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return <Sun className="text-amber-600" />;
      case "lunch":
        return <Cloud className="text-blue-600" />;
      case "dinner":
        return <Moon className="text-indigo-600" />;
      case "snack":
        return <Coffee className="text-amber-700" />;
      default:
        return <Utensils className="text-gray-600" />;
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  };
  
  const formatTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };
  
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meal Tracking</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Meal</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe what you ate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories (kcal)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (g)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fat (g)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={addMealMutation.isPending}>
                    {addMealMutation.isPending ? "Saving..." : "Save Meal"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Today's Meals */}
          {Object.entries(mealsByDate).length > 0 ? (
            Object.entries(mealsByDate).map(([date, mealList]) => (
              <div key={date} className="mb-8">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{formatDate(date)}</h4>
                
                <div className="space-y-6">
                  {mealList.map((meal, idx) => (
                    <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {getMealIcon(meal.mealType)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{meal.mealType}</h5>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(meal.date)}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{meal.description}</p>
                          {(meal.calories || meal.carbs || meal.protein || meal.fat) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {meal.calories && (
                                <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-0">
                                  {meal.calories} kcal
                                </Badge>
                              )}
                              {meal.carbs && (
                                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-0">
                                  {meal.carbs}g carbs
                                </Badge>
                              )}
                              {meal.protein && (
                                <Badge variant="outline" className="bg-rose-100 dark:bg-red-900 text-rose-800 dark:text-red-300 border-0">
                                  {meal.protein}g protein
                                </Badge>
                              )}
                              {meal.fat && (
                                <Badge variant="outline" className="bg-amber-100 dark:bg-yellow-900 text-amber-800 dark:text-yellow-300 border-0">
                                  {meal.fat}g fat
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Utensils className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No meals recorded</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start by adding your meals to track your nutrition.
              </p>
            </div>
          )}
          
          {/* Nutrition Summary */}
          {todayMeals.length > 0 && (
            <div className="mt-8">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Nutrition Summary</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Calorie chart */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Calories</h5>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{dailyTotals.calories} / {dailyGoals.calories}</span>
                  </div>
                  <div className="mt-3 relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 dark:text-primary-300 bg-primary-200 dark:bg-primary-800">
                          {Math.round((dailyTotals.calories / dailyGoals.calories) * 100)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={(dailyTotals.calories / dailyGoals.calories) * 100} className="bg-primary-600 dark:bg-primary-500" />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900 p-2 rounded">
                      <span className="block text-xs text-blue-700 dark:text-blue-300">Carbs</span>
                      <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{dailyTotals.carbs}g</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round((dailyTotals.carbs * 4 / dailyTotals.calories) * 100) || 0}%
                      </span>
                    </div>
                    <div className="bg-rose-50 dark:bg-red-900 p-2 rounded">
                      <span className="block text-xs text-rose-700 dark:text-red-300">Protein</span>
                      <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{dailyTotals.protein}g</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round((dailyTotals.protein * 4 / dailyTotals.calories) * 100) || 0}%
                      </span>
                    </div>
                    <div className="bg-amber-50 dark:bg-yellow-900 p-2 rounded">
                      <span className="block text-xs text-amber-700 dark:text-yellow-300">Fat</span>
                      <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{dailyTotals.fat}g</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round((dailyTotals.fat * 9 / dailyTotals.calories) * 100) || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Nutritional info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Nutrients</h5>
                  
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Carbs</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{dailyTotals.carbs}g / {dailyGoals.carbs}g</span>
                      </div>
                      <Progress 
                        value={(dailyTotals.carbs / dailyGoals.carbs) * 100} 
                        className="bg-blue-500 dark:bg-blue-400 h-1.5" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Protein</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{dailyTotals.protein}g / {dailyGoals.protein}g</span>
                      </div>
                      <Progress 
                        value={(dailyTotals.protein / dailyGoals.protein) * 100} 
                        className="bg-rose-500 dark:bg-red-400 h-1.5" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Fat</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{dailyTotals.fat}g / {dailyGoals.fat}g</span>
                      </div>
                      <Progress 
                        value={(dailyTotals.fat / dailyGoals.fat) * 100} 
                        className="bg-amber-500 dark:bg-yellow-400 h-1.5" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
