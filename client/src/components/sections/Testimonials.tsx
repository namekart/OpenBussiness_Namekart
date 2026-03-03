import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Implementing OpenBusiness.ai was a game-changer for our operations. We've automated our entire customer outreach and the ERP integration is seamless.",
    author: "Sarah Jenkins",
    role: "CEO at TechFlow",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  {
    quote: "The AI Voice calling is incredibly natural. Our customers can't even tell they're talking to an agent, and it handles 24/7 support perfectly.",
    author: "Marcus Doe",
    role: "Operations Manager at Global Retail",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face"
  },
  {
    quote: "Finally, a platform that actually unifies CRM and ERP with real AI. OpenBusiness.ai has doubled our team's productivity in just a month.",
    author: "Elena Rodriguez",
    role: "Director of Ops at Omni",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-foreground">Loved by innovative teams</h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. See what our customers have to say about their experience with OpenBusiness.ai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-lg mb-8 leading-relaxed text-foreground">"{item.quote}"</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* user avatar face */}
                <img 
                  src={item.image} 
                  alt={item.author} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold font-display text-sm">{item.author}</h4>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
