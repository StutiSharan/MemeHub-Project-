import React, { useRef, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import MemeCard from "./MemeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MemeCarousel = ({ memes }) => {
  const sliderRef = useRef(null); // Ref for DOM element
  const sliderInstanceRef = useRef(null); // Ref for slider instance
  const timerRef = useRef(null);

  const [ref] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    created: (slider) => {
      sliderInstanceRef.current = slider;
    },
  });

  // Auto-play every 3 seconds
  useEffect(() => {
    const startAutoPlay = () => {
      timerRef.current = setInterval(() => {
        sliderInstanceRef.current?.next();
      }, 3000);
    };

    startAutoPlay();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="relative">
      {/* Keen Slider */}
      <div
        ref={(node) => {
          ref(node); // KeenSlider hook ref
          sliderRef.current = node; // DOM ref
        }}
        className="keen-slider rounded-xl overflow-hidden"
      >
        {memes.map((meme) => (
          <div key={meme.id} className="keen-slider__slide px-1">
            <MemeCard meme={meme} highlight />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={() => sliderInstanceRef.current?.prev()}
        className="absolute top-1/2 left-0 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md z-10 ml-2"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next Button */}
      <button
        onClick={() => sliderInstanceRef.current?.next()}
        className="absolute top-1/2 right-0 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md z-10 mr-2"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default MemeCarousel;
