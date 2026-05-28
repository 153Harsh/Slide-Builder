import { create } from "zustand";

import type {
  EditorNode,
  TextNode,
  ImageNode,
  ButtonNode,
  UpdateNodePayload,
} from "../types/editor";

export interface SlideType {
  id: string;
  name: string;
  nodes: EditorNode[];
}

interface EditorState {
  slides: SlideType[];
  clipboardNode: EditorNode | null;
  currentSlideId: string;

  // Canonical selection state
  selectedNodeIds: string[];

  // Backward-compatible single selection used by existing UI
  selectedNodeId: string | null;

  previewMode: boolean;

  history: SlideType[][];
  future: SlideType[][];

  activeTransition: string;

  setActiveTransition: (transition: string) => void;

  addSlide: () => void;
  setCurrentSlide: (id: string) => void;

  setSelectedNodes: (ids: string[]) => void;
  toggleNodeSelection: (id: string) => void;
  clearSelection: () => void;

  // Convenience used by canvas/layers
  selectNode: (id: string) => void;

  // Nodes
  addText: () => void;
  addImage: (src: string) => void;
  addButton: () => void;

  deleteSelectedNode: () => void;
  duplicateSelectedNode: () => void;
  copySelectedNode: () => void;
  pasteNode: () => void;

  updateNode: (id: string, updates: UpdateNodePayload) => void;

  // Layer ordering
  moveNodeUp: (id: string) => void;
  moveNodeDown: (id: string) => void;

  // Preview
  setPreviewMode: (value: boolean) => void;

  // History
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Export / Import
  exportProject: () => string;
  importProject: (json: string) => void;
}

const getFirstSelectedId = (ids: string[]) => (ids.length > 0 ? ids[0] : null);

export const useEditorStore = create<EditorState>((set, get) => ({
  slides: [
    {
      id: "slide-1",
      name: "Slide 1",
      nodes: [],
    },
  ],

  currentSlideId: "slide-1",

  selectedNodeIds: [],
  selectedNodeId: null,

  previewMode: false,

  history: [],
  future: [],

  activeTransition: "fade",

  clipboardNode: null,

  setActiveTransition: (transition) =>
    set({
      activeTransition: transition,
    }),

  addSlide: () =>
    set((state) => ({
      slides: [
        ...state.slides,
        {
          id: `slide-${Date.now()}`,
          name: `Slide ${state.slides.length + 1}`,
          nodes: [],
        },
      ],
    })),

  saveHistory: () => {
    const { slides, history } = get();

    set({
      history: [...history, structuredClone(slides)],
      future: [],
    });
  },

  undo: () => {
    const { history, slides, future } = get();

    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    set({
      slides: previous,
      history: newHistory,
      future: [structuredClone(slides), ...future],
    });
  },

  redo: () => {
    const { future, slides, history } = get();

    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      slides: next,
      future: newFuture,
      history: [...history, structuredClone(slides)],
    });
  },

  setCurrentSlide: (id) =>
    set({
      currentSlideId: id,
      selectedNodeIds: [],
      selectedNodeId: null,
    }),

  setPreviewMode: (value) =>
    set({
      previewMode: value,
      selectedNodeIds: [],
      selectedNodeId: null,
    }),

  setSelectedNodes: (ids) => {
    const selectedNodeId = getFirstSelectedId(ids);
    set({ selectedNodeIds: ids, selectedNodeId });
  },

  selectNode: (id) =>
    set({
      selectedNodeIds: [id],
      selectedNodeId: id,
    }),

  toggleNodeSelection: (id) => {
    const { selectedNodeIds } = get();

    if (selectedNodeIds.includes(id)) {
      const next = selectedNodeIds.filter((nodeId) => nodeId !== id);
      set({ selectedNodeIds: next, selectedNodeId: getFirstSelectedId(next) });
      return;
    }

    const next = [...selectedNodeIds, id];
    set({ selectedNodeIds: next, selectedNodeId: getFirstSelectedId(next) });
  },

  clearSelection: () =>
    set({
      selectedNodeIds: [],
      selectedNodeId: null,
    }),

  addText: () => {
    const { slides, currentSlideId } = get();
    get().saveHistory();

    const newNode: TextNode = {
      id: Date.now().toString(),
      type: "text",
      name: "Text",
      props: {
        text: "New Text",
      },
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        color: "#c60606",
        fontSize: 24,
      },
    };

    set({
      slides: slides.map((s) =>
        s.id === currentSlideId ? { ...s, nodes: [...s.nodes, newNode] } : s
      ),
    });
  },

  addImage: (src) => {
    const { slides, currentSlideId } = get();
    get().saveHistory();

    const newNode: ImageNode = {
      id: Date.now().toString(),
      type: "image",
      name: "Image",
      props: {
        src,
      },
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        borderRadius: 0,
      },
    };

    set({
      slides: slides.map((s) =>
        s.id === currentSlideId ? { ...s, nodes: [...s.nodes, newNode] } : s
      ),
    });
  },

  addButton: () => {
    const { slides, currentSlideId } = get();
    get().saveHistory();

    const newNode: ButtonNode = {
      id: Date.now().toString(),
      type: "button",
      name: "Button",
      props: {
        text: "Button",
        targetSlideId: "",
        transition: "fade",
      },
      style: {
        x: 100,
        y: 100,
        width: 150,
        height: 50,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        backgroundColor: "#9505ef",
        color: "#711111",
        borderRadius: 8,
        fontSize: 16,
      },
    };

    set({
      slides: slides.map((s) =>
        s.id === currentSlideId ? { ...s, nodes: [...s.nodes, newNode] } : s
      ),
    });
  },

  deleteSelectedNode: () => {
    const { slides, currentSlideId, selectedNodeIds } = get();
    const firstId = selectedNodeIds[0];
    if (!firstId) return;

    get().saveHistory();

    set({
      slides: slides.map((slide) =>
        slide.id === currentSlideId
          ? {
              ...slide,
              nodes: slide.nodes.filter((node) => node.id !== firstId),
            }
          : slide
      ),
      selectedNodeIds: [],
      selectedNodeId: null,
    });
  },

  duplicateSelectedNode: () => {
    const {
      slides,
      currentSlideId,
      selectedNodeIds,
    } = get();

    const firstId = selectedNodeIds[0];
    if (!firstId) return;

    get().saveHistory();

    set({
      slides: slides.map((slide) => {
        if (slide.id !== currentSlideId) return slide;

        const targetNode = slide.nodes.find((node) => node.id === firstId);
        if (!targetNode) return slide;

        const duplicatedNode: EditorNode = {
          ...structuredClone(targetNode),
          id: Date.now().toString(),
          style: {
            ...targetNode.style,
            x: targetNode.style.x + 20,
            y: targetNode.style.y + 20,
          },
        };

        return { ...slide, nodes: [...slide.nodes, duplicatedNode] };
      }),
    });
  },

  copySelectedNode: () => {
    const { slides, selectedNodeIds } = get();
    const firstId = selectedNodeIds[0];
    if (!firstId) return;

    const targetNode = slides.flatMap((s) => s.nodes).find((n) => n.id === firstId);
    if (!targetNode) return;

    set({ clipboardNode: structuredClone(targetNode) });
  },

  pasteNode: () => {
    const { clipboardNode, slides, currentSlideId } = get();
    if (!clipboardNode) return;

    get().saveHistory();

    set({
      slides: slides.map((slide) => {
        if (slide.id !== currentSlideId) return slide;

        const pastedNode: EditorNode = {
          ...structuredClone(clipboardNode),
          id: Date.now().toString(),
          style: {
            ...clipboardNode.style,
            x: clipboardNode.style.x + 30,
            y: clipboardNode.style.y + 30,
          },
        };

        return { ...slide, nodes: [...slide.nodes, pastedNode] };
      }),
    });
  },

  moveNodeUp: (id) => {
    get().saveHistory();
    const { slides, currentSlideId } = get();

    set({
      slides: slides.map((slide) => {
        if (slide.id !== currentSlideId) return slide;

        const index = slide.nodes.findIndex((node) => node.id === id);
        if (index === -1 || index === slide.nodes.length - 1) return slide;

        const nodes = [...slide.nodes];
        [nodes[index], nodes[index + 1]] = [nodes[index + 1], nodes[index]];
        return { ...slide, nodes };
      }),
    });
  },

  moveNodeDown: (id) => {
    get().saveHistory();
    const { slides, currentSlideId } = get();

    set({
      slides: slides.map((slide) => {
        if (slide.id !== currentSlideId) return slide;

        const index = slide.nodes.findIndex((node) => node.id === id);
        if (index <= 0) return slide;

        const nodes = [...slide.nodes];
        [nodes[index], nodes[index - 1]] = [nodes[index - 1], nodes[index]];
        return { ...slide, nodes };
      }),
    });
  },

  updateNode: (id, updates) => {
    get().saveHistory();
    const { slides, currentSlideId } = get();

    set({
      slides: slides.map((slide) => {
        if (slide.id !== currentSlideId) return slide;

        return {
          ...slide,
          nodes: slide.nodes.map((node): EditorNode => {
            if (node.id !== id) return node;

            const updatedStyle = {
              ...node.style,
              ...updates.style,
            };

            if (node.type === "text") {
              const nextText = (updates.props as Partial<TextNode["props"]>)?.text;
              const nextTargetSlideId =
                (updates.props as Partial<TextNode["props"]>)?.targetSlideId;

              return {
                ...node,
                name: updates.name ?? node.name,
                style: updatedStyle,
                props: {
                  ...node.props,
                  text: typeof nextText === "string" ? nextText : node.props.text,
                  targetSlideId:
                    nextTargetSlideId ?? node.props.targetSlideId,
                },
              };
            }

            if (node.type === "image") {
              const nextSrc = (updates.props as Partial<ImageNode["props"]>)?.src;
              const nextTargetSlideId =
                (updates.props as Partial<ImageNode["props"]>)?.targetSlideId;

              return {
                ...node,
                name: updates.name ?? node.name,
                style: updatedStyle,
                props: {
                  ...node.props,
                  src: typeof nextSrc === "string" ? nextSrc : node.props.src,
                  targetSlideId:
                    nextTargetSlideId ?? node.props.targetSlideId,
                },
              };
            }

            // button
            const nextButtonProps = updates.props as Partial<ButtonNode["props"]>;

            return {
              ...node,
              name: updates.name ?? node.name,
              style: updatedStyle,
              props: {
                ...node.props,
                text: typeof nextButtonProps?.text === "string" ? nextButtonProps.text : node.props.text,
                targetSlideId:
                  nextButtonProps?.targetSlideId ?? node.props.targetSlideId,
                transition:
                  nextButtonProps?.transition ?? node.props.transition,
              },
            };
          }),
        };
      }),
    });
  },

  exportProject: () => {
    const { slides } = get();
    return JSON.stringify(slides, null, 2);
  },

  importProject: (json) => {
    try {
      const parsed = JSON.parse(json) as SlideType[];
      set({
        slides: parsed,
        currentSlideId: parsed[0]?.id ?? "slide-1",
        selectedNodeIds: [],
        selectedNodeId: null,
      });
    } catch (error) {
      console.error("Import failed", error);
    }
  },
}));

