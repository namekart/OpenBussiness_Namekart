import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturePageTemplate } from "@/components/feature/FeaturePageTemplate";

const content = {
  badge: "New: AI Voice 2.0",
  heroTitle: "Transform Customer Interactions with Intelligent AI Voice",
  heroDescription:
    "Empower your business with 24/7 automated support and sales. Deliver hyper-realistic, human-like voice experiences that scale with growth.",
  heroImage: "https://images.unsplash.com/photo-1590650046871-92c887180603?w=1800&h=1100&fit=crop",
  heroImageAlt: "AI voice analytics dashboard",
  whatTitle: "What AI Voice Does",
  whatSubtitle: "Bridge human intelligence and automated speed in every call.",
  whatItDoes: [
    {
      title: "AI Voice Assistants",
      description: "Natural, human-like voice agents for support, outreach, and appointment workflows.",
    },
    {
      title: "Automated Responses",
      description: "Instant resolution for repetitive queries so teams focus on complex problems.",
    },
    {
      title: "Smart Interactions",
      description: "Context-aware dialogue that learns and improves with every interaction.",
    },
  ],
  howTitle: "How Teams Use AI Voice Flow",
  howSubtitle: "From first utterance to analytics-driven optimization.",
  howToUse: [
    {
      title: "Call Handling",
      description: "Intake and basic routing.",
    },
    {
      title: "Intent Detection",
      description: "Understand customer needs quickly.",
    },
    {
      title: "Response Generation",
      description: "Generate dynamic AI-driven replies.",
    },
    {
      title: "Escalation",
      description: "Handover smoothly to a human agent when needed.",
    },
    {
      title: "Analytics",
      description: "Track performance and optimize conversation flows.",
    },
  ],
  productivityTitle: "Productivity Impact",
  productivitySubtitle: "Measurable results that redefine business efficiency.",
  chartTitle: "Call Volume and Resolution Analytics",
  productivity: [
    { metric: "80%", title: "First-Call Resolution", description: "Decrease ticket volume routed to human agents." },
    { metric: "65%", title: "Lower Op-Ex", description: "Reduced cost per customer interaction." },
    { metric: "24/7", title: "Availability", description: "Zero downtime for global customer support." },
    { metric: "1m 12s", title: "Avg Resolution Time", description: "Optimized handling speed across common intents." },
    { metric: "45%", title: "Faster Than Baseline", description: "Improved resolution performance vs historical flow." },
    { metric: "Real-time", title: "Call Volume Trends", description: "Monitor demand and response behavior instantly." },
  ],
  detailsTitle: "Advanced Deep Capabilities",
  detailsPanelTitle: "Conversation Intelligence Panel",
  detailsPanelDescription: "Real-time transcript intelligence with sentiment and intent highlights.",
  detailsPanelImage: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=1400&h=1000&fit=crop",
  detailsPanelImageAlt: "Voice transcript and sentiment dashboard",
  finalCtaTitle: "Ready to transform your communications?",
  finalCtaDescription:
    "Join 500+ enterprises scaling with AI Voice and intelligent conversation automation.",
  details: [
    {
      label: "Core AI",
      title: "Advanced NLP & Sentiment Analysis",
      description: "Understand accents, slang, and nuanced phrasing in real time.",
      useCase: "Teams support diverse customer segments without script rigidity.",
    },
    {
      label: "Adaptive Tone",
      title: "Seamless CRM Voice Sync",
      description: "Log summaries, action items, and follow-ups automatically into CRM platforms.",
      useCase: "Sales and support teams stay aligned with immediate interaction context.",
    },
    {
      label: "Call Intelligence",
      title: "Transcript Analysis",
      description: "Analyze intent and sentiment from live transcripts for better outcomes.",
      useCase: "Operations teams identify escalation patterns and improve call flows quickly.",
    },
  ],
};

export default function AIVoicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <FeaturePageTemplate content={content} />
      <Footer />
    </div>
  );
}
