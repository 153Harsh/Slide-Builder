import Canvas from "./components/Canvas";

import { useEditorStore } from "./store/editorStore";

import { generateHTML } from "./utils/exportHtml";

import PropertyPanel from "./components/PropertyPanel";

import LayersPanel from "./components/LayersPanel";
import { useEffect } from "react";
// import { generateReactApp } from "./utils/generateReactApp";
import { generateViteProject } from "./utils/generateViteProject";

import {
  Eye,
  EyeOff,
  Download,
  Upload,
  Plus,
  Type,
  MousePointerClick,
  Trash2,
  ImageIcon,
  Sparkles,
} from "lucide-react";

export default function App() {
  const {
    slides,

    currentSlideId,

    selectedNodeId,

    previewMode,

    setPreviewMode,

    setCurrentSlide,

    addSlide,

    addText,

    addImage,

    addButton,

    deleteSelectedNode,
    
    updateNode,

    exportProject,
    duplicateSelectedNode,
    importProject,
    copySelectedNode,
pasteNode,
undo,
redo,
  } = useEditorStore();

  // --------------------
  // CURRENT SELECTED NODE
  // --------------------

  const selectedNode = slides
    .flatMap((slide) => slide.nodes)
    .find(
      (node) =>
        node.id === selectedNodeId
    );

  // --------------------
  // IMAGE UPLOAD
  // --------------------
  const handleExportViteProject =
  async () => {
    await generateViteProject(
      slides
    );
  };
// const handleExportReactApp =
//   () => {
//     const reactCode =
//       generateReactApp(
//         slides
//       );

//     const blob = new Blob(
//       [reactCode],
//       {
//         type: "text/javascript",
//       }
//     );

//     const url =
//       URL.createObjectURL(
//         blob
//       );

//     const a =
//       document.createElement(
//         "a"
//       );

//     a.href = url;

//     a.download = "App.jsx";

//     a.click();

//     URL.revokeObjectURL(
//       url
//     );
//   };
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      addImage(
        reader.result as string
      );
    };

    reader.readAsDataURL(file);
  };

  // --------------------
  // EXPORT PROJECT JSON
  // --------------------

  const handleExportProject =
    () => {
      const data =
        exportProject();

      const blob = new Blob(
        [data],
        {
          type: "application/json",
        }
      );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "project.json";

      a.click();

      URL.revokeObjectURL(
        url
      );
    };

  // --------------------
  // IMPORT PROJECT
  // --------------------

  const handleImportProject =
    (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) {
        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        importProject(
          reader.result as string
        );
      };

      reader.readAsText(file);
    };

  // --------------------
  // EXPORT WEBSITE
  // --------------------

  const handleExportWebsite =
    () => {
      const html =
        generateHTML(
          slides
        );

      const blob = new Blob(
        [html],
        {
          type: "text/html",
        }
      );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "index.html";

      a.click();

      URL.revokeObjectURL(
        url
      );
    };

  // --------------------
  // UPDATE BUTTON TARGET
  // --------------------

  const handleButtonTargetChange =
    (
      nodeId: string,
      targetSlideId: string
    ) => {
      updateNode(nodeId, {
        props: {
          targetSlideId,
        },
      });
    };
useEffect(() => {
  const handleKeyDown = (
    e: KeyboardEvent
  ) => {
//undo-redo
if (
  (e.ctrlKey || e.metaKey) &&
  e.key.toLowerCase() === "z"
) {
  e.preventDefault();

  undo();

  return;
}
if (
  (e.ctrlKey || e.metaKey) &&
  e.key.toLowerCase() === "y"
) {
  e.preventDefault();

  redo();

  return;
}


//copy paste
    if (
  (e.ctrlKey || e.metaKey) &&
  e.key.toLowerCase() === "c"
) {
  e.preventDefault();

  copySelectedNode();

  return;
}
if (
  (e.ctrlKey || e.metaKey) &&
  e.key.toLowerCase() === "v"
) {
  e.preventDefault();

  pasteNode();

  return;
}
    // DELETE

    if (
      e.key === "Delete" &&
      selectedNodeId
    ) {
      deleteSelectedNode();

      return;
    }

    // NO NODE

    if (!selectedNode) {
      return;
    }

    // MOVE AMOUNT

    const moveAmount =
      e.shiftKey ? 10 : 1;

    // CURRENT POSITION

    let newX =
      selectedNode.style.x;

    let newY =
      selectedNode.style.y;

    // ARROWS
if (
  (e.ctrlKey || e.metaKey) &&
  e.key.toLowerCase() === "d"
) {
  e.preventDefault();

  duplicateSelectedNode();

  return;
}
    switch (e.key) {
      case "ArrowUp":
        newY -= moveAmount;
        break;

      case "ArrowDown":
        newY += moveAmount;
        break;

      case "ArrowLeft":
        newX -= moveAmount;
        break;

      case "ArrowRight":
        newX += moveAmount;
        break;

      default:
        return;
    }

    // PREVENT PAGE SCROLL

    e.preventDefault();

    // UPDATE NODE

    updateNode(
      selectedNode.id,
      {
        style: {
          x: newX,
          y: newY,
        },
      }
    );
  };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, [
  selectedNode,

  selectedNodeId,

  updateNode,

  deleteSelectedNode,
]);
  return (
    <div className="w-screen h-screen flex overflow-hidden bg-[#0b0f19] text-white">

      {/* ========================= */}
      {/* LEFT SIDEBAR */}
      {/* ========================= */}

      <aside className="w-[200px] bg-[#111827] border-r border-white/10 flex flex-col">

        {/* LOGO */}

        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">

          <div>
            <h1 className="text-x font-bold flex items-center gap-2">
              <Sparkles
                size={20}
                className="text-blue-500"
              />

              Visual Builder
            </h1>

            <p className="text-xs text-gray-400 pl-8">
              React App Editor
            </p>
          </div>

        </div>

        {/* SIDEBAR CONTENT */}

        <div className="flex-1 overflow-y-auto p-1 space-y-3">

          {/* PREVIEW + EXPORT */}

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10 shadow-2xl">

            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
              Project
            </h2>

            <div className="space-y-3">

              {/* PREVIEW */}

              <button
                onClick={() =>
                  setPreviewMode(
                    !previewMode
                  )
                }
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium transition-all duration-200 hover:scale-[1.02]
                
                ${
                  previewMode
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {previewMode ? (
                  <>
                    <EyeOff size={18} />
                    Exit Preview
                  </>
                ) : (
                  <>
                    <Eye size={18} />
                    Preview
                  </>
                )}
              </button>

              {/* EXPORT PROJECT */}

              <button
                onClick={
                  handleExportProject
                }
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium bg-yellow-500 hover:bg-yellow-600 text-black transition-all duration-200 hover:scale-[1.02]"
              >
                <Download size={18} />

                Export Project
              </button>

              {/* EXPORT WEBSITE */}

              <button
                onClick={
                  handleExportWebsite
                }
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium bg-cyan-500 hover:bg-cyan-600 text-black transition-all duration-200 hover:scale-[1.02]"
              >
                <Download size={18} />

                Export Website
              </button>
              <button
  onClick={
    handleExportViteProject
  }
  className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl font-medium bg-blue-500 hover:bg-cyan-600 text-black transition-all duration-200 hover:scale-[1.02]"
  >
    <Download size={18} />
  Export React
</button>

              {/* IMPORT */}

              <label className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-medium bg-orange-500 hover:bg-orange-600 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                <Upload size={18} />

                Import Project

                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={
                    handleImportProject
                  }
                />
              </label>

            </div>

          </div>

          {/* SLIDES */}

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10 shadow-2xl">

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-sm uppercase tracking-wider text-gray-400">
                Slides
              </h2>

              <button
                onClick={
                  addSlide
                }
                className="w-9 h-9 rounded-xl bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <Plus size={18} />
              </button>

            </div>

            <div className="space-y-2">

              {slides.map(
                (slide) => (
                  <button
                    key={
                      slide.id
                    }

                    onClick={() =>
                      setCurrentSlide(
                        slide.id
                      )
                    }

                    className={`
                      w-full text-left px-4 py-3 rounded-2xl transition-all duration-200

                      ${
                        currentSlideId ===
                        slide.id
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : "bg-[#1b2230] text-gray-300 hover:bg-[#273244]"
                      }
                    `}
                  >
                    {slide.name}
                  </button>
                )
              )}

            </div>

          </div>

          {/* ELEMENTS */}

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10 shadow-2xl">

            <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
              Elements
            </h2>

            <div className="grid grid-cols-2 gap-2">

              {/* TEXT */}

              <button
                onClick={addText}
                className="bg-[#1b2230] hover:bg-[#283548] transition-all duration-200 hover:scale-[1.03] rounded-2xl py-3 flex flex-col items-center justify-center gap-1"
              >
                <Type size={20} />

                <span className="text-sm">
                  Text
                </span>
              </button>

              {/* BUTTON */}

              <button
                onClick={
                  addButton
                }
                className="bg-[#1b2230] hover:bg-[#283548] transition-all duration-200 hover:scale-[1.03] rounded-2xl py-3 flex flex-col items-center justify-center gap-1"
              >
                <MousePointerClick
                  size={20}
                />

                <span className="text-sm">
                  Button
                </span>
              </button>

              {/* IMAGE */}

              <label className="bg-[#1b2230] hover:bg-[#283548] transition-all duration-200 hover:scale-[1.03] rounded-2xl py-3 flex flex-col items-center justify-center gap-1 cursor-pointer">

                <ImageIcon size={20} />

                <span className="text-sm">
                  Image
                </span>

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    handleImageUpload
                  }
                />
              </label>

              {/* DELETE */}

              {selectedNodeId && (
                <button
                  onClick={
                    deleteSelectedNode
                  }
                  className="bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-[1.03] rounded-2xl py-3 flex flex-col items-center justify-center gap-1"
                >
                  <Trash2 size={20} />

                  <span className="text-sm">
                    Delete
                  </span>
                </button>
              )}

            </div>

          </div>

          {/* ELEMENT TARGET */}

          {(selectedNode?.type === "button" ||
            selectedNode?.type === "text" ||
            selectedNode?.type === "image") && (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-2 border border-white/10 shadow-2xl">

              <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                Target Slide
              </h2>

              <select
                className="w-full bg-[#1b2230] border border-white/10 p-3 rounded-2xl outline-none"

                value={
                  selectedNode
                    .props
                    .targetSlideId ??
                  ""
                }

                onChange={(
                  e
                ) =>
                  handleButtonTargetChange(
                    selectedNode.id,
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Target Slide
                </option>

                {slides.map(
                  (slide) => (
                    <option
                      key={
                        slide.id
                      }

                      value={
                        slide.id
                      }
                    >
                      {
                        slide.name
                      }
                    </option>
                  )
                )}

              </select>

            </div>
          )}

        </div>

      </aside>

      {/* ========================= */}
      {/* CENTER AREA */}
      {/* ========================= */}

      <main className="flex-1 flex flex-col">

        {/* CANVAS AREA */}

        <div className="flex-1 relative overflow-hidden bg-[#0b0f19]">

          {/* GRID */}

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(255,255,255,0.15) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,0.15) 1px,
                  transparent 1px
                )
              `,
              backgroundSize:
                "40px 40px",
            }}
          />

          {/* LAYERS */}

          <div className="absolute z-20 right-0 top-0 h-full justify-end w-[16%]">
            <div className="h-full">
              <LayersPanel />
            </div>
          </div>


          {/* CANVAS */}

          <div className="w-full h-full flex items-start justify-start relative z-10 p-2">

            <div className="bg-white shadow-2xl overflow-hidden w-[84%] h-[82%]">
  <Canvas />
</div>

          </div>

        </div>

      </main>

      {/* ========================= */}
      {/* RIGHT PANEL */}
      {/* ========================= */}


          <div >

            <PropertyPanel />

          </div>


    </div>
  );
}