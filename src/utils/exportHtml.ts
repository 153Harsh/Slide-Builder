import type { SlideType } from "../store/editorStore";

export function generateHTML(
  slides: SlideType[]
) {
  const slidesHTML = slides
    .map((slide, index) => {
      const elementsHTML =
        slide.elements
          .map((el) => {
            if (el.type === "text") {
              return `
                <div
                  style="
                    position:absolute;
                    left:${el.x}px;
                    top:${el.y}px;
                    font-size:24px;
                  "
                >
                  ${el.text}
                </div>
              `;
            }

            if (el.type === "image") {
              return `
                <img
                  src="${el.src}"
                  style="
                    position:absolute;
                    left:${el.x}px;
                    top:${el.y}px;
                    width:${el.width}px;
                    height:${el.height}px;
                  "
                />
              `;
            }

            if (el.type === "button") {
              return `
                <button
                  onclick="goToSlide('${el.targetSlideId}')"
                  style="
                    position:absolute;
                    left:${el.x}px;
                    top:${el.y}px;
                    width:${el.width}px;
                    height:${el.height}px;
                    background:#3B82F6;
                    color:white;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                  "
                >
                  ${el.text}
                </button>
              `;
            }

            return "";
          })
          .join("");

      return `
        <div
          class="slide"
          id="${slide.id}"
          style="
            display:${
              index === 0
                ? "block"
                : "none"
            };
          "
        >
          ${elementsHTML}
        </div>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <title>Exported App</title>

  <style>
    body {
      margin:0;
      overflow:hidden;
      font-family:sans-serif;
    }

    .slide {
      position:relative;
      width:100vw;
      height:100vh;
      background:#f3f4f6;
    }
  </style>
</head>

<body>

${slidesHTML}

<script>
  function goToSlide(id) {
    document
      .querySelectorAll(".slide")
      .forEach(slide => {
        slide.style.display = "none";
      });

    document.getElementById(id)
      .style.display = "block";
  }
</script>

</body>
</html>
`;
}