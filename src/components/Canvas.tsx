import {
  Stage,
  Layer,
  Text,
  Transformer,
  Rect,
} from "react-konva";

import { useRef, useEffect } from "react";

import { useEditorStore } from "../store/editorStore";

import ImageElement from "./ImageElement";

export default function Canvas() {
  const {
    slides,
    currentSlideId,

    updateElementPosition,
    updateElementSize,
    
    selectedElementId,
    selectElement,
    setCurrentSlide,
previewMode,

  } = useEditorStore();

  const currentSlide = slides.find(
    (slide) =>
      slide.id === currentSlideId
  );

  const transformerRef = useRef<any>(null);

  const selectedNodeRef = useRef<any>(null);





  useEffect(() => {
    if (
      transformerRef.current &&
      selectedNodeRef.current
    ) {
      transformerRef.current.nodes([
        selectedNodeRef.current,
      ]);

      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId]);

  return (
    <Stage
      width={window.innerWidth - 256}
      height={window.innerHeight}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) {
          selectElement(null);
        }
      }}
    >
      <Layer>
        {currentSlide?.elements.map(
          (el) => {
            const isSelected =
              selectedElementId === el.id;

            if (el.type === "text") {
              return (
                <Text
                  key={el.id}
                  ref={
                    isSelected
                      ? selectedNodeRef
                      : null
                  }
                  text={el.text || ""}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  scaleX={el.scaleX}
                  scaleY={el.scaleY}
                  fontSize={24}
                  draggable
                  onClick={() =>
                    selectElement(el.id)
                  }
                  onTap={() =>
                    selectElement(el.id)
                  }
                  onDragEnd={(e) => {
                    updateElementPosition(
                      el.id,
                      e.target.x(),
                      e.target.y()
                    );
                  }}
                  onTransformEnd={(e) => {
                    const node: any = e.target as any;


                    updateElementSize(
                      el.id,
                      (node as any).width(),

                      (node as any).height(),
                      (node as any).scaleX(),
                      (node as any).scaleY()

                    );
                  }}
                />
              );
            }

            if (el.type === "image") {
              return (
                <ImageElement
                  key={el.id}
                  refProp={
                    isSelected
                      ? selectedNodeRef
                      : null
                  }
                  src={el.src || ""}
                  x={el.x}
                  y={el.y}
                  width={
                    el.width || 200
                  }
                  height={
                    el.height || 200
                  }
                  scaleX={
                    el.scaleX || 1
                  }
                  scaleY={
                    el.scaleY || 1
                  }
                  onClick={() =>
                    selectElement(el.id)
                  }
                  onDragEnd={(x, y) => {
                    updateElementPosition(
                      el.id,
                      x,
                      y
                    );
                  }}
                  onTransformEnd={(
                    node
                  ) => {
                    updateElementSize(
                      el.id,
                      (node as any).width(),
                      (node as any).height(),
                      (node as any).scaleX(),
                      (node as any).scaleY()
                    );
                  }}
                />
              );
            }
            if (el.type === "button") {
  return (
    <>
      <Rect
        ref={
          isSelected
            ? selectedNodeRef
            : null
        }
        x={el.x}
        y={el.y}
        width={el.width}
        height={el.height}
        fill="#3B82F6"
        cornerRadius={8}
        draggable
        scaleX={el.scaleX}
        scaleY={el.scaleY}
        onClick={() => {
  if (
    previewMode &&
    el.targetSlideId
  ) {
    setCurrentSlide(
      el.targetSlideId
    );

    return;
  }

  selectElement(el.id);
}}
        onTap={() => {
  if (
    previewMode &&
    el.targetSlideId
  ) {
    setCurrentSlide(
      el.targetSlideId
    );

    return;
  }

  selectElement(el.id);
}}
        onDragEnd={(e) => {
          updateElementPosition(
            el.id,
            e.target.x(),
            e.target.y()
          );
        }}
        onTransformEnd={(e) => {
          const node = e.target;

          updateElementSize(
            el.id,
            node.width(),
            node.height(),
            node.scaleX(),
            node.scaleY()
          );
        }}
      />

      <Text
        text={el.text || ""}
        x={el.x}
        y={el.y + 15}
        width={el.width}
        align="center"
        fill="white"
        listening={false}
      />
    </>
  );
}

            return null;
          }
        )}

        {selectedElementId && (
          <Transformer
            ref={transformerRef}
          />
        )}
        
      </Layer>
    </Stage>
  );
}