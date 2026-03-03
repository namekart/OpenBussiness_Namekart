import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin, loginSchema, type LoginRequestType } from "@/hooks/use-api";
import { Loader2, Mail, Lock } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const loginMutation = useLogin();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequestType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginRequestType) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-background rounded-3xl border-border/50">
        <div className="px-6 pt-8 pb-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-display text-2xl font-bold text-center">Welcome back</DialogTitle>
            <DialogDescription className="text-center">
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                  {...register("email")} 
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary focus:ring-primary/20 transition-all"
                  {...register("password")} 
                />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
        
        <div className="bg-muted/30 px-6 py-4 text-center border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <a href="#" className="text-primary font-medium hover:underline">Sign up</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
