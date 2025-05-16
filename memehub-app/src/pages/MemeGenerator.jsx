import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

export default function MemeGenerator() {
  const [memes, setMemes] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [topText, setTopText] = useState("");
  const [middleText, setMiddleText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [topColor, setTopColor] = useState("#ffffff");
  const [middleColor, setMiddleColor] = useState("#ffffff");
  const [bottomColor, setBottomColor] = useState("#ffffff");
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setMemes(data.data.memes));
  }, []);

  const memesPerPage = 10;
  const totalPages = Math.ceil(memes.length / memesPerPage);
  const currentMemes = memes.slice(
    currentPage * memesPerPage,
    (currentPage + 1) * memesPerPage
  );

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
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Meme Generator</h1>

      {/* Meme Pagination */}
      <div className="grid grid-cols-5 gap-2 max-w-xl">
        {currentMemes.map((meme) => (
          <img
            key={meme.id}
            src={meme.url}
            alt={meme.name}
            className="cursor-pointer w-32 h-32 object-cover border hover:border-blue-500"
            onClick={() => setSelectedMeme(meme.url)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4">
        <button
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>
        <span className="font-bold">{`Page ${
          currentPage + 1
        } of ${totalPages}`}</span>
        <button
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Meme Editor */}
      {selectedMeme && (
        <div id="meme" className="relative w-96 h-96 bg-white mt-4">
          <img
            src={selectedMeme}
            alt="Selected Meme"
            className="w-full h-full object-cover"
          />
          <p
            className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold"
            style={{ color: topColor }}
          >
            {topText}
          </p>
          <p
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"
            style={{ color: middleColor }}
          >
            {middleText}
          </p>
          <p
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold"
            style={{ color: bottomColor }}
          >
            {bottomText}
          </p>
        </div>
      )}

      {/* Text Inputs & Color Pickers */}
      {selectedMeme && (
        <div className="flex flex-col mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="p-2 border"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Upper Text"
            />
            <input
              type="color"
              value={topColor}
              onChange={(e) => setTopColor(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="p-2 border"
              value={middleText}
              onChange={(e) => setMiddleText(e.target.value)}
              placeholder="Middle Text"
            />
            <input
              type="color"
              value={middleColor}
              onChange={(e) => setMiddleColor(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="p-2 border"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Bottom Text"
            />
            <input
              type="color"
              value={bottomColor}
              onChange={(e) => setBottomColor(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Download Button */}
      {selectedMeme && (
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4"
          onClick={handleDownload}
        >
          Download Meme
        </button>
      )}
    </div>
  );
}
