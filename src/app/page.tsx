"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const [scrambleText, setScrambleText] = useState("Dpka");
  const origText = "Dpka";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [scrollY, setScrollY] = useState(0);
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleItems(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-slam').forEach(el => observer.observe(el));

    if (window.matchMedia("(pointer: fine)").matches) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('a') || target.closest('button') || target.closest('.cursor-pointer') || target.closest('[href]')) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseover", handleMouseOver);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseover", handleMouseOver);
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrambleStart = () => {
    if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
    let iter = 0;
    scrambleIntervalRef.current = setInterval(() => {
      setScrambleText(origText.split("").map((letter, index) => {
        if (index < iter) return origText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iter >= origText.length) clearInterval(scrambleIntervalRef.current as NodeJS.Timeout);
      iter += 1/3;
    }, 40);
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) rotate(${x * 0.05}deg)`;
  };
  
  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = `translate(0px, 0px) rotate(0deg)`;
  };

  const getSlamClass = (id: string, hoverClasses: string, initRotate: string = "rotate-[5deg]") => {
    const isVisible = visibleItems[id];
    return `animate-slam transition-all duration-[800ms] ease-[cubic-bezier(0.1,1,0.2,1)] ${isVisible ? `opacity-100 translate-y-0 rotate-0 ${hoverClasses}` : `opacity-0 translate-y-24 pointer-events-none ${initRotate}`}`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className={`fixed inset-0 z-[999999] bg-gaude-black transition-transform duration-[1500ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${isLoaded ? '-translate-y-[120%]' : 'translate-y-0'} flex flex-col items-center justify-center pointer-events-none`}>
        <div className="font-archivo text-white text-[10vw] uppercase tracking-tighter opacity-10 blur-sm">Loading...</div>
      </div>

      <div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] mix-blend-difference hidden md:flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
      >
        <div className={`bg-white rounded-full transition-all duration-300 ${isHovering ? 'w-10 h-10 opacity-70' : 'w-4 h-4 opacity-100'}`}></div>
      </div>

      <button 
        onClick={() => setIsNavOpen(!isNavOpen)} 
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        className="fixed top-16 left-4 md:top-20 md:left-8 z-[200] bg-white border-4 border-gaude-black shadow-[4px_4px_0_0_#0a0a0a] transition-transform duration-100 ease-out p-3 md:p-4 cursor-pointer text-gaude-black flex items-center justify-center hover:shadow-[8px_8px_0_0_#0a0a0a]"
        aria-label="Toggle Navigation"
      >
        {isNavOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      <nav 
        className={`fixed top-[5.5rem] left-4 md:top-[7.5rem] md:left-8 z-[150] bg-white border-4 border-gaude-black shadow-[8px_8px_0_0_#0a0a0a] flex flex-col transition-all duration-300 origin-top-left overflow-hidden ${isNavOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'}`}
      >
        <a href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-3 md:py-4 hover:bg-gaude-orange hover:text-white transition-colors cursor-pointer border-b-2 border-gaude-black">Home</a>
        <a href="#experience" onClick={(e) => scrollToSection(e, 'experience')} className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-3 md:py-4 hover:bg-gaude-purple transition-colors cursor-pointer border-b-2 border-gaude-black">Experience</a>
        <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-3 md:py-4 hover:bg-gaude-pink transition-colors cursor-pointer border-b-2 border-gaude-black">About</a>
        <a href="#skills" onClick={(e) => scrollToSection(e, 'skills')} className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-3 md:py-4 hover:bg-gaude-green transition-colors cursor-pointer border-b-2 border-gaude-black">Skills</a>
        <a href="#academics" onClick={(e) => scrollToSection(e, 'academics')} className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-3 md:py-4 hover:bg-[#c3a4f6] transition-colors cursor-pointer border-b-2 border-gaude-black">Academics</a>
        <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-3 md:py-4 hover:bg-gaude-orange hover:text-white transition-colors cursor-pointer border-b-2 border-gaude-black">Contact</a>
        <a href="/beyond" className="font-archivo uppercase text-gaude-black text-sm md:text-xl px-6 md:px-8 py-4 bg-gaude-purple/20 hover:bg-gaude-black hover:text-white transition-colors cursor-pointer flex justify-between items-center gap-8">Beyond Classroom <span>↗</span></a>
      </nav>

      <main className="relative w-full overflow-clip">

        <section id="hero" className="sticky top-0 h-[100svh] w-full bg-gaude-orange flex flex-col items-center p-0 z-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>

          <header className="w-full border-b-4 border-gaude-black bg-white/10 backdrop-blur-md text-gaude-black font-inter text-sm md:text-xl font-black mt-0 overflow-hidden py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative z-20">
            <div className="flex whitespace-nowrap will-change-transform ease-out transition-transform duration-100" style={{ transform: `translateX(${-scrollY * 1.5}px)` }}>
              <div className="flex gap-16 px-8 items-center uppercase tracking-widest animate-marquee min-w-max">
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
                <span>{"-> Deepika's Portfolio"}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 w-full flex items-center justify-center pb-12 relative z-10">
            <h1 onMouseEnter={handleScrambleStart}
                className="font-syne text-[clamp(6rem,18vw,26rem)] leading-none tracking-tighter drop-shadow-2xl select-none 
                         bg-clip-text text-transparent bg-[linear-gradient(to_right,#ffffff,#ffedcc,#ffffff)] bg-[length:200%_auto] animate-[gradient-x_4s_linear_infinite] cursor-crosshair">
              {scrambleText}
            </h1>
          </div>
        </section>

        <section id="experience" className="sticky top-0 h-[100svh] w-full bg-gaude-black flex items-center justify-center p-8 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] z-20 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gaude-purple/10 to-transparent animate-[pulse-glow_6s_ease-in-out_infinite] pointer-events-none"></div>

          <div className="relative w-full max-w-6xl aspect-square md:aspect-[21/9]">
            <div className={`absolute top-[4%] md:top-[5%] left-[2%] md:left-[12%] w-[90%] md:w-[48%] ${activeCard === 1 ? 'z-50' : 'z-10'}`}>
              <div
                onClick={() => setActiveCard(1)}
                className="bg-white p-6 md:p-8 rotate-[-2deg] shadow-2xl border border-neutral-200 transition-all duration-500 hover:scale-[1.02] hover:rotate-[-1deg] cursor-pointer h-full border-b-[6px] border-r-[6px] border-gaude-black">
                <h2 className="font-archivo text-4xl md:text-[3.5rem] leading-[0.8] text-gaude-black tracking-tighter uppercase">
                  Backend<br />Intern
                </h2>
                <div className="mt-4 md:mt-5 border-2 border-gaude-black p-1 md:p-2 font-inter text-[10px] md:text-xs text-gaude-black font-bold uppercase inline-block">
                  {"-> NxtWave"}
                </div>
                <div className="mt-4 text-[10px] md:text-[11px] lg:text-xs text-gaude-black font-inter leading-relaxed max-w-[95%] space-y-3">
                  <p className="font-bold underline underline-offset-2 decoration-gaude-orange">I work on real production systems — not practice projects.</p>
                  <p>Writing and debugging backend code used by actual users, fixing issues that break flows, and making systems more reliable day by day. From handling API failures to resolving OS-level errors, I’ve worked on problems where the impact is immediate and visible.</p>
                  <p>Along the way, I didn't just stick to backend — I pushed into full-stack, learning React Native and Flutter to understand how products come together end-to-end.</p>
                  <p className="font-bold font-syne text-sm md:text-base text-gaude-orange uppercase pt-2">Now, I don’t just build parts of a system — I understand the whole product.</p>
                </div>
              </div>
            </div>

            <div className={`absolute top-[38%] md:top-[45%] left-0 md:left-[5%] w-[85%] md:w-[42%] ${activeCard === 2 ? 'z-50' : 'z-20'}`}>
              <div
                onClick={() => setActiveCard(2)}
                className="bg-gaude-purple p-6 md:p-8 rotate-[3deg] shadow-[0_20px_50px_rgba(195,164,246,0.3)] transition-all duration-500 hover:scale-[1.02] hover:rotate-[1deg] cursor-pointer h-full border-b-[6px] border-r-[6px] border-gaude-black">
                <h3 className="font-inter font-black text-3xl md:text-[3rem] text-gaude-black tracking-tighter mb-4 leading-none">
                  Co-Founder
                </h3>
                <div className="text-[10px] md:text-[11px] lg:text-xs text-gaude-black font-inter leading-relaxed mb-4 space-y-3">
                  <p className="font-bold text-sm">Started with an idea. Turned it into a working service.</p>
                  <p>At Editco.Media, we build and deliver real solutions — from websites and automations to social media systems that actually grow brands.</p>
                  <div className="bg-gaude-black/5 p-3 rounded-md">
                    <b>Worked on:</b><br />
                    → Automation workflows<br />
                    → WordPress and custom websites<br />
                    → Mobile apps (Flutter & React Native)<br />
                    → Content + strategy
                  </div>
                  <p className="pt-1 italic font-semibold">This isn’t just building — it’s managing clients and making things work in the real world.</p>
                </div>
                <div className="flex flex-col border-t-2 border-gaude-black pt-3">
                  <span className="font-inter text-xs md:text-sm font-black text-gaude-black uppercase tracking-wider">Editco.Media</span>
                </div>
              </div>
            </div>

            <div className={`absolute top-[55%] md:top-[25%] right-0 md:right-[5%] w-[85%] md:w-[42%] ${activeCard === 3 ? 'z-50' : 'z-30'}`}>
              <div
                onClick={() => setActiveCard(3)}
                className="bg-gaude-orange p-6 md:p-8 rotate-[-1deg] shadow-[0_20px_50px_rgba(255,78,0,0.3)] transition-all duration-500 hover:scale-[1.02] hover:rotate-0 cursor-pointer h-full border-b-[6px] border-r-[6px] border-white">
                <div className="flex justify-between items-end font-inter text-[10px] md:text-xs font-bold text-white uppercase mb-5 border-b border-white/30 pb-2">
                  <span className="text-sm md:text-base">Social Media<br />Manager</span>
                  <span>#Community</span>
                </div>
                <div className="text-[10px] md:text-[11px] lg:text-xs text-white/90 font-inter leading-relaxed mb-6 space-y-3">
                  <p className="font-bold text-sm text-white">Handled the voice and presence of a growing tech community.</p>
                  <p>Managed social media, planned content, and made sure the club actually reached people — not just posted.</p>
                  <p>Organized hackathons and workshops, built projects, and taught students — breaking down complex tech into something people can actually understand and use.</p>
                  <p className="font-bold font-syne text-sm md:text-base bg-white text-gaude-orange inline-block p-1 px-2 mt-2 uppercase shadow-sm">Not just managing — building impact.</p>
                </div>
                <h3 className="font-syne text-4xl md:text-5xl leading-none text-white tracking-tighter mt-4">
                  GenAI<br />Club
                </h3>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="sticky top-0 min-h-[100svh] w-full bg-white flex flex-col justify-center p-8 md:p-16 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] z-[25] overflow-y-auto relative">
          <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gaude-purple/20 rounded-full blur-[100px] animate-[pulse-glow_8s_ease-in-out_infinite] pointer-events-none"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-gaude-orange/15 rounded-full blur-[100px] animate-[pulse-glow_6s_ease-in-out_infinite] pointer-events-none"></div>

          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start py-20 pb-32 relative z-10">

            <div className="lg:w-1/3 flex-shrink-0 lg:sticky lg:top-32">
              <h2 className="font-archivo text-[clamp(4rem,8vw,7rem)] leading-[0.8] text-gaude-black tracking-tighter uppercase mb-6 drop-shadow-sm">
                About<br />Me.
              </h2>
              <div className="w-24 h-4 bg-[linear-gradient(to_right,var(--color-gaude-orange),var(--color-gaude-purple),var(--color-gaude-orange))] bg-[length:200%_auto] animate-[gradient-x_3s_linear_infinite]"></div>
            </div>

            <div className="lg:w-2/3 flex flex-col gap-6 md:gap-8 pt-4 z-10 relative">
              <p className="font-syne text-2xl md:text-4xl lg:text-[2.75rem] leading-[1.1] text-gaude-black font-bold tracking-tight">
                I’m Deepika —<br />
                a developer who builds systems that actually work, and designs experiences that make them feel right.
              </p>

              <p className="font-inter text-lg md:text-2xl text-gaude-black/80 font-medium leading-relaxed max-w-3xl">
                I focus on writing clean, structured backend logic and turning ideas into real, scalable products. From full-stack applications to GenAI integrations, I care about how things are built, how they perform, and how they hold up in the real world.
              </p>

              <p className="font-inter text-lg md:text-2xl text-gaude-black/80 font-medium leading-relaxed max-w-3xl">
                Alongside development, I design interfaces that are simple, clear, and purposeful — not just visually good, but easy to use.
              </p>

              <p className="font-inter text-lg md:text-2xl text-gaude-black/80 font-medium leading-relaxed max-w-3xl">
                Currently working across backend systems, full-stack projects, and AI-driven applications, constantly learning, building, and improving.
              </p>

              <div className="mt-8 md:mt-16 border-t-[6px] border-gaude-black pt-12 text-left md:text-right">
                <p className="font-archivo text-4xl md:text-[3.5rem] lg:text-[4.5rem] text-gaude-black uppercase tracking-tighter leading-[0.85] max-w-3xl ml-auto">
                  I don’t just design<br />
                  or <span className="text-gaude-orange">write code.</span><br />
                  I build complete,<br />
                  <span className="text-gaude-purple inline-block mt-3 mb-1">working solutions.</span>
                </p>
              </div>
            </div>

          </div>
        </section>

        <section className="sticky top-0 h-[100svh] w-full bg-gaude-orange flex flex-col justify-center p-8 md:p-16 shadow-[0_-20px_40px_rgba(0,0,0,0.3)] z-30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none"></div>

          <div className="w-full max-w-7xl mx-auto flex flex-col justify-between h-full py-12 relative z-10">
            <h2 className="font-archivo text-[clamp(2.5rem,8vw,10rem)] leading-[0.85] text-white tracking-tighter uppercase mt-12 md:mt-24 text-balance drop-shadow-xl hover:scale-[1.01] transition-transform duration-500">
              Turning complex<br />
              problems into<br />
              elegant systems.
            </h2>
            <p className="font-syne text-2xl md:text-4xl text-white font-bold tracking-tight mb-8 drop-shadow-md">
              Dpka Portfolio.
            </p>
          </div>
        </section>

        <section id="skills" className="relative min-h-[100svh] w-full bg-gaude-black py-16 px-4 md:px-8 z-40">
          <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 pt-12 pb-12">

              <div id="slam-1" className={`bg-gaude-purple border-4 border-white p-6 md:p-8 shadow-xl hover:shadow-[0_0_50px_rgba(195,164,246,0.5)] lg:col-span-2 flex flex-col justify-between cursor-default group ${getSlamClass('slam-1', 'hover:-translate-y-2', 'rotate-[-5deg]')}`}>
                <div>
                  <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gaude-black">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M9 21V9" />
                    </svg>
                  </div>
                  <h3 className="font-archivo text-3xl md:text-4xl text-gaude-black uppercase leading-[0.9] mb-4">1. Design<br />Systems</h3>
                  <p className="font-inter text-sm md:text-base text-gaude-black/90 font-bold mb-6">I design things that don’t just look good — they make sense.</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["Figma", "Canva", "UI Systems", "Interaction Design"].map(s => (
                      <span key={s} className="px-3 py-1 bg-gaude-black text-white font-inter text-xs font-black uppercase tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t-4 border-gaude-black pt-4 mt-4 relative overflow-hidden group-hover:border-gaude-orange transition-colors">
                  <p className="font-syne text-lg md:text-xl text-gaude-black tracking-tight leading-none uppercase">Clean. Functional. No noise.</p>
                </div>
              </div>

              <div id="slam-2" className={`bg-gaude-orange border-4 border-white p-6 md:p-8 shadow-xl hover:shadow-[0_0_50px_rgba(255,78,0,0.5)] lg:col-span-4 flex flex-col justify-between cursor-default group ${getSlamClass('slam-2', 'hover:-translate-y-2', 'rotate-[3deg]')}`} style={{transitionDelay: '100ms'}}>
                <div>
                  <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                      <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
                      <path d="M10 19v-3.96 3.15" />
                      <path d="M7 19h5" />
                      <rect width="6" height="10" x="16" y="12" rx="2" />
                    </svg>
                  </div>
                  <h3 className="font-archivo text-4xl md:text-5xl text-white uppercase leading-[0.9] mb-4">2. Frontend<br />+ Mobile</h3>
                  <p className="font-inter text-sm md:text-base text-white/90 font-bold mb-6">Interfaces that feel fast, smooth, and alive.</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["HTML / CSS / JS", "React", "React Native", "Flutter"].map(s => (
                      <span key={s} className="px-3 py-1 bg-white text-gaude-orange font-inter text-xs font-black uppercase tracking-wider shadow-sm">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t-4 border-white pt-4 mt-4 group-hover:border-gaude-black transition-colors">
                  <p className="font-syne text-xl md:text-2xl text-white tracking-tight leading-none uppercase">From web to mobile — same vibe, same quality.</p>
                </div>
              </div>

              <div id="slam-3" className={`bg-[#36df93] border-4 border-white p-6 md:p-8 shadow-xl hover:shadow-[0_0_50px_rgba(47,223,146,0.5)] lg:col-span-3 flex flex-col justify-between cursor-default group ${getSlamClass('slam-3', 'hover:-translate-y-2', 'rotate-[-2deg]')}`} style={{transitionDelay: '100ms'}}>
                <div>
                  <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gaude-black">
                      <rect width="20" height="8" x="2" y="2" rx="2" />
                      <rect width="20" height="8" x="2" y="14" rx="2" />
                      <line x1="6" x2="6.01" y1="6" y2="6" />
                      <line x1="6" x2="6.01" y1="18" y2="18" />
                    </svg>
                  </div>
                  <h3 className="font-archivo text-4xl md:text-[3.5rem] text-gaude-black uppercase leading-[0.9] mb-4">3. Backend<br />Systems</h3>
                  <p className="font-inter text-sm md:text-base text-gaude-black/90 font-bold mb-6">I don’t just design screens — I build what powers them.</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["Python", "Django", "PHP (PDO, CRUD)", "MySQL", "MERN Stack"].map(s => (
                      <span key={s} className="px-3 py-1 bg-gaude-black text-white font-inter text-xs font-black uppercase tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t-4 border-gaude-black pt-4 mt-4 transition-colors">
                  <p className="font-syne text-xl md:text-2xl text-gaude-black tracking-tight leading-none uppercase">Scalable. Structured. No messy logic.</p>
                </div>
              </div>

              <div id="slam-4" className={`bg-white border-4 border-gaude-black p-6 md:p-8 shadow-xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] lg:col-span-3 flex flex-col justify-between cursor-default group ${getSlamClass('slam-4', 'hover:-translate-y-2', 'rotate-[4deg]')}`} style={{transitionDelay: '200ms'}}>
                <div>
                  <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-gaude-black">
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  </div>
                  <h3 className="font-archivo text-4xl md:text-[3.5rem] text-gaude-black uppercase leading-[0.9] mb-4 bg-clip-text text-transparent bg-[linear-gradient(to_right,var(--color-gaude-black),var(--color-gaude-purple))]">4. Gen AI +<br />Future Tech</h3>
                  <p className="font-inter text-sm md:text-base text-gaude-black/90 font-bold mb-6">Not just using AI — building with it.</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {["LangChain", "ChromaDB", "RAG Applications", "Gemini APIs"].map(s => (
                      <span key={s} className="px-3 py-1 bg-gaude-black text-white font-inter text-xs font-black uppercase tracking-wider group-hover:bg-gaude-purple transition-colors">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t-4 border-gaude-black pt-4 mt-4 transition-colors">
                  <p className="font-syne text-xl md:text-2xl text-gaude-black tracking-tight leading-none uppercase">AI that actually solves problems.</p>
                </div>
              </div>

              <div id="slam-5" className={`bg-[#ffa5d8] border-4 border-white p-6 md:p-10 shadow-xl hover:shadow-[0_0_50px_rgba(252,165,204,0.5)] lg:col-span-6 flex flex-col md:flex-row md:items-end justify-between gap-8 cursor-default group overflow-hidden relative ${getSlamClass('slam-5', 'hover:-translate-y-2', 'rotate-[-3deg]')}`} style={{transitionDelay: '150ms'}}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                <div className="flex-1 relative z-10">
                  <div className="mb-4 group-hover:scale-110 transition-transform origin-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 md:w-12 md:h-12 text-gaude-black">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <h3 className="font-archivo text-4xl md:text-6xl text-gaude-black uppercase leading-[0.9] mb-6">Things that give me<br />an unfair advantage</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Branding", "Social Media Strategy", "Networking"].map(s => (
                      <span key={s} className="px-4 py-2 bg-white text-gaude-black font-inter text-sm md:text-base font-black uppercase tracking-wider border-2 border-gaude-black shadow-[4px_4px_0_0_#0a0a0a] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="border-l-0 md:border-l-5 border-t-5 md:border-t-0 border-gaude-black pt-6 md:pt-0 pb-2 pl-0 md:pl-10 text-left md:text-right flex-shrink-0 relative z-10">
                  <p className="font-syne text-3xl md:text-5xl text-gaude-black tracking-tight leading-[0.9] uppercase max-w-[280px]">I know how<br />to build<br />AND sell.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="academics" className="relative w-full bg-gaude-black flex flex-col py-24 md:py-32 px-6 md:px-12 z-[45] border-y-4 border-gaude-black text-white">
          <div className="w-full max-w-6xl mx-auto flex flex-col">

            <div className="mb-16 border-b-2 border-white/20 pb-6 flex justify-between items-end">
              <h2 className="font-archivo text-4xl md:text-6xl tracking-tighter uppercase">
                Academics.
              </h2>
            </div>

            <div className="flex flex-col">
              <div id="slam-aca-1" className={`flex flex-col md:flex-row justify-between md:items-center gap-6 py-8 border-b border-white/10 hover:bg-white/5 transition-colors group px-4 ${getSlamClass('slam-aca-1', 'opacity-100', 'rotate-[0deg]')}`}>
                <div className="flex-1">
                  <h3 className="font-syne text-2xl md:text-3xl uppercase font-black mb-2 text-white group-hover:text-gaude-purple transition-colors">B.Sc. Computer Science</h3>
                  <p className="font-inter text-sm md:text-base text-white/50 max-w-xl">
                    Strong foundation in core computer science with consistent academic excellence.
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-1 flex-shrink-0">
                  <span className="font-archivo text-xl md:text-2xl font-black uppercase text-white tracking-widest">BITS Pilani</span>
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-xs font-bold text-white/50 uppercase tracking-widest">2024 – 2027</span>
                    <span className="font-inter text-xs font-black text-gaude-black bg-gaude-purple px-2 py-0.5 uppercase">CGPA: 9.25</span>
                  </div>
                </div>
              </div>

              <div id="slam-aca-2" className={`flex flex-col md:flex-row justify-between md:items-center gap-6 py-8 border-b border-white/10 hover:bg-white/5 transition-colors group px-4 ${getSlamClass('slam-aca-2', 'opacity-100', 'rotate-[0deg]')}`} style={{transitionDelay: '100ms'}}>
                <div className="flex-1">
                  <h3 className="font-syne text-2xl md:text-3xl uppercase font-black mb-2 text-white group-hover:text-gaude-orange transition-colors">NIAT</h3>
                  <p className="font-inter text-sm md:text-base text-white/50 max-w-xl">
                    Focused on practical, industry-ready skills through real-world projects and hands-on learning.
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-1 flex-shrink-0">
                  <span className="font-archivo text-xl md:text-2xl font-black uppercase text-white tracking-widest">Hyderabad</span>
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-xs font-bold text-white/50 uppercase tracking-widest">2024 – 2028</span>
                  </div>
                </div>
              </div>

              <div id="slam-aca-3" className={`flex flex-col md:flex-row justify-between md:items-center gap-6 py-8 border-b border-white/10 hover:bg-white/5 transition-colors group px-4 ${getSlamClass('slam-aca-3', 'opacity-100', 'rotate-[0deg]')}`} style={{transitionDelay: '200ms'}}>
                <div className="flex-1">
                  <h3 className="font-syne text-2xl md:text-3xl uppercase font-black text-white group-hover:text-gaude-pink transition-colors">Narayana</h3>
                </div>
                <div className="flex flex-col md:items-end gap-1 flex-shrink-0 mt-4 md:mt-0">
                  <span className="font-archivo text-xl md:text-2xl font-black uppercase text-white tracking-widest">Junior College</span>
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-xs font-black text-gaude-black bg-gaude-pink px-2 py-0.5 uppercase">97.5%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section id="contact" className="relative min-h-[100svh] w-full bg-gaude-pink flex flex-col justify-center p-8 md:p-16 z-50 overflow-hidden">

          <div className="absolute -bottom-[10%] -right-[5%] text-[20rem] md:text-[30rem] leading-none opacity-20 pointer-events-none rotate-12 animate-[float2_8s_ease-in-out_infinite]">
            ✌️
          </div>

          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-between h-full relative z-10 py-16">

            <div className="lg:w-1/2 flex flex-col justify-center">
              <h2 className="font-archivo text-[clamp(3.5rem,7vw,6rem)] leading-[0.8] text-gaude-black tracking-tighter uppercase mb-8">
                If you’re working on something interesting —<br />
                <span className="text-white drop-shadow-[0_4px_0_#0a0a0a] block mt-6 rotate-[-2deg] bg-gaude-black inline-block px-4 py-2 border-4 border-white">
                  I’d love to be part of it.
                </span>
              </h2>
              <p className="font-syne text-2xl lg:text-4xl text-gaude-black font-black tracking-tight mt-4 drop-shadow-md">
                Or just say hi :)
              </p>
            </div>

            <div className="lg:w-1/2 flex flex-col gap-4 w-full md:max-w-md">
              <a href="mailto:deepikamundla54@gmail.com" className="group bg-white border-2 border-gaude-black px-6 md:px-8 py-5 md:py-6 flex items-center justify-between shadow-[4px_4px_0_0_#0a0a0a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0a0a0a] transition-all">
                <div className="flex flex-col overflow-hidden mr-4">
                  <span className="font-inter text-xs font-bold text-gaude-black/50 uppercase tracking-widest mb-0.5">Email</span>
                  <span className="font-syne text-lg md:text-xl font-bold text-gaude-black truncate">deepikamundla54@gmail.com</span>
                </div>
                <span className="font-archivo text-xl text-gaude-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0">↗</span>
              </a>

              <a href="https://www.linkedin.com/in/deepika-mundla/" target="_blank" rel="noopener noreferrer" className="group bg-gaude-purple border-2 border-gaude-black px-6 md:px-8 py-5 md:py-6 flex items-center justify-between shadow-[4px_4px_0_0_#0a0a0a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0a0a0a] transition-all">
                <div className="flex flex-col overflow-hidden mr-4">
                  <span className="font-inter text-xs font-bold text-gaude-black/50 uppercase tracking-widest mb-0.5">LinkedIn</span>
                  <span className="font-syne text-lg md:text-xl font-bold text-gaude-black truncate">deepika-mundla</span>
                </div>
                <span className="font-archivo text-xl text-gaude-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0">↗</span>
              </a>

              <a href="https://github.com/dpka2206" target="_blank" rel="noopener noreferrer" className="group bg-[#36df93] border-2 border-gaude-black px-6 md:px-8 py-5 md:py-6 flex items-center justify-between shadow-[4px_4px_0_0_#0a0a0a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0a0a0a] transition-all">
                <div className="flex flex-col overflow-hidden mr-4">
                  <span className="font-inter text-xs font-bold text-gaude-black/50 uppercase tracking-widest mb-0.5">GitHub</span>
                  <span className="font-syne text-lg md:text-xl font-bold text-gaude-black truncate">dpka2206</span>
                </div>
                <span className="font-archivo text-xl text-gaude-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0">↗</span>
              </a>
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
