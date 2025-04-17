"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, useCallback } from "react"
import { Twitter } from "lucide-react"
import { FloatingBlobs } from "@/components/floating-blobs"
import { MouseFollowerBlob } from "@/components/mouse-follower-blob"
import { BlobButton } from "@/components/blob-button"
import { InteractiveBlob } from "@/components/interactive-blob"
import { BlobText } from "@/components/blob-text"
import { ParallaxBlob } from "@/components/parallax-blob"
import { ScrollReveal } from "@/components/scroll-reveal"
import { TwitterFeed } from "@/components/twitter-feed"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Throttle scroll event for better performance
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lazy load sections based on visibility
  const LazySection = useCallback(({ children, id }: { children: React.ReactNode; id: string }) => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true)
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current)
            }
          }
        },
        { threshold: 0.1, rootMargin: "100px" },
      )

      if (sectionRef.current) {
        observer.observe(sectionRef.current)
      }

      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current)
        }
      }
    }, [])

    return (
      <div ref={sectionRef} id={id}>
        {isVisible ? children : <div className="min-h-screen" />}
      </div>
    )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-200 overflow-hidden">
      {/* Mouse follower blob - only on desktop */}
      <MouseFollowerBlob color="#FFD700" />

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="h-screen flex items-center justify-center overflow-hidden relative sticky top-0 z-10"
        >
          {/* Parallax blobs that move on scroll - reduced on mobile */}
          {!isMobile && (
            <>
              <ParallaxBlob
                className="absolute -top-1/4 -right-1/4 opacity-30"
                color="#FFD700"
                size={600}
                scrollFactor={0.05}
                initialPosition={{ x: -20, y: -20 }}
              />
              <ParallaxBlob
                className="absolute -bottom-1/4 -left-1/4 opacity-20"
                color="#FFD700"
                size={700}
                scrollFactor={-0.03}
                initialPosition={{ x: 20, y: 20 }}
              />
            </>
          )}

          {/* Simplified blobs for mobile */}
          {isMobile && (
            <>
              <div className="absolute -top-1/4 -right-1/4 opacity-30 w-[400px] h-[400px] rounded-full bg-yellow-400 blur-3xl"></div>
              <div className="absolute -bottom-1/4 -left-1/4 opacity-20 w-[450px] h-[450px] rounded-full bg-yellow-400 blur-3xl"></div>
            </>
          )}

          <div className="container relative z-10">
            <div className="flex flex-col items-center text-center gap-8">
              <div
                className="relative w-40 h-40 md:w-60 md:h-60 mb-4"
                style={{
                  transform: "translateY(0)",
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div className="w-full h-full bg-yellow-400 rounded-full animate-pulse"></div>
                <Image
                  src="/images/blorbo-mascot-new.png"
                  alt="Blorbo Mascot"
                  width={400}
                  height={400}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                  priority // Load hero image with priority
                />
              </div>

              <div
                style={{
                  transform: "translateY(0)",
                }}
              >
                <BlobText
                  text="$BLORBO"
                  className="text-6xl md:text-8xl font-black text-yellow-600 tracking-tight"
                  speed={isMobile ? 0.3 : 0.5}
                  intensity={isMobile ? 2 : 3}
                />
              </div>

              {/* Live price indicator */}
              <div
                className="flex items-center justify-center gap-2 mb-2"
                style={{
                  transform: "translateY(0)",
                }}
              >
                <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full live-indicator">
                  LIVE ON PUMP.FUN
                </span>
              </div>

              <p
                className="text-xl md:text-2xl text-yellow-700 max-w-2xl mx-auto font-medium"
                style={{
                  transform: "translateY(0)",
                }}
              >
                The gooiest blob on Solana is <span className="font-bold text-yellow-500">LIVE</span> on{" "}
                <span className="font-bold">pump.fun</span>
              </p>

              <div
                className="mt-8 flex flex-col sm:flex-row gap-6 justify-center"
                style={{
                  transform: "translateY(0)",
                }}
              >
                <Link href="https://pump.fun/token/blorboonsol" target="_blank" rel="noopener noreferrer">
                  <BlobButton
                    variant="primary"
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg rounded-full px-10 py-4"
                  >
                    Buy on pump.fun
                  </BlobButton>
                </Link>

                <Link href="https://x.com/blorboonsol" target="_blank" rel="noopener noreferrer">
                  <BlobButton
                    variant="secondary"
                    size="lg"
                    className="border-yellow-500 bg-transparent text-yellow-700 hover:bg-yellow-100 font-medium rounded-full px-10 py-4 border-2"
                  >
                    Follow <Twitter className="ml-2 h-4 w-4 inline" />
                  </BlobButton>
                </Link>
              </div>

              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5V19M12 19L5 12M12 19L19 12"
                    stroke="#CA8A04"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* About Section with Scroll Reveal - lazy loaded */}
        <LazySection id="about">
          <section className="py-32 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/50 via-yellow-950/30 to-black"></div>

            {/* Animated blobs in background - simplified on mobile */}
            <div className="absolute inset-0 overflow-hidden">
              {!isMobile ? (
                <>
                  <InteractiveBlob
                    className="absolute top-1/4 right-1/4 opacity-10"
                    color="#FFD700"
                    size={800}
                    speed={0.02}
                    complexity={8}
                  />
                  <InteractiveBlob
                    className="absolute bottom-1/4 left-1/4 opacity-5"
                    color="#FFD700"
                    size={900}
                    speed={0.01}
                    complexity={7}
                  />
                </>
              ) : (
                <>
                  <div className="absolute top-1/4 right-1/4 opacity-10 w-[500px] h-[500px] rounded-full bg-yellow-400 blur-3xl"></div>
                  <div className="absolute bottom-1/4 left-1/4 opacity-5 w-[600px] h-[600px] rounded-full bg-yellow-400 blur-3xl"></div>
                </>
              )}
            </div>

            <div className="container relative z-10">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-8">
                    Not just another <span className="text-yellow-300">meme</span>
                  </h2>

                  <p className="text-xl text-yellow-200 font-medium">Born from the goo, powered by Solana.</p>

                  <p className="text-lg text-yellow-100/80">
                    Blorboonsol isn't trying to be the next big thing. It's just a weird, gooey blob that somehow found
                    its way onto the blockchain. No utility, no roadmap, just vibes.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                <ScrollReveal delay={0.1}>
                  <div className="bg-yellow-950/30 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-500 relative overflow-hidden group border border-yellow-900/50 animate-blob-wobble animate-blob-move-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-yellow-800/10 to-yellow-900/20 animate-blob-background"></div>
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <InteractiveBlob
                          className="absolute inset-0"
                          color="#FFD700"
                          size={400}
                          speed={0.05}
                          complexity={5}
                          hover={true}
                        />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-yellow-600/50 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center animate-blob-pulse">
                        <span className="text-2xl animate-jelly">🫠</span>
                      </div>
                      <h3 className="text-xl font-bold text-yellow-300 mb-2 transition-all duration-300 group-hover:text-yellow-200">
                        Blobby Goodness
                      </h3>
                      <p className="text-yellow-100/80 transition-all duration-300 group-hover:text-white/90">
                        The gooiest, blobbiest token on Solana. Blorbo oozes where others can't even squeeze.
                      </p>
                    </div>
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/10 to-yellow-600/0 animate-blob-ooze"></div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <div className="bg-yellow-950/30 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-500 relative overflow-hidden group border border-yellow-900/50 animate-blob-wobble-alt animate-blob-move-2">
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900/20 via-yellow-800/10 to-yellow-900/20 animate-blob-background"></div>
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <InteractiveBlob
                          className="absolute inset-0"
                          color="#FFD700"
                          size={400}
                          speed={0.05}
                          complexity={5}
                          hover={true}
                        />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-yellow-600/50 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center animate-blob-pulse">
                        <span className="text-2xl animate-jelly">🌊</span>
                      </div>
                      <h3 className="text-xl font-bold text-yellow-300 mb-2 transition-all duration-300 group-hover:text-yellow-200">
                        pump.fun
                      </h3>
                      <p className="text-yellow-100/80 transition-all duration-300 group-hover:text-white/90">
                        Fair launch on pump.fun means everyone gets the same shot at the goo.
                      </p>
                    </div>
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/10 to-yellow-600/0 animate-blob-ooze"></div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="bg-yellow-950/30 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-500 relative overflow-hidden group border border-yellow-900/50 animate-blob-wobble-slow animate-blob-move-3">
                    <div className="absolute inset-0 bg-gradient-to-bl from-yellow-900/20 via-yellow-800/10 to-yellow-900/20 animate-blob-background"></div>
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <InteractiveBlob
                          className="absolute inset-0"
                          color="#FFD700"
                          size={400}
                          speed={0.05}
                          complexity={5}
                          hover={true}
                        />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-yellow-600/50 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center animate-blob-pulse">
                        <span className="text-2xl animate-jelly">🎮</span>
                      </div>
                      <h3 className="text-xl font-bold text-yellow-300 mb-2 transition-all duration-300 group-hover:text-yellow-200">
                        Just Vibes
                      </h3>
                      <p className="text-yellow-100/80 transition-all duration-300 group-hover:text-white/90">
                        No utility, no promises, no BS. Just a weird blob doing its thing.
                      </p>
                    </div>
                    {!isMobile && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/10 to-yellow-600/0 animate-blob-ooze"></div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        </LazySection>

        {/* Twitter Feed Section - lazy loaded */}
        <LazySection id="twitter">
          <section className="py-32 bg-gradient-to-b from-black via-black to-yellow-950/80 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/30 via-black/90 to-black"></div>

            <ScrollReveal>
              <div className="container relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-16">
                  Join the <span className="text-yellow-300">Conversation</span>
                </h2>

                <TwitterFeed />

                <div className="mt-16">
                  <Link href="https://x.com/blorboonsol" target="_blank" rel="noopener noreferrer">
                    <BlobButton
                      variant="primary"
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg rounded-full px-10 py-4 inline-flex items-center"
                    >
                      <Twitter className="mr-2 h-5 w-5" />
                      Follow @BlorboSol
                    </BlobButton>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </LazySection>

        {/* CTA Section - lazy loaded */}
        <LazySection id="cta">
          <section className="py-32 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 text-black relative overflow-hidden">
            {!isMobile ? (
              <>
                <InteractiveBlob
                  className="absolute -top-1/4 -right-1/4 opacity-30"
                  color="#FFFFFF"
                  size={800}
                  speed={0.02}
                  complexity={8}
                />
                <InteractiveBlob
                  className="absolute -bottom-1/4 -left-1/4 opacity-20"
                  color="#FFFFFF"
                  size={700}
                  speed={0.03}
                  complexity={7}
                />
              </>
            ) : (
              <>
                <div className="absolute -top-1/4 -right-1/4 opacity-30 w-[500px] h-[500px] rounded-full bg-white blur-3xl"></div>
                <div className="absolute -bottom-1/4 -left-1/4 opacity-20 w-[450px] h-[450px] rounded-full bg-white blur-3xl"></div>
              </>
            )}

            <ScrollReveal>
              <div className="container text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-black mb-8">
                  Join the <span className="text-white">Pump</span>
                </h2>
                <p className="text-xl max-w-2xl mx-auto mb-12">
                  Blorboonsol is live on pump.fun. Get your gooey blobs before they ooze away.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="https://pump.fun/token/blorboonsol" target="_blank" rel="noopener noreferrer">
                    <BlobButton
                      variant="primary"
                      size="lg"
                      className="bg-white hover:bg-yellow-100 text-yellow-600 font-bold text-lg rounded-full px-10 py-4 flex items-center gap-2"
                    >
                      Buy on pump.fun
                    </BlobButton>
                  </Link>
                  <Link href="https://x.com/blorboonsol" target="_blank" rel="noopener noreferrer">
                    <BlobButton
                      variant="secondary"
                      size="lg"
                      className="border-white bg-transparent text-white hover:bg-white/10 font-medium rounded-full px-10 py-4 border-2"
                    >
                      Follow @BlorboSol
                    </BlobButton>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </LazySection>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-8 relative overflow-hidden">
        {!isMobile ? (
          <FloatingBlobs count={3} minSize={150} maxSize={300} colors={["#FFD700"]} className="opacity-5" />
        ) : (
          <div className="absolute inset-0 bg-yellow-900/5"></div>
        )}

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-full group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/blorbo-mascot-new.png"
                  alt="Blorbo Logo"
                  width={40}
                  height={40}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shine"></div>
              </div>
              <span className="font-bold text-xl group-hover:text-yellow-200 transition-colors">Blorboonsol</span>
            </div>

            <div className="text-center md:text-right text-sm text-white/70">
              <p>© {new Date().getFullYear()} Blorboonsol</p>
              <p className="mt-1">Stay gooey!</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
