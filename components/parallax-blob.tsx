"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { InteractiveBlob } from "./interactive-blob"
import { useIsMobile } from "@/hooks/use-mobile"

interface ParallaxBlobProps {
  className?: string
  color?: string
  size?: number
  scrollFactor?: number
  initialPosition?: { x: number; y: number }
  style?: React.CSSProperties
}

export function ParallaxBlob({
  className = "",
  color = "#FFCC00",
  size = 400,
  scrollFactor = 0.1,
  initialPosition = { x: 0, y: 0 },
  style = {},
}: ParallaxBlobProps) {
  const [offset, setOffset] = useState({ x: initialPosition.x, y: initialPosition.y })
  const isMobile = useIsMobile()
  const blobRef = useRef<HTMLDivElement>(null)
  const isVisible = useRef(false)

  // Reduce parallax effect on mobile
  const adjustedScrollFactor = isMobile ? scrollFactor * 0.5 : scrollFactor
  // Reduce size on mobile
  const adjustedSize = isMobile ? size * 0.7 : size

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      // Skip scroll handling when not visible (performance optimization)
      if (!isVisible.current) return

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setOffset({
            x: initialPosition.x + window.scrollY * adjustedScrollFactor,
            y: initialPosition.y + window.scrollY * adjustedScrollFactor,
          })
          ticking = false
        })
        ticking = true
      }
    }

    // Use IntersectionObserver to only update when visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible.current = entries[0].isIntersecting
      },
      { threshold: 0.1 },
    )

    if (blobRef.current) {
      observer.observe(blobRef.current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (blobRef.current) {
        observer.unobserve(blobRef.current)
      }
    }
  }, [initialPosition.x, initialPosition.y, adjustedScrollFactor])

  return (
    <div ref={blobRef} className="relative">
      <InteractiveBlob
        className={className}
        color={color}
        size={adjustedSize}
        style={{
          ...style,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
        // Reduce complexity on mobile
        complexity={isMobile ? 4 : 6}
        // Reduce animation speed on mobile
        speed={isMobile ? 0.02 : 0.05}
      />
    </div>
  )
}
