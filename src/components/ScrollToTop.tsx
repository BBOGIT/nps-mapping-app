import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Функція для відстеження прокрутки сторінки
  useEffect(() => {
    const toggleVisibility = () => {
      // Показуємо кнопку, коли прокрутили більше ніж 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Додаємо слухач події прокрутки
    window.addEventListener('scroll', toggleVisibility);

    // Прибираємо слухач при розмонтуванні компонента
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Функція для плавної прокрутки вгору
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`fixed bottom-4 right-4 bg-[#E31E24] text-white p-3 rounded-full shadow-lg
        transition-all duration-300 hover:bg-[#C41A1F] focus:outline-none
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      onClick={scrollToTop}
      aria-label="Прокрутити вгору"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTop;