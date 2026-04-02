import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "success" | "destructive"
}

export const useToast = () => {
  const toast = ({ title, description, variant = "default" }: ToastProps) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      })
    } else if (variant === "success") {
      sonnerToast.success(title, {
        description,
      })
    } else {
      sonnerToast.info(title, {
        description,
      })
    }
  }

  return { toast }
}
