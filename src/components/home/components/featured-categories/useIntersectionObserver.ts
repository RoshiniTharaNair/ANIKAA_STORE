import { useEffect, useRef, useState, MutableRefObject } from 'react';

const useIntersectionObserver = (
  options: IntersectionObserverInit
): [MutableRefObject<Element[]>, (boolean | undefined)[]] => {
  const elementsRef = useRef<Element[]>([]);
  const [isIntersecting, setIsIntersecting] = useState<(boolean | undefined)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = elementsRef.current.indexOf(entry.target);
        if (index > -1) {
          setIsIntersecting((prev) => {
            const newIsIntersecting = [...prev];
            newIsIntersecting[index] = entry.isIntersecting;
            return newIsIntersecting;
          });
        }
      });
    }, options);

    elementsRef.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elementsRef.current.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [options]);

  return [elementsRef, isIntersecting];
};

export default useIntersectionObserver;
