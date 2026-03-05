import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium text-sm mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Next Generation Business Operations
        </motion.div>

          <motion.h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            One Platform. <br className="hidden md:block" />
            <span className="text-gradient">Infinite Possibilities.</span>
          </motion.h1>

        <motion.p 
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Automate operations, manage sales, and deploy multilingual customer engagement across <span className="text-foreground font-semibold">50+ languages</span> and <span className="text-foreground font-semibold">100+ dialects</span>.
        </motion.p>

        <motion.div 
          className="mt-10 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button 
            size="lg" 
            className="h-14 px-8 text-base rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Transforming <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
        
        {/* Dashboard Preview Image */}
        <motion.div
          className="mt-20 relative mx-auto max-w-5xl rounded-2xl md:rounded-t-[2.5rem] border border-border/50 bg-background/50 backdrop-blur-sm p-2 md:p-4 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 rounded-2xl"></div>
          {/* landing page hero dashboard mockup */}
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop" 
            alt="Dashboard Interface" 
            className="w-full h-auto rounded-xl md:rounded-t-[2rem] border border-border/50 opacity-90"
          />
        </motion.div>
      </div>
    </section>
  );
}
