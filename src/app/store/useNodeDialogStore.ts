import { create } from "zustand";

type NodeDialogStore = {
  open: boolean;
  selectedNode: any | null;

  setOpen: (open: boolean) => void;
  setSelectedNode: (node: any | null) => void;
};
export const useNodeDialogStore = create<NodeDialogStore>((set) => ({
  open: false,
  selectedNode: null,

  setOpen: (open: boolean) => set({ open }),
  setSelectedNode: (node: any | null) => set({ selectedNode: node }),
}));
