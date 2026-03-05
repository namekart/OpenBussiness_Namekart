import { AppShell } from "@/components/layout/AppShell";
import { FeaturePageTemplate } from "@/components/feature/FeaturePageTemplate";

const content = {
  badge: "New: AI-Powered Forecasting",
  heroTitle: "Unify Your Business Operations with Intelligent ERP",
  heroDescription:
    "Streamline inventory, finance, and operations with one platform built for high-growth teams.",
  heroImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1800&h=1100&fit=crop",
  heroImageAlt: "ERP operations dashboard",
  whatTitle: "What ERP Does",
  whatSubtitle: "Experience centralized management with intelligent data orchestration.",
  whatItDoes: [
    {
      title: "Inventory & Finance",
      description: "Track every dollar and SKU with precision and automated reconciliation.",
    },
    {
      title: "Workflow Automation",
      description: "Eliminate manual tasks with trigger-based automation across operations.",
    },
    {
      title: "Centralized Management",
      description: "Manage your entire business stack from one control surface.",
    },
  ],
  howTitle: "Seamless Operational Flow",
  howSubtitle: "A connected flow from source to reporting.",
  howToUse: [
    {
      title: "Procurement",
      description: "Sourcing and purchasing with standardized controls.",
    },
    {
      title: "Inventory",
      description: "Track stock movement and reorder levels in real time.",
    },
    {
      title: "Invoicing",
      description: "Automated billing and receivables workflows.",
    },
    {
      title: "Reporting",
      description: "Actionable business insights from connected data.",
    },
    {
      title: "Optimization",
      description: "Use data insights to continuously refine operating efficiency.",
    },
  ],
  productivityTitle: "Productivity Impact",
  productivitySubtitle: "Real measurable results from enterprise teams.",
  chartTitle: "Operations and Cashflow Trends",
  productivity: [
    { metric: "22%", title: "Reduced Overhead", description: "Average savings during first implementation phase." },
    { metric: "15h", title: "Saved Weekly", description: "Per operations manager through automation." },
    { metric: "99.9%", title: "Data Accuracy", description: "Eliminating manual entry errors across systems." },
    { metric: "+12%", title: "Cashflow Growth", description: "Yearly improvement in asset performance." },
    { metric: "Real-time", title: "Inventory Health", description: "Track movement and turnover across warehouses." },
    { metric: "Global", title: "Scalable Operations", description: "Support multi-entity workflows with confidence." },
  ],
  detailsTitle: "Intelligence at Every Touchpoint",
  detailsPanelTitle: "Operations Command View",
  detailsPanelDescription: "Cross-functional performance from procurement through collections in one dashboard.",
  detailsPanelImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&h=1000&fit=crop",
  detailsPanelImageAlt: "ERP operations control panel",
  finalCtaTitle: "Ready to unify your business operations?",
  finalCtaDescription:
    "Join high-growth companies using OpenBusiness.ai to power operations with clarity and speed.",
  details: [
    {
      label: "Real-time Inventory",
      title: "Never lose track of a single SKU",
      description: "Sync stock across warehouses and channels with predictive demand support.",
      useCase: "Operations teams prevent stockouts by triggering replenishment before threshold breaches.",
    },
    {
      label: "Smart Invoicing",
      title: "Cash flow management on autopilot",
      description: "Automate recurring billing, tax handling, and integrated payment collection.",
      useCase: "Finance teams improve payment speed while reducing billing errors and delays.",
    },
  ],
};

export default function ERPPage() {
  return (
    <AppShell title="ERP" subtitle="Feature workspace">
      <FeaturePageTemplate content={content} />
    </AppShell>
  );
}
