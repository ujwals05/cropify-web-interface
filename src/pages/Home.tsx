import { motion } from 'framer-motion';
import { ArrowRight, Sprout, CloudRain, BarChart3, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Soil Health', value: '98%', icon: Sprout, color: 'text-accent' },
  { label: 'Moisture', value: '42%', icon: CloudRain, color: 'text-blue-500' },
  { label: 'Yield Forecast', value: '+12%', icon: BarChart3, color: 'text-highlight' },
];

const features = [
  {
    title: "Precision Analytics",
    description: "Deep-dive into your soil's DNA with our advanced AI diagnostic tools.",
    icon: Zap,
    color: "bg-accent/10 text-accent"
  },
  {
    title: "Eco-Security",
    description: "Military-grade data protection for your farm's most valuable assets.",
    icon: ShieldCheck,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    title: "Global Insights",
    description: "Connect with worldwide agricultural trends and market fluctuations.",
    icon: Globe,
    color: "bg-highlight/10 text-highlight"
  }
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background pb-32"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 md:pt-24 lg:pt-28 pb-16 md:pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-primary/5 text-primary/70 font-semibold text-xs tracking-wide shadow-sm mb-8">
              <Sparkles size={14} className="text-accent" />
              <span>THE FUTURE OF AGRI-FINTECH</span>
            </div>

            <h1 className="text-2xl md:text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-[1] tracking-tight text-primary mb-8">
              Sow <span className="text-accent underline decoration-accent/20 underline-offset-8">Intelligence</span>,<br />
              Harvest Wealth.
            </h1>

            <p className="text-base md:text-lg text-primary/70 max-w-lg leading-relaxed font-sans mb-10">
              Cropify empowers modern farmers with institutional-grade analytics.
              Predict yields, optimize soil health, and secure your financial future with Cropify.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/advisor">
                <Button size="lg" className="shadow-lg hover:shadow-accent/20 px-10 group">
                  Start Analyzing
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="md" className="px-6 py-3 border-primary/10 text-primary/80 hover:bg-primary/5">
                  Our Method
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-sm md:max-w-md lg:max-w-lg mx-auto group transition-all duration-700">
              {/* Image Container with Gradient Overlay */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop"
                  alt="Sustainable Farming"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-accent/20" />
              </div>

              {/* Floating Glass Dashboard Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -right-4 md:-right-12 top-1/4 max-w-[200px]"
              >
                <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-premium border border-white/40 ring-1 ring-black/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                      <BarChart3 size={18} />
                    </div>
                    <span className="font-bold text-primary text-sm">Monthly Yield</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-extrabold text-primary">84.2</span>
                      <span className="text-xs font-bold text-accent mb-1">+12%</span>
                    </div>
                    <div className="flex gap-1 items-end h-12">
                      {[40, 70, 45, 90, 65, 80].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-accent/20 rounded-t-sm transition-all duration-500 hover:bg-accent"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Verified Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white py-3 px-6 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10"
              >
                <ShieldCheck className="text-accent" size={20} />
                <span className="text-sm font-bold tracking-tight">Cropify Verified Data</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats & Features Section */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-accent/10 transition-colors" />
                <stat.icon className={cn("mb-6 transition-transform group-hover:scale-110", stat.color)} size={32} />
                <div className="text-2xl md:text-3xl font-extrabold text-primary mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-primary/40 uppercase tracking-widest leading-none">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-muted/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg group">
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-primary/60 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
