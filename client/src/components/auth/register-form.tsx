import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
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
import { useState } from "react";

// Extend the insert schema with additional validation
const registerSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { registerMutation } = useAuth();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { t } = useTranslation();
  
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });
  
  const onSubmit = async (data: RegisterData) => {
    // Remove confirmPassword and agreeTerms as they're not part of the schema
    const { confirmPassword, agreeTerms, ...userData } = data;
    await registerMutation.mutateAsync(userData);
  };
  
  const handleOAuthRegister = (provider: string) => {
    // In a real app, this would redirect to the OAuth provider
    alert(`${provider} OAuth registration would be implemented here.`);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">{t('auth.fullName')}</FormLabel>
              <FormControl>
                <Input className="focus:border-blue-500 focus:ring-blue-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500" placeholder={t('auth.fullName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">{t('auth.username')}</FormLabel>
              <FormControl>
                <Input className="focus:border-blue-500 focus:ring-blue-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500" placeholder={t('auth.username')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">{t('auth.email')}</FormLabel>
              <FormControl>
                <Input className="focus:border-blue-500 focus:ring-blue-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500" type="email" placeholder={t('auth.email')} {...field} />
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
              <FormLabel className="text-gray-700 dark:text-gray-300">{t('auth.password')}</FormLabel>
              <FormControl>
                <Input className="focus:border-blue-500 focus:ring-blue-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500" type="password" placeholder={t('auth.password')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">{t('auth.confirmPassword')}</FormLabel>
              <FormControl>
                <Input className="focus:border-blue-500 focus:ring-blue-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500" type="password" placeholder={t('auth.confirmPassword')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="agreeTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('auth.agreeToTerms')} <a href="#" className="text-blue-500 hover:text-blue-600 dark:text-emerald-500 dark:hover:text-emerald-400">{t('auth.termsOfService')}</a> {t('auth.and')} <a href="#" className="text-blue-500 hover:text-blue-600 dark:text-emerald-500 dark:hover:text-emerald-400">{t('auth.privacyPolicy')}</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.creatingAccount')}
            </>
          ) : (
            t('auth.createAccount')
          )}
        </Button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">{t('auth.orRegisterWith')}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
            onClick={() => handleOAuthRegister("Google")}
          >
            <FaGoogle className="mr-2 h-4 w-4 text-red-500" />
            {t('auth.google')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
            onClick={() => handleOAuthRegister("Facebook")}
          >
            <FaFacebook className="mr-2 h-4 w-4 text-blue-600" />
            {t('auth.facebook')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
