import React, { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => onOpenChange(false)}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 relative" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const DialogTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-bold mb-4">{children}</h2>
);
