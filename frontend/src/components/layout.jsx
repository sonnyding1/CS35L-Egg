import * as React from "react"

import { cn } from "@/lib/utils"


// MainLayout: The fundamental layout housing the two columns (side bar and contents)
// Colspan size is 5 so that sidebar:content ratio would be 1:6
const MainLayout = React.forwardRef(({className, ...props}, ref) => (
    <div 
        ref={ref}
        className={cn("w-full h-screen container mx-auto grid grid-cols-7")}
        //grid-rows-[auto,1fr,auto]
        {...props}
    />

))
MainLayout.displayName = "MainLayout"


// SideBar: Featured on the left, fixed, narrow
const SideBar = React.forwardRef(({className, ...props}, ref) => (
    <div 
        ref={ref}
        className={cn("bg-slate-700 grid-rows-[repeat(auto-fill,minmax(500px,1fr))")}
        {...props}
    />

))
SideBar.displayName = "SideBar"

// MainBar: Contents.
const MainBar = React.forwardRef(({className, ...props}, ref) => (
    <div 
        ref={ref}
        className={cn(" rounded-lg border shadow-lg col-span-6 grid-rows-[repeat(auto-fill,minmax(500px,1fr))] space-y-8")}
        {...props}
    />

))
MainBar.displayName = "MainBar"

// Box
const Box = React.forwardRef(({className, ...props}, ref) => (
    <div 
        ref={ref}
        className={cn("rounded-lg border shadow-lg p-4 margin-8")}
        {...props}
    />

))
Box.displayName = "Box"



export {MainLayout, SideBar, MainBar, Box}