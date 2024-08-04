// pages/other.tsx
"use client";
import Head from "next/head";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import classNames from "classnames";
import Image from "next/image";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import type { LightGallery } from "lightgallery/lightgallery";
import LightGalleryComponent from "lightgallery/react";

const tabs = [
  { key: "vienna", display: "Vienna Chronicles" },
  { key: "berg", display: "Berg" },
  { key: "portraits", display: "Portraits" },
  { key: "japan", display: "Japan" },
];

export default function Other() {
  const [breakpointCols, setBreakpointCols] = useState(2);
  const lightboxRef = useRef<LightGallery | null>(null);

  const [wienimages, setWienImages] = useState<string[]>([]);
  const [bergimages, setBergImages] = useState<string[]>([]);
  const [portraitimages, setPortraitImages] = useState<string[]>([]);
  const [japanimages, setJapanImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async (
      path: string,
      setState: React.Dispatch<React.SetStateAction<string[]>>,
      count: number
    ) => {
      const loadedImages = [];
      for (let i = 1; i <= count; i++) {
        try {
          const image = await import(`../public/pics/${path}/${path}${i}.jpg`);
          loadedImages.push(image.default);
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
        }
      }
      setState(loadedImages);
    };

    fetchImages("wien", setWienImages, 45);
    fetchImages("berg", setBergImages, 98);
    fetchImages("portraits", setPortraitImages, 61);
    fetchImages("japan", setJapanImages, 160);
  }, []);

  return (
    <div className="flex flex-col h-full bg-cover bg-bottom overflow-auto">
      <Head>
        <title>Other Portfolio</title>
      </Head>
      <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
        <span className="uppercase text-lg font-medium">Other Portfolio</span>
      </header>
      <main className="grow pt-[100px] w-full h-full z-10">
        <div className="flex flex-col h-full w-full">
          <TabGroup className="h-full w-full">
            <TabList className="flex items-center justify-center gap-5 pr-4">
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
                  breakpointCols={breakpointCols}
                  className="flex gap-2"
                  columnClassName=""
                >
                  {wienimages.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt="Vienna"
                      className="my-2 hover:opacity-85 cursor-pointer"
                      placeholder="blur"
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
                    src: image,
                    thumb: image,
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
                      alt="Berg"
                      className="my-2 hover:opacity-85 cursor-pointer"
                      placeholder="blur"
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
                    src: image,
                    thumb: image,
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
                      alt="Portrait"
                      className="my-2 hover:opacity-85 cursor-pointer"
                      placeholder="blur"
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
                    src: image,
                    thumb: image,
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
                      alt="Japan"
                      className="my-2 hover:opacity-85 cursor-pointer"
                      placeholder="blur"
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
                    src: image,
                    thumb: image,
                  }))}
                />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </main>
    </div>
  );
}
