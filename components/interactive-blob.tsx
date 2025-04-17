"use client"

import type React from "react"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface InteractiveBlobProps {
  className?: string
  color?: string
  size?: number
  speed?: number
  complexity?: number
  hover?: boolean
  style?: React.CSSProperties
}

export function InteractiveBlob({
  className = "",
  color = "#FFCC00",
  size = 400,
  speed = 0.05,
  complexity = 5,
  hover = false,
  style = {},
}: InteractiveBlobProps) {
  const blobRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const [points, setPoints] = useState<
    { x: number; y: number; originX: number; originY: number; noiseOffsetX: number; noiseOffsetY: number }[]
  >([])

  const isMobile = useIsMobile()

  // Reduce complexity on mobile devices
  const adjustedComplexity = useMemo(() => (isMobile ? Math.min(complexity, 4) : complexity), [complexity, isMobile])

  // Reduce animation speed on mobile
  const adjustedSpeed = useMemo(() => (isMobile ? speed * 0.5 : speed), [speed, isMobile])

  // Initialize points for the blob - memoized to avoid recalculation
  useEffect(() => {
    if (!blobRef.current) return

    const generatePoints = () => {
      const newPoints = []
      const slice = (Math.PI * 2) / adjustedComplexity
      const radius = size / 2

      for (let i = 0; i < adjustedComplexity; i++) {
        const angle = slice * i
        const x = radius * Math.cos(angle) + radius
        const y = radius * Math.sin(angle) + radius

        newPoints.push({
          x,
          y,
          originX: x,
          originY: y,
          noiseOffsetX: Math.random() * 1000,
          noiseOffsetY: Math.random() * 1000,
        })
      }

      setPoints(newPoints)
    }

    generatePoints()

    const updateDimensions = () => {
      if (blobRef.current) {
        const { width, height } = blobRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()

    // Throttle resize event for better performance
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateDimensions, 100)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [adjustedComplexity, size])

  // Throttled mouse movement handler
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!blobRef.current) return

    const rect = blobRef.current.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      if (!e.touches[0]) return
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = (clientX - rect.left) / rect.width
    const y = (clientY - rect.top) / rect.height

    setPosition({ x, y })
  }, [])

  // Handle mouse movement with throttling
  useEffect(() => {
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Throttle mouse/touch events
    let ticking = false
    const throttledHandler = (e: MouseEvent | TouchEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleMouseMove(e)
          ticking = false
        })
        ticking = true
      }
    }

    if (hover) {
      window.addEventListener("mousemove", throttledHandler, { passive: true })
      window.addEventListener("touchmove", throttledHandler, { passive: true })
      blobRef.current?.addEventListener("mouseenter", handleMouseEnter)
      blobRef.current?.addEventListener("mouseleave", handleMouseLeave)
    } else {
      document.addEventListener("mousemove", throttledHandler, { passive: true })
      document.addEventListener("touchmove", throttledHandler, { passive: true })
    }

    return () => {
      if (hover) {
        window.removeEventListener("mousemove", throttledHandler)
        window.removeEventListener("touchmove", throttledHandler)
        blobRef.current?.removeEventListener("mouseenter", handleMouseEnter)
        blobRef.current?.removeEventListener("mouseleave", handleMouseLeave)
      } else {
        document.removeEventListener("mousemove", throttledHandler)
        document.removeEventListener("touchmove", throttledHandler)
      }
    }
  }, [hover, handleMouseMove])

  // Animation loop with performance optimizations
  useEffect(() => {
    if (points.length === 0) return

    // Skip animation on mobile when not in viewport
    if (isMobile) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation()
          } else if (requestRef.current) {
            cancelAnimationFrame(requestRef.current)
            requestRef.current = undefined
          }
        },
        { threshold: 0.1 },
      )

      if (blobRef.current) {
        observer.observe(blobRef.current)
      }

      return () => {
        if (blobRef.current) {
          observer.unobserve(blobRef.current)
        }
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    } else {
      startAnimation()
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current)
        }
      }
    }

    function startAnimation() {
      const animate = (time: number) => {
        if (previousTimeRef.current !== undefined) {
          // Reduce calculations for mobile
          const shouldAnimate = !hover || isHovering

          if (shouldAnimate) {
            // Update points less frequently on mobile
            const updateFrequency = isMobile ? 2 : 1
            if (time % updateFrequency === 0) {
              setPoints((prevPoints) => {
                return prevPoints.map((point) => {
                  // Calculate distance from mouse position
                  const centerX = dimensions.width / 2
                  const centerY = dimensions.height / 2
                  const mouseX = position.x * dimensions.width
                  const mouseY = position.y * dimensions.height

                  // Direction from center to point
                  const dirX = point.originX - centerX
                  const dirY = point.originY - centerY

                  // Direction from mouse to point
                  const mouseDirX = point.originX - mouseX
                  const mouseDirY = point.originY - mouseY
                  const mouseDistance = Math.sqrt(mouseDirX * mouseDirX + mouseDirY * mouseDirY)

                  // Apply force based on mouse distance (closer = stronger)
                  // Reduce force on mobile
                  const force = isMobile
                    ? Math.max(80 - mouseDistance, 0) / 100
                    : Math.max(120 - mouseDistance, 0) / 100

                  // Noise-based movement with more variation
                  // Reduce movement on mobile
                  const noiseMultiplier = isMobile ? 15 : 25
                  point.noiseOffsetX += adjustedSpeed * 0.15
                  point.noiseOffsetY += adjustedSpeed * 0.15

                  // More organic movement with sine/cosine combinations
                  const noiseX =
                    Math.sin(point.noiseOffsetX) * noiseMultiplier * Math.sin(time * 0.001 + point.noiseOffsetY)
                  const noiseY =
                    Math.cos(point.noiseOffsetY) * noiseMultiplier * Math.cos(time * 0.001 + point.noiseOffsetX)

                  // Combine forces with more dynamic movement
                  const mouseForceX = mouseDirX * force * (isMobile ? 0.01 : 0.015)
                  const mouseForceY = mouseDirY * force * (isMobile ? 0.01 : 0.015)

                  return {
                    ...point,
                    x: point.originX + noiseX + mouseForceX,
                    y: point.originY + noiseY + mouseForceY,
                  }
                })
              })
            }
          }
        }

        previousTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
      }

      requestRef.current = requestAnimationFrame(animate)
    }
  }, [position, points, dimensions, adjustedSpeed, hover, isHovering, isMobile])

  // Generate SVG path from points - memoized to avoid recalculation
  const blobPath = useMemo(() => {
    if (points.length === 0) return ""

    const pointsString = points
      .map((point, index) => {
        const { x, y } = point
        return index === 0 ? `M ${x},${y}` : `L ${x},${y}`
      })
      .join(" ")

    return `${pointsString} Z`
  }, [points])

  return (
    <div
      ref={blobRef}
      className={`absolute pointer-events-none ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation={isMobile ? "4" : "8"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path d={blobPath} fill={color} filter="url(#glow)" />
        <path d={blobPath} fill={color} opacity="0.7" filter={`blur(${isMobile ? "8" : "15"}px)`} />
      </svg>
    </div>
  )
}
