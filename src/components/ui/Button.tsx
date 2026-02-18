"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
    children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_20px_rgba(14,165,233,0.3)]",
            accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
            outline: "border border-border bg-transparent hover:bg-white/5",
            ghost: "hover:bg-white/5 text-muted-foreground hover:text-foreground",
        };

        const sizes = {
            sm: "h-9 px-4 text-xs",
            md: "h-11 px-6 text-sm",
            lg: "h-13 px-8 text-base font-medium",
            icon: "h-10 w-10 flex items-center justify-center p-0",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <span className={cn(isLoading && "opacity-0")}>{children}</span>
            </motion.button>
        );
    }
);

Button.displayName = "Button";

export { Button };
