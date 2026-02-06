"use client"

import { useEffect, useRef } from "react"

interface DotGridBackgroundProps {
    dotSize?: number
    dotColor?: string
    gap?: number
    className?: string
}

export default function DotGridBackground({
    dotSize = 2,
    dotColor = "#000000",
    gap = 20,
    className = "",
}: DotGridBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let dots: { x: number; y: number; originX: number; originY: number }[] = []

        const resize = () => {
            const parent = canvas.parentElement
            if (parent) {
                canvas.width = parent.clientWidth
                canvas.height = parent.clientHeight
                initDots()
            }
        }

        const initDots = () => {
            dots = []
            const rows = Math.ceil(canvas.height / gap)
            const cols = Math.ceil(canvas.width / gap)

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const x = j * gap + (gap / 2)
                    const y = i * gap + (gap / 2)
                    dots.push({ x, y, originX: x, originY: y })
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = dotColor

            dots.forEach((dot) => {
                // Calculate distance from mouse
                const dx = mouseRef.current.x - dot.x
                const dy = mouseRef.current.y - dot.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                // Repulsion effect
                const maxDist = 150
                const force = Math.max(0, (maxDist - dist) / maxDist)
                const angle = Math.atan2(dy, dx)

                // Move dots away from cursor
                const moveX = Math.cos(angle) * force * -20 // -20 for repulsion, +20 for attraction
                const moveY = Math.sin(angle) * force * -20

                // Easing back to origin
                dot.x += (dot.originX + moveX - dot.x) * 0.1
                dot.y += (dot.originY + moveY - dot.y) * 0.1

                ctx.beginPath()
                ctx.arc(dot.x, dot.y, dotSize / 2, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resize)
        window.addEventListener("mousemove", (e) => {
            // We need to adjust for canvas position relative to viewport if it's not fixed
            // But if it's filling a relative container, we need local coordinates
            const rect = canvas.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        })

        resize()
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [dotSize, dotColor, gap])

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={{ zIndex: 0 }}
        />
    )
}
