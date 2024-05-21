"use client";
import Head from "next/head";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import classNames from "classnames";
import Image from "next/image";

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
    display: "Portraits",
  },
];

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [breakpointCols, setBreakpointCols] = useState(2);
  const [selectedTab, setSelectedTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // Track the active tab separately
  const [otherTabSelected, setOtherTabSelected] = useState(true); // Track if the "Other" tab is selected

  const [images, setImages] = useState<string[]>([]); // Specify the type of initial state as string[]

  useEffect(() => {
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 61; i++) {
        try {
          const image = await import(`../public/pics/all/pf${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setImages(loadedImages);
    };

    fetchImages();
  }, []);

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
      for (let i = 1; i <= 95; i++) {
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

  return (
    <div className="flex flex-col h-full bg-cover bg-bottom overflow-auto">
      <Head>
        <title>Tobis portfoliooo</title>
      </Head>

      <div className="fixed left-0 top-0 w-full h-full z-10 from-stone-50 bg-gradient-to-b"></div>

      <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
        <span className="uppercase text-lg font-medium">Tobi's Portfolio</span>
        <div className="flex gap-3 pr-4">
          <button
            className={classNames(
              "rounded-3xl bg-stone-200 text-black px-2 py-1 text-sm",
              {
                "bg-opacity-30": breakpointCols !== 1,
              }
            )}
            onClick={() => setBreakpointCols(1)}
          >
            x1
          </button>
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
        <div className="flex flex-col  h-full w-full">
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
                      className="my-2"
                      placeholder="blur"
                    />
                  ))}
                </Masonry>
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
                      className="my-2"
                      placeholder="blur"
                    />
                  ))}
                </Masonry>
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
                      className="my-2"
                      placeholder="blur"
                    />
                  ))}
                </Masonry>
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
                      className="my-2"
                      placeholder="blur"
                    />
                  ))}
                </Masonry>
              </TabPanel>
            </TabPanels>
          </TabGroup>
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
