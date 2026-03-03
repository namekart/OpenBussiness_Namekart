import { motion } from "framer-motion";
import { Database, Users, Mic, CheckCircle2, Globe2, PhoneCall } from "lucide-react";

const features = [
  {
    icon: <Database className="h-6 w-6 text-blue-500" />,
    title: "AI-Native ERP",
    description: "Streamline workflows and automate operations with modern AI infrastructure that learns from your business patterns.",
    points: [
      "Automated data entry & reconciliation",
      "Predictive inventory management",
      "Real-time financial analytics"
    ],
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    icon: <Users className="h-6 w-6 text-purple-500" />,
    title: "Intelligent CRM",
    description: "Manage sales pipelines automatically. Enhance responsiveness with AI that drafts replies and predicts customer needs.",
    points: [
      "Smart lead scoring & routing",
      "Automated follow-up sequences",
      "360° customer health insights"
    ],
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    icon: <Mic className="h-6 w-6 text-green-500" />,
    title: "AI Voice Calling",
    description: "Deploy human-like multilingual customer engagement. Handle inbound support and outbound sales seamlessly.",
    points: [
      "50+ languages natively supported",
      "100+ local dialects for natural feel",
      "24/7 autonomous call handling"
    ],
    color: "bg-green-500/10 border-green-500/20"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">One Platform. Infinite Possibilities.</h2>
          <p className="text-lg text-muted-foreground">
            We've unified the core pillars of business software with state-of-the-art AI, eliminating silos and multiplying your team's output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-background rounded-3xl p-8 border border-border/60 hover:border-border hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${feature.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {feature.description}
              </p>
              
              <ul className="space-y-4">
                {feature.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
