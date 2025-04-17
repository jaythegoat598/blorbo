"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface MouseFollowerBlobProps {
  color?: string
  size?: number
  opacity?: number
  delay?: number
  className?: string
}

export function MouseFollowerBlob({
  color = "#FFCC00",
  size = 40,
  opacity = 0.5,
  delay = 0.1,
  className = "",
}: MouseFollowerBlobProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMobile = useIsMobile()

  // Skip this component on mobile devices to improve performance
  const [shouldRender, setShouldRender] = useState(!isMobile)

  useEffect(() => {
    if (!isMobile) {
      let ticking = false

      const handleMouseMove = (e: MouseEvent) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            setPosition({ x: e.clientX, y: e.clientY })
            setIsVisible(true)
            ticking = false
          })
          ticking = true
        }

        // Hide the blob after 2 seconds of inactivity
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          setIsVisible(false)
        }, 2000)
      }

      const handleMouseLeave = () => {
        setIsVisible(false)
      }

      const handleMouseDown = () => {
        setIsClicked(true)

        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }

        clickTimeoutRef.current = setTimeout(() => {
          setIsClicked(false)
        }, 300)
      }

      const handleMouseUp = () => {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }

        clickTimeoutRef.current = setTimeout(() => {
          setIsClicked(false)
        }, 100)
      }

      window.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseleave", handleMouseLeave)
      document.addEventListener("mousedown", handleMouseDown)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseleave", handleMouseLeave)
        document.removeEventListener("mousedown", handleMouseDown)
        document.removeEventListener("mouseup", handleMouseUp)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }
      }
    }
  }, [isMobile])

  if (!shouldRender) {
    return null
  }

  return (
    <div
      className={`fixed pointer-events-none z-50 transition-opacity duration-300 ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        width: `${isClicked ? size * 0.7 : size}px`,
        height: `${isClicked ? size * 0.7 : size}px`,
        opacity: isVisible ? opacity : 0,
        transition: `opacity 0.3s ease, transform 0.2s ease, width 0.2s ease, height 0.2s ease, left ${delay}s ease-out, top ${delay}s ease-out`,
      }}
    >
      <div
        className="w-full h-full rounded-full animate-pulse"
        style={{
          backgroundColor: color,
          filter: "blur(8px)",
          animation: isClicked ? "pulse 0.5s ease-out" : "pulse 2s infinite",
        }}
      />
    </div>
  )
}
