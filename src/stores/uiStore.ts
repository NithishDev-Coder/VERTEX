import { create } from "zustand";

type EditMode = "edit" | "simulation";

interface UIState {
  selectedObject: string | null;
  activeTool: string;
  activePanel: string | null;
  editMode: EditMode;

  setSelectedObject: (id: string | null) => void;
  setActiveTool: (tool: string) => void;
  setActivePanel: (panel: string | null) => void;
  setEditMode: (mode: EditMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedObject: null,
  activeTool: "select",
  activePanel: null,
  editMode: "edit",

  setSelectedObject: (id) =>
    set({ selectedObject: id }),

  setActiveTool: (tool) =>
    set({ activeTool: tool }),

  setActivePanel: (panel) =>
    set({ activePanel: panel }),

  setEditMode: (mode) =>
    set({ editMode: mode }),
}));