import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WhatItem = {
  title: string;
  description: string;
};

type StepItem = {
  title: string;
  description: string;
};

type DetailItem = {
  label: string;
  title: string;
  description: string;
  useCase: string;
};

type BenefitItem = {
  metric?: string;
  title: string;
  description: string;
};

export type FeaturePageContent = {
  badge: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt: string;
  whatTitle: string;
  whatSubtitle: string;
  whatItDoes: WhatItem[];
  howTitle: string;
  howSubtitle: string;
  howToUse: StepItem[];
  productivityTitle: string;
  productivitySubtitle: string;
  productivity: BenefitItem[];
  chartTitle: string;
  detailsTitle: string;
  detailsPanelTitle: string;
  detailsPanelDescription: string;
  detailsPanelImage: string;
  detailsPanelImageAlt: string;
  finalCtaTitle: string;
  finalCtaDescription: string;
  details: DetailItem[];
};

type FeaturePageTemplateProps = {
  content: FeaturePageContent;
};

export function FeaturePageTemplate({ content }: FeaturePageTemplateProps) {
  const howGridColsClass =
    content.howToUse.length >= 5 ? "md:grid-cols-5" : content.howToUse.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden pt-28 pb-24 bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-16 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium text-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              {content.badge}
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              {content.heroTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {content.heroDescription}
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Button className="rounded-full h-14 px-10 font-semibold bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-0.5">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-14 max-w-6xl mx-auto rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 shadow-2xl"
          >
            <img
              src={content.heroImage}
              alt={content.heroImageAlt}
              className="w-full h-[320px] md:h-[460px] object-cover rounded-2xl border border-border/50"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">{content.whatTitle}</h2>
          <p className="text-muted-foreground mt-3 mb-8">{content.whatSubtitle}</p>
          <div className="grid gap-5 md:grid-cols-3">
            {content.whatItDoes.map((item) => (
              <Card key={item.title} className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
                    <span>{item.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{item.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">{content.howTitle}</h2>
          <p className="text-muted-foreground mt-3 mb-8">{content.howSubtitle}</p>
          <div className={`grid gap-5 ${howGridColsClass}`}>
            {content.howToUse.map((step, index) => (
              <Card key={step.title} className="border-border/60 bg-card/70 backdrop-blur-sm md:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">
                    <span className="text-primary mr-2">0{index + 1}.</span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{step.description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold">{content.productivityTitle}</h2>
          <p className="text-muted-foreground mt-3 mb-8">{content.productivitySubtitle}</p>
          <div className="grid gap-5 md:grid-cols-3">
            {content.productivity.map((item) => (
              <Card key={item.title} className="border-border/60 bg-card/80">
                <CardHeader>
                  {item.metric ? <p className="text-2xl font-extrabold text-primary">{item.metric}</p> : null}
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{item.description}</CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6 border-border/60 bg-card/80 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">{content.chartTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Trend</p>
                  <svg viewBox="0 0 300 140" className="w-full h-36">
                    <path d="M5 120 C 40 110, 70 90, 100 95 C 130 100, 160 70, 195 72 C 225 74, 250 45, 295 30" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" />
                    <path d="M5 125 L295 125" stroke="hsl(var(--border))" strokeWidth="1" />
                  </svg>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Performance Mix</p>
                  <div className="h-36 flex items-end gap-3">
                    {[50, 75, 62, 90, 68, 96].map((height, i) => (
                      <div key={height + i} className="flex-1 rounded-t-md bg-gradient-to-t from-primary/40 to-primary" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8">{content.detailsTitle}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-5">
              {content.details.map((item) => (
                <Card key={item.title} className="border-border/60 bg-card/80">
                  <CardHeader>
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold">{item.label}</p>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{item.description}</p>
                    <div className="rounded-xl bg-accent/50 border border-border/60 p-4 text-sm">
                      <p className="font-semibold mb-1">Use case</p>
                      <p className="text-muted-foreground">{item.useCase}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-border/60 bg-card/80 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">{content.detailsPanelTitle}</CardTitle>
                <p className="text-sm text-muted-foreground">{content.detailsPanelDescription}</p>
              </CardHeader>
              <CardContent>
                <img
                  src={content.detailsPanelImage}
                  alt={content.detailsPanelImageAlt}
                  className="w-full h-[340px] object-cover rounded-xl border border-border/60"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="rounded-[2rem] border border-border bg-gradient-to-r from-primary/15 via-purple-500/10 to-pink-500/10 p-8 md:p-12 text-center shadow-xl">
            <h2 className="font-display text-3xl md:text-5xl font-bold">{content.finalCtaTitle}</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              {content.finalCtaDescription}
            </p>
            <Button className="mt-8 rounded-xl h-12 px-8 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
