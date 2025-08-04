import { useState, useEffect, useRef } from "react";

export const useMouseTracking = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothMousePosition, setSmoothMousePosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const animateFrame = () => {
      setSmoothMousePosition((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.1,
        y: prev.y + (mousePosition.y - prev.y) * 0.1,
      }));
    };

    const interval = setInterval(animateFrame, 16);
    return () => clearInterval(interval);
  }, [mousePosition]);

  return { mousePosition, smoothMousePosition };
};

export const useTypingAnimation = (texts) => {
  const [typedText, setTypedText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const typeText = () => {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        setTypedText(currentText.substring(0, charIndex + 1));
        charIndex++;

        if (charIndex === currentText.length) {
          isDeleting = true;
          timeout = setTimeout(typeText, 1000);
        } else {
          timeout = setTimeout(typeText, 100);
        }
      } else {
        setTypedText(currentText.substring(0, charIndex - 1));
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          timeout = setTimeout(typeText, 500);
        } else {
          timeout = setTimeout(typeText, 50);
        }
      }
    };

    timeout = setTimeout(typeText, 1000);
    return () => clearTimeout(timeout);
  }, [mounted, texts]);

  return typedText;
};

export const useIntersectionObserver = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return isVisible;
};

export const useCarousel = (itemCount, interval = 4000) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount);
    }, interval);
    return () => clearInterval(timer);
  }, [itemCount, interval]);

  return { activeIndex, setActiveIndex };
};
