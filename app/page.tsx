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

      <header className="flex justify-between items-center h-[90px] px-6">
        <div className="text-transparent">hm get in touch</div>
        <div className="text-center">Portfolio</div>
        <Link
          href="#"
          className="rounded-3xl bg-stone-100 px-3 py-2 hover:bg-opacity-30"
        >
          Get in touch
        </Link>
      </header>

      <main className="grow">
        <div className="flex flex-col items-center">
          <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            {" "}
            <TabList className="flex items-center gap-14">
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
            <TabPanels>
              <TabPanel>All Photos</TabPanel>
              <TabPanel>Portraits</TabPanel>
              <TabPanel>Landscapes</TabPanel>
            </TabPanels>
          </TabGroup>{" "}
        </div>
      </main>

      <footer className="h-[60px]">
        <p>Placeholder</p>
      </footer>
    </div>
  );
}
