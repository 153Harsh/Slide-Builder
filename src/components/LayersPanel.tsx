import { ChevronUp, ChevronDown, Layers3 } from "lucide-react";

import { useEditorStore } from "../store/editorStore";

export default function LayersPanel() {
  const {
    slides,

    currentSlideId,

    moveNodeUp,

    moveNodeDown,

    selectedNodeId,

    selectNode,
  } = useEditorStore();

  // CURRENT SLIDE

  const currentSlide = slides.find(
    (slide) =>
      slide.id === currentSlideId
  );

  return (
    <div className="w-[230px] h-full bg-[#111827] border-r border-white/10 overflow-y-auto">

      {/* HEADER */}

      <div className="sticky top-0 z-10 bg-[#111827]/90 backdrop-blur-xl border-b border-white/10 px-4 py-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">

            <Layers3
              size={20}
              className="text-blue-400"
            />

          </div>

          <div>

            <h2 className="text-sm uppercase tracking-wider text-gray-400">
              Layers
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Manage slide elements
            </p>

          </div>

        </div>

      </div>

      {/* LAYERS LIST */}

      <div className="p-2 space-y-2">

        {currentSlide?.nodes.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">

            <p className="text-sm text-gray-400">
              No layers added yet
            </p>

          </div>
        )}

        {currentSlide?.nodes.map(
          (node, index) => {
            const isSelected =
              selectedNodeId ===
              node.id;

            return (
              <div
                key={node.id}
                className={`
                  rounded-2xl
                  border
                  transition-all
                  duration-200
                  overflow-hidden

                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                  }
                `}
              >

                {/* LAYER BUTTON */}

                <button
                  onClick={() =>
                    selectNode(
                      node.id
                    )
                  }
                  className="w-full p-2 text-left transition-all duration-200"
                >

                  <div className="flex items-start justify-between gap-3">

                    {/* LEFT */}

                    <div className="flex-1 min-w-0">

                      <div className="flex items-center gap-2">

                        <div
                          className={`
                            w-2 h-2 rounded-full

                            ${
                              isSelected
                                ? "bg-blue-400"
                                : "bg-gray-500"
                            }
                          `}
                        />

                        <h3 className="font-medium text-sm truncate">

                          {node.name ||
                            node.type}

                        </h3>

                      </div>

                      <p className="text-xs text-gray-400 mt-2 capitalize">

                        {node.type}

                      </p>

                    </div>

                    {/* INDEX */}

                    <div className="text-xs text-gray-500 bg-black/20 px-2 py-1 rounded-lg">

                      #{index + 1}

                    </div>

                  </div>

                </button>

                {/* ACTIONS */}

                <div className="px-4 pb-4 flex gap-2">

                  {/* MOVE UP */}

                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      moveNodeUp(
                        node.id
                      );
                    }}
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2
                      rounded-xl
                      bg-[#1f2937]
                      hover:bg-[#374151]
                      transition-all
                      duration-200
                      text-sm
                    "
                  >

                    <ChevronUp
                      size={16}
                    />

                    Up

                  </button>

                  {/* MOVE DOWN */}

                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      moveNodeDown(
                        node.id
                      );
                    }}
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2
                      rounded-xl
                      bg-[#1f2937]
                      hover:bg-[#374151]
                      transition-all
                      duration-200
                      text-sm
                    "
                  >

                    <ChevronDown
                      size={16}
                    />

                    Down

                  </button>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}