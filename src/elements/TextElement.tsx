import { Text } from "react-konva";

import type {
  TextNode,
} from "../types/editor";

interface Props {
  node: TextNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refProp?: React.Ref<any>;

  previewMode: boolean;

  setCurrentSlide: (
    id: string
  ) => void;

  isSelected: boolean;

  onSelect: () => void;

  onChange: (
    updates: Partial<TextNode>
  ) => void;
}

export default function TextElement({
  node,

  previewMode,

  setCurrentSlide,

  refProp,

  onSelect,

  onChange,
}: Props) {
  return (
    <Text
      ref={refProp}

      text={node.props.text}

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

      rotation={
        node.style.rotation || 0
      }

      opacity={
        node.style.opacity || 1
      }

      fill={
        node.style.color || "#000000"
      }

      fontSize={
        node.style.fontSize || 24
      }

      draggable={!previewMode}

      onPointerClick={() => {
  if (
    previewMode &&
    node.props.targetSlideId
  ) {
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

            rotation:
              target.rotation(),
          },
        });
      }}
    />
  );
}