import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: React.ReactNode;
  isLoading?: boolean;
  confirmText?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false,
  confirmText = "Delete Permanently"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-primary/20 shadow-2xl rounded-2xl max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-destructive mb-2">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-card-foreground/80">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border-primary/10 hover:bg-primary/5 transition-all h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            variant="destructive"
            className="flex-1 bg-destructive hover:bg-destructive/90 text-white shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)] rounded-xl px-6 h-11 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
