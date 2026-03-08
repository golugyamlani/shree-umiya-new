import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = ({ variant = "default", size = "default", className }: { variant?: "default" | "secondary" | "outline" | "ghost" | "link", size?: "default" | "sm" | "lg" | "icon", className?: string }) => {
    return cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 font-sans cursor-pointer",
        {
            "bg-primary text-white hover:bg-[#b01662] shadow-sm": variant === "default",
            "bg-secondary text-white hover:bg-[#1a232b] shadow-sm": variant === "secondary",
            "border border-secondary bg-transparent hover:bg-gray-100 text-secondary": variant === "outline",
            "hover:bg-gray-100 text-secondary": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-10 px-6 py-2": size === "default",
            "h-8 rounded-sm px-3 text-xs": size === "sm",
            "h-12 rounded-sm px-8 text-base": size === "lg",
            "h-9 w-9": size === "icon",
        },
        className
    )
}

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "default" | "secondary" | "outline" | "ghost" | "link";
        size?: "default" | "sm" | "lg" | "icon";
    }
>(({ className, variant, size, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={buttonVariants({ variant, size, className })}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
