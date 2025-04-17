"use client"

import { useEffect, useState, useMemo } from "react"
import { InteractiveBlob } from "./interactive-blob"
import { useIsMobile } from "@/hooks/use-mobile"

interface FloatingBlobsProps {
  count?: number
  minSize?: number
  maxSize?: number
  colors?: string[]
  className?: string
}

export function FloatingBlobs({
  count = 5,
  minSize = 100,
  maxSize = 300,
  colors = ["#FFD700", "#FFC800", "#FFBF00"],
  className = "",
}: FloatingBlobsProps) {
  const [blobs, setBlobs] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      speed: number
      complexity: number
    }>
  >([])

  const isMobile = useIsMobile()

  // Reduce blob count and complexity on mobile
  const adjustedCount = useMemo(() => (isMobile ? Math.min(count, 3) : count), [count, isMobile])

  useEffect(() => {
    const newBlobs = Array.from({ length: adjustedCount }, (_, i) => {
      // Smaller size range on mobile
      const adjustedMinSize = isMobile ? minSize * 0.7 : minSize
      const adjustedMaxSize = isMobile ? maxSize * 0.7 : maxSize
      const size = Math.floor(Math.random() * (adjustedMaxSize - adjustedMinSize) + adjustedMinSize)

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        // Slower animation on mobile
        speed: (Math.random() * 0.04 + 0.02) * (isMobile ? 0.5 : 1),
        // Reduced complexity on mobile
        complexity: isMobile ? Math.floor(Math.random() * 2) + 3 : Math.floor(Math.random() * 4) + 4,
      }
    })

    setBlobs(newBlobs)
  }, [adjustedCount, minSize, maxSize, colors, isMobile])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {blobs.map((blob, index) => (
        <InteractiveBlob
          key={blob.id}
          className={`absolute opacity-20 ${index % 2 === 0 ? "animate-float" : "animate-bounce-slow"}`}
          style={{
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            transform: "translate(-50%, -50%)",
            animationDelay: `${index * 0.5}s`,
          }}
          color={blob.color}
          size={blob.size}
          speed={blob.speed}
          complexity={blob.complexity}
        />
      ))}
    </div>
  )
}
