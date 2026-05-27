import React from "react";

import {
  Rect,
  Text,
} from "react-konva";

import type {
  ButtonNode,
} from "../types/editor";

interface Props {
  node: ButtonNode;

  previewMode: boolean;
  setActiveTransition: (
  transition: string
) => void;
  setCurrentSlide: (
    id: string
  ) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refProp?: React.Ref<any>;

  onSelect: () => void;

  onChange: (
    updates: Partial<ButtonNode>
  ) => void;
  
}

export default function ButtonElement({
  setActiveTransition,
  node,

  previewMode,

  setCurrentSlide,

  refProp,

  onSelect,

  onChange,
}: Props) {
  return (
    <React.Fragment>
      <Rect
      rotation={
  node.style.rotation || 0
}

opacity={
  node.style.opacity || 1
}




        ref={refProp}
        x={node.style.x}
        y={node.style.y}
        width={node.style.width}
        height={node.style.height}
        scaleX={
          node.style.scaleX || 1
        }
        scaleY={
          node.style.scaleY || 1
        }
       fill={
  node.style.backgroundColor ||
  "#3B82F6"
}

cornerRadius={
  node.style.borderRadius || 8
}
stroke={
  node.style.color ||
  "#000000"
}
strokeWidth={
  1
}
        draggable
        onClick={() => {
          if (
            previewMode &&
            node.props.targetSlideId
          ) {
            setActiveTransition(
  node.props.transition ||
    "fade"
);

setCurrentSlide(
  node.props.targetSlideId
);

            return;
          }

          onSelect();
        }}
        onTap={() => {
          if (
            previewMode &&
            node.props.targetSlideId
          ) {
           setActiveTransition(
  node.props.transition ||
    "fade"
);

setCurrentSlide(
  node.props.targetSlideId
);

            return;
          }

          onSelect();
        }}
        onDragEnd={(e) => {
          onChange({
            style: {
              ...node.style,

              x: e.target.x(),
              y: e.target.y(),
            },
          });
        }}
        onTransformEnd={(e) => {
          const target = e.target;

          const scaleX =
            target.scaleX();

          const scaleY =
            target.scaleY();

          const width =
            target.width() * scaleX;

          const height =
            target.height() * scaleY;

          target.scaleX(1);
          target.scaleY(1);

          onChange({
            style: {
              ...node.style,

              width,
              height,

              scaleX: 1,
              scaleY: 1,
            },
          });
        }}
      />

  <Text
  text={node.props.text}
  x={node.style.x}
  width={node.style.width}
  align="center"
  y={
    node.style.y +
    (node.style.height -
      (node.style.fontSize || 16)) /
      2
  }
  fill={
    node.style.color || "#ffffff"
  }

  fontSize={
    node.style.fontSize || 16
  }


  rotation={
    node.style.rotation || 0
  }

  opacity={
    node.style.opacity || 1
  }

  scaleX={
    node.style.scaleX || 1
  }

  scaleY={
    node.style.scaleY || 1
  }

  listening={false}
/>
    </React.Fragment>
  );
}