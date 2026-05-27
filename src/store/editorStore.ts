import { create } from "zustand";

type ElementId = string;

type ElementType = "text" | "image" | "button";

export interface ElementBase {
  id: ElementId;
  type: ElementType;
  x: number;
  y: number;

  width?: number;
  height?: number;
  scaleX?: number;
  scaleY?: number;
  
}

export interface TextElement extends ElementBase {
  type: "text";
  text?: string;
}

export interface ImageElementType extends ElementBase {
  type: "image";
  src?: string;
}

export interface ButtonElement extends ElementBase {
  type: "button";
  text?: string;
  targetSlideId?: string;
}

export type ElementTypeUnion = TextElement | ImageElementType | ButtonElement;

export interface SlideType {
  id: string;
  name: string;
  elements: ElementTypeUnion[];
}

interface EditorState {
  slides: SlideType[];
  currentSlideId: string;
  selectedElementId: string | null;
  addSlide: () => void;

  setCurrentSlide: (id: string) => void;

  addText: () => void;
  addImage: (src: string) => void;
  addButton: () => void;

  selectElement: (id: string | null) => void;
  deleteSelected: () => void;

  updateElementPosition: (id: string, x: number, y: number) => void;
  updateElementSize: (
    id: string,
    width: number,
    height: number,
    scaleX: number,
    scaleY: number
  ) => void;

  updateButtonTarget: (id: string, targetSlideId: string) => void;

  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
  exportProject: () => string;

importProject: (
  json: string
) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  slides: [
    {
      id: "slide-1",
      name: "Slide 1",
      elements: [],
    },
  ],

  currentSlideId: "slide-1",
  selectedElementId: null,
  previewMode: false,

  addSlide: () =>
    set((state) => ({
      slides: [
        ...state.slides,
        {
          id: `slide-${Date.now()}`,
          name: `Slide ${state.slides.length + 1}`,
          elements: [],
        },
      ],
    })),

  setCurrentSlide: (id) =>
    set({
      currentSlideId: id,
      selectedElementId: null,
    }),

  setPreviewMode: (value) =>
    set({
      previewMode: value,
      selectedElementId: null,
    }),

  addText: () => {
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            id: Date.now().toString(),
            type: "text" as const,
            x: 100,
            y: 100,
            width: 150,
            height: 40,
            scaleX: 1,
            scaleY: 1,
            text: "New Text",
          },
        ],
      };
    });

    set({ slides: updatedSlides });
  },

  addImage: (src) => {
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            id: Date.now().toString(),
            type: "image" as const,
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            scaleX: 1,
            scaleY: 1,
            src,
          },
        ],
      };
    });

    set({ slides: updatedSlides });
  },

  addButton: () => {
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: [
          ...slide.elements,
          {
            id: Date.now().toString(),
            type: "button" as const,
            x: 100,
            y: 100,
            width: 150,
            height: 50,
            scaleX: 1,
            scaleY: 1,
            text: "Button",
          },
        ],
      };
    });

    set({ slides: updatedSlides });
  },

  selectElement: (id) => set({ selectedElementId: id }),

  deleteSelected: () => {
    const { slides, currentSlideId, selectedElementId } = get();

    if (!selectedElementId) return;

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: slide.elements.filter((el) => el.id !== selectedElementId),
      };
    });

    set({ slides: updatedSlides, selectedElementId: null });
  },

  updateElementPosition: (id, x, y) => {
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: slide.elements.map((el) =>
          el.id === id
            ? {
                ...el,
                x,
                y,
              }
            : el
        ),
      };
    });

    set({ slides: updatedSlides });
  },

  updateElementSize: (id, width, height, scaleX, scaleY) => {
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: slide.elements.map((el) =>
          el.id === id
            ? {
                ...el,
                width,
                height,
                scaleX,
                scaleY,
              }
            : el
        ),
      };
    });

    set({ slides: updatedSlides });
  },

  updateButtonTarget: (id, targetSlideId) => {
    const { slides, currentSlideId } = get();

    const updatedSlides = slides.map((slide) => {
      if (slide.id !== currentSlideId) return slide;

      return {
        ...slide,
        elements: slide.elements.map((el) =>
          el.id === id
            ? {
                ...el,
                targetSlideId,
                type: "button" as const,
              }
            : el

        ),

      };
    });

    set({ slides: updatedSlides });
  },
  exportProject: () => {
  const state = get();

  return JSON.stringify(
    {
      slides: state.slides,
    },
    null,
    2
  );
},

importProject: (json) => {
  try {
    const parsed = JSON.parse(json);

    set({
      slides: parsed.slides,

      currentSlideId:
        parsed.slides[0]?.id ||
        "slide-1",

      selectedElementId: null,
    });
  } catch (error) {
    console.error(
      "Invalid project file",
      error
    );
  }
},
}));

