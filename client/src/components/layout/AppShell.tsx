import { Link, useLocation } from "wouter";
import { Bell, Database, Hexagon, Mic, Search, Settings, Users } from "lucide-react";

type AppShellProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

const infrastructureItems = [
  { href: "/crm", label: "CRM", icon: Users },
  { href: "/erp", label: "ERP", icon: Database },
  { href: "/ai-voice", label: "AI Voice", icon: Mic },
];

const managementItems = [{ href: "/settings", label: "Settings", icon: Settings }];

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground p-3 md:p-5">
      <div className="mx-auto max-w-[1600px] rounded-3xl border border-border/60 bg-card/40 shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-[260px_1fr] min-h-[calc(100vh-2.5rem)]">
          <aside className="border-r border-border/60 bg-[#0B0C10] text-slate-200 p-5 md:p-6">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg shadow-primary/30">
                <Hexagon className="w-5 h-5 fill-current" />
              </div>
              <span className="font-display font-bold text-lg">
                OpenBusiness<span className="text-primary">.ai</span>
              </span>
            </Link>

            <div className="space-y-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Infrastructure
                </p>
                <div className="space-y-2">
                  {infrastructureItems.map((item) => {
                    const active = location === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                          active
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Management
                </p>
                <div className="space-y-2">
                  {managementItems.map((item) => {
                    const active = location === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                          active
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                            : "text-slate-300 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <section className="bg-background">
            <div className="h-16 border-b border-border/60 px-6 md:px-8 flex items-center justify-between">
              <div>
                {title ? <h1 className="font-display text-lg md:text-xl font-bold">{title}</h1> : null}
                {subtitle ? <p className="text-xs md:text-sm text-muted-foreground">{subtitle}</p> : null}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Search className="h-4 w-4 cursor-pointer hover:text-foreground" />
                <Bell className="h-4 w-4 cursor-pointer hover:text-foreground" />
                <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 text-primary flex items-center justify-center text-xs font-bold">
                  U
                </div>
              </div>
            </div>
            <div className="h-[calc(100vh-6.5rem)] overflow-y-auto">{children}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
