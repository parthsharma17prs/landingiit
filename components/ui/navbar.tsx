"use client"

import * as React from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"

import { Button } from "@/components/ui/button"

export function Navbar() {
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isHidden, setIsHidden] = React.useState(false)
    const lastScrollY = React.useRef(0)

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY.current
        if (latest > previous && latest > 150) {
            setIsHidden(false) // Keep it visible but maybe smaller? Wait, user said "gets wider" when scrolling up.
            // Actually user said: "on scrolling down the nav bar must get consize and. while scrolling up. it gets wider back"
            // This implies size change, not hiding.
        }

        // Logic for concise vs wide
        // Scrolling down -> Concise (smaller width/padding)
        // Scrolling up -> Wider (full width or larger)

        if (latest > 50) {
            setIsScrolled(true)
        } else {
            setIsScrolled(false)
        }

        lastScrollY.current = latest
    })

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
            <motion.nav
                variants={{
                    wide: {
                        width: "90%",
                        maxWidth: "1200px",
                        padding: "1rem 2rem",
                        y: 0
                    },
                    concise: {
                        width: "fit-content",
                        minWidth: "300px",
                        padding: "0.75rem 1.5rem",
                        y: 0
                    }
                }}
                animate={isScrolled ? "concise" : "wide"}
                transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
                className="pointer-events-auto flex items-center justify-between gap-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg dark:bg-black/10 dark:border-white/10"
            >
                <div className="font-bold text-lg tracking-tight">
                    Parixo
                </div>

                <div className="flex items-center gap-6 text-sm font-medium">
                    {/* Menu Items - hidden when concise to save space if needed, or just kept */}
                    <a href="#" className="hover:text-blue-500 transition-colors hidden sm:block">Work</a>
                    <a href="#" className="hover:text-blue-500 transition-colors hidden sm:block">Agency</a>
                    <a href="#" className="hover:text-blue-500 transition-colors hidden sm:block">Labs</a>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full px-5 dark:border-white/20 dark:hover:bg-white/10">
                        Login
                    </Button>
                    <ModeToggle />
                </div>
            </motion.nav>
        </div>
    )
}
