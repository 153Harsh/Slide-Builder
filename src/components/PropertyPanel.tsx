import { useEditorStore } from "../store/editorStore";

export default function PropertyPanel() {
  const { slides, selectedNodeId, updateNode } = useEditorStore();

  const selectedNode = slides
    .flatMap((slide) => slide.nodes)
    .find((node) => node.id === selectedNodeId);

  const inputClass =
    "w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  const labelClass =
    "text-xs uppercase tracking-wide text-gray-400 mb-1 block";

  if (!selectedNode) {
    return (
      <div className="w-[220px] h-full bg-[#111827] border-l border-white/10 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-white text-lg font-semibold mb-2">
            Properties
          </h2>

          <p className="text-gray-400 text-sm">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[220px] h-full bg-[#111827] border-l border-white/10 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#111827] border-b border-white/10 px-4 py-2">
        <h2 className="text-white text-lg font-semibold">
          Properties
        </h2>

        <p className="text-xs text-gray-400 mt-1 capitalize">
          Editing {selectedNode.type}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {/* Layout Section */}
        <div className="bg-[#1e293b] rounded-xl p-2 space-y-2">
          <h3 className="text-sm font-semibold text-white">
            Layout
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>X</label>

              <input
                type="number"
                value={selectedNode.style.x}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    style: { x: Number(e.target.value) },
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Y</label>

              <input
                type="number"
                value={selectedNode.style.y}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    style: { y: Number(e.target.value) },
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Width</label>

              <input
                type="number"
                value={selectedNode.style.width}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    style: { width: Number(e.target.value) },
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Height</label>

              <input
                type="number"
                value={selectedNode.style.height}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    style: { height: Number(e.target.value) },
                  })
                }
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* TEXT NODE */}
        {selectedNode.type === "text" && (
          <div className="bg-[#1e293b] rounded-xl p-2 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Text Settings
            </h3>

            <div>
              <label className={labelClass}>Text</label>

              <input
                type="text"
                value={selectedNode.props.text}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    props: { text: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Font Size</label>

              <input
                type="number"
                value={selectedNode.style.fontSize ?? 24}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    style: {
                      fontSize: Number(e.target.value),
                    },
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Text Color</label>

              <input
                type="color"
                value={selectedNode.style.color ?? "#ffffff"}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    style: { color: e.target.value },
                  })
                }
                className="w-full h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
            </div>

            <div>
              <label className={labelClass}>
                Target Slide ID
              </label>

              <input
                type="text"
                value={selectedNode.props.targetSlideId ?? ""}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    props: {
                      targetSlideId: e.target.value,
                    },
                  })
                }
                className={inputClass}
                placeholder="slide-..."
              />
            </div>
          </div>
        )}

        {/* BUTTON NODE */}
        {selectedNode.type === "button" && (
          <>
            <div className="bg-[#1e293b] rounded-xl p-2 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Button Settings
              </h3>

              <div>
                <label className={labelClass}>Button Text</label>

                <input
                  type="text"
                  value={selectedNode.props.text}
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      props: { text: e.target.value },
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Background Color
                </label>

                <input
                  type="color"
                  value={
                    selectedNode.style.backgroundColor ??
                    "#3B82F6"
                  }
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      style: {
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                />
              </div>

              <div>
                <label className={labelClass}>Text Color</label>

                <input
                  type="color"
                  value={selectedNode.style.color ?? "#ffffff"}
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      style: { color: e.target.value },
                    })
                  }
                  className="w-full h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer"
                />
              </div>

              <div>
                <label className={labelClass}>Font Size</label>

                <input
                  type="number"
                  value={selectedNode.style.fontSize ?? 16}
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      style: {
                        fontSize: Number(e.target.value),
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Border Radius
                </label>

                <input
                  type="number"
                  value={
                    selectedNode.style.borderRadius ?? 8
                  }
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      style: {
                        borderRadius: Number(
                          e.target.value
                        ),
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl p-2 space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Effects
              </h3>

              <div>
                <label className={labelClass}>Rotation</label>

                <input
                  type="number"
                  value={selectedNode.style.rotation ?? 0}
                  onChange={(e) =>
                    updateNode(selectedNode.id, {
                      style: {
                        rotation: Number(e.target.value),
                      },
                    })
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Opacity
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={
                      selectedNode.style.opacity ?? 1
                    }
                    onChange={(e) =>
                      updateNode(selectedNode.id, {
                        style: {
                          opacity: Number(
                            e.target.value
                          ),
                        },
                      })
                    }
                    className="w-full"
                  />

                  <span className="text-xs text-gray-300 w-10">
                    {Math.round(
                      (selectedNode.style.opacity ?? 1) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-3">
  <label className="block text-sm mb-1">
    Transition
  </label>

  <select
    value={
      selectedNode.props
        .transition || "fade"
    }

    onChange={(e) =>
      updateNode(
        selectedNode.id,
        {
          props: {
            transition:
              e.target.value,
          },
        }
      )
    }

    className="w-full h-8 rounded-lg border border-white/10 bg-transparent cursor-pointer"
  >
    <option value="none" className="bg-[#1e293b] rounded-xl p-2 space-y-2">
      None
    </option>

    <option value="fade" className="bg-[#1e293b] rounded-xl p-2 space-y-2">
      Fade
    </option>

    <option value="slide-left" className="bg-[#1e293b] rounded-xl p-2 space-y-2">
      Slide Left
    </option>

    <option value="slide-right" className="bg-[#1e293b] rounded-xl p-2 space-y-2">
      Slide Right
    </option>

    <option value="zoom" className="bg-[#1e293b] rounded-xl p-2 space-y-2">
      Zoom
    </option>
  </select>
</div>
          </>
        )}

        {/* IMAGE NODE */}
        {selectedNode.type === "image" && (
          <div className="bg-[#1e293b] rounded-xl p-2 space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Image Settings
            </h3>

            <div>
              <label className={labelClass}>
                Image Source
              </label>

              <input
                type="text"
                value={selectedNode.props.src}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    props: { src: e.target.value },
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Target Slide ID
              </label>

              <input
                type="text"
                value={selectedNode.props.targetSlideId ?? ""}
                onChange={(e) =>
                  updateNode(selectedNode.id, {
                    props: {
                      targetSlideId: e.target.value,
                    },
                  })
                }
                className={inputClass}
                placeholder="slide-..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}