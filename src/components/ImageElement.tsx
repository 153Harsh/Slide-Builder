import { Image } from "react-konva";

import useImage from "use-image";

interface Props {
  src: string;

  x: number;
  y: number;

  width: number;
  height: number;

  scaleX: number;
  scaleY: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refProp: React.Ref<any>;












  onClick: () => void;

  onDragEnd: (
    x: number,
    y: number
  ) => void;

  onTransformEnd: (node: unknown) => void;



}


export default function ImageElement({
  src,

  x,
  y,

  width,
  height,

  scaleX,
  scaleY,

  refProp,

  onClick,

  onDragEnd,

  onTransformEnd,
}: Props) {
  const [image] = useImage(src);

  return (
    <Image
      ref={refProp}
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      scaleX={scaleX}
      scaleY={scaleY}
      draggable
      onClick={onClick}
      onTap={onClick}
      onDragEnd={(e) => {
        onDragEnd(
          e.target.x(),
          e.target.y()
        );
      }}
      onTransformEnd={(e) => {
        onTransformEnd(e.target);
      }}
    />
  );
}