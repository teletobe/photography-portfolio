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

import img1 from "../public/APC_1150.jpg";
import img2 from "../public/APC_1440.jpg";

const tabs = [
  {
    key: "all",
    display: "Portfolio",
  },
  {
    key: "vienna",
    display: "Vienna Chronicles",
  },
  {
    key: "berg",
    display: "Berg",
  },
  {
    key: "portraits",
    display: "Portraitss",
  },
  {
    key: "japan",
    display: "Japan",
  },
];

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [breakpointCols, setBreakpointCols] = useState(2);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // Track the active tab separately
  const [otherTabSelected, setOtherTabSelected] = useState(true); // Track if the "Other" tab is selected
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lightboxRef = useRef<LightGallery | null>(null);

  const [images, setImages] = useState<string[]>([]); // Specify the type of initial state as string[]

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

  /*
    
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 85; i++) {
        try {
          const image = await import(`../public/pics/all/pf${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages(loadedImages);
      setIsLoading(false); // Set loading state to false once images are fetched
    };

    fetchImages();
  }, []);
*/
  const [wienimages, setWienImages] = useState<string[]>([]); // Specify the type of initial state as string[]

  useEffect(() => {
    const fetchImages = async () => {
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

    fetchImages();
  }, []);

  const [bergimages, setBergImages] = useState<string[]>([]); // Specify the type of initial state as string[]

  useEffect(() => {
    const fetchImages = async () => {
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

    fetchImages();
  }, []);

  const [portraitimages, setPortraitImages] = useState<string[]>([]); // Specify the type of initial state as string[]

  useEffect(() => {
    const fetchImages = async () => {
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

    fetchImages();
  }, []);

  const [japanimages, setJapanImages] = useState<string[]>([]); // Specify the type of initial state as string[]

  useEffect(() => {
    const fetchImages = async () => {
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

    fetchImages();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const removeTimeout = setTimeout(() => {
      setShowWelcomeOverlay(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-cover bg-bottom overflow-auto">
      <Head>
        <link rel="preload" as="image" href="/pics/all/pf1.jpg" />
        <link rel="preload" as="image" href="/pics/all/pf2.jpg" />
        <link rel="preload" as="image" href="/pics/all/pf3.jpg" />
        <title>Tobis portfoliooo</title>
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

      <div className="fixed left-0 top-0 w-full h-full z-10 from-stone-50 bg-gradient-to-b"></div>

      <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
        <span className="uppercase text-lg font-medium">Tobi's Portfolio</span>
        <div className="flex gap-3 pr-4">
          <span className="text-sm py-1 ">columns:</span>
          <button
            className={classNames(
              "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
              {
                "bg-opacity-30": breakpointCols !== 2,
              }
            )}
            onClick={() => setBreakpointCols(2)}
          >
            x2
          </button>
          <button
            className={classNames(
              "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
              {
                "bg-opacity-30": breakpointCols !== 3,
              }
            )}
            onClick={() => setBreakpointCols(3)}
          >
            x3
          </button>
        </div>
        {/*<Link
          href="#"
          className="rounded-3xl bg-white text-stone-700 px-3 py-2 hover:bg-opacity-30"
        >
          Contact
          </Link>*/}
      </header>

      <main className="grow pt-[100px] w-full h-full z-10">
        <div className="contentInner flex flex-col  h-full w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="spinner"></div>
              <p>loading...</p>
            </div>
          ) : (
            <TabGroup className="h-full w-full">
              <TabList className="flex items-center justify-center gap-5 pr-4">
                <Tab
                  key="all"
                  className="p-2"
                  onClick={() => {
                    setSelectedTab("all"), setShowDropdown(false);
                  }}
                >
                  {({ selected }) => (
                    <span
                      className={classNames(
                        "uppercase text-md ",
                        selected ? "text-stone-800" : "text-stone-400"
                      )}
                    >
                      Portfolio
                    </span>
                  )}
                </Tab>
                <div className="relative">
                  <button
                    className={classNames("p-2 uppercase text-md", {
                      "text-stone-800":
                        showDropdown ||
                        selectedIndex === 1 ||
                        selectedIndex === 2,
                      "text-stone-400": !(
                        showDropdown ||
                        selectedIndex === 1 ||
                        selectedIndex === 2
                      ),
                    })}
                    onClick={() => setShowDropdown((prev) => !prev)}
                  >
                    Other
                  </button>
                  {showDropdown && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg">
                      <div className="py-1">
                        <Tab
                          key="vienna"
                          className="p-2"
                          onClick={() => {
                            setSelectedTab("vienna");
                            setShowDropdown(false);
                          }}
                        >
                          {({ selected }) => (
                            <span
                              className={classNames(
                                "text-sm", // Adjusted text size
                                selected ? "text-stone-800" : "text-stone-400"
                              )}
                            >
                              Vienna
                            </span>
                          )}
                        </Tab>
                        <Tab
                          key="berg"
                          className="p-2"
                          onClick={() => {
                            setSelectedTab("berg");
                            setShowDropdown(false);
                          }}
                        >
                          {({ selected }) => (
                            <span
                              className={classNames(
                                "text-sm", // Adjusted text size
                                selected ? "text-stone-800" : "text-stone-400"
                              )}
                            >
                              Berg
                            </span>
                          )}
                        </Tab>
                        <Tab
                          key="portraits"
                          className="p-2"
                          onClick={() => {
                            setSelectedTab("portraits");
                            setShowDropdown(false);
                          }}
                        >
                          {({ selected }) => (
                            <span
                              className={classNames(
                                "text-sm", // Adjusted text size
                                selected ? "text-stone-800" : "text-stone-400"
                              )}
                            >
                              Portraits
                            </span>
                          )}
                        </Tab>
                        <Tab
                          key="japan"
                          className="p-2"
                          onClick={() => {
                            setSelectedTab("japan");
                            setShowDropdown(false);
                          }}
                        >
                          {({ selected }) => (
                            <span
                              className={classNames(
                                "text-sm", // Adjusted text size
                                selected ? "text-stone-800" : "text-stone-400"
                              )}
                            >
                              Japan
                            </span>
                          )}
                        </Tab>
                      </div>
                    </div>
                  )}
                </div>
              </TabList>

              <TabPanels className="tabPanelsContainer flex gap-12 bg-opacity-60 p-2 h-full sm:p-4 my-6">
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
                        alt="placeholder"
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy" // Lazy load images
                        onClick={() => {
                          lightboxRef.current?.openGallery(index);
                        }}
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
                      src:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                      thumb:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                    }))}
                  />
                </TabPanel>
                <TabPanel>
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-2"
                    columnClassName=""
                  >
                    {wienimages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt="placeholder"
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy" // Lazy load images
                        onClick={() => {
                          lightboxRef.current?.openGallery(index);
                        }}
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
                    dynamicEl={wienimages.map((image) => ({
                      src:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                      thumb:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                    }))}
                  />
                </TabPanel>
                <TabPanel>
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-2"
                    columnClassName=""
                  >
                    {bergimages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt="placeholder"
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy" // Lazy load images
                        onClick={() => {
                          lightboxRef.current?.openGallery(index);
                        }}
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
                    dynamicEl={bergimages.map((image) => ({
                      src:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                      thumb:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                    }))}
                  />
                </TabPanel>
                <TabPanel>
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-2"
                    columnClassName=""
                  >
                    {portraitimages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt="placeholder"
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy" // Lazy load images
                        onClick={() => {
                          lightboxRef.current?.openGallery(index);
                        }}
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
                    dynamicEl={portraitimages.map((image) => ({
                      src:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                      thumb:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                    }))}
                  />
                </TabPanel>
                <TabPanel>
                  <Masonry
                    breakpointCols={breakpointCols}
                    className="flex gap-2"
                    columnClassName=""
                  >
                    {japanimages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt="placeholder"
                        className="my-2 hover:opacity-85 cursor-pointer"
                        placeholder="blur"
                        loading="lazy" // Lazy load images
                        onClick={() => {
                          lightboxRef.current?.openGallery(index);
                        }}
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
                    dynamicEl={japanimages.map((image) => ({
                      src:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                      thumb:
                        typeof image === "string"
                          ? image
                          : (image as { src: string }).src,
                    }))}
                  />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          )}
        </div>
      </main>

      {/*
      <footer className="relative h-[90px] flex justify-center items-center uppercase text-lg font-medium z-20">
        <p>Photography portfolio</p>
      </footer>
          */}
    </div>
  );
}
