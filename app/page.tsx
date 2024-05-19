"use client";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useState } from "react";
import Masonry from "react-masonry-css";
import classNames from "classnames";

const tabs = [
  {
    key: "all",
    display: "All",
  },
  {
    key: "people",
    display: "People",
  },
  {
    key: "landscapes",
    display: "Landscapes",
  },
];

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="flex flex-col h-full bg-[url('/photographer-bg.jpg')] bg-cover bg-bottom overflow-auto">
      <Head>
        <title>Title for pages</title>
      </Head>

      <div className="fixed left-0 top-0 w-full h-full z-10 from-stone-50 bg-gradient-to-b"></div>

      <header className="fixed top-0 w-full z-30 flex justify-between items-center h-[90px] px-10">
        <span className="uppercase text-lg font-medium">
          Photography Portfolio
        </span>
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
                  breakpointCols={3}
                  className="flex gap-2"
                  columnClassName=""
                >
                  <img src="/pics/all/pf1.jpg" alt="image-1" className="my-2" />
                  <img src="/pics/all/pf2.jpg" alt="image-2" className="my-2" />
                  <img src="/pics/all/pf3.jpg" alt="image-3" className="my-2" />
                  <img src="/pics/all/pf4.jpg" alt="image-4" className="my-2" />
                  <img src="/pics/all/pf5.jpg" alt="image-5" className="my-2" />
                  <img src="/pics/all/pf6.jpg" alt="image-6" className="my-2" />
                  <img src="/pics/all/pf7.jpg" alt="image-7" className="my-2" />
                  <img src="/pics/all/pf8.jpg" alt="image-8" className="my-2" />
                </Masonry>
              </TabPanel>
              <TabPanel>
                <div className=""></div>
              </TabPanel>
              <TabPanel>
                <div className=""></div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </main>

      <footer className="h-[80px] flex justify-center items-center uppercase text-lg font-medium z-20">
        <p>Photography portfolio</p>
      </footer>
    </div>
  );
}
