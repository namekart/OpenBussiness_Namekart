import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Hexagon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/auth/LoginModal";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ERP");
  const { theme, setTheme } = useTheme();

  // Export activeTab to be used by other components if needed, 
  // but for now we'll handle the scroll/change logic here
  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    const element = document.getElementById('product-showcase');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll behavior for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "py-6 bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <motion.div
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow"
            >
              <Hexagon className="w-6 h-6 fill-current" />
            </motion.div>
            <motion.span 
              className="font-display font-bold text-xl tracking-tight text-foreground"
              animate={{ scale: isScrolled ? 0.95 : 1 }}
            >
              OpenBusiness<span className="text-primary">.ai</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <button onClick={() => handleNavClick("Platform")} className={`hover:text-foreground transition-colors ${activeTab === "Platform" ? "text-foreground" : ""}`}>Platform</button>
            <button onClick={() => handleNavClick("ERP")} className={`hover:text-foreground transition-colors ${activeTab === "ERP" ? "text-foreground" : ""}`}>ERP</button>
            <button onClick={() => handleNavClick("CRM")} className={`hover:text-foreground transition-colors ${activeTab === "CRM" ? "text-foreground" : ""}`}>CRM</button>
            <button onClick={() => handleNavClick("Voice")} className={`hover:text-foreground transition-colors ${activeTab === "Voice" ? "text-foreground" : ""}`}>AI Voice</button>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-accent"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="font-semibold"
              onClick={() => setLoginOpen(true)}
            >
              Log in
            </Button>
            <Button 
              className="font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[72px] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border z-40 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Features</a>
              <a href="#product" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Product</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium">Testimonials</a>
              <div className="h-px w-full bg-border" />
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => { setLoginOpen(true); setMobileMenuOpen(false); }}
              >
                Log in
              </Button>
              <Button 
                className="w-full justify-center bg-primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
