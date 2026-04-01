import { motion } from 'framer-motion';
import { Quote, Sparkles, TrendingUp, Heart, ArrowRight, AlertCircle, CheckCircle2, Leaf, Shield, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const missionPoints = [
  { label: 'Sustainable Innovation', icon: Leaf, text: 'Pioneering regenerative tech that respects the earth while maximizing profit.' },
  { label: 'Data Integrity', icon: Shield, text: 'Hardened security and transparent algorithms for your peace of mind.' },
  { label: 'Global Connectivity', icon: Globe, text: 'Bridging local expertise with global agricultural financial indices.' }
];

const comparisons = [
  {
    problem: "Outdated intuition-based decision making",
    solution: "Data-driven precision with Cropify diagnostics",
    icon: TrendingUp
  },
  {
    problem: "Fragmented and insecure farm data silos",
    solution: "Unified, state-of-the-art secure cloud ecosystem",
    icon: Shield
  },
  {
    problem: "Unpredictable yield and financial instability",
    solution: "Predictive modeling for guaranteed growth paths",
    icon: Heart
  }
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background pb-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Editorial Heading */}
        <div className="pt-32 pb-24 border-b border-primary/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="text-accent font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Sparkles size={16} />
              THE CROP-TECH REVOLUTION
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-extrabold text-primary leading-[1] tracking-tight mb-12">
              Cultivating a <span className="text-accent italic">Smarter</span><br />Agricultural Future.
            </h1>
            <p className="text-xl md:text-2xl text-primary/60 leading-relaxed font-sans font-medium">
              Cropify is a premiere agricultural fintech firm. We've spent a decade refining the intersection of soil science and financial risk management.
            </p>
          </motion.div>
        </div>

        {/* Vision Section */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                alt="Our Heritage"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <Quote size={40} className="text-accent mb-4 opacity-80" />
                <p className="text-xl font-medium italic leading-relaxed">
                  "Legacy is built by those who see the data within the dirt."
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary tracking-tight">
              Our Core Methodology
            </h2>
            <div className="space-y-6">
              {missionPoints.map((point, idx) => (
                <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white border border-muted/30 hover:border-accent/20 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <point.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{point.label}</h3>
                    <p className="text-primary/60 text-sm leading-relaxed">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem vs Solution - The Comparison Grid */}
        <section className="py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">
              Bridging the <span className="text-accent">Efficiency Gap</span>
            </h2>
            <p className="text-primary/60 font-medium">
              We identified the systemic failures in traditional farming and engineered
              world-class solutions through the Cropify design system.
            </p>
          </div>

          <div className="space-y-6">
            {comparisons.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="bg-white border border-muted/50 p-6 rounded-2xl flex items-center gap-4 opacity-60">
                  <AlertCircle className="text-red-400 shrink-0" size={20} />
                  <span className="text-primary/80 font-medium text-sm">{item.problem}</span>
                </div>
                <div className="bg-accent/5 border border-accent/20 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
                  <CheckCircle2 className="text-accent shrink-0" size={20} />
                  <span className="text-primary font-bold text-sm tracking-tight">{item.solution}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA Strip */}
        <section className="mt-20">
          <div className="bg-primary rounded-[2.5rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Animated background shape */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1/2 -right-1/4 w-[120%] h-[200%] bg-accent/20 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.1] max-w-2xl mx-auto">
                Harvest Your <br /> Potential.
              </h2>
              <p className="text-xl md:text-2xl text-white/60 max-w-xl mx-auto font-sans font-medium leading-relaxed">
                Step into the future of digital agriculture. Start your diagnostic assessment today.
              </p>
              <div className="flex justify-center">
                <Link to="/advisor">
                  <Button variant="primary" size="lg" className="shadow-2xl shadow-accent/20 group px-12">
                    Open Advisor
                    <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
