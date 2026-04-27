import { create } from "zustand";

type BillingUiState = {
  isEditingCard: boolean;
  setEditingCard: (nextValue: boolean) => void;
};

/**
 * Holds transient UI-only state for billing screens.
 */
export const useBillingUiStore = create<BillingUiState>((set) => ({
  isEditingCard: false,
  setEditingCard: (nextValue) => {
    set({ isEditingCard: nextValue });
  },
}));
