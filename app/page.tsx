"use client";
import Head from "next/head";
import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { useEffect, useState } from "react";

import {
  usePortfolioImages,
  useBergImages,
  useArtImages,
  useStreetImages,
  usePortraitImages,
} from "./hooks/useImages";
import WelcomeOverlay from "./components/WelcomeOverlay";
import Header from "./components/Header";
import ImageGallery from "./components/ImageGallery";
import TabNavigation from "./components/TabNavigation";

export default function Home() {
  const [breakpointCols, setBreakpointCols] = useState(2);
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const { images, isLoading, isRemainingLoading } = usePortfolioImages();
  const otherImages = useBergImages();
  const artImages = useArtImages();
  const streetImages = useStreetImages();
  const portraitImages = usePortraitImages();

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

      <WelcomeOverlay show={showWelcomeOverlay} fadeOut={fadeOut} />

      <div className="fixed left-0 top-0 w-full h-full z-10 from-stone-50 bg-gradient-to-b"></div>

      <Header
        breakpointCols={breakpointCols}
        setBreakpointCols={setBreakpointCols}
      />

      <main className="grow pt-[100px] w-full h-full z-10">
        <div className="contentInner flex flex-col  h-full w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="spinner"></div>
              <p>loading...</p>
            </div>
          ) : (
            <TabGroup className="h-full w-full">
              <TabNavigation />
              <TabPanels className="tabPanelsContainer flex gap-12 bg-opacity-60 p-2 h-full sm:p-4 my-6">
                <TabPanel>
                  <ImageGallery
                    images={images}
                    breakpointCols={breakpointCols}
                    isRemainingLoading={isRemainingLoading}
                  />
                </TabPanel>
                <TabPanel>
                  <ImageGallery
                    images={otherImages}
                    breakpointCols={breakpointCols}
                  />
                </TabPanel>
                <TabPanel>
                  <ImageGallery
                    images={artImages}
                    breakpointCols={breakpointCols}
                  />
                </TabPanel>
                <TabPanel>
                  <ImageGallery
                    images={streetImages}
                    breakpointCols={breakpointCols}
                  />
                </TabPanel>
                <TabPanel>
                  <ImageGallery
                    images={portraitImages}
                    breakpointCols={breakpointCols}
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
