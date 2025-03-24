import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorSchema, type TwoFactorData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface TwoFactorFormProps {
  onBack: () => void;
}

export function TwoFactorForm({ onBack }: TwoFactorFormProps) {
  const { verifyTwoFactorMutation } = useAuth();
  const [, navigate] = useLocation();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  
  const form = useForm<TwoFactorData>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });
  
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1); // Only keep the last character
    setDigits(newDigits);
    
    // Move focus to next input if a digit was entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
    
    // Combine all digits and update form value
    form.setValue("code", newDigits.join(""));
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };
  
  const onSubmit = async (data: TwoFactorData) => {
    await verifyTwoFactorMutation.mutateAsync(data);
    // If verification is successful, navigate to dashboard
    navigate("/");
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={() => (
                <FormItem>
                  <div className="flex justify-center space-x-2">
                    {digits.map((digit, index) => (
                      <FormControl key={index}>
                        <Input
                          id={`digit-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="w-12 h-12 text-center text-xl font-semibold"
                          value={digit}
                          onChange={(e) => handleDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          autoFocus={index === 0}
                        />
                      </FormControl>
                    ))}
                  </div>
                  <FormMessage className="text-center mt-2" />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={verifyTwoFactorMutation.isPending || digits.join("").length !== 6}
            >
              {verifyTwoFactorMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
            
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive a code?{" "}
                <a href="#" className="font-medium text-primary hover:text-primary/80">
                  Resend code
                </a>
              </p>
              
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
              >
                Back to login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
