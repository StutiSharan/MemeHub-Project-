import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

export default function MemeGenerator() {
  const [memes, setMemes] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);

  // Text states for top, middle, bottom
  const [texts, setTexts] = useState({
    top: { text: "", color: "#ffffff", pos: { x: 150, y: 40 }, fontSize: 28 },
    middle: { text: "", color: "#ffffff", pos: { x: 150, y: 150 }, fontSize: 28 },
    bottom: { text: "", color: "#ffffff", pos: { x: 150, y: 280 }, fontSize: 28 },
  });

  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const dragging = useRef(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Fetch memes once
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setMemes(data.data.memes));
  }, []);

  const memesPerPage = 10;
  const totalPages = Math.ceil(memes.length / memesPerPage);
  const currentMemes = memes.slice(currentPage * memesPerPage, (currentPage + 1) * memesPerPage);

  // Dragging handlers
  function handleMouseDown(e, id) {
    e.preventDefault();
    dragging.current = id;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: texts[id].pos.x,
      startY: texts[id].pos.y,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e) {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.mouseX;
    const dy = e.clientY - dragStart.current.mouseY;
    const newX = dragStart.current.startX + dx;
    const newY = dragStart.current.startY + dy;

    setTexts((prev) => ({
      ...prev,
      [dragging.current]: {
        ...prev[dragging.current],
        pos: { x: newX, y: newY },
      },
    }));
  }

  function handleMouseUp() {
    dragging.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  // Resize text on wheel scroll
  function handleWheel(e, id) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    setTexts((prev) => {
      const newSize = Math.min(Math.max(prev[id].fontSize + delta, 12), 72);
      return {
        ...prev,
        [id]: { ...prev[id], fontSize: newSize },
      };
    });
  }

  // Update text input and color
  function handleTextChange(id, val) {
    setTexts((prev) => ({
      ...prev,
      [id]: { ...prev[id], text: val },
    }));
  }
  function handleColorChange(id, val) {
    setTexts((prev) => ({
      ...prev,
      [id]: { ...prev[id], color: val },
    }));
  }
  function handleFontSizeChange(id, val) {
    setTexts((prev) => ({
      ...prev,
      [id]: { ...prev[id], fontSize: val },
    }));
  }

  // Download meme image
  const handleDownload = async () => {
    const memeElement = document.getElementById("meme");
    html2canvas(memeElement, { useCORS: true, scale: 2 }).then((canvas) => {
      const imageBase64 = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageBase64;
      link.download = "meme.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => navigate("/upload"), 1500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-100 px-4 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 tracking-wide text-yellow-800 drop-shadow-lg">Meme Templates</h1>

      {/* Meme selection */}
      <div className="grid grid-cols-5 gap-3 max-w-5xl w-full mb-6">
        {currentMemes.map((meme) => (
          <img
            key={meme.id}
            src={meme.url}
            alt={meme.name}
            title={meme.name}
            className={`cursor-pointer w-full aspect-square object-cover rounded-lg border-4 transition-transform duration-200 hover:scale-105 hover:border-yellow-400 ${
              selectedMeme === meme.url ? "border-yellow-400" : "border-transparent"
            }`}
            onClick={() => setSelectedMeme(meme.url)}
            loading="lazy"
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mb-8 flex items-center space-x-6 text-lg font-semibold">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md shadow hover:bg-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Prev
        </button>
        <span>
          <span className="text-yellow-800">{currentPage + 1}</span>
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md shadow hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>

      {/* Meme editor + controls side by side */}
      {selectedMeme && (
        <div className="flex flex-col md:flex-row items-start md:space-x-12 max-w-5xl w-full">
          {/* Meme Preview */}
          <div
            id="meme"
            className="relative w-96 h-96 bg-black rounded-lg shadow-lg overflow-hidden select-none"
            style={{ userSelect: "none" }}
          >
            <img
              src={selectedMeme}
              alt="Selected Meme"
              className="w-full h-full object-cover"
              draggable={false}
              loading="lazy"
            />

            {["top", "middle", "bottom"].map((pos) => {
              const t = texts[pos];
              if (!t.text) return null;
              return (
                <p
                  key={pos}
                  onMouseDown={(e) => handleMouseDown(e, pos)}
                  onWheel={(e) => handleWheel(e, pos)}
                  title="Drag to move, scroll to resize"
                  style={{
                    position: "absolute",
                    top: t.pos.y,
                    left: t.pos.x,
                    transform: "translate(-50%, -50%)",
                    color: t.color,
                    fontSize: t.fontSize,
                    fontWeight: "900",
                    cursor: "grab",
                    textShadow: "2px 2px 5px rgba(0,0,0,0.9)",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    transition: "font-size 0.15s ease",
                    WebkitUserSelect: "none",
                  }}
                >
                  {t.text}
                </p>
              );
            })}
          </div>

          {/* Controls */}
          <div className="mt-8 md:mt-0 flex-1 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            {["top", "middle", "bottom"].map((pos) => {
              const t = texts[pos];
              const label = pos.charAt(0).toUpperCase() + pos.slice(1) + " Text";
              return (
                <div key={pos} className="mb-6">
                  <label
                    htmlFor={`${pos}-text`}
                    className="block font-semibold mb-1 text-yellow-400"
                  >
                    {label}
                  </label>
                  <input
                    id={`${pos}-text`}
                    type="text"
                    value={t.text}
                    onChange={(e) => handleTextChange(pos, e.target.value)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-yellow-400"
                  />

                  <div className="flex items-center space-x-4 mt-3">
                    <div>
                      <label
                        htmlFor={`${pos}-color`}
                        className="block font-semibold mb-1 text-yellow-400"
                      >
                        Color
                      </label>
                      <input
                        id={`${pos}-color`}
                        type="color"
                        value={t.color}
                        onChange={(e) => handleColorChange(pos, e.target.value)}
                        className="w-12 h-8 cursor-pointer rounded"
                        title="Pick text color"
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor={`${pos}-size`}
                        className="block font-semibold mb-1 text-yellow-400"
                      >
                        Font Size ({t.fontSize}px)
                      </label>
                      <input
                        id={`${pos}-size`}
                        type="range"
                        min="12"
                        max="72"
                        value={t.fontSize}
                        onChange={(e) => handleFontSizeChange(pos, parseInt(e.target.value, 10))}
                        className="w-full cursor-pointer"
                        title="Adjust font size"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleDownload}
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md shadow-lg transition"
            >
              Download Meme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
