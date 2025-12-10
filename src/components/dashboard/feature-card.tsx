import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
    href: string
    gradient: string
    borderHoverColor: string
    children: React.ReactNode
    className?: string
    height?: string
    glowOpacity?: string
}

export function FeatureCard({
    href,
    gradient,
    borderHoverColor,
    children,
    className,
    height = "h-28",
    glowOpacity = "opacity-10 group-hover:opacity-40"
}: FeatureCardProps) {
    return (
        <div className={cn("relative group", className)}>
            <div
                className={cn(
                    "absolute -inset-1 rounded-2xl blur transition duration-1000 group-hover:duration-200",
                    gradient,
                    glowOpacity
                )}
            />
            <Button
                asChild
                className={cn(
                    "relative w-full rounded-xl bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/5 transition-all duration-300 overflow-hidden group",
                    height,
                    borderHoverColor
                )}
            >
                <Link href={href} className="flex items-center justify-between px-6">
                    {children}
                </Link>
            </Button>
        </div>
    )
}
