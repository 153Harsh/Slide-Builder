export type NodeStyle = {
  x: number;
  y: number;

  width: number;
  height: number;

  scaleX?: number;
  scaleY?: number;

  rotation?: number;

  opacity?: number;

  zIndex?: number;
  backgroundColor?: string;

color?: string;

fontSize?: number;

borderRadius?: number;
};

export type BaseNode = {
  id: string;

  type: string;

  name?: string;

  parentId?: string;

  children?: string[];

  props: Record<string, any>;

  style: NodeStyle;
};

export type TextNode = BaseNode & {
  type: "text";

  props: {
    text: string;
    targetSlideId?: string;
  };
};
export type ImageNode = BaseNode & {
  type: "image";

  props: {
    src: string;
    targetSlideId?: string;
  };
};
export type ButtonNode = BaseNode & {
  type: "button";

  props: {
    text: string;

    targetSlideId?: string;
    transition?: string;
  };
  
};
export type UpdateNodePayload = {
  style?: Partial<NodeStyle>;

  props?: Record<string, any>;

  name?: string;
};


export type EditorNode =
  | TextNode
  | ImageNode
  | ButtonNode;