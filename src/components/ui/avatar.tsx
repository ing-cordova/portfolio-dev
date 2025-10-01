import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
)
Avatar.displayName = "Avatar"

interface AvatarImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
}

const AvatarImage = React.forwardRef<HTMLDivElement, AvatarImageProps>(
  ({ className, src, alt = "", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("aspect-square h-full w-full relative", className)}
      {...props}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      )}
    </div>
  )
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }