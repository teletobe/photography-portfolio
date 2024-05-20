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
    key: "Berg",
    display: "Berg",
  },
];

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [images, setImages] = useState<string[]>([]); // Specify the type of initial state as string[]

  useEffect(() => {
    const fetchImages = async () => {
      const loadedImages = [];
      for (let i = 1; i <= 60; i++) {
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
      for (let i = 1; i <= 94; i++) {
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

  return (
    <div className="flex flex-col h-full bg-cover bg-bottom overflow-auto">
      <Head>
        <title>Tobis portfoliooo</title>
      </Head>

      <div className="fixed left-0 top-0 w-full h-full z-10 from-stone-50 bg-gradient-to-b"></div>

      <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
        <span className="uppercase text-lg font-medium">Tobi's Portfolio</span>
        <Link
          href="#"
          className="rounded-3xl  bg-white text-stone-700 px-3 py-2 hover:bg-opacity-30"
        >
          Contact
        </Link>
      </header>

      <main className="grow pt-[100px] w-full h-full z-10">
        <div className="flex flex-col  h-full w-full">
          <TabGroup className="h-full w-full">
            <TabList className="flex items-center justify-center gap-12">
              {tabs.map((tab) => (
                <Tab key={tab.key} className="p-2">
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
              <TabPanel>
                <Masonry
                  breakpointCols={2}
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

                  {/*
                  <img src="/pics/all/pf1.jpg" alt="image-1" className="my-3" />
                  <img src="/pics/all/pf2.jpg" alt="image-2" className="my-3" />
                  <img src="/pics/all/pf3.jpg" alt="image-3" className="my-3" />
                  <img src="/pics/all/pf4.jpg" alt="image-4" className="my-3" />
                  <img src="/pics/all/pf5.jpg" alt="image-5" className="my-3" />
                  <img src="/pics/all/pf6.jpg" alt="image-6" className="my-3" />
                  <img src="/pics/all/pf7.jpg" alt="image-7" className="my-3" />
                  <img src="/pics/all/pf8.jpg" alt="image-8" className="my-3" />
            */}
                </Masonry>
              </TabPanel>
              <TabPanel>
                <Masonry
                  breakpointCols={2}
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

                  {/*
                  <img src="/pics/all/pf1.jpg" alt="image-1" className="my-3" />
                  <img src="/pics/all/pf2.jpg" alt="image-2" className="my-3" />
                  <img src="/pics/all/pf3.jpg" alt="image-3" className="my-3" />
                  <img src="/pics/all/pf4.jpg" alt="image-4" className="my-3" />
                  <img src="/pics/all/pf5.jpg" alt="image-5" className="my-3" />
                  <img src="/pics/all/pf6.jpg" alt="image-6" className="my-3" />
                  <img src="/pics/all/pf7.jpg" alt="image-7" className="my-3" />
                  <img src="/pics/all/pf8.jpg" alt="image-8" className="my-3" />
            */}
                </Masonry>
              </TabPanel>
              <TabPanel>
                <Masonry
                  breakpointCols={2}
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

                  {/*
                  <img src="/pics/all/pf1.jpg" alt="image-1" className="my-3" />
                  <img src="/pics/all/pf2.jpg" alt="image-2" className="my-3" />
                  <img src="/pics/all/pf3.jpg" alt="image-3" className="my-3" />
                  <img src="/pics/all/pf4.jpg" alt="image-4" className="my-3" />
                  <img src="/pics/all/pf5.jpg" alt="image-5" className="my-3" />
                  <img src="/pics/all/pf6.jpg" alt="image-6" className="my-3" />
                  <img src="/pics/all/pf7.jpg" alt="image-7" className="my-3" />
                  <img src="/pics/all/pf8.jpg" alt="image-8" className="my-3" />
            */}
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
