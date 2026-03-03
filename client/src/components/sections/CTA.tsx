import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitInquiry, inquirySchema, type InquiryRequestType } from "@/hooks/use-api";
import { Loader2, Send } from "lucide-react";

export function CTA() {
  const inquiryMutation = useSubmitInquiry();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryRequestType>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = (data: InquiryRequestType) => {
    inquiryMutation.mutate(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-primary/5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="bg-background rounded-[2.5rem] border border-border shadow-2xl p-8 md:p-16 overflow-hidden relative">
          
          {/* Decorative shapes inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex flex-col lg:flex-row gap-16 relative z-10">
            
            {/* Left side text */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <motion.h2 
                className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to transform your workflow?
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Join forward-thinking SMEs globally who are already scaling efficiently with OpenBusiness.ai.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 text-sm text-muted-foreground font-medium"
              >
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <img 
                      key={i} 
                      src={`https://i.pravatar.cc/100?img=${i+10}`} 
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                      alt="User"
                    />
                  ))}
                </div>
                <span>Join 10,000+ users</span>
              </motion.div>
            </div>

            {/* Right side form */}
            <motion.div 
              className="w-full lg:w-1/2 bg-muted/30 backdrop-blur-sm rounded-3xl p-8 border border-border"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold font-display mb-2">Get in touch</h3>
              <p className="text-sm text-muted-foreground mb-6">Have questions? We'd love to hear from you.</p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input 
                    placeholder="Your Name" 
                    className="h-12 rounded-xl bg-background border-border" 
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                
                <div>
                  <Input 
                    type="email" 
                    placeholder="Work Email" 
                    className="h-12 rounded-xl bg-background border-border" 
                    {...register("email")}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <Textarea 
                    placeholder="How can we help?" 
                    className="min-h-[120px] rounded-xl bg-background border-border resize-none" 
                    {...register("message")}
                  />
                  {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
                  disabled={inquiryMutation.isPending}
                >
                  {inquiryMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Send Message <Send className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
