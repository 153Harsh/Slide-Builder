import { Image } from "react-konva";

import useImage from "use-image";

import type {
  ImageNode,
} from "../types/editor";

interface Props {
  node: ImageNode;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refProp?: React.Ref<any>;

  previewMode: boolean;

  setCurrentSlide: (
    id: string
  ) => void;

  onSelect: () => void;

  onChange: (
    updates: Partial<ImageNode>
  ) => void;
}

export default function ImageElement({
  node,

  refProp,

  previewMode,

  setCurrentSlide,

  onSelect,

  onChange,
}: Props) {
  const [image] = useImage(
    node.props.src
  );

  return (
    <Image
      ref={refProp}
      image={image}
      x={node.style.x}
      y={node.style.y}
      width={node.style.width}
      height={node.style.height}
      scaleX={node.style.scaleX || 1}
      scaleY={node.style.scaleY || 1}
      draggable
      rotation={
        node.style.rotation || 0
      }
      opacity={
        node.style.opacity || 1
      }
      onClick={() => {
        if (
          previewMode &&
          typeof node.props.targetSlideId === "string" &&
          node.props.targetSlideId.trim()
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
          },
        });
      }}
    />
  );
}

