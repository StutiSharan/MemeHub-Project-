import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../utils/firebaseConfig";
import { ref, push } from "firebase/database";
import MemeChatbot from "../components/geminisuggest/MemeChatbot";

export default function MemeGenerator() {
  const [memes, setMemes] = useState([]);
  const [isChatOpen, setChatOpen] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [texts, setTexts] = useState([
    { id: "top", text: "", color: "#ffffff", pos: { x: 150, y: 40 }, fontSize: 28 },
    { id: "middle", text: "", color: "#ffffff", pos: { x: 150, y: 150 }, fontSize: 28 },
    { id: "bottom", text: "", color: "#ffffff", pos: { x: 150, y: 280 }, fontSize: 28 },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const dragging = useRef(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const editorRef = useRef(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setMemes(data.data.memes));
  }, []);

  useEffect(() => {
    if (selectedMeme && editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedMeme]);

  const memesPerPage = 10;
  const totalPages = Math.ceil(memes.length / memesPerPage);
  const currentMemes = memes.slice(currentPage * memesPerPage, (currentPage + 1) * memesPerPage);

  function handleMouseDown(e, id) {
    e.preventDefault();
    dragging.current = id;
    const t = texts.find((t) => t.id === id);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: t.pos.x,
      startY: t.pos.y,
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

    setTexts((prev) =>
      prev.map((t) =>
        t.id === dragging.current ? { ...t, pos: { x: newX, y: newY } } : t
      )
    );
  }

  function handleMouseUp() {
    dragging.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  function handleWheel(e, id) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, fontSize: Math.min(Math.max(t.fontSize + delta, 12), 72) }
          : t
      )
    );
  }

  function handleTextChange(id, val) {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, text: val } : t)));
  }

  function handleColorChange(id, val) {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, color: val } : t)));
  }

  function handleFontSizeChange(id, val) {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, fontSize: val } : t)));
  }

  function handleAddText() {
    const newId = `custom-${Date.now()}`;
    setTexts((prev) => [
      ...prev,
      { id: newId, text: "", color: "#ffffff", pos: { x: 150, y: 150 }, fontSize: 28 },
    ]);
  }

  function handleRemoveText(id) {
    setTexts((prev) => prev.filter((t) => t.id !== id));
  }

  const handleDownload = async () => {
    if (!selectedMeme) return alert("Please select a meme template first.");
    const memeElement = document.getElementById("meme");
    const canvas = await html2canvas(memeElement, { useCORS: true, scale: 2 });
    const imageBase64 = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageBase64;
    link.download = "meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => navigate("/upload"), 1500);
  };

  const saveMeme = async (status) => {
    if (!selectedMeme) return alert("Please select a meme template first.");
    const memeElement = document.getElementById("meme");
    const canvas = await html2canvas(memeElement, { useCORS: true, scale: 2 });
    const imageBase64 = canvas.toDataURL("image/png");

    const user = auth.currentUser;
    const memeData = {
      image: imageBase64,
      texts: texts.filter((t) => t.text.trim() !== ""),
      createdAt: new Date().toISOString(),
      author: user ? { uid: user.uid, email: user.email || null } : null,
    };

    if (status === "draft") {
      const savedMemes = JSON.parse(localStorage.getItem("memeDrafts")) || [];
      savedMemes.push({ ...memeData, id: `meme-${Date.now()}` });
      localStorage.setItem("memeDrafts", JSON.stringify(savedMemes));
      alert("Meme saved as draft!");
    } else {
      try {
        await push(ref(database, "publicMemes"), memeData);
        alert("Meme published to feed!");
        navigate("/feed");
      } catch (err) {
        console.error("Error publishing meme:", err);
        alert("Failed to publish meme.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-100 px-4 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-yellow-800">Meme Templates</h1>

      <div className="mb-6 text-yellow-900 bg-yellow-100 border border-yellow-300 rounded-xl p-4 shadow-md w-full max-w-3xl text-center">
        <h2 className="text-2xl font-bold mb-2">🛠 How to Generate a Meme</h2>
        <ul className="list-disc text-left text-lg list-inside">
          <li>📌 Select a meme template from the grid below.</li>
          <li>✍️ Add text layers. Customize font size, color, and position.</li>
          <li>🖱️ Drag to move, scroll to resize text.</li>
          <li>🎨 Use the panel to adjust text styles.</li>
          <li>💾 Save as Draft or Publish directly.</li>
          <li>📥 Optionally, click Download Meme.</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-5xl w-full mb-6">
        {currentMemes.map((meme) => (
          <img
            key={meme.id}
            src={meme.url}
            alt={meme.name}
            title={meme.name}
            className={`cursor-pointer w-full aspect-square object-cover rounded-lg border-4 transition-transform duration-200 hover:scale-105 ${
              selectedMeme === meme.url ? "border-yellow-400" : "border-transparent"
            }`}
            onClick={() => setSelectedMeme(meme.url)}
            loading="lazy"
          />
        ))}
      </div>

      <div className="mb-8 flex items-center space-x-6 text-lg font-semibold">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
          disabled={currentPage === 0}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md shadow hover:bg-yellow-800 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-yellow-800">{currentPage + 1}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md shadow hover:bg-yellow-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={() => setChatOpen(true)}
        className="bg-purple-800 text-white p-2 rounded hover:bg-purple-500"
      >
        Open Meme Chatbot 🤖
      </button>
      <MemeChatbot
        isOpen={isChatOpen}
        onClose={() => setChatOpen(false)}
        templateName={selectedMeme?.name}
      />

      {selectedMeme && (
        <div ref={editorRef} className="flex flex-col md:flex-row items-start md:space-x-12 max-w-6xl w-full mt-8">
          <div
            id="meme"
            className="relative w-full md:w-96 aspect-square bg-black rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={selectedMeme}
              alt="Selected Meme"
              className="w-full h-full object-cover"
              draggable={false}
              loading="lazy"
            />
            {texts.map((t) =>
              !t.text ? null : (
                <p
                  key={t.id}
                  onMouseDown={(e) => handleMouseDown(e, t.id)}
                  onWheel={(e) => handleWheel(e, t.id)}
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
                  }}
                >
                  {t.text}
                </p>
              )
            )}
          </div>

          <div className="mt-8 md:mt-0 flex-1 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[32rem]">
            {texts.map((t) => (
              <div key={t.id} className="mb-6 border-b border-gray-700 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-yellow-400">Text ID: {t.id}</label>
                  <button
                    onClick={() => handleRemoveText(t.id)}
                    className="text-sm text-red-400 hover:underline"
                  >
                    ❌ Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={t.text}
                  onChange={(e) => handleTextChange(t.id, e.target.value)}
                  placeholder="Enter text"
                  className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700 mb-2"
                />
                <div className="flex items-center space-x-4">
                  <input
                    type="color"
                    value={t.color}
                    onChange={(e) => handleColorChange(t.id, e.target.value)}
                    className="w-12 h-8 rounded"
                  />
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={t.fontSize}
                    onChange={(e) => handleFontSizeChange(t.id, parseInt(e.target.value, 10))}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handleAddText}
              className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md shadow"
            >
              + Add Text
            </button>
            <button
              onClick={handleDownload}
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md shadow-lg"
            >
              Download Meme
            </button>
            <button
              onClick={() => saveMeme("draft")}
              className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-md shadow-lg"
            >
              Save as Draft
            </button>
            <button
              onClick={() => saveMeme("published")}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-lg"
            >
              Publish to Feed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
