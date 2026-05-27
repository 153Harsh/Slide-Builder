import Canvas from "./components/Canvas";

import { useEditorStore } from "./store/editorStore";
import { generateHTML } from "./utils/exportHtml";
export default function App() {
  const {
    slides,

    currentSlideId,
    exportProject,
importProject,
    setCurrentSlide,

    addSlide,

    addText,
    updateButtonTarget,
    addImage,
    addButton,
    previewMode,
setPreviewMode,
    deleteSelected,

    selectedElementId,
  } = useEditorStore();
  

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      addImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };
  const selectedElement = slides
  .flatMap((slide) => slide.elements)
  .find(
    (el) =>
      el.id === selectedElementId
  );
const handleExport = () => {
  const data = exportProject();

  const blob = new Blob(
    [data],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "project.json";

  a.click();

  URL.revokeObjectURL(url);
};
const handleImport = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file =
    e.target.files?.[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload = () => {
    importProject(
      reader.result as string
    );
  };

  reader.readAsText(file);
};
const handleExportWebsite = () => {
  const html = generateHTML(slides);

  const blob = new Blob(
    [html],
    {
      type: "text/html",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "index.html";

  a.click();

  URL.revokeObjectURL(url);
};
  return (
    <div className="w-screen h-screen flex">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
        
        <h1 className="text-2xl font-bold mb-4">
          Slide Builder
        </h1>
<button
  onClick={() =>
    setPreviewMode(
      !previewMode
    )
  }
  className={`w-full mb-4 px-4 py-2 rounded ${
    previewMode
      ? "bg-red-500"
      : "bg-green-500"
  }`}
>
  {previewMode
    ? "Exit Preview"
    : "Preview Mode"}
</button>
<button
  onClick={handleExport}
  className="w-full bg-yellow-500 px-4 py-2 rounded mb-2"
>
  Export Project
</button>
<button
  onClick={handleExportWebsite}
  className="w-full bg-cyan-500 px-4 py-2 rounded mb-2"
>
  Export Website
</button>
<label className="w-full bg-orange-500 px-4 py-2 rounded mb-4 cursor-pointer text-center block">
  Import Project

  <input
    type="file"
    hidden
    accept=".json"
    onChange={handleImport}
  />
</label>
        {/* Slides */}
        <div className="mb-6">
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">
              Slides
            </h2>

            <button
              onClick={addSlide}
              className="bg-green-500 px-2 py-1 rounded"
            >
              +
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() =>
                  setCurrentSlide(
                    slide.id
                  )
                }
                className={`p-2 rounded text-left ${
                  currentSlideId ===
                  slide.id
                    ? "bg-blue-500"
                    : "bg-gray-700"
                }`}
              >
                {slide.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-3">
          
          <button
            onClick={addText}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Add Text
          </button>
          <button
  onClick={addButton}
  className="bg-purple-500 px-4 py-2 rounded"
>
  Add Button
</button>

          <label className="bg-green-500 px-4 py-2 rounded cursor-pointer text-center">
            Upload Image

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          {selectedElementId && (
            <button
              onClick={deleteSelected}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Delete Selected
            </button>
          )}
          {selectedElement?.type ===
  "button" && (
  <select
    className="bg-gray-700 p-2 rounded"
    value={
      selectedElement.targetSlideId ||
      ""
    }
    onChange={(e) =>
      updateButtonTarget(
        selectedElement.id,
        e.target.value
      )
    }
  >
    <option value="">
      Select Target Slide
    </option>

    {slides.map((slide) => (
      <option
        key={slide.id}
        value={slide.id}
      >
        {slide.name}
      </option>
    ))}
  </select>
)}
        </div>
      </div>

      {/* CANVAS */}
      <div className="flex-1 bg-gray-200">
        <Canvas />
      </div>
    </div>
  );
}