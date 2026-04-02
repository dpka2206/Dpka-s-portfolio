"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function BeyondPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    // Scramble text state setup
    const [scrambleText, setScrambleText] = useState("BEYOND");
    const origText = "BEYOND";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Intersection Observers for Slam Animations
    const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Custom cursor tracking
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a') || target.closest('button') || target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        if (window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseover", handleMouseOver);
        }

        // Slam animations observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisibleItems(prev => ({ ...prev, [entry.target.id]: true }));
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-slam').forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            observer.disconnect();
        };
    }, []);

    const handleScrambleStart = () => {
        if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current);
        let iter = 0;
        scrambleIntervalRef.current = setInterval(() => {
            setScrambleText(origText.split("").map((letter, index) => {
                if (index < iter) return origText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iter >= origText.length) clearInterval(scrambleIntervalRef.current as NodeJS.Timeout);
            iter += 1 / 3;
        }, 40);
    };

    const getSlamClass = (id: string, hoverClasses: string, initRotate: string = "rotate-[5deg]") => {
        const isVisible = visibleItems[id];
        return `animate-slam transition-all duration-[800ms] ease-[cubic-bezier(0.1,1,0.2,1)] ${isVisible ? `opacity-100 translate-y-0 rotate-0 ${hoverClasses}` : `opacity-0 translate-y-24 pointer-events-none ${initRotate}`}`;
    };

    return (
        <main className="bg-gaude-black min-h-[100svh] w-full text-white relative overflow-x-hidden font-inter selection:bg-white selection:text-gaude-black pb-32">

            {/* Brutalist Grid Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

            {/* Custom Cursor */}
            <div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] mix-blend-difference hidden md:flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
            >
                <div className={`bg-white rounded-full transition-all duration-300 ${isHovering ? 'w-10 h-10 opacity-70' : 'w-4 h-4 opacity-100'}`}></div>
            </div>

            {/* Elegant Header Bar */}
            <div className="w-full border-b-4 border-white/10 px-6 md:px-12 py-4 flex justify-between items-center bg-gaude-black/80 backdrop-blur-lg sticky top-0 z-50">
                <Link href="/" className="font-archivo text-xs md:text-sm uppercase font-black tracking-[0.2em] text-white/50 hover:text-white transition-colors flex items-center gap-2">
                    <span>←</span> BACK TO MAIN
                </Link>
                <div className="font-syne font-black text-xl md:text-2xl tracking-tighter text-white">Dpka.</div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 relative z-10 w-full">

                {/* Title Section */}
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-white/20 pb-12">
                    <div>
                        <h1 onMouseEnter={handleScrambleStart} className="font-archivo text-6xl md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] mb-4 text-white drop-shadow-md cursor-crosshair inline-block">
                            {scrambleText}<br />
                            <span className="text-gaude-black drop-shadow-[0_4px_0_rgba(255,255,255,1)] stroke-white" style={{ WebkitTextStroke: "2px white" }}>THE CLASS.</span>
                        </h1>
                    </div>
                    <p className="font-syne text-lg md:text-2xl text-white/80 max-w-sm font-bold bg-white/10 p-4 border-l-4 border-white uppercase">
                        Not just learning.<br />Building, pitching, <span className="text-gaude-orange">and proving it.</span>
                    </p>
                </div>

                <div className="flex flex-col gap-16 md:gap-24 w-full relative">

                    {/* Thread Line connecting cards visually */}
                    <div className="absolute left-[2rem] md:left-[3.5rem] top-[5rem] bottom-[5rem] w-1 bg-white/10 hidden md:block z-0"></div>

                    {/* Experience 1: Mumbai Tech Week (ORANGE) */}
                    <div id="slam-beyond-1" className={`bg-gaude-orange p-8 md:p-12 border-4 border-white shadow-[8px_8px_0_0_#ffffff] relative group z-10 ${getSlamClass('slam-beyond-1', 'hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[16px_16px_0_0_#ffffff]', 'rotate-[-2deg]')}`}>

                        <div className="absolute -top-6 -right-6 text-8xl md:text-[10rem] font-archivo font-black text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            01
                        </div>

                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 relative z-10">
                            <div>
                                <p className="font-syne text-gaude-black font-black text-sm md:text-base uppercase tracking-widest bg-white inline-block px-2 py-1 border-2 border-gaude-black mb-3 box-shadow-sm">Pitched to IT Minister</p>
                                <h2 className="font-archivo text-4xl md:text-5xl font-black uppercase tracking-tighter text-gaude-black drop-shadow-sm leading-none">Mumbai Tech Week</h2>
                            </div>
                            <span className="font-inter text-sm md:text-base font-black text-gaude-black tracking-widest uppercase border-b-2 border-gaude-black">2025</span>
                        </div>

                        <div className="space-y-6 font-inter text-lg md:text-xl font-medium text-gaude-black leading-relaxed mb-8 relative z-10">
                            <p className="text-2xl font-black font-syne">Engaged directly with founders, investors, and leaders shaping India's tech ecosystem.</p>
                            <p>Had meaningful conversations with leaders from companies like <strong className="font-black bg-white px-2 py-0.5 border border-gaude-black">OYO, Dream11, Meta, AWS, and Essential AI</strong> — gaining firsthand insights into how real-world products and startups are built.</p>
                        </div>

                        <div className="bg-gaude-black text-white p-6 md:p-8 mb-10 relative z-10 border-4 border-gaude-black">
                            <h3 className="font-syne font-black uppercase text-sm md:text-base tracking-widest text-[#ffdb58] mb-4">Key Takeaways</h3>
                            <ul className="space-y-3 font-inter text-sm md:text-base font-bold">
                                <li><span className="text-gaude-orange mr-3">{'->'}</span> Tech is about solving real problems.</li>
                                <li><span className="text-gaude-orange mr-3">{'->'}</span> Great builders execute relentlessly.</li>
                                <li><span className="text-gaude-orange mr-3">{'->'}</span> Opportunities are created, not waited for.</li>
                            </ul>
                        </div>

                        <a href="https://www.linkedin.com/posts/deepika-mundla_mumbaitechweek-genaiclub-niatindia-activity-7317550310082625549-s0yV" target="_blank" rel="noopener noreferrer" className="relative z-10 font-archivo text-sm md:text-base font-black uppercase tracking-widest text-gaude-black bg-white px-6 py-4 border-4 border-gaude-black hover:bg-gaude-black hover:text-white transition-colors shadow-[4px_4px_0_0_#0a0a0a] hover:shadow-none inline-flex items-center gap-2">
                            View Experience <span className="text-xl">↗</span>
                        </a>
                    </div>

                    {/* Experience 2: AI Impact Summit (BLUE) */}
                    <div id="slam-beyond-2" className={`bg-[#4dadea] p-8 md:p-12 border-4 border-white shadow-[8px_8px_0_0_#ffffff] relative group z-10 ${getSlamClass('slam-beyond-2', 'hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[16px_16px_0_0_#ffffff]', 'rotate-[1deg]')}`}>

                        <div className="absolute -top-6 -right-6 text-8xl md:text-[10rem] font-archivo font-black text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            02
                        </div>

                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 relative z-10">
                            <div>
                                <p className="font-syne text-white font-black text-sm md:text-base uppercase tracking-widest bg-gaude-black inline-block px-2 py-1 mb-3">OpenAI x NxtWave</p>
                                <h2 className="font-archivo text-4xl md:text-5xl font-black uppercase tracking-tighter text-gaude-black drop-shadow-sm leading-none">AI Impact Summit</h2>
                            </div>
                            <div className="flex flex-col md:items-end gap-1">
                                <span className="font-inter text-xs font-black text-gaude-black tracking-widest uppercase border border-gaude-black px-2 py-0.5">Top 15 Ranking</span>
                                <span className="font-inter text-sm md:text-base font-black text-gaude-black tracking-widest uppercase border-b-2 border-gaude-black mt-2">Delhi, 2026</span>
                            </div>
                        </div>

                        <div className="space-y-6 font-inter text-lg md:text-xl font-medium text-gaude-black leading-relaxed mb-8 relative z-10">
                            <p className="text-2xl font-black font-syne">Selected for a national-level hackathon with OpenAI & ranked Top 15.</p>
                            <p>Attended the AI Impact Summit, where global leaders from <strong className="font-black bg-white px-2 py-0.5 border border-gaude-black">OpenAI, Google, Microsoft, NVIDIA, and Meta</strong> discussed the future of artificial intelligence.</p>
                        </div>

                        <div className="bg-white border-4 border-gaude-black p-6 md:p-8 mb-10 relative z-10">
                            <h3 className="font-syne font-black uppercase text-sm md:text-base tracking-widest text-[#4dadea] mb-6">Exposure Gained</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-inter text-sm md:text-base font-bold text-gaude-black">
                                <div className="flex items-center gap-3"><span className="text-[#4dadea] font-black text-2xl">01.</span> Responsible AI</div>
                                <div className="flex items-center gap-3"><span className="text-[#4dadea] font-black text-2xl">02.</span> Policy & Governance</div>
                                <div className="flex items-center gap-3"><span className="text-[#4dadea] font-black text-2xl">03.</span> Real-world Apps</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 relative z-10">
                            <a href="https://www.linkedin.com/posts/deepika-mundla_indiaaiimpactsummit2026-aiforall-aiimpactsummit-activity-7430545863195705344-gCsf" target="_blank" rel="noopener noreferrer" className="font-archivo text-sm md:text-base font-black uppercase tracking-widest text-white bg-gaude-black px-6 py-4 border-4 border-gaude-black hover:bg-white hover:text-gaude-black transition-colors shadow-[4px_4px_0_0_#0a0a0a] hover:shadow-none inline-flex items-center gap-2">
                                View Summit <span className="text-xl">↗</span>
                            </a>
                            <a href="https://www.linkedin.com/posts/deepika-mundla_openaiacademyxnxtwavebuildathon-openai-nxtwave-activity-7431360086393966593-v9PJ" target="_blank" rel="noopener noreferrer" className="font-archivo text-sm md:text-base font-black uppercase tracking-widest text-gaude-black bg-white px-6 py-4 border-4 border-gaude-black hover:bg-gaude-black hover:text-white transition-colors shadow-[4px_4px_0_0_#0a0a0a] hover:shadow-none inline-flex items-center gap-2">
                                Hackathon Top 15 <span className="text-xl">↗</span>
                            </a>
                        </div>
                    </div>

                    {/* Experience 3: Backend Intern (PURPLE) */}
                    <div id="slam-beyond-3" className={`bg-gaude-purple p-8 md:p-12 border-4 border-white shadow-[8px_8px_0_0_#ffffff] relative group z-10 ${getSlamClass('slam-beyond-3', 'hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[16px_16px_0_0_#ffffff]', 'rotate-[-3deg]')}`}>

                        <div className="absolute -top-6 -right-6 text-8xl md:text-[10rem] font-archivo font-black text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            03
                        </div>

                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 relative z-10">
                            <div>
                                <p className="font-syne text-white font-black text-sm md:text-base uppercase tracking-widest bg-gaude-orange inline-block px-2 py-1 border-2 border-gaude-black mb-3">NxtWave</p>
                                <h2 className="font-archivo text-4xl md:text-5xl font-black uppercase tracking-tighter text-gaude-black drop-shadow-sm leading-none">Backend Intern</h2>
                            </div>
                            <span className="font-inter text-sm md:text-base font-black text-gaude-black tracking-widest uppercase border-b-2 border-gaude-black">Production</span>
                        </div>

                        <div className="space-y-6 font-inter text-lg md:text-xl font-medium text-gaude-black leading-relaxed mb-8 relative z-10">
                            <p className="text-2xl font-black font-syne">Worked on real production codebases with active users.</p>
                            <p>Handling systems where performance, reliability, and correctness directly matter.</p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 relative z-10 mb-8">
                            <div className="w-full md:w-1/2 bg-white border-4 border-gaude-black p-6 md:p-8">
                                <h3 className="font-archivo font-black uppercase text-xl mb-4 text-gaude-orange">Core Backend</h3>
                                <ul className="space-y-3 font-inter text-sm md:text-base font-bold text-gaude-black">
                                    <li><span className="text-gaude-orange mr-2">{'//'}</span> Debugging API failures.</li>
                                    <li><span className="text-gaude-orange mr-2">{'//'}</span> Improving response delays.</li>
                                    <li><span className="text-gaude-orange mr-2">{'//'}</span> Writing structured code.</li>
                                </ul>
                            </div>

                            <div className="w-full md:w-1/2 bg-gaude-black text-white border-4 border-gaude-black p-6 md:p-8">
                                <h3 className="font-archivo font-black uppercase text-xl mb-4 text-[#c3a4f6]">Full-Stack Expansion</h3>
                                <p className="font-inter text-sm md:text-base font-bold">Learned and built with React Native and Flutter during the internship to understand end-to-end integration.</p>
                            </div>
                        </div>

                        <div className="relative z-10 pt-6 border-t-4 border-gaude-black">
                            <p className="font-archivo text-2xl md:text-4xl uppercase font-black tracking-tighter text-gaude-black">
                                Shifted from learning code<br />
                                <span className="text-white bg-gaude-black px-2 mt-2 inline-block shadow-[4px_4px_0_0_#ffffff]">to building systems that run.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
