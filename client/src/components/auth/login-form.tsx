import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginData } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useOAuthConfig } from "@/hooks/use-oauth-config";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onRequestTwoFactor: () => void;
}

export function LoginForm({ onRequestTwoFactor }: LoginFormProps) {
  const { loginMutation } = useAuth();
  const { googleEnabled, isLoadingGoogleConfig } = useOAuthConfig();
  const [rememberMe, setRememberMe] = useState(false);
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
    // In a real app, we would check if 2FA is required for this user
    // For demo purposes, we'll always show the 2FA screen
    onRequestTwoFactor();
  };
  
  const handleOAuthLogin = (provider: string) => {
    if (provider === "Google" && googleEnabled) {
      // Redirect to Google OAuth endpoint
      window.location.href = "/api/auth/google";
    } else if (provider === "Google" && !googleEnabled) {
      alert("Google login is not configured yet.");
    } else {
      // For other providers like Facebook (not yet implemented)
      alert(`${provider} OAuth login is not implemented yet.`);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username or Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username or email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe} 
              onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
            />
            <label htmlFor="remember-me" className="text-sm text-gray-600">
              Remember me
            </label>
          </div>
          
          <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
            Forgot password?
          </a>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin("Google")}
            disabled={isLoadingGoogleConfig || loginMutation.isPending}
          >
            {isLoadingGoogleConfig ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FaGoogle className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthLogin("Facebook")}
            disabled={loginMutation.isPending}
          >
            <FaFacebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>
      </form>
    </Form>
  );
}
