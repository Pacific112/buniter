import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "$/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-zinc-500 inline-flex h-9 w-fit items-center justify-center redark:text-zinc-400",
        className
      )}
      {...props}
    />
  )
}
//
function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:text-zinc-950 border-b-transparent border-b-2 data-[state=active]:border-b-gray-500 focus-visible:border-zinc-950 focus-visible:ring-zinc-950/50 focus-visible:outline-ring inline-flex items-center justify-center gap-2 px-2 py-2 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 redark:data-[state=active]:bg-zinc-950 redark:data-[state=active]:text-zinc-50 redark:focus-visible:border-zinc-300 redark:focus-visible:ring-zinc-300/50",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
