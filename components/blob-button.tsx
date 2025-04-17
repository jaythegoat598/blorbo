"use client"

import { type ButtonHTMLAttributes, type ReactNode, useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface BlobButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary"
  size?: "default" | "lg" | "sm"
  className?: string
}

export function BlobButton({ children, variant = "primary", size = "default", className, ...props }: BlobButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const variantStyles = {
    primary: "bg-yellow-500 hover:bg-yellow-600 text-black font-bold",
    secondary: "bg-transparent text-yellow-700 border-2 border-yellow-500",
  }

  const sizeStyles = {
    default: "text-sm px-4 py-2",
    sm: "text-xs px-3 py-1",
    lg: "text-lg px-8 py-3",
  }

  useEffect(() => {
    if (!buttonRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    const button = buttonRef.current
    button.addEventListener("mousemove", handleMouseMove)

    return () => {
      button.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Add a pulsing effect for primary buttons that are likely "Buy" buttons
  const isPrimaryBuyButton =
    variant === "primary" &&
    (children?.toString().toLowerCase().includes("buy") || children?.toString().toLowerCase().includes("pump"))

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative rounded-full transition-all duration-300 overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        isPressed ? "scale-95" : isHovered ? "scale-105" : "",
        isPrimaryBuyButton && !isHovered ? "animate-pulse" : "",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {/* Enhanced blob effect on hover */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
        {/* Radial gradient that follows mouse */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`
              : "none",
          }}
        ></div>

        <div className="absolute -inset-[100%] blur-md opacity-30 bg-white animate-blob-rotate"></div>
        {/* Add a second blob for more dynamic effect */}
        <div
          className="absolute -inset-[80%] blur-md opacity-20 bg-white animate-blob-rotate"
          style={{ animationDirection: "reverse", animationDuration: "8s" }}
        ></div>
      </div>

      {/* Add a subtle shine effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"} animate-shine`}
      ></div>

      {/* Pressed effect */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-150 ${isPressed ? "opacity-10" : "opacity-0"}`}
      ></div>
    </button>
  )
}
