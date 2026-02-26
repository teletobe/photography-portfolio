"use client";
import { useState } from "react";
import { Tab, TabList } from "@headlessui/react";
import classNames from "classnames";

export default function TabNavigation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [otherTabSelected, setOtherTabSelected] = useState(true);

  return (
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
                key="others"
                className="p-2"
                onClick={() => {
                  setSelectedTab("others");
                  setShowDropdown(false);
                }}
              >
                {({ selected }) => (
                  <span
                    className={classNames(
                      "text-sm",
                      selected ? "text-stone-800" : "text-stone-400"
                    )}
                  >
                    b-roll
                  </span>
                )}
              </Tab>
              <Tab
                key="art"
                className="p-2"
                onClick={() => {
                  setSelectedTab("art");
                  setShowDropdown(false);
                }}
              >
                {({ selected }) => (
                  <span
                    className={classNames(
                      "text-sm",
                      selected ? "text-stone-800" : "text-stone-400"
                    )}
                  >
                    concept
                  </span>
                )}
              </Tab>
              <Tab
                key="street"
                className="p-2"
                onClick={() => {
                  setSelectedTab("street");
                  setShowDropdown(false);
                }}
              >
                {({ selected }) => (
                  <span
                    className={classNames(
                      "text-sm",
                      selected ? "text-stone-800" : "text-stone-400"
                    )}
                  >
                    street
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
                      "text-sm",
                      selected ? "text-stone-800" : "text-stone-400"
                    )}
                  >
                    people
                  </span>
                )}
              </Tab>
            </div>
          </div>
        )}
      </div>
    </TabList>
  );
}
