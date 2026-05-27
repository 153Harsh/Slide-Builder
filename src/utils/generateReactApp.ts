import type {
  SlideType,
} from "../store/editorStore";

function escapeText(
  text: string
) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$");
}

function clean(
  value?: number
) {
  return Number(
    (value || 0).toFixed(2)
  );
}

export function generateReactApp(
  slides: SlideType[]
) {
  if (slides.length === 0) {
    return "";
  }

  // --------------------
  // GENERATE SLIDES JSX
  // --------------------

  const slidesCode = slides
    .map((slide) => {
      const elementsCode =
        slide.nodes
          .map((node) => {
            // --------------------
            // TEXT
            // --------------------

            if (
              node.type === "text"
            ) {
              return `
{
  currentSlide === "${slide.id}" && (
    <div
      style={{
        position: "absolute",

        left: ${clean(
          node.style.x
        )},

        top: ${clean(
          node.style.y
        )},

        width: ${clean(
          node.style.width
        )},

        height: ${clean(
          node.style.height
        )},

        color: "${
          node.style.color ||
          "#000000"
        }",

        fontSize: ${
          node.style.fontSize ||
          24
        },

        transform:
          "rotate(${
            node.style.rotation ||
            0
          }deg)",

        opacity: ${
          node.style.opacity ||
          1
        },
      }}
    >
      ${escapeText(
        node.props.text
      )}
    </div>
  )
}
`;
            }

            // --------------------
            // IMAGE
            // --------------------

            if (
              node.type === "image"
            ) {
              return `
{
  currentSlide === "${slide.id}" && (
    <img
      src="${
        node.props.src
      }"

      style={{
        position: "absolute",

        left: ${clean(
          node.style.x
        )},

        top: ${clean(
          node.style.y
        )},

        width: ${clean(
          node.style.width
        )},

        height: ${clean(
          node.style.height
        )},

        objectFit: "cover",

        transform:
          "rotate(${
            node.style.rotation ||
            0
          }deg)",

        opacity: ${
          node.style.opacity ||
          1
        },
      }}
    />
  )
}
`;
            }

            // --------------------
            // BUTTON
            // --------------------

            if (
              node.type === "button"
            ) {
              return `
{
  currentSlide === "${slide.id}" && (
    <button
      onClick={() => {
        ${
          node.props
            .targetSlideId
            ? `setCurrentSlide("${node.props.targetSlideId}")`
            : ""
        }
      }}

      style={{
        position: "absolute",

        left: ${clean(
          node.style.x
        )},

        top: ${clean(
          node.style.y
        )},

        width: ${clean(
          node.style.width
        )},

        height: ${clean(
          node.style.height
        )},

        background: "${
          node.style
            .backgroundColor ||
          "#3B82F6"
        }",

        color: "${
          node.style.color ||
          "#ffffff"
        }",

        border: "none",

        borderRadius: ${
          node.style
            .borderRadius || 8
        },

        fontSize: ${
          node.style.fontSize ||
          16
        },

        cursor: "pointer",

        transform:
          "rotate(${
            node.style.rotation ||
            0
          }deg)",

        opacity: ${
          node.style.opacity ||
          1
        },
      }}
    >
      ${escapeText(
        node.props.text
      )}
    </button>
  )
}
`;
            }

            return "";
          })
          .join("\n");

      return elementsCode;
    })
    .join("\n");

  // --------------------
  // FINAL APP
  // --------------------

  return `
import { useState } from "react";

export default function App() {

  const [currentSlide, setCurrentSlide] =
    useState("${slides[0].id}");

  return (
    <div
      style={{
        width: "100vw",

        height: "100vh",

        position: "relative",

        overflow: "hidden",

        background: "#f3f4f6",
      }}
    >
      ${slidesCode}
    </div>
  );
}
`;
}