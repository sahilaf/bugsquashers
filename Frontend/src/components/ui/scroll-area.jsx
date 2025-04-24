import * as React from "react"
import PropTypes from "prop-types"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "../../lib/utils"

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  const viewportRef = React.useRef(null)
  const isScrolling = React.useRef(false)

  // Easing function for smooth acceleration/deceleration
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  const smoothScroll = (direction) => {
    if (isScrolling.current) return
    const element = viewportRef.current
    if (!element) return

    const scrollAmount = element.clientWidth * 0.8 // Scroll 80% of container width
    const maxScroll = element.scrollWidth - element.clientWidth
    const initialScroll = element.scrollLeft

    let targetScroll = direction === "left" 
      ? initialScroll - scrollAmount 
      : initialScroll + scrollAmount

    // Clamp target scroll to valid range
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll))

    if (targetScroll === initialScroll) return

    const duration = 100 // Longer duration for smoother effect
    let startTime = null

    isScrolling.current = true

    const animateScroll = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutQuad(progress)

      element.scrollLeft = initialScroll + (targetScroll - initialScroll) * easedProgress

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        isScrolling.current = false
      }
    }

    requestAnimationFrame(animateScroll)
  }

  return (
    <div className="relative flex items-center group">
      {/* Left Scroll Button */}
      <button
        onClick={() => smoothScroll("left")}
        className="absolute left-0 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-black hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110">
        ←
      </button>

      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("w-full overflow-hidden", className)}
        {...props}>
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="h-full w-full whitespace-nowrap rounded-[inherit] overflow-x-auto scrollbar-none scroll-smooth">
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>

      {/* Right Scroll Button */}
      <button
        onClick={() => smoothScroll("right")}
        className="absolute right-0 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-black hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110">
        →
      </button>
    </div>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

ScrollArea.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export { ScrollArea }