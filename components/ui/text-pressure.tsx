"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface TextPressureProps {
    text?: string
    fontFamily?: string
    className?: string
    textColor?: string
    fontSize?: number
    width?: boolean
    weight?: boolean
    italic?: boolean
    alpha?: boolean
    flex?: boolean
    stroke?: boolean
    scale?: boolean
    minFontSize?: number
}

const TextPressure: React.FC<TextPressureProps> = ({
    text = "PRESSURE",
    fontFamily = "sans-serif",
    className = "",
    textColor = "#000000",
    fontSize = 200,
    width = true,
    weight = true,
    italic = true,
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    minFontSize = 24,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const [spans, setSpans] = useState<HTMLSpanElement[]>([])

    const mouseRef = useRef({ x: 0, y: 0 })
    const cursorRef = useRef({ x: 0, y: 0 })

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                })
            }
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        if (titleRef.current) {
            const children = Array.from(titleRef.current.children) as HTMLSpanElement[]
            setSpans(children)
        }
    }, [text])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    useEffect(() => {
        let rafId: number
        const animate = () => {
            const { x: mouseX, y: mouseY } = mouseRef.current
            cursorRef.current.x += (mouseX - cursorRef.current.x) * 0.1
            cursorRef.current.y += (mouseY - cursorRef.current.y) * 0.1

            if (containerRef.current && titleRef.current) {
                const { top, left, width, height } =
                    titleRef.current.getBoundingClientRect()
                const center = { x: left + width / 2, y: top + height / 2 }

                const dist = Math.hypot(
                    cursorRef.current.x - center.x,
                    cursorRef.current.y - center.y
                )
                const maxDist = Math.hypot(window.innerWidth, window.innerHeight)
                const intensity = Math.max(0, 1 - dist / (maxDist * 0.5))

                spans.forEach((span, i) => {
                    // A simple "pressure" effect simulation using variable font axes if available, 
                    // or performant transforms. Since we don't have a guaranteed variable font,
                    // we will use scale and weight simulation.

                    // Calculate distance from cursor to this specific letter
                    const rect = span.getBoundingClientRect()
                    const charCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                    const charDist = Math.hypot(cursorRef.current.x - charCenter.x, cursorRef.current.y - charCenter.y)
                    const charIntensity = Math.max(0, 1 - charDist / 500) // 500px radius

                    // Apply styles
                    // Note: This works best with a variable font. We will simulate with transform.
                    const scaleY = 1 + charIntensity * 0.5 // Stretch vertically
                    const scaleX = 1 - charIntensity * 0.2 // Compress horizontally
                    const fontWeight = 100 + Math.round(charIntensity * 800) // 100 to 900

                    span.style.transform = `scale(${scaleX}, ${scaleY})`
                    span.style.fontWeight = `${fontWeight}`
                    // span.style.fontVariationSettings = `'wdth' ${100 - charIntensity * 50}, 'wght' ${100 + charIntensity * 800}`
                })
            }

            rafId = requestAnimationFrame(animate)
        }

        animate()
        return () => cancelAnimationFrame(rafId)
    }, [spans, containerSize])

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full flex items-center justify-center ${className}`}
        >
            <h1
                ref={titleRef}
                className={`flex justify-between w-full uppercase text-center ${flex ? "flex" : ""
                    } ${stroke ? "text-stroke" : ""}`}
                style={{
                    fontFamily,
                    fontSize: fontSize, // Responsive hook would be better here for real prod
                    color: textColor,
                    lineHeight: 0.8,
                }}
            >
                {text.split("").map((char, i) => (
                    <span
                        key={i}
                        className="inline-block transition-transform duration-75 will-change-transform"
                        style={{
                            transformOrigin: "center center"
                        }}
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    )
}

export default TextPressure
