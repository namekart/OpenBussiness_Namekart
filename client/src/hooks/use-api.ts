import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Instead of importing from @shared/routes which might cause path resolution issues 
// in this sandbox if not set up properly, we define the schemas matching the backend contract here.
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message is too short"),
});

export type LoginRequestType = z.infer<typeof loginSchema>;
export type InquiryRequestType = z.infer<typeof inquirySchema>;

export function useLogin() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: LoginRequestType) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useSubmitInquiry() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InquiryRequestType) => {
      const res = await apiRequest("POST", "/api/inquiry", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent!",
        description: "We'll get back to you as soon as possible.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    },
  });
}
