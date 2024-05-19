"use client";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useState } from "react";

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
    <div className="flex flex-col h-full bg-[url('/photographer-bg.jpg')] bg-cover bg-bottom">
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
          className="rounded-3xl bg-white text-stone-700 px-3 py-2 hover:bg-opacity-30"
        >
          Get in touch
        </Link>
      </header>

      <main className=" grow pt-[110px] w-full h-full z-10">
        <div className="flex flex-col  h-full w-full">
          <TabGroup className="h-full w-full">
            <TabList className="flex items-center justify-center gap-12">
              {tabs.map((tab) => (
                <Tab key={tab.key} className="p-2">
                  {({ selected }) => (
                    <span
                      className={selected ? "text-stone-800" : "text-stone-400"}
                    >
                      {tab.display}
                    </span>
                  )}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="flex gap-12 bg-stone-100 bg-opacity-60 p-2 h-full sm:p-4 my-6">
              <TabPanel>
                <div className="">test</div>
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
