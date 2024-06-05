import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        navButton:
          "m-2 bg-neutral-100 p-3 rounded-2xl focus:ring-2 transition-all ease-in-out delay-150 hover:bg-neutral-200 hover:overline hover:decoration-slate-900 text-slate-700 hover:text-slate-900",
        sideButton:
          "justify-self-auto m-2 bg-neutral-100 p-3 rounded-2xl focus:ring-2 transition-all ease-in-out delay-150 hover:bg-neutral-200 hover:overline hover:decoration-slate-900 text-slate-700 hover:text-slate-900",
        NotLikedButton:
          "bg-[url('@/images/like-png.jpg')] w-[19px] h-[18px] bg-contain hover:scale-110 transition-all delay-200 align-middle",
        LikedButton: 
          "bg-[url('@/images/like-png.jpg')] w-[19px] h-[18px] bg-contain hover:scale-110 transition-all delay-200 align-middle bg-slate-300",
        gabe: "bg-neutral-100 p-3 rounded-sm focus:ring-2 transition-all ease-in-out delay-150 text-slate-700 mr-4 hover:bg-neutral-300 hover:text-slate-900 hover:decoration-slate-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
