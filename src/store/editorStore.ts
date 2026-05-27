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

  // Backward-compat with existing UI/export code
}

interface EditorState {
  slides: SlideType[];
  clipboardNode: EditorNode | null;
  currentSlideId: string;

  selectedNodeId: string | null;

  previewMode: boolean;
  history: SlideType[][];

  future: SlideType[][];
  // --------------------
  // SLIDES
  // --------------------
  activeTransition: string;

  setActiveTransition: (transition: string) => void;

  addSlide: () => void;

  setCurrentSlide: (id: string) => void;

  // --------------------
  // NODES
  // --------------------

  addText: () => void;

  addImage: (src: string) => void;

  addButton: () => void;

  selectNode: (id: string | null) => void;

  deleteSelectedNode: () => void;

  duplicateSelectedNode: () => void;
  copySelectedNode: () => void;
  pasteNode: () => void;

  updateNode: (id: string, updates: UpdateNodePayload) => void;

  // --------------------
  // PREVIEW
  // --------------------

  setPreviewMode: (value: boolean) => void;

  // --------------------
  // EXPORT
  // --------------------

  exportProject: () => string;

  importProject: (json: string) => void;
  moveNodeUp: (id: string) => void;

  moveNodeDown: (id: string) => void;
  undo: () => void;

  redo: () => void;

  saveHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  slides: [
    {
      id: "slide-1",

      name: "Slide 1",

      nodes: [],
    },
  ],

  currentSlideId: "slide-1",

  selectedNodeId: null,
  history: [],
  activeTransition: "fade",
  future: [],
  previewMode: false,
  clipboardNode: null,
  // --------------------
  // ADD SLIDE
  // --------------------

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
  setActiveTransition: (transition) =>
    set({
      activeTransition: transition,
    }),
  //undo-redo
  saveHistory: () => {
    const { slides, history } = get();

    set({
      history: [...history, structuredClone(slides)],

      future: [],
    });
  },
  undo: () => {
    const { history, slides, future } = get();

    if (history.length === 0) {
      return;
    }

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

    if (future.length === 0) {
      return;
    }

    const next = future[0];

    const newFuture = future.slice(1);

    set({
      slides: next,

      future: newFuture,

      history: [...history, structuredClone(slides)],
    });
  },

  //duplicate copy paste
  duplicateSelectedNode: () => {
    get().saveHistory();
    const { slides, currentSlideId, selectedNodeId } = get();

    if (!selectedNodeId) {
      return;
    }

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      const targetNode = slide.nodes.find((node) => node.id === selectedNodeId);

      if (!targetNode) {
        return slide;
      }

      const duplicatedNode = {
        ...targetNode,

        id: Date.now().toString(),

        style: {
          ...targetNode.style,

          x: targetNode.style.x + 20,

          y: targetNode.style.y + 20,
        },
      };

      return {
        ...slide,

        nodes: [...slide.nodes, duplicatedNode],
      };
    });

    set({
      slides: updatedSlides,
    });
  },
  copySelectedNode: () => {
    const { slides, selectedNodeId } = get();

    if (!selectedNodeId) {
      return;
    }

    const targetNode = slides
      .flatMap((slide) => slide.nodes)
      .find((node) => node.id === selectedNodeId);

    if (!targetNode) {
      return;
    }

    set({
      clipboardNode: structuredClone(targetNode),
    });
  },
  pasteNode: () => {
    get().saveHistory();
    const {
      clipboardNode,

      slides,

      currentSlideId,
    } = get();

    if (!clipboardNode) {
      return;
    }

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      const pastedNode = {
        ...structuredClone(clipboardNode),

        id: Date.now().toString(),

        style: {
          ...clipboardNode.style,

          x: clipboardNode.style.x + 30,

          y: clipboardNode.style.y + 30,
        },
      };

      return {
        ...slide,

        nodes: [...slide.nodes, pastedNode],
      };
    });

    set({
      slides: updatedSlides,
    });
  },
  //layer
  moveNodeUp: (id) => {
    get().saveHistory();
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      const index = slide.nodes.findIndex((node) => node.id === id);

      if (index === -1 || index === slide.nodes.length - 1) {
        return slide;
      }

      const nodes = [...slide.nodes];

      [nodes[index], nodes[index + 1]] = [nodes[index + 1], nodes[index]];

      return {
        ...slide,
        nodes,
      };
    });

    set({
      slides: updatedSlides,
    });
  },
  moveNodeDown: (id) => {
    get().saveHistory();
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      const index = slide.nodes.findIndex((node) => node.id === id);

      if (index <= 0) {
        return slide;
      }

      const nodes = [...slide.nodes];

      [nodes[index], nodes[index - 1]] = [nodes[index - 1], nodes[index]];

      return {
        ...slide,
        nodes,
      };
    });

    set({
      slides: updatedSlides,
    });
  },
  // --------------------
  // SET CURRENT SLIDE
  // --------------------

  setCurrentSlide: (id) =>
    set({
      currentSlideId: id,

      selectedNodeId: null,
    }),

  // --------------------
  // PREVIEW MODE
  // --------------------

  setPreviewMode: (value) =>
    set({
      previewMode: value,

      selectedNodeId: null,
    }),

  // --------------------
  // ADD TEXT NODE
  // --------------------

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

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      return {
        ...slide,

        nodes: [...slide.nodes, newNode],
      };
    });

    set({
      slides: updatedSlides,
    });
  },

  // --------------------
  // ADD IMAGE NODE
  // --------------------

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

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      return {
        ...slide,

        nodes: [...slide.nodes, newNode],
      };
    });

    set({
      slides: updatedSlides,
    });
  },

  // --------------------
  // ADD BUTTON NODE
  // --------------------

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

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      return {
        ...slide,

        nodes: [...slide.nodes, newNode],
      };
    });

    set({
      slides: updatedSlides,
    });
  },

  // --------------------
  // SELECT NODE
  // --------------------

  selectNode: (id) =>
    set({
      selectedNodeId: id,
    }),

  // --------------------
  // DELETE NODE
  // --------------------

  deleteSelectedNode: () => {
    get().saveHistory();
    const { slides, currentSlideId, selectedNodeId } = get();

    if (!selectedNodeId) {
      return;
    }

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      return {
        ...slide,

        nodes: slide.nodes.filter((node) => node.id !== selectedNodeId),
      };
    });

    set({
      slides: updatedSlides,

      selectedNodeId: null,
    });
  },

  // --------------------
  // UPDATE NODE
  // --------------------

  updateNode: (id, updates) => {
    get().saveHistory();
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) {
        return slide;
      }

      return {
        ...slide,

        nodes: slide.nodes.map((node): EditorNode => {
          if (node.id !== id) {
            return node;
          }

          const updatedStyle = {
            ...node.style,

            ...updates.style,
          };

          // --------------------
          // TEXT NODE
          // --------------------

          if (node.type === "text") {
            const nextText = (updates.props as Partial<TextNode["props"]>)
              ?.text;

            return {
              ...node,

              name: updates.name ?? node.name,

              style: updatedStyle,

              props: {
                ...node.props,

                text: typeof nextText === "string" ? nextText : node.props.text,

                targetSlideId:
                  (updates.props as Partial<TextNode["props"]>)
                    ?.targetSlideId ?? node.props.targetSlideId,
              },
            };
          }

          // --------------------
          // IMAGE NODE
          // --------------------
          else if (node.type === "image") {
            const nextSrc = (updates.props as Partial<ImageNode["props"]>)?.src;

            return {
              ...node,

              name: updates.name ?? node.name,

              style: updatedStyle,

              props: {
                ...node.props,

                src: typeof nextSrc === "string" ? nextSrc : node.props.src,

                targetSlideId:
                  (updates.props as Partial<ImageNode["props"]>)
                    ?.targetSlideId ?? node.props.targetSlideId,
              },
            };
          }

          // --------------------
          // BUTTON NODE
          // --------------------
          else {
            const nextButtonProps = updates.props as Partial<
              ButtonNode["props"]
            >;

            return {
              ...node,

              name: updates.name ?? node.name,

              style: updatedStyle,

              props: {
                ...node.props,

                text:
                  typeof nextButtonProps?.text === "string"
                    ? nextButtonProps.text
                    : node.props.text,

                targetSlideId:
                  nextButtonProps?.targetSlideId ?? node.props.targetSlideId,
                transition:
                  nextButtonProps?.transition ?? node.props.transition,
              },
            };
          }
        }),
      };
    });

    set({
      slides: updatedSlides,
    });
  },

  // --------------------
  // EXPORT PROJECT
  // --------------------

  exportProject: () => {
    const { slides } = get();

    return JSON.stringify(slides, null, 2);
  },

  // --------------------
  // IMPORT PROJECT
  // --------------------

  importProject: (json) => {
    try {
      const parsed = JSON.parse(json);

      set({
        slides: parsed,
      });
    } catch (error) {
      console.error("Import failed", error);
    }
  },
}));
