import { Stage ,Layer, Rect} from "react-konva";
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
    selectedNodeIds,
    clearSelection,
    toggleNodeSelection,
    selectNode,
    updateNode,
    setActiveTransition,
    previewMode,
    setCurrentSlide,
    activeTransition,
    setSelectedNodes,
  } = useEditorStore();

  const currentSlide = slides.find((slide) => slide.id === currentSlideId);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [
  selectionRect,
  setSelectionRect,
] = useState({
  visible: false,

  x: 0,
  y: 0,

  width: 0,
  height: 0,
});

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
    // Only start drag-selection when the user clicks on the empty canvas area.
    // If the pointer is down on an existing Konva node, let that node handle selection.
    if (e.target !== e.target.getStage()) {
      return;
    }

    const pos = e.target.getStage()?.getPointerPosition();


    if (!pos) {
      return;
    }

    clearSelection();

    setSelectionRect({
      visible: true,

      x: pos.x,
      y: pos.y,

      width: 0,
      height: 0,
    });
  }}

  onMouseMove={(e) => {
    if (
      !selectionRect.visible
    ) {
      return;
    }

    const pos =
      e.target
        .getStage()
        ?.getPointerPosition();

    if (!pos) {
      return;
    }

    setSelectionRect(
      (prev) => ({
        ...prev,

        width:
          pos.x - prev.x,

        height:
          pos.y - prev.y,
      })
    );
  }}

  onMouseUp={() => {
  // FIND SELECTED NODES

  const selectedIds =
    (
      currentSlide?.nodes || []
    )
      .filter((node) => {
        const nodeX =
          node.style.x;

        const nodeY =
          node.style.y;

        const nodeWidth =
          node.style.width;

        const nodeHeight =
          node.style.height;

        const rectX =
          selectionRect.width >= 0
            ? selectionRect.x
            : selectionRect.x +
              selectionRect.width;

        const rectY =
          selectionRect.height >= 0
            ? selectionRect.y
            : selectionRect.y +
              selectionRect.height;

        const rectWidth =
          Math.abs(
            selectionRect.width
          );

        const rectHeight =
          Math.abs(
            selectionRect.height
          );

        // INTERSECTION CHECK

        return !(
          nodeX >
            rectX +
              rectWidth ||

          nodeX + nodeWidth <
            rectX ||

          nodeY >
            rectY +
              rectHeight ||

          nodeY + nodeHeight <
            rectY
        );
      })
      .map((node) => node.id);

  // SET MULTI SELECTION

  setSelectedNodes(
    selectedIds
  );

  // HIDE RECTANGLE

  setSelectionRect(
    (prev) => ({
      ...prev,

      visible: false,
    })
  );
}}
>
      <CanvasRenderer
        nodes={currentSlide?.nodes || []}
        selectedNodeIds={selectedNodeIds}
        selectNode={selectNode}
        setSelectedNodes={useEditorStore.getState().setSelectedNodes}
        updateNode={updateNode}
        toggleNodeSelection={toggleNodeSelection}
        clearSelection={clearSelection}
        previewMode={previewMode}
        setCurrentSlide={setCurrentSlide}
        setActiveTransition={setActiveTransition}
      />
      <Layer>
  {selectionRect.visible && (
    <Rect
      x={selectionRect.x}
      y={selectionRect.y}

      width={
        selectionRect.width
      }

      height={
        selectionRect.height
      }

      fill="rgba(59,130,246,0.2)"

      stroke="#3B82F6"

      dash={[4, 4]}
    />
  )}
</Layer>
 
      </Stage>
       </motion.div>
</AnimatePresence>
    </div>
  );
}


