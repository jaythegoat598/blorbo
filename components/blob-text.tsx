"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface BlobTextProps {
  text: string
  className?: string
  speed?: number
  intensity?: number
}

export function BlobText({ text, className, speed = 0.3, intensity = 2 }: BlobTextProps) {
  const [letters, setLetters] = useState<Array<{ char: string; offset: number }>>([])
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const isMobile = useIsMobile()

  // Reduce animation complexity on mobile
  const adjustedSpeed = isMobile ? speed * 0.7 : speed
  const adjustedIntensity = isMobile ? intensity * 0.7 : intensity

  useEffect(() => {
    // Initialize letters with random offsets
    const initialLetters = text.split("").map((char) => ({
      char,
      offset: Math.random() * Math.PI * 2,
    }))
    setLetters(initialLetters)

    // Animation loop with performance optimizations
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        // Skip frames on mobile for better performance
        const shouldUpdate = !isMobile || time % 2 === 0

        if (shouldUpdate) {
          // Update each letter's offset
          setLetters((prevLetters) =>
            prevLetters.map((letter, index) => ({
              ...letter,
              // Different speeds for different letters creates a wave effect
              offset: letter.offset + adjustedSpeed * (0.1 + (index % 3) * 0.05),
            })),
          )
        }
      }

      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [text, adjustedSpeed, isMobile])

  return (
    <div className={cn("relative inline-block", className)}>
      <span className="invisible">{text}</span>
      <div className="absolute top-0 left-0 w-full h-full flex">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block transition-transform"
            style={{
              transform: letter.char !== " " ? `translateY(${Math.sin(letter.offset) * adjustedIntensity}px)` : "",
              // Use hardware acceleration for smoother animations
              willChange: "transform",
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
    </div>
  )
}
