import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  Mic, 
  Settings, 
  Search, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Globe2,
  Activity,
  BarChart3
} from "lucide-react";

const TABS = ["CRM", "ERP", "Voice"];

const DASHBOARD_DATA = {
  ERP: {
    title: "Financial Operations",
    subtitle: "Real-time resource planning & metrics",
    stats: [
      { label: "Q2 REVENUE", value: "$8.4M", trend: "+12.5%", positive: true },
      { label: "OPEX", value: "$3.1M", trend: "-2.4%", positive: true },
      { label: "NET MARGIN", value: "42.8%", trend: "+4.1%", positive: true }
    ],
    chartLabel: "REVENUE VS EXPENSES (YTD)"
  },
  CRM: {
    title: "Pipeline Overview",
    subtitle: "Active enterprise deals by stage",
    stats: [
      { label: "LEAD", value: "Nova Dynamics", amount: "$250,000", color: "bg-blue-500" },
      { label: "QUALIFIED", value: "GlobalTech", amount: "$85,000", color: "bg-yellow-500" },
      { label: "PROPOSAL", value: "Acme Corp", amount: "$120,000", color: "bg-orange-500" },
      { label: "WON", value: "Stark Ind.", amount: "$450,000", color: "bg-green-500" }
    ],
    chartLabel: "SALES VELOCITY"
  },
  Voice: {
    title: "Voice Intelligence",
    subtitle: "Multilingual semantic analysis",
    stats: [
      { label: "LANGUAGES", value: "50+", icon: <Globe2 className="w-4 h-4 text-green-500" /> },
      { label: "SENTIMENT", value: "94%", icon: <Activity className="w-4 h-4 text-blue-500" /> },
      { label: "VOLUME", value: "1.2M", icon: <BarChart3 className="w-4 h-4 text-purple-500" /> }
    ],
    chartLabel: "IN-FLIGHT AGENT DISTRIBUTION"
  }
};

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("ERP");
  const data = DASHBOARD_DATA[activeTab as keyof typeof DASHBOARD_DATA];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = TABS.indexOf(prev);
        return TABS[(currentIndex + 1) % TABS.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="product-showcase" className="py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold mb-6 text-foreground"
          >
            Command Center.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            One dashboard to rule your entire global footprint. Real-time observability for every KPI.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-6xl mx-auto aspect-[16/10] md:aspect-[16/9] rounded-[2rem] border border-border/50 bg-[#0A0C10] shadow-2xl overflow-hidden flex"
        >
          {/* Sidebar */}
          <div className="w-20 md:w-64 border-r border-border/50 flex flex-col p-4 md:p-6 bg-[#0D0F14]">
            <div className="flex gap-1.5 mb-10 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>

            <div className="space-y-8 flex-1">
              <div>
                <p className="hidden md:block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-4 px-2">Infrastructure</p>
                <div className="space-y-1">
                  {[
                    { id: "CRM", icon: Users },
                    { id: "ERP", icon: Database },
                    { id: "Voice", icon: Mic }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        activeTab === item.id 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="hidden md:block font-medium text-sm">{item.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="hidden md:block text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-4 px-2">Management</p>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="hidden md:block font-medium text-sm">Settings</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-border/50">
              <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">OS</div>
                <div className="hidden md:block overflow-hidden">
                  <p className="text-xs font-bold truncate">System Admin</p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">Enterprise v4.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 md:px-8 bg-[#0D0F14]/50">
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                <LayoutDashboard className="w-3 h-3 text-primary" />
                <span>Control</span>
                <span className="opacity-30">/</span>
                <span className="text-foreground">{activeTab}</span>
              </div>
              <div className="flex items-center gap-4">
                <Search className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                <Bell className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 md:p-10 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-1">{data.title}</h3>
                    <p className="text-sm text-muted-foreground">{data.subtitle}</p>
                  </div>

                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {activeTab === "CRM" ? (
                      data.stats.map((stat: any, i) => (
                        <div key={i} className="bg-[#14171C] border border-border/50 p-5 rounded-2xl">
                          <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3 flex items-center justify-between">
                            {stat.label}
                            <span className={`w-2 h-2 rounded-full ${stat.color}`}></span>
                          </p>
                          <p className="text-sm font-bold mb-1 truncate">{stat.value}</p>
                          <p className="text-xs text-muted-foreground">{stat.amount}</p>
                        </div>
                      ))
                    ) : (
                      data.stats.map((stat: any, i) => (
                        <div key={i} className="bg-[#14171C] border border-border/50 p-5 rounded-2xl">
                          <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">{stat.label}</p>
                          <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold flex items-center gap-2">
                              {stat.icon && stat.icon}
                              {stat.value}
                            </p>
                            {stat.trend && (
                              <div className={`flex items-center text-[10px] font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 bg-[#14171C] border border-border/50 rounded-2xl p-6 relative overflow-hidden">
                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-6">{data.chartLabel}</p>
                    
                    {activeTab === "Voice" ? (
                      <div className="h-full flex items-end justify-between gap-4 pb-12">
                        {["EN", "ES", "FR", "DE", "ZH"].map((lang, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-3">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${[80, 40, 25, 20, 15][i]}%` }}
                              className="w-full max-w-[40px] bg-primary rounded-lg shadow-lg shadow-primary/20"
                            ></motion.div>
                            <span className="text-[10px] font-bold text-muted-foreground">{lang}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full relative pb-12">
                         {/* Mock Line Chart */}
                         <svg className="w-full h-full" viewBox="0 0 400 150">
                            <motion.path
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, ease: "easeInOut" }}
                              d="M0,120 Q50,110 100,90 T200,80 T300,50 T400,30"
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="3"
                            />
                            <motion.path
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1 }}
                              d="M0,130 Q50,125 100,115 T200,110 T300,105 T400,100"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeDasharray="4 4"
                              opacity="0.3"
                            />
                         </svg>
                         <div className="flex justify-between mt-4 text-[10px] font-bold text-muted-foreground px-2">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                         </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
