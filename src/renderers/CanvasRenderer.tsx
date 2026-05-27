import { Layer, Transformer } from "react-konva";

import { useEffect, useRef } from "react";

import { elementRegistry } from "../registry/elementRegistry";

import type {
  EditorNode,
} from "../types/editor";

interface Props {
  nodes: EditorNode[];
  setActiveTransition: (
  transition: string
) => void;
  selectedNodeId: string | null;

  selectNode: (
    id: string | null
  ) => void;

  updateNode: (
    id: string,
    updates: any
  ) => void;

  previewMode: boolean;

  setCurrentSlide: (
    id: string
  ) => void;
  
}

export default function CanvasRenderer({
  setActiveTransition,
  nodes,

  selectedNodeId,

  selectNode,

  updateNode,

  previewMode,

  setCurrentSlide,
  
}: Props) {
  const transformerRef =
    useRef<any>(null);

  const selectedNodeRef =
    useRef<any>(null);

  useEffect(() => {
    if (!selectedNodeId) {
      return;
    }

    const transformer = transformerRef.current;
    const selectedNode = selectedNodeRef.current;

    if (!transformer || !selectedNode) {
      return;
    }

    // Attach transformer to the selected konva node
    transformer.nodes([selectedNode]);
    transformer.getLayer()?.batchDraw();
  }, [selectedNodeId]);

  return (
    <Layer>
      {nodes.map((node) => {
        const registryItem =
          elementRegistry[
            node.type as keyof typeof elementRegistry
          ];

        if (!registryItem) {
          return null;
        }

        const Component =
          registryItem.component as any;

        const isSelected =
          selectedNodeId ===
          node.id;

        return (
          <Component
          setActiveTransition={
  setActiveTransition
}
            key={node.id}
            node={node}
            refProp={
              isSelected
                ? selectedNodeRef
                : null
            }
            isSelected={
              isSelected
            }
            previewMode={
              previewMode
            }
            setCurrentSlide={
              setCurrentSlide
            }
            onSelect={() =>
              selectNode(
                node.id
              )
            }
            onChange={(
              updates: any
            ) => {
              updateNode(
                node.id,
                updates
              );
            }}
          />
        );
      })}

      {selectedNodeId && (
        <Transformer
          ref={transformerRef}
        />
      )}
    </Layer>
  );
}