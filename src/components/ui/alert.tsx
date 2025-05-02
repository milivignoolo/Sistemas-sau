
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckSquare, Info, TriangleAlert } from "lucide-react" // Added icons

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground [&>svg]:text-foreground", // Specify default icon color
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
           "border-green-500/50 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-950 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        info:
           "border-blue-500/50 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:bg-blue-950 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400", // Added info variant styles
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant = "default", children, ...props }, ref) => { // Ensure default variant is set
    // Determine icon based on variant
    const Icon =
        variant === "destructive" ? AlertCircle :
        variant === "success" ? CheckSquare : // Use CheckSquare for success
        variant === "info" ? Info : // Use Info for info variant
        TriangleAlert; // Default icon (can be TriangleAlert or Info)

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
          {/* Always render an icon based on the variant */}
         <Icon className="h-4 w-4" />
         {children}
      </div>
    )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
