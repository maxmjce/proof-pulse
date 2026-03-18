'use client';

import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    open: false,
    options: { title: '', description: '' },
    resolve: null,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, open: false, resolve: null }));
  }, [state.resolve]);

  const handleCancel = useCallback((open: boolean) => {
    if (!open) {
      state.resolve?.(false);
      setState((prev) => ({ ...prev, open: false, resolve: null }));
    }
  }, [state.resolve]);

  return {
    confirm,
    confirmDialogProps: {
      open: state.open,
      onOpenChange: handleCancel,
      onConfirm: handleConfirm,
      ...state.options,
    },
  };
}
