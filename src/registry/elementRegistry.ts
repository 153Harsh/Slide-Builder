import TextElement from "../elements/TextElement";

import ImageElement from "../elements/ImageElement";

import ButtonElement from "../elements/ButtonElement";

export const elementRegistry = {
  text: {
    component: TextElement,
  },

  image: {
    component: ImageElement,
  },

  button: {
    component: ButtonElement,
  },
};