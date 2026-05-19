import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useSpring, animate } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "sonner";
import {
  Phone,
  MessageCircle,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Sparkles,
  Mail,
  ShieldCheck,
  Clock,
  TrendingUp,
  Zap,
  Bot,
  Stars,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import ganshLogo from "../assets/gansh-logo-transparent.png";

/* ============================================================
   Reveal wrapper – fade-up on scroll
   ============================================================ */
const Reveal = ({ children, delay = 0, y = 28, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================================
   Animated counter
   ============================================================ */
const Counter = ({ to = 48, duration = 1.8 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{val}</span>;
};

/* ============================================================
   Navbar – glassy, larger logo, smooth hide on scroll up
   ============================================================ */
const Navbar = ({ onCtaClick }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Services", id: "services" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Contact", id: "contact" },
  ];

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#05070f]/75 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 md:h-24 flex items-center justify-between">
        <button
          data-testid="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group"
          aria-label="Gansh AI home"
        >
          <img
            src={ganshLogo}
            alt="Gansh AI"
            className="h-20 md:h-24 w-auto object-contain logo-invert select-none transition-transform duration-500 group-hover:scale-105"
            draggable="false"
          />
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-link-${l.id}`}
              onClick={() => go(l.id)}
              className="relative px-5 py-2 text-[15px] font-medium text-slate-300 hover:text-white transition-colors group"
            >
              {l.label}
              <span className="absolute left-5 right-5 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-[#ff6b1a] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            data-testid="nav-cta-get-started"
            onClick={onCtaClick}
            className="bg-[#ff6b1a] hover:bg-[#ff7a30] text-white font-semibold rounded-full px-7 h-12 shadow-[0_8px_30px_-8px_rgba(255,107,26,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(255,107,26,0.85)] hover:-translate-y-0.5 transition-all"
          >
            Get Started
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>

        <button
          data-testid="nav-mobile-toggle"
          className="md:hidden p-2 rounded-md text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          data-testid="mobile-menu"
          className="md:hidden bg-[#05070f]/95 backdrop-blur-xl border-t border-white/5 px-5 py-4 space-y-2"
        >
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={`mobile-link-${l.id}`}
              onClick={() => go(l.id)}
              className="block w-full text-left py-3 px-2 rounded-lg text-slate-200 hover:bg-white/5 font-medium"
            >
              {l.label}
            </button>
          ))}
          <Button
            data-testid="mobile-cta-get-started"
            onClick={() => {
              setOpen(false);
              onCtaClick();
            }}
            className="w-full bg-[#ff6b1a] hover:bg-[#ff7a30] text-white font-semibold rounded-full h-12"
          >
            Get Started
          </Button>
        </motion.div>
      )}
    </motion.header>
  );
};

/* ============================================================
   Hero Visual – animated dashboard + nodes
   ============================================================ */
const HeroVisual = () => {
  return (
    <div data-testid="hero-visual" className="relative w-full aspect-[5/4] md:aspect-[6/5]">
      {/* Layer: dark glass card */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0a0f1f] via-[#0d1428] to-[#0a0f1f] border border-white/5">
        <div className="absolute inset-0 gansh-grid opacity-60" />

        {/* SVG connectors */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ln1" x1="0" x2="1">
              <stop offset="0%" stopColor="#ff6b1a" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#ff6b1a" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ff6b1a" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="ln2" x1="0" x2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M60 70 Q 200 30 350 100" stroke="url(#ln1)" strokeWidth="1.4" fill="none" className="gansh-dash" />
          <path d="M90 230 Q 220 280 320 220" stroke="url(#ln2)" strokeWidth="1.2" fill="none" />
          <path d="M70 160 Q 200 110 340 180" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" strokeDasharray="3 4" />
        </svg>

        {/* Floating nodes */}
        <div className="absolute top-[18%] left-[14%] w-3 h-3 rounded-full bg-[#ff6b1a] gansh-float-slow shadow-[0_0_24px_rgba(255,107,26,0.85)]" />
        <div className="absolute top-[68%] left-[22%] w-2 h-2 rounded-full bg-[#38bdf8] gansh-float-fast shadow-[0_0_18px_rgba(56,189,248,0.7)]" />
        <div className="absolute top-[30%] right-[12%] w-2.5 h-2.5 rounded-full bg-white/80 gansh-float-slow" />
        <div className="absolute bottom-[18%] right-[24%] w-3.5 h-3.5 rounded-full bg-[#ff6b1a] gansh-float-fast shadow-[0_0_24px_rgba(255,107,26,0.85)]" />
      </div>

      {/* Glass dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[6%] right-[6%] top-[14%] gansh-glass rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-5 md:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-[#ff6b1a] animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6b1a]" />
            </span>
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.18em] uppercase">
              Live Lead Feed
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {[
          { icon: <Phone className="w-4 h-4 text-[#ff9a5a]" />, title: "Missed call → AI answered", sub: "Booked appointment · 0:38", tone: "text-emerald-400", tag: "+1 lead" },
          { icon: <MessageCircle className="w-4 h-4 text-[#38bdf8]" />, title: "WhatsApp inquiry handled", sub: "Quote sent automatically", tone: "text-emerald-400", tag: "Replied" },
          { icon: <Workflow className="w-4 h-4 text-[#a5b4fc]" />, title: "Invoice synced to CRM", sub: "Workflow #12 complete", tone: "text-slate-400", tag: "Done" },
        ].map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.18, duration: 0.6 }}
            className="flex items-center justify-between py-2.5 border-b last:border-0 border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">{row.icon}</div>
              <div>
                <div className="text-sm font-semibold text-slate-100">{row.title}</div>
                <div className="text-xs text-slate-400">{row.sub}</div>
              </div>
            </div>
            <span className={`text-xs font-semibold ${row.tone}`}>{row.tag}</span>
          </motion.div>
        ))}

        <div className="mt-4 flex items-center justify-between bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-xl px-4 py-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold">Captured today</div>
            <div className="text-2xl font-bold text-white font-heading">
              <Counter to={48} /> leads
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            +32%
          </div>
        </div>
      </motion.div>

      {/* Floating AI badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="absolute -bottom-3 right-4 md:right-8 gansh-glass rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3"
      >
        <div className="relative w-9 h-9 rounded-full bg-[#ff6b1a]/15 flex items-center justify-center gansh-pulse-ring">
          <Bot className="w-4 h-4 text-[#ff6b1a]" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 font-semibold">AI Agent</div>
          <div className="text-sm font-bold text-white">Answering 24/7</div>
        </div>
      </motion.div>
    </div>
  );
};

/* ============================================================
   Hero – spotlight cursor + staggered word reveal
   ============================================================ */
const Hero = ({ onCtaClick }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.35]);

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      data-testid="hero-section"
      className="gansh-spotlight relative pt-36 md:pt-44 pb-20 md:pb-28 overflow-hidden"
    >
      <div className="gansh-aurora" />
      <div className="absolute inset-0 -z-10 gansh-grid opacity-40" />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 md:gap-16 items-center">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-full pl-1 pr-4 py-1 mb-7">
              <span className="bg-[#ff6b1a] text-white text-[11px] font-bold uppercase tracking-[0.18em] rounded-full px-2.5 py-1">New</span>
              <span className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
                <Stars className="w-3.5 h-3.5 text-[#ff9a5a]" />
                AI Voice Agents now live for SMBs
              </span>
            </div>
          </Reveal>

          <h1 data-testid="hero-headline" className="font-heading text-4xl sm:text-5xl lg:text-[64px] xl:text-[72px] font-bold text-white leading-[1.04] tracking-tight">
            {["Stop", "Losing", "Customers", "to"].map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="inline-block mr-3 relative"
            >
              <span className="gansh-shimmer">Unanswered Calls</span>
            </motion.span>
            {["and", "Slow", "Follow-Ups."].map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.42 + i * 0.06 }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <Reveal delay={0.6}>
            <p className="mt-7 text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl">
              Replace manual communication friction with intelligent, seamless automation. Reclaim your time and scale effortlessly.
            </p>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                data-testid="hero-cta-primary"
                onClick={onCtaClick}
                className="group bg-[#ff6b1a] hover:bg-[#ff7a30] text-white font-semibold rounded-full h-14 px-8 text-base shadow-[0_15px_40px_-10px_rgba(255,107,26,0.7)] hover:shadow-[0_20px_60px_-10px_rgba(255,107,26,0.9)] hover:-translate-y-0.5 transition-all"
              >
                Automate My Business
                <ArrowRight className="ml-1.5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                data-testid="hero-cta-secondary"
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="rounded-full h-14 px-8 text-base font-semibold border-white/15 text-white hover:bg-white/5 bg-transparent"
              >
                See How It Works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.8}>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              {["No code required", "Free consultation", "Setup in days, not months"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.3} y={36}>
          <HeroVisual />
        </Reveal>
      </motion.div>
    </section>
  );
};

/* ============================================================
   Marquee trust strip
   ============================================================ */
const TrustStrip = () => {
  const items = [
    "Local Clinics",
    "Real Estate Agents",
    "Auto Dealerships",
    "Salons & Spas",
    "Home Services",
    "Law Firms",
    "Boutique Hotels",
    "Restaurants",
    "Coaching Studios",
  ];
  const doubled = [...items, ...items];
  return (
    <section className="py-14 border-y border-white/5 bg-[#070b18] overflow-hidden relative">
      <Reveal>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-6">
          Built for ambitious local businesses
        </p>
      </Reveal>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#070b18] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#070b18] to-transparent z-10 pointer-events-none" />
        <div className="flex gansh-marquee-track gap-12 whitespace-nowrap">
          {doubled.map((t, i) => (
            <span key={i} className="font-heading text-2xl md:text-3xl font-semibold text-slate-600 hover:text-slate-300 transition-colors">
              {t}
              <span className="ml-12 text-[#ff6b1a]/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Problem / Solution split
   ============================================================ */
const ProblemSolution = () => (
  <section data-testid="problem-solution-section" className="py-24 md:py-32 relative">
    <div className="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-8 md:gap-10 items-stretch">
      <Reveal>
        <div className="gansh-tilt h-full rounded-3xl bg-gradient-to-br from-[#0d1428] to-[#0a0f1f] border border-white/5 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -left-16 w-56 h-56 rounded-full bg-rose-500/10 blur-3xl" />
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-rose-400 mb-4">The Problem</div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white leading-tight">
            You are losing revenue when you miss calls or delay replies.
          </h3>
          <p className="mt-5 text-slate-400 leading-relaxed">
            Every unanswered call is a customer ringing the next business on the list. Every late reply is a quote that goes cold. Hiring more staff doesn't scale — and it gets expensive fast.
          </p>
          <ul className="mt-7 space-y-3">
            {["67% of customers won't call back after a missed call", "Lead response under 5 mins is 21× more likely to convert", "Repetitive tasks eat 40% of your team's week"].map((t) => (
              <li key={t} className="flex items-start gap-3 text-slate-300">
                <X className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="gansh-tilt h-full rounded-3xl bg-gradient-to-br from-[#1a1240] via-[#0f1a3a] to-[#0a0f1f] border border-white/10 p-8 md:p-10 relative overflow-hidden text-white">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#ff6b1a]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-[#4f6cf3]/20 blur-3xl" />
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#fdba74] mb-4 relative">Our Solution</div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold leading-tight relative">
            We build systems that fit how you already operate, capturing every lead instantly.
          </h3>
          <p className="mt-5 text-slate-300 leading-relaxed relative">
            Gansh AI plugs into your phone, WhatsApp, and tools — so every inquiry gets answered, qualified, and routed in seconds. No friction. No retraining. Just more revenue captured.
          </p>
          <ul className="mt-7 space-y-3 relative">
            {[
              { icon: Clock, text: "Answers in under 3 seconds, 24/7" },
              { icon: ShieldCheck, text: "Sounds human, stays on-brand" },
              { icon: TrendingUp, text: "Captured leads logged & followed up automatically" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-[#fdba74] flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ============================================================
   Services – tilt-on-hover cards with glow border
   ============================================================ */
const services = [
  { icon: Phone, title: "Intelligent Call Automation", desc: "Never miss a revenue opportunity. Our AI voice solutions handle customer inquiries 24/7, promptly and professionally.", bullet: ["Books appointments", "Qualifies leads", "Sends call summaries"] },
  { icon: MessageCircle, title: "WhatsApp Automation", desc: "Turn your messaging into a fast, conversational engine for lead nurturing, instant support, and client updates.", bullet: ["Instant replies", "Broadcasts & nudges", "Two-way chat handoff"] },
  { icon: Workflow, title: "Business Workflow Automation", desc: "Connect your daily operations. Routine manual tasks happen automatically in the background so you can focus on the real work.", bullet: ["CRM sync", "Invoicing & reminders", "Custom integrations"] },
];

const Services = () => (
  <section id="services" data-testid="services-section" className="py-24 md:py-32 relative">
    <div className="absolute inset-0 -z-10 gansh-grid opacity-30" />
    <div className="max-w-7xl mx-auto px-5 md:px-8">
      <div className="max-w-2xl">
        <Reveal>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff9a5a] mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Core Services
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
            Three engines. One always-on{" "}
            <span className="gansh-shimmer">revenue system</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 text-slate-400 text-lg max-w-xl">
            Pick one, or run all three together. Each module fits your existing tools and workflows.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
            <div data-testid={`service-card-${i}`} className="gansh-glow-border gansh-tilt group relative h-full rounded-3xl bg-gradient-to-br from-[#0d1428] to-[#080c1a] border border-white/5 p-7 md:p-8 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#ff6b1a]/0 group-hover:bg-[#ff6b1a]/10 blur-3xl transition-all duration-700" />

              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff6b1a] to-[#c2410c] flex items-center justify-center mb-6 shadow-[0_12px_30px_-10px_rgba(255,107,26,0.7)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-3">
                {s.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">{s.desc}</p>
              <ul className="mt-6 space-y-2">
                {s.bullet.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#ff9a5a]" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="absolute top-7 right-7 font-heading text-4xl font-black text-white/5 group-hover:text-[#ff6b1a]/30 transition-colors duration-500">
                0{i + 1}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ============================================================
   How It Works
   ============================================================ */
const steps = [
  { n: "01", title: "Discovery call", desc: "We map your current call & follow-up flow in 30 minutes — no slides, just your real bottlenecks." },
  { n: "02", title: "Custom blueprint", desc: "You get a clear automation plan: what gets answered, what gets routed, what gets logged." },
  { n: "03", title: "Build & integrate", desc: "We deploy your AI agents on phone, WhatsApp and tools — connected to the systems you already use." },
  { n: "04", title: "Go live & scale", desc: "Track captured leads, response times, and revenue impact from day one. Iterate together." },
];

const HowItWorks = () => (
  <section id="how-it-works" data-testid="how-it-works-section" className="py-24 md:py-32 relative bg-[#070b18] border-y border-white/5">
    <div className="absolute inset-0 -z-0 opacity-50">
      <div className="gansh-aurora" />
    </div>
    <div className="relative max-w-7xl mx-auto px-5 md:px-8">
      <div className="max-w-2xl">
        <Reveal>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff9a5a] mb-3 flex items-center gap-2">
            <Workflow className="w-3.5 h-3.5" />
            How It Works
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05]">
            From first call to fully automated — <span className="gansh-shimmer">in days</span>.
          </h2>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="gansh-tilt relative h-full bg-gradient-to-br from-[#0d1428] to-[#080c1a] border border-white/5 rounded-2xl p-7">
              <div className="font-heading text-4xl font-black text-[#ff6b1a] mb-4">{s.n}</div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/15" />
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ============================================================
   Contact Form
   ============================================================ */
const ContactForm = () => {
  const [form, setForm] = useState({ full_name: "", business_name: "", email: "", phone: "", need: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.business_name || !form.email || !form.phone || !form.need) {
      toast.error("Please fill in every field so we can reach out properly.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("/api/leads", form);
      setSuccess(true);
      toast.success("Got it — we'll be in touch within 24 hours.");
    } catch (err) {
      if (!err?.response) {
        toast.error("Backend not reachable. Start it with `npm run dev:all` (or run `npm run server` in another terminal).");
      } else {
        const msg = err?.response?.data?.detail || "Something went wrong. Please try again.";
        toast.error(typeof msg === "string" ? msg : "Submission failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32 relative overflow-hidden">
      <div className="gansh-aurora" />
      <div className="relative max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-5 gap-10 md:gap-14 items-start">
        <div className="md:col-span-2">
          <Reveal>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff9a5a] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Free Consultation
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-[1.05]">
              Let's automate the part of your business that's <span className="gansh-shimmer">costing you most</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-slate-400 text-lg leading-relaxed">
              Tell us a bit about your business. We'll get back within 24 hours with a quick plan tailored to you — no pressure, no jargon.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#ff9a5a]" />
                </div>
                <a data-testid="contact-email-link" href="mailto:yugansh@gansh-ai.com" className="font-medium hover:text-white transition-colors">
                  yugansh@gansh-ai.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#ff9a5a]" />
                </div>
                <span className="font-medium">Reply within 24h on weekdays</span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-3">
          <Reveal delay={0.1} y={36}>
            <div className="gansh-glass rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] p-7 md:p-10">
              {success ? (
                <div data-testid="form-success" className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 14 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="font-heading text-2xl font-bold text-white">Thanks — we're on it.</h3>
                  <p className="mt-3 text-slate-400 max-w-sm mx-auto">
                    Your request just landed in our inbox. Expect a friendly reply from the Gansh AI team within 24 hours.
                  </p>
                  <Button
                    data-testid="form-success-reset"
                    onClick={() => { setSuccess(false); setForm({ full_name: "", business_name: "", email: "", phone: "", need: "" }); }}
                    variant="outline"
                    className="mt-7 rounded-full px-6 h-11 border-white/15 text-white hover:bg-white/5 bg-transparent"
                  >
                    Submit another request
                  </Button>
                </div>
              ) : (
                <form data-testid="contact-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="full_name" className="mb-2 block text-slate-300 font-medium">Full Name</Label>
                      <Input id="full_name" data-testid="input-full-name" value={form.full_name} onChange={handleChange("full_name")} placeholder="Jane Doe" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#ff6b1a]" required />
                    </div>
                    <div>
                      <Label htmlFor="business_name" className="mb-2 block text-slate-300 font-medium">Business Name</Label>
                      <Input id="business_name" data-testid="input-business-name" value={form.business_name} onChange={handleChange("business_name")} placeholder="Doe & Co." className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#ff6b1a]" required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="email" className="mb-2 block text-slate-300 font-medium">Email Address</Label>
                      <Input id="email" type="email" data-testid="input-email" value={form.email} onChange={handleChange("email")} placeholder="jane@business.com" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#ff6b1a]" required />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="mb-2 block text-slate-300 font-medium">Phone Number</Label>
                      <Input id="phone" type="tel" data-testid="input-phone" value={form.phone} onChange={handleChange("phone")} placeholder="+91 98765 43210" className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-[#ff6b1a]" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="need" className="mb-2 block text-slate-300 font-medium">What do you need help with?</Label>
                    <Select value={form.need} onValueChange={(v) => setForm((f) => ({ ...f, need: v }))}>
                      <SelectTrigger id="need" data-testid="select-need-trigger" className="h-12 bg-white/5 border-white/10 text-white focus:ring-[#ff6b1a] data-[placeholder]:text-slate-500">
                        <SelectValue placeholder="Choose a service…" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0d1428] border-white/10 text-white">
                        <SelectItem data-testid="select-option-call" value="Call Automation">Call Automation</SelectItem>
                        <SelectItem data-testid="select-option-whatsapp" value="WhatsApp Automation">WhatsApp Automation</SelectItem>
                        <SelectItem data-testid="select-option-workflow" value="Workflow Automation">Workflow Automation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    data-testid="form-submit"
                    disabled={submitting}
                    className="w-full bg-[#ff6b1a] hover:bg-[#ff7a30] text-white font-semibold rounded-full h-14 text-base shadow-[0_15px_40px_-10px_rgba(255,107,26,0.7)] hover:shadow-[0_20px_60px_-10px_rgba(255,107,26,0.95)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {submitting ? "Sending…" : (<>Request a Free Consultation<ArrowRight className="ml-1.5 w-5 h-5" /></>)}
                  </Button>
                  <p className="text-xs text-slate-500 text-center">
                    By submitting, you agree to be contacted by Gansh AI about your inquiry. We never share your info.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ============================================================
   Footer
   ============================================================ */
const Footer = () => (
  <footer data-testid="site-footer" className="bg-[#04060d] border-t border-white/5 relative overflow-hidden">
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff6b1a]/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-14 grid md:grid-cols-3 gap-8 items-start">
      <div>
        <img src={ganshLogo} alt="Gansh AI" className="h-20 w-auto object-contain logo-invert" draggable="false" />
        <p className="mt-4 text-sm text-slate-400 max-w-xs leading-relaxed">
          Automation that drives growth — for local businesses ready to capture every lead.
        </p>
      </div>

      <div className="md:justify-self-center">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-4">Navigate</div>
        <ul className="space-y-2 text-sm">
          {[
            { label: "Services", id: "services" },
            { label: "How It Works", id: "how-it-works" },
            { label: "Contact", id: "contact" },
          ].map((l) => (
            <li key={l.id}>
              <button
                data-testid={`footer-link-${l.id}`}
                onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })}
                className="text-slate-300 hover:text-[#ff9a5a] transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:justify-self-end">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-4">Get in touch</div>
        <a data-testid="footer-email" href="mailto:yugansh@gansh-ai.com" className="text-sm text-white font-medium hover:text-[#ff9a5a] transition-colors block">
          yugansh@gansh-ai.com
        </a>
        <a data-testid="footer-privacy" href="#privacy" className="text-sm text-slate-400 hover:text-[#ff9a5a] transition-colors block mt-2">
          Privacy Policy
        </a>
      </div>
    </div>
    <div className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500">© 2026 Gansh AI. All rights reserved.</p>
        <p className="text-xs text-slate-500">Built for businesses that refuse to miss a lead.</p>
      </div>
    </div>
  </footer>
);

/* ============================================================
   Page
   ============================================================ */
const LandingPage = () => {
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="font-body min-h-screen bg-[#05070f] text-slate-200 relative">
      <div className="gansh-noise" aria-hidden="true" />
      <Toaster position="top-center" richColors theme="dark" />
      <Navbar onCtaClick={scrollToContact} />
      <main className="relative z-[1]">
        <Hero onCtaClick={scrollToContact} />
        <TrustStrip />
        <ProblemSolution />
        <Services />
        <HowItWorks />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
