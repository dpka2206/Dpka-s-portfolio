"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function BeyondPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [scrambleText, setScrambleText] = useState("BEYOND");
    const origText = "BEYOND";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    const scrambleIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
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

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisibleItems(prev => ({ ...prev, [entry.target.id]: true }));
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-slam').forEach(el => observer.observe(el));

        if (window.location.hash) {
            setTimeout(() => {
                const id = window.location.hash.replace('#', '');
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }

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
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

            <div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[99999] mix-blend-difference hidden md:flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
            >
                <div className={`bg-white rounded-full transition-all duration-300 ${isHovering ? 'w-10 h-10 opacity-70' : 'w-4 h-4 opacity-100'}`}></div>
            </div>

            <div className="w-full border-b-4 border-white/10 px-6 md:px-12 py-4 flex justify-between items-center bg-gaude-black/80 backdrop-blur-lg sticky top-0 z-50">
                <Link href="/" className="font-archivo text-xs md:text-sm uppercase font-black tracking-[0.2em] text-white/50 hover:text-white transition-colors flex items-center gap-2">
                    <span>←</span> BACK TO MAIN
                </Link>
                <div className="font-syne font-black text-xl md:text-2xl tracking-tighter text-white">Dpka.</div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-20 md:py-24 relative z-10 w-full">

                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-white/20 pb-12">
                    <div>
                        <h1 onMouseEnter={handleScrambleStart} className="font-archivo text-6xl md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] mb-4 text-white drop-shadow-md cursor-crosshair inline-block">
                            {scrambleText}<br />
                            <span className="text-gaude-black drop-shadow-[0_4px_0_rgba(255,255,255,1)] stroke-white" style={{ WebkitTextStroke: "2px white" }}>THE CLASS.</span>
                        </h1>
                    </div>
                    <p className="font-syne text-lg md:text-2xl text-white/80 max-w-sm font-bold bg-white/10 p-4 border-l-4 border-white uppercase">
                        Not just learning. Building, shipping, and <span className="text-white bg-gaude-orange px-2 drop-shadow-md">stepping into real rooms.</span>
                    </p>
                </div>

                <div className="flex flex-col gap-16 md:gap-32 w-full relative">
                    <div className="absolute left-[2rem] md:left-[3.5rem] top-[5rem] bottom-[5rem] w-1 bg-white/10 hidden md:block z-0"></div>

                    {/* CARD 1: HACKATHONS */}
                    <div id="hackathons" className={`bg-gaude-orange p-8 md:p-12 border-4 border-white shadow-[8px_8px_0_0_#ffffff] relative group z-10 ${getSlamClass('hackathons', 'hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[16px_16px_0_0_#ffffff]', 'rotate-[-2deg]')}`}>
                        <div className="absolute -top-6 -right-6 text-8xl md:text-[10rem] font-archivo font-black text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            01
                        </div>

                        <h2 className="font-archivo text-5xl md:text-6xl font-black uppercase text-gaude-black mb-8 border-b-4 border-gaude-black pb-4 relative z-10">Summits & Hackathons</h2>

                        <div className="flex flex-col md:flex-row gap-12 font-inter text-gaude-black relative z-10">
                            <div className="flex-1 space-y-4">
                                <p className="font-syne font-black text-xs uppercase bg-white px-2 py-1 inline-block border-2 border-gaude-black box-shadow-sm">Pitched to IT Minister</p>
                                <h3 className="font-archivo text-3xl font-black uppercase">Mumbai Tech Week '25</h3>
                                <p className="text-lg font-bold">Engaged directly with founders and leaders from OYO, Meta, AWS, and Essential AI.</p>
                                <ul className="text-sm font-bold opacity-80 list-disc ml-4 space-y-1 mt-2 mb-6">
                                    <li>Tech is about solving real problems.</li>
                                    <li>Great builders execute relentlessly.</li>
                                </ul>
                                <a href="https://www.linkedin.com/posts/deepika-mundla_mumbaitechweek-genaiclub-niatindia-activity-7317550310082625549-s0yV" target="_blank" rel="noopener noreferrer" className="bg-gaude-black text-white font-inter text-xs font-black uppercase px-4 py-2 border-2 border-white hover:bg-white hover:text-gaude-black transition-colors shadow-[4px_4px_0_0_#ffffff] hover:shadow-none translate-y-0 inline-block">
                                    View Post ↗
                                </a>
                            </div>

                            <div className="flex-1 space-y-4 border-t-4 md:border-t-0 md:border-l-4 border-gaude-black pt-6 md:pt-0 md:pl-8">
                                <p className="font-syne font-black text-xs uppercase bg-gaude-black text-white px-2 py-1 inline-block border-2 border-white">Top 15 Hackathon Ranking</p>
                                <h3 className="font-archivo text-3xl font-black uppercase">AI Impact Summit '26</h3>
                                <p className="text-lg font-bold">Selected for a national-level OpenAI hackathon and attended global AI discussions with NVIDIA & Meta.</p>
                                <ul className="text-sm font-bold opacity-80 list-disc ml-4 space-y-1 mt-2 mb-6">
                                    <li>Responsible AI & Policy</li>
                                    <li>Real-world AI application building</li>
                                </ul>
                                <div className="flex flex-wrap gap-3">
                                    <a href="https://www.linkedin.com/posts/deepika-mundla_indiaaiimpactsummit2026-aiforall-aiimpactsummit-activity-7430545863195705344-gCsf" target="_blank" rel="noopener noreferrer" className="bg-gaude-black text-white font-inter text-xs font-black uppercase px-4 py-2 border-2 border-white hover:bg-white hover:text-gaude-black transition-colors shadow-[4px_4px_0_0_#ffffff] hover:shadow-none inline-block">
                                        Summit ↗
                                    </a>
                                    <a href="https://www.linkedin.com/posts/deepika-mundla_openaiacademyxnxtwavebuildathon-openai-nxtwave-activity-7431360086393966593-v9PJ" target="_blank" rel="noopener noreferrer" className="bg-white text-gaude-black font-inter text-xs font-black uppercase px-4 py-2 border-2 border-gaude-black hover:bg-gaude-black hover:text-white transition-colors shadow-[4px_4px_0_0_#0a0a0a] hover:shadow-none inline-block">
                                        Hackathon ↗
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: EDITCO.MEDIA */}
                    <div id="editco" className={`bg-[#c3a4f6] p-8 md:p-12 border-4 border-white shadow-[8px_8px_0_0_#ffffff] relative group z-10 ${getSlamClass('editco', 'hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[16px_16px_0_0_#ffffff]', 'rotate-[1deg]')}`}>
                        <div className="absolute -top-6 -right-6 text-8xl md:text-[10rem] font-archivo font-black text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            02
                        </div>

                        <h2 className="font-archivo text-5xl md:text-6xl font-black uppercase text-gaude-black mb-8 border-b-4 border-gaude-black pb-4 relative z-10">Building Editco.Media</h2>

                        <div className="font-inter text-lg md:text-xl text-gaude-black font-medium leading-relaxed max-w-4xl space-y-6 relative z-10">
                            <p className="font-syne text-2xl md:text-3xl font-black leading-tight border-l-4 border-gaude-black pl-4 py-1">
                                Started with a simple idea — most brands fail because they lack systems, not effort.
                            </p>
                            <p className="bg-white/40 p-4 border-2 border-gaude-black">
                                We build automation systems, clean websites, and cross-platform apps (Flutter & React Native) that actually help businesses streamline and grow. It’s not just about content creation—it's about building a digital infrastructure.
                            </p>
                            <div className="bg-gaude-black text-white p-6 md:p-8 border-4 border-gaude-black shadow-[8px_8px_0_0_#ffffff] mt-6 transform rotate-1">
                                <h3 className="font-archivo text-[#c3a4f6] font-black uppercase text-xl md:text-2xl mb-3">What I Do</h3>
                                <p className="text-base font-bold opacity-90">
                                    I work across the technical side—designing interfaces, setting up workflows, and building mobile and web apps. It's about pushing beyond just writing code and actually connecting with what users need, delivering solutions that are built for real people.
                                </p>
                            </div>
                            <div className="mt-8 flex">
                                <a href="https://editcomedia.com" target="_blank" rel="noopener noreferrer" className="bg-white text-gaude-black font-archivo text-xl font-black uppercase px-8 py-4 border-4 border-gaude-black shadow-[4px_4px_0_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                                    → View editcomedia.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* CARD 3: EXPERIENCE */}
                    <div id="experience" className={`bg-[#36df93] p-8 md:p-12 border-4 border-white shadow-[8px_8px_0_0_#ffffff] relative group z-10 ${getSlamClass('experience', 'hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[16px_16px_0_0_#ffffff]', 'rotate-[-2deg]')}`}>
                        <div className="absolute -top-6 -right-6 text-8xl md:text-[10rem] font-archivo font-black text-white/20 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            03
                        </div>

                        <h2 className="font-archivo text-5xl md:text-6xl font-black uppercase text-gaude-black mb-8 border-b-4 border-gaude-black pb-4 relative z-10">Production Experience</h2>

                        <div className="flex flex-col gap-10 font-inter text-gaude-black relative z-10 w-full max-w-4xl mx-auto">
                            {/* NxtWave Block */}
                            <div className="bg-white p-6 md:p-8 border-4 border-gaude-black shadow-[8px_8px_0_0_#0a0a0a]">
                                <div className="mb-6 border-b-2 border-gaude-black pb-4">
                                    <p className="font-syne font-black text-sm uppercase text-gaude-black tracking-widest mb-1 bg-gaude-orange px-2 py-1 inline-block border-2 border-gaude-black">NxtWave</p>
                                    <h3 className="font-archivo text-3xl md:text-4xl font-black uppercase tracking-tight mt-2">Backend Intern</h3>
                                </div>
                                <p className="text-xl font-bold mb-6 font-syne border-l-4 border-gaude-purple pl-4 text-gaude-black/90">Writing and debugging real production codebases used by active users.</p>
                                <ul className="text-base font-bold opacity-80 space-y-3 ml-6 list-disc">
                                    <li>Resolving API failures & improving response delays.</li>
                                    <li>Writing structured, highly robust backend logic.</li>
                                    <li>Expanded into Full-Stack to understand React Native/Flutter integration.</li>
                                </ul>
                            </div>

                            {/* GenAI Block */}
                            <div className="bg-white p-6 md:p-8 border-4 border-gaude-black shadow-[8px_8px_0_0_#0a0a0a]">
                                <div className="mb-6 border-b-2 border-gaude-black pb-4">
                                    <p className="font-syne font-black text-sm uppercase text-gaude-black tracking-widest mb-1 bg-[#c3a4f6] px-2 py-1 inline-block border-2 border-gaude-black">GenAI Club</p>
                                    <h3 className="font-archivo text-3xl md:text-4xl font-black uppercase tracking-tight mt-2">Social Media Manager</h3>
                                </div>
                                <p className="text-xl font-bold mb-6 font-syne border-l-4 border-gaude-purple pl-4 text-gaude-black/90">Managing the voice, community, and outreach for a growing tech club.</p>
                                <ul className="text-base font-bold opacity-80 space-y-3 ml-6 list-disc">
                                    <li>Handled social media strategy and consistent community content.</li>
                                    <li>Organized hackathons and technical workshops for students.</li>
                                    <li>Taught complex AI concepts in accessible formats.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
