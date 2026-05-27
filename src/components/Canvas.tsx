import { Stage } from "react-konva";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useEditorStore } from "../store/editorStore";
import CanvasRenderer from "../renderers/CanvasRenderer";

export default function Canvas() {
  const {
    slides,
    currentSlideId,
    selectedNodeId,
    selectNode,
    updateNode,
    setActiveTransition,
    previewMode,
    setCurrentSlide,
    activeTransition
  } = useEditorStore();

  const currentSlide = slides.find((slide) => slide.id === currentSlideId);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      // guard against 0-sized container during layout
      setSize({
        width: Math.max(1, Math.floor(rect.width)),
        height: Math.max(1, Math.floor(rect.height)),
      });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      
        <AnimatePresence mode="wait">
  <motion.div
    key={currentSlideId}

    initial={
      activeTransition ===
      "fade"
        ? {
            opacity: 0,
          }
        : activeTransition ===
          "slide-left"
        ? {
            x: 300,
            opacity: 0,
          }
        : activeTransition ===
          "slide-right"
        ? {
            x: -300,
            opacity: 0,
          }
        : activeTransition ===
          "zoom"
        ? {
            scale: 0.8,
            opacity: 0,
          }
        : {}
    }

    animate={{
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
    }}

    exit={
      activeTransition ===
      "fade"
        ? {
            opacity: 0,
          }
        : activeTransition ===
          "slide-left"
        ? {
            x: -300,
            opacity: 0,
          }
        : activeTransition ===
          "slide-right"
        ? {
            x: 300,
            opacity: 0,
          }
        : activeTransition ===
          "zoom"
        ? {
            scale: 1.2,
            opacity: 0,
          }
        : {}
    }

    transition={{
      duration: 0.4,
    }}

    style={{
      width: "100%",
      height: "100%",
    }}
  >
    <Stage
        width={size.width}
        height={size.height}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) selectNode(null);
        }}
      >
    <CanvasRenderer
      nodes={
        currentSlide?.nodes ||
        []
      }

      selectedNodeId={
        selectedNodeId
      }

      selectNode={selectNode}

      updateNode={updateNode}

      previewMode={
        previewMode
      }

      setCurrentSlide={
        setCurrentSlide
      }

      setActiveTransition={
        setActiveTransition
      }
    />
 
      </Stage>
       </motion.div>
</AnimatePresence>
    </div>
  );
}


