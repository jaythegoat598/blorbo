"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
}

export function ScrollReveal({ children, className, threshold = 0.1, delay = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Reduce animation duration on mobile for better performance
  const animationDuration = isMobile ? 700 : 1000

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay to stagger animations and reduce jank
          setTimeout(() => {
            setIsVisible(true)
          }, 50)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        // Add root margin to start animation slightly before element is in view
        rootMargin: isMobile ? "50px" : "0px",
      },
    )

    const currentRef = ref.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, isMobile])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20",
        className,
      )}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${animationDuration}ms`,
        // Use hardware acceleration for smoother animations
        transform: isVisible ? "translate3d(0, 0, 0)" : "translate3d(0, 20px, 0)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}
