import type { SlideType } from "../store/editorStore";

function escapeHTML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str: string) {
  return escapeHTML(str);
}

export function generateHTML(slides: SlideType[]) {
  const slidesHTML = slides
    .map((slide, index) => {
      const nodeHTML = slide.nodes
        .map((node) => {
          // --------------------
          // TEXT NODE
          // --------------------
          if (node.type === "text") {
            const color = node.style.color ?? "#000000";
            const fontSize = node.style.fontSize ?? 24;
            const rotation = node.style.rotation ?? 0;
            const opacity = node.style.opacity ?? 1;
            const zIndex = node.style.zIndex ?? 1;

            const target =
              typeof node.props.targetSlideId === "string"
                ? node.props.targetSlideId
                : "";
            const hasTarget = target.trim().length > 0;

            return `
              <div
                role="button"
                tabindex="0"
                ${
                  hasTarget
                    ? `onclick="goToSlide('${escapeAttr(target)}')"`
                    : ""
                }
                style="
                  position:absolute;

                  left:${node.style.x}px;
                  top:${node.style.y}px;

                  width:${node.style.width}px;
                  height:${node.style.height}px;

                  color:${color};
                  font-size:${fontSize}px;
                  line-height:1.15;

                  transform:rotate(${rotation}deg);
                  transform-origin:top left;

                  opacity:${opacity};
                  z-index:${zIndex};

                  overflow:hidden;
                  word-break:break-word;
                  white-space:pre-wrap;
                  display:block;
                  text-align:left;

                  cursor:${hasTarget ? "pointer" : "default"};
                  user-select:none;
                  pointer-events:${hasTarget ? "auto" : "none"};
                "
              >
                ${escapeHTML(node.props.text ?? "")}
              </div>
            `;
          }

          // --------------------
          // IMAGE NODE
          // --------------------
          if (node.type === "image") {
            const rotation = node.style.rotation ?? 0;
            const opacity = node.style.opacity ?? 1;
            const zIndex = node.style.zIndex ?? 1;
            const borderRadius = node.style.borderRadius ?? 0;

            const target =
              typeof node.props.targetSlideId === "string"
                ? node.props.targetSlideId
                : "";
            const hasTarget = target.trim().length > 0;

            return `
              <img
                src="${escapeAttr(node.props.src ?? "")}" 
                draggable="false"
                alt=""
                role="button"
                tabindex="0"
                ${hasTarget ? `onclick="goToSlide('${escapeAttr(target)}')"` : ""}
                style="
                  position:absolute;

                  left:${node.style.x}px;
                  top:${node.style.y}px;

                  width:${node.style.width}px;
                  height:${node.style.height}px;

                  transform:rotate(${rotation}deg);
                  transform-origin:top left;

                  opacity:${opacity};
                  z-index:${zIndex};

                  border-radius:${borderRadius}px;
                  object-fit:cover;

                  cursor:${hasTarget ? "pointer" : "default"};
                  pointer-events:${hasTarget ? "auto" : "none"};
                  user-select:none;
                "
              />
            `;
          }

          // --------------------
          // BUTTON NODE
          // --------------------
          if (node.type === "button") {
            const rotation = node.style.rotation ?? 0;
            const opacity = node.style.opacity ?? 1;
            const zIndex = node.style.zIndex ?? 1;
            const borderRadius = node.style.borderRadius ?? 8;

            const bg = node.style.backgroundColor ?? "#3B82F6";
            const color = node.style.color ?? "#ffffff";
            const fontSize = node.style.fontSize ?? 16;

            const target =
              typeof node.props.targetSlideId === "string"
                ? node.props.targetSlideId
                : "";
            const hasTarget = target.trim().length > 0;

            return `
              <button
                ${hasTarget ? `onclick="goToSlide('${escapeAttr(target)}')"` : "disabled"}
                style="
                  position:absolute;

                  left:${node.style.x}px;
                  top:${node.style.y}px;

                  width:${node.style.width}px;
                  height:${node.style.height}px;

                  background:${bg};
                  color:${color};

                  border:none;
                  border-radius:${borderRadius}px;

                  cursor:${hasTarget ? "pointer" : "default"};
                  pointer-events:${hasTarget ? "auto" : "none"};

                  font-size:${fontSize}px;

                  display:flex;
                  align-items:center;
                  justify-content:center;

                  transform:rotate(${rotation}deg);
                  transform-origin:top left;

                  opacity:${opacity};
                  z-index:${zIndex};

                  user-select:none;
                "
              >
                ${escapeHTML(node.props.text ?? "")}
              </button>
            `;
          }

          return "";
        })
        .join("");

      return `
        <div
          class="slide"
          id="${escapeAttr(slide.id)}"
          style="
            display:${index === 0 ? "block" : "none"};

            position:relative;
            width:100vw;
            height:100vh;

            overflow:hidden;
          "
        >
          ${nodeHTML}
        </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Exported App</title>

  <style>
    * { box-sizing:border-box; }

    html, body {
      margin:0;
      width:100%;
      height:100%;

      overflow:hidden;

      font-family:Arial, sans-serif;
      background:#f3f4f6;
    }

    #app {
      width:100vw;
      height:100vh;
    }

    .slide { background:#f3f4f6; }

    button:hover { opacity:0.9; }
    button:disabled { opacity:0.65; }
  </style>
</head>

<body>
  <div id="app">
    ${slidesHTML}
  </div>

  <script>
    function goToSlide(id) {
      document.querySelectorAll('.slide').forEach((s) => {
        s.style.display = 'none';
      });

      const target = document.getElementById(id);
      if (target) target.style.display = 'block';
    }
  </script>
</body>

</html>
`;
}

