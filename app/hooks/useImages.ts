import { useState, useEffect } from "react";

export function usePortfolioImages() {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBetween, setIsLoadingBetween] = useState(true);
  const [isRemainingLoading, setIsRemainingLoading] = useState(true);

  useEffect(() => {
    const loadInitialImages = async () => {
      setIsLoading(true);
      const initialImages = [];
      for (let i = 1; i <= 13; i++) {
        try {
          const image = await import(`../../public/pics/all/pf${i}.jpg`);
          initialImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages(initialImages);
      setIsLoading(false);
    };

    const loadBetweenImages = async () => {
      //setIsLoadingBetween(true); // Show loading
      const betweenImages: any[] = [];
      for (let i = 14; i <= 24; i++) {
        try {
          const image = await import(`../../public/pics/all/pf${i}.jpg`);
          betweenImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages(betweenImages);
      setIsLoadingBetween(false);
    };

    const loadRemainingImages = async () => {
      const remainingImages: any[] = [];
      for (let i = 14; i <= 96; i++) {
        try {
          const image = await import(`../../public/pics/all/pf${i}.jpg`);
          remainingImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages((prevImages) => [...prevImages, ...remainingImages]);
      setIsRemainingLoading(false);
    };

    loadInitialImages();
    loadBetweenImages();
    loadRemainingImages();
  }, []);

  return { images, isLoading, isRemainingLoading };
}

export function useBergImages() {
  const [otherImages, setOtherImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 98; i++) {
        try {
          const image = await import(`../../public/pics/berg/berg${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setOtherImages(loadedImages);
    };

    fetchImages();
  }, []);

  return otherImages;
}

export function useArtImages() {
  const [artImages, setArtImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 17; i++) {
        try {
          const image = await import(`../../public/pics/art/art${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setArtImages(loadedImages);
    };

    fetchImages();
  }, []);

  return artImages;
}

export function useStreetImages() {
  const [streetImages, setStreetImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 22; i++) {
        try {
          const image = await import(`../../public/pics/street/street${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setStreetImages(loadedImages);
    };

    fetchImages();
  }, []);

  return streetImages;
}

export function usePortraitImages() {
  const [portraitImages, setPortraitImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 63; i++) {
        try {
          const image = await import(
            `../../public/pics/portraits/portrait${i}.jpg`
          );
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setPortraitImages(loadedImages);
    };

    fetchImages();
  }, []);

  return portraitImages;
}
