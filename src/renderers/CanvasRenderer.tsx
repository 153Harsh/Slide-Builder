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
  selectedNodeIds: string[];

  selectNode: (
  id: string
) => void;

setSelectedNodes: (
  ids: string[]
) => void;

toggleNodeSelection: (
  id: string
) => void;

clearSelection: () => void;

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

  selectedNodeIds,

  selectNode,

  updateNode,

  previewMode,

  setCurrentSlide,
  toggleNodeSelection,
  
}: Props) {
  const transformerRef =
    useRef<any>(null);

 const nodeRefs = useRef<
  Record<string, any>
>({});
    

  useEffect(() => {
  const transformer =
    transformerRef.current;

  if (!transformer) {
    return;
  }

  const selectedNodes =
    selectedNodeIds
      .map(
        (id) =>
          nodeRefs.current[id]
      )
      .filter(Boolean);

  transformer.nodes(
    selectedNodes
  );

  transformer
    .getLayer()
    ?.batchDraw();
}, [selectedNodeIds]);

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
  selectedNodeIds.includes(
    node.id
  );

        return (
          <Component
          setActiveTransition={
  setActiveTransition
}
            key={node.id}
            node={node}
            refProp={(ref: any) => {
  if (ref) {
    nodeRefs.current[
      node.id
    ] = ref;
  }
}}
            isSelected={
              isSelected
            }
            previewMode={
              previewMode
            }
            setCurrentSlide={
              setCurrentSlide
            }
            onSelect={(e: any) => {
  if (
    e?.evt?.shiftKey
  ) {
    toggleNodeSelection(
      node.id
    );
  } else {
    selectNode(node.id);
  }
}}
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

      {selectedNodeIds && (
        <Transformer
          ref={transformerRef}
        />
      )}
    </Layer>
  );
}