"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Twitter, Heart, Repeat } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"

// Mock Twitter data
const mockTweets = [
  {
    id: "1",
    username: "solanaglen",
    handle: "@glensolanaa",
    avatar:
      "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/221897409/original/5a7fd71225e9674fa4ff7b54b647f9907f87f411/develop-script-that-generate-multiple-3d-nft.png",
    content: "I don't know what a Blorbo is but I bought some anyway lol. The yellow blob spoke to me.",
    likes: 8,
    retweets: 2,
    time: "7m",
  },
  {
    id: "2",
    username: "SolanaWhale",
    handle: "@solana_whale",
    avatar:
      "https://media.istockphoto.com/id/1398056740/vector/vector-illustration-of-a-cute-whale-single-item.jpg?s=612x612&w=0&k=20&c=X-LE22J40r9rGa-Dkd-9OGtC0fh57cV82R2yGRA3Ojk=",
    content: "Blorboonsol is sick love the idea,Im in send it",
    likes: 4,
    retweets: 1,
    time: "2m",
  },
  {
    id: "3",
    username: "Shade",
    handle: "@Shadesol",
    avatar: "https://pbs.twimg.com/media/GK2ONLrWwAAUEPd.jpg",
    content: "$Blorbo send it",
    likes: 18,
    retweets: 3,
    time: "9m",
  },
]

export function TwitterFeed() {
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only start the interval when the component is visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  // Control the interval based on visibility
  useEffect(() => {
    if (isVisible) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % mockTweets.length)
      }, 5000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible])

  return (
    <div className="max-w-4xl mx-auto" ref={containerRef}>
      <div className="relative h-[300px] md:h-[250px]">
        {mockTweets.map((tweet, index) => (
          <div
            key={tweet.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === activeIndex
                ? "opacity-100 translate-x-0"
                : index < activeIndex
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
            // Only render the active tweet and adjacent ones for performance
            style={{ display: Math.abs(index - activeIndex) > 1 ? "none" : "block" }}
          >
            <ScrollReveal delay={0.1 * index}>
              <div className="bg-black/40 backdrop-blur-md border border-yellow-900/30 rounded-xl p-6 shadow-xl hover:shadow-yellow-500/10 transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-yellow-800/30">
                      <Image
                        src={tweet.avatar || "/placeholder.svg"}
                        alt={tweet.username}
                        width={50}
                        height={50}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">{tweet.username}</span>
                      <span className="text-gray-400 text-sm">{tweet.handle}</span>
                      <span className="text-gray-400 text-sm">· {tweet.time}</span>
                    </div>
                    <p className="text-white mb-4">{tweet.content}</p>
                    <div className="flex items-center gap-6 text-gray-400">
                      <div className="flex items-center gap-2 hover:text-pink-500 transition-colors cursor-pointer">
                        <Heart size={18} />
                        <span className="text-sm">{tweet.likes}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-green-500 transition-colors cursor-pointer">
                        <Repeat size={18} />
                        <span className="text-sm">{tweet.retweets}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Twitter className="text-blue-400" size={20} />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        ))}
      </div>

      {/* Tweet navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {mockTweets.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeIndex ? "bg-yellow-400 scale-125" : "bg-yellow-800/50 hover:bg-yellow-700/50"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View tweet ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
