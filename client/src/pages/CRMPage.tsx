import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeaturePageTemplate } from "@/components/feature/FeaturePageTemplate";

const content = {
  badge: "New Feature Release",
  heroTitle: "Accelerate Your Pipeline with AI-Driven CRM",
  heroDescription:
    "Supercharge your sales pipeline and manage leads with our AI-powered platform designed for speed, scale, and intelligence.",
  heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&h=1100&fit=crop",
  heroImageAlt: "CRM dashboard with pipeline and metrics",
  whatTitle: "What CRM Does",
  whatSubtitle: "Everything you need to turn relationships into revenue, powered by intelligent automation.",
  whatItDoes: [
    {
      title: "Manage Leads",
      description: "Keep track of every interaction and never miss a follow-up with automated reminders.",
    },
    {
      title: "Track Sales",
      description: "Monitor your pipeline with real-time analytics and predictive forecasting.",
    },
    {
      title: "Improve Collaboration",
      description: "Sync your team seamlessly with shared notes, ownership, and tasks.",
    },
  ],
  howTitle: "Optimized Workflow Flow",
  howSubtitle: "Streamlined from initial contact to lifetime partnership.",
  howToUse: [
    {
      title: "Capture",
      description: "Automated multi-channel lead generation and intent capture.",
    },
    {
      title: "Nurture",
      description: "Personalized AI-driven engagement and follow-up orchestration.",
    },
    {
      title: "Close",
      description: "Opportunity conversion with guided sales actions.",
    },
    {
      title: "Expand",
      description: "Upsell motions and long-term account growth.",
    },
  ],
  productivityTitle: "Productivity Impact",
  productivitySubtitle: "Quantifiable results achieved by high-performing teams.",
  chartTitle: "Revenue Growth and Pipeline Performance",
  productivity: [
    { metric: "35%", title: "Faster Deal Closing", description: "Accelerated pipeline velocity across active opportunities." },
    { metric: "4x", title: "Higher Lead Quality", description: "Higher conversion potential from smarter scoring signals." },
    { metric: "60h", title: "Saved Weekly per Rep", description: "Less manual CRM work and data entry overhead." },
    { metric: "22%", title: "Churn Reduction", description: "Improved retention through proactive engagement." },
    { metric: "98%", title: "Forecast Confidence", description: "Higher confidence in sales forecasting and planning." },
    { metric: "+12.4%", title: "Revenue Growth", description: "Year-over-year uplift from pipeline optimization." },
  ],
  detailsTitle: "Deep Capability Details",
  detailsPanelTitle: "Lead Intelligence Console",
  detailsPanelDescription: "Lead profile intelligence with opportunity value, probability, and activity timeline.",
  detailsPanelImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=1000&fit=crop",
  detailsPanelImageAlt: "Lead intelligence dashboard",
  finalCtaTitle: "Ready to Transform Your Sales Machine?",
  finalCtaDescription:
    "Join 500+ high-growth teams already using OpenBusiness.ai to dominate their markets.",
  details: [
    {
      label: "Core Feature",
      title: "Pipeline Management",
      description:
        "Visualize your entire funnel with customizable stages and instant awareness when deals stall.",
      useCase: "Leaders spot pipeline risk earlier and take action before opportunities slip.",
    },
    {
      label: "Intelligent Insights",
      title: "Predictive Lead Scoring",
      description: "AI models prioritize prospects based on fit, behavior, and engagement signals.",
      useCase: "Inside sales teams focus first on high-intent accounts to improve close probability.",
    },
    {
      label: "Activation",
      title: "Behavioral Tracking",
      description: "Track opens, clicks, and visits automatically so teams react with better timing.",
      useCase: "Reps tailor follow-ups by intent signal instead of relying on manual notes.",
    },
  ],
};

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <FeaturePageTemplate content={content} />
      <Footer />
    </div>
  );
}
