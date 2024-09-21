"use client";
import Head from "next/head";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import classNames from "classnames";
import Image from "next/image";

import type { LightGallery } from "lightgallery/lightgallery";
import LightGalleryComponent from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

// Tabs definition
const tabs = [
  { key: "all", display: "Portfolio" },
  { key: "vienna", display: "Vienna Chronicles" },
  { key: "berg", display: "Berg" },
  { key: "portraits", display: "Portraits" },
  { key: "japan", display: "Japan" },
];

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [breakpointCols, setBreakpointCols] = useState(2);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lightboxRef = useRef<LightGallery | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [wienImages, setWienImages] = useState<string[]>([]);
  const [bergImages, setBergImages] = useState<string[]>([]);
  const [portraitImages, setPortraitImages] = useState<string[]>([]);
  const [japanImages, setJapanImages] = useState<string[]>([]);

  // Priority load first few images in Portfolio
  useEffect(() => {
    const loadInitialImages = async () => {
      setIsLoading(true); // Show loading
      const initialImages = [];
      for (let i = 1; i <= 5; i++) {
        try {
          const image = await import(`../public/pics/all/pf${i}.jpg`);
          initialImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages(initialImages); // Set initial images
      setIsLoading(false); // Hide loading
    };

    const loadRemainingImages = async () => {
      const remainingImages: any[] = [];
      for (let i = 6; i <= 85; i++) {
        try {
          const image = await import(`../public/pics/all/pf${i}.jpg`);
          remainingImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages((prevImages) => [...prevImages, ...remainingImages]); // Append remaining images
    };

    loadInitialImages(); // Prioritize first 5 images
    loadRemainingImages(); // Load the rest in the background
  }, []);

  // Load images for Vienna, Berg, Portraits, and Japan
  useEffect(() => {
    const loadWienImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 45; i++) {
        try {
          const image = await import(`../public/pics/wien/wien${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setWienImages(loadedImages);
    };
    loadWienImages();
  }, []);

  useEffect(() => {
    const loadBergImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 98; i++) {
        try {
          const image = await import(`../public/pics/berg/berg${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setBergImages(loadedImages);
    };
    loadBergImages();
  }, []);

  useEffect(() => {
    const loadPortraitImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 61; i++) {
        try {
          const image = await import(
            `../public/pics/portraits/portrait${i}.jpg`
          );
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setPortraitImages(loadedImages);
    };
    loadPortraitImages();
  }, []);

  useEffect(() => {
    const loadJapanImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 61; i++) {
        try {
          const image = await import(`../public/pics/japan/japan${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setJapanImages(loadedImages);
    };
    loadJapanImages();
  }, []);

  // Welcome overlay timeout
  useEffect(() => {
    const timeout = setTimeout(() => setFadeOut(true), 2000);
    const removeTimeout = setTimeout(() => setShowWelcomeOverlay(false), 3000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-cover bg-bottom overflow-auto">
      <Head>
        <link rel="preload" as="image" href="/pics/all/pf1.jpg" />
        <title>Tobis Portfolio</title>
      </Head>

      {showWelcomeOverlay && (
        <div
          className={classNames(
            "fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-1000",
            { "opacity-0": fadeOut }
          )}
        >
          <span className="text-2xl font-bold">Welcome!</span>
        </div>
      )}

      <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
        <span className="uppercase text-lg font-medium">Tobi's Portfolio</span>
        <div className="flex gap-3 pr-4">
          <span className="text-sm py-1">columns:</span>
          <button
            className={classNames(
              "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
              { "bg-opacity-30": breakpointCols !== 2 }
            )}
            onClick={() => setBreakpointCols(2)}
          >
            x2
          </button>
          <button
            className={classNames(
              "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
              { "bg-opacity-30": breakpointCols !== 3 }
            )}
            onClick={() => setBreakpointCols(3)}
          >
            x3
          </button>
        </div>
      </header>

      <main className="grow pt-[100px] w-full h-full z-10">
        <div className="contentInner flex flex-col h-full w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <TabGroup className="h-full w-full">
              <TabList className="flex items-center justify-center gap-5 pr-4">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.key}
                    className="p-2"
                    onClick={() => setSelectedTab(tab.key)}
                  >
                    {({ selected }) => (
                      <span
                        className={classNames(
                          "uppercase text-md",
                          selected ? "text-stone-800" : "text-stone-400"
                        )}
                      >
                        {tab.display}
                      </span>
                    )}
                  </Tab>
                ))}
              </TabList>

              <TabPanels className="tabPanelsContainer flex gap-12 bg-opacity-60 p-2 h-full sm:p-4 my-6">
                {/* Portfolio Tab */}
                <TabPanel>
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-2"
                    columnClassName=""
                  >
                    {images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Image ${index}`}
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy"
                        onClick={() => lightboxRef.current?.openGallery(index)}
                      />
                    ))}
                  </Masonry>
                  <LightGalleryComponent
                    onInit={(ref) => {
                      if (ref) {
                        lightboxRef.current = ref.instance;
                      }
                    }}
                    speed={500}
                    plugins={[lgThumbnail, lgZoom]}
                    dynamic
                    dynamicEl={images.map((image) => ({
                      src: image,
                      thumb: image,
                    }))}
                  />
                </TabPanel>

                {/* Vienna Tab */}
                <TabPanel>
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-2"
                    columnClassName=""
                  >
                    {wienImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Vienna ${index}`}
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy"
                        onClick={() => lightboxRef.current?.openGallery(index)}
                      />
                    ))}
                  </Masonry>
                  <LightGalleryComponent
                    onInit={(ref) => {
                      if (ref) {
                        lightboxRef.current = ref.instance;
                      }
                    }}
                    speed={500}
                    plugins={[lgThumbnail, lgZoom]}
                    dynamic
                    dynamicEl={wienImages.map((image) => ({
                      src: image,
                      thumb: image,
                    }))}
                  />
                </TabPanel>

                {/* Berg, Portraits, and Japan tabs can follow the same pattern */}
              </TabPanels>
            </TabGroup>
          )}
        </div>
      </main>
    </div>
  );
}
