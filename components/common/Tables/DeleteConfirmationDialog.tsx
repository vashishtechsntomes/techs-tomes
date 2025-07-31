import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Survey } from "@/types"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  survey: Survey | null
  onConfirm: () => Promise<void>
  isLoading?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  survey,
  onConfirm,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting survey:", error)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this survey?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the survey
            {survey && (
              <>
                {" "}
                <span className="font-semibold">&quot;{survey.name}&quot; ({survey.code})</span>
              </>
            )}
            {" "}and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-white t hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete Survey"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}