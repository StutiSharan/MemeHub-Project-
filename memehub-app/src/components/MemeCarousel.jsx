import React, { useRef, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import MemeCard from './MemeCard';

const MemeCarousel = ({ memes }) => {
  const timerRef = useRef();

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
  });

  // Auto-play logic without pause on hover
  useEffect(() => {
    if (!slider) return;

    timerRef.current = setInterval(() => {
      slider.next();
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(timerRef.current);
  }, [slider]);

  return (
    <div ref={sliderRef} className="keen-slider">
      {memes.map((meme) => (
        <div key={meme.id} className="keen-slider__slide">
          <MemeCard meme={meme} highlight />
        </div>
      ))}
    </div>
  );
};

export default MemeCarousel;
