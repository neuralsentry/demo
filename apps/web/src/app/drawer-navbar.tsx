"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDownIcon, Github, Newspaper } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

export function DrawerNavbar({ children }: Props) {
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="drawer">
      <input
        id="mobile-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawer}
        onChange={() => setDrawer(!drawer)}
      />
      <div className="drawer-content">
        <div className="sm:px-4 xl:max-w-6xl mx-auto w-screen static">
          <div className="navbar bg-base-100 relative z-50">
            <div className="navbar-start">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="mobile-drawer"
                  className="btn btn-square btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <Link href="/" className="btn btn-ghost">
                <Image
                  src="/neuralsentry-full.svg"
                  alt="Neuralsentry Logo"
                  width={220}
                  height={240}
                  priority
                />
              </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal gap-x-1 items-center">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <div className="dropdown dropdown-hover">
                  <li>
                    <p className="group">
                      Challenge
                      <ChevronDownIcon className="transition-transform group-hover:rotate-180" />
                    </p>
                  </li>
                  <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 border-base-300 border rounded-box w-52">
                    <li>
                      <Link href="/challenge" className="block">
                        Play
                        <span className="text-xs text-gray-500">
                          <br />
                          Try and beat AI models
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ai/functions"
                        onClick={() => setDrawer(false)}
                        className="block"
                      >
                        Functions
                        <span className="text-xs text-gray-500">
                          <br />
                          Predictions made by AI
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </ul>
            </div>

            <div className="navbar-end gap-x-2 hidden lg:flex items-center">
              <div className="dropdown dropdown-hover dropdown-end">
                <button className="btn btn-square btn-outline btn-sm border-neutral-600">
                  <a
                    href="https://github.com/neuralsentry/vulnfix-commit-llm-classifier"
                    target="_blank"
                    className="block"
                  >
                    <Github size={20} strokeWidth={2.5} />
                  </a>
                </button>
                <ul className="dropdown-content absolute menu p-2 shadow bg-base-100 border border-base-300 rounded-box w-52">
                  <li>
                    <a
                      href="https://github.com/neuralsentry/vulnfix-commit-llm-classifier"
                      target="_blank"
                      className="block"
                    >
                      NLP Commit Classifier
                      <br />
                      <span className="text-xs text-gray-500">
                        The tool utilising our AI NLP model
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="dropdown dropdown-hover dropdown-end">
                <button className="btn btn-square btn-outline btn-sm border-neutral-600 mt-1">
                  <a
                    href="https://huggingface.co/neuralsentry"
                    target="_blank"
                    className="block"
                  >
                    <Image
                      src="/huggingface.svg"
                      alt="HuggingFace Logo"
                      width={29}
                      height={29}
                    />
                  </a>
                </button>
                <ul className="dropdown-content absolute menu p-2 shadow bg-base-100 border border-base-300 rounded-box w-52">
                  <li>
                    <a
                      href="https://huggingface.co/neuralsentry"
                      target="_blank"
                      className="block"
                    >
                      HuggingFace
                      <br />
                      <span className="text-xs text-gray-500">
                        Our AI models and datasets
                      </span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="dropdown dropdown-hover dropdown-end">
                <button className="btn btn-square btn-outline btn-sm border-neutral-600 mt-1">
                  <a
                    href="https://drive.google.com/file/d/1swedlrjc0KrED4Cz1RtUNDBk9Ns3KS5H/view?usp=sharing"
                    target="_blank"
                    className="block"
                  >
                    <Newspaper size={20} />
                  </a>
                </button>
                <ul className="dropdown-content absolute menu p-2 shadow bg-base-100 border border-base-300 rounded-box w-52">
                  <li>
                    <a
                      href="https://drive.google.com/file/d/1swedlrjc0KrED4Cz1RtUNDBk9Ns3KS5H/view?usp=sharing"
                      target="_blank"
                      className="block"
                    >
                      Report
                      <br />
                      <span className="text-xs text-gray-500">
                        Our Academic Report
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-2 m-0 divider bg-base-100 h-0 relative z-20"></div>
          {children}
        </div>
      </div>
      <div className="drawer-side z-50">
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 overflow-y-auto flex-nowrap h-full bg-base-100 border-r border-base-300">
          <li>
            <h2 className="menu-title">Main</h2>
            <ul>
              <li>
                <Link
                  href="/"
                  onClick={() => setDrawer(false)}
                  className="block"
                >
                  Home
                  <br />
                  <span className="text-xs text-gray-500">
                    This is home, truly{" "}
                    <Image
                      className="inline-block align-middle"
                      src="/sg.svg"
                      width={12}
                      height={12}
                      alt="Singapore flag"
                    />{" "}
                    .
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setDrawer(false)}
                  className="block"
                >
                  About{" "}
                  <span className="text-xs text-gray-500">
                    <br />
                    Learn more about our project
                  </span>
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Challenge</h2>
            <ul>
              <li>
                <Link
                  href="/challenge"
                  onClick={() => setDrawer(false)}
                  className="block"
                >
                  Play
                  <span className="text-xs text-gray-500">
                    <br />
                    Try and beat AI models
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/ai/functions"
                  onClick={() => setDrawer(false)}
                  className="block"
                >
                  Functions
                  <span className="text-xs text-gray-500">
                    <br />
                    Predictions made by AI
                  </span>
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Our Work</h2>
            <ul>
              <li>
                <a
                  href="https://huggingface.co/neuralsentry"
                  target="_blank"
                  className="block"
                >
                  HuggingFace
                  <br />
                  <span className="text-xs text-gray-500">
                    Our AI models and datasets
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/neuralsentry/vulnfix-commit-llm-classifier"
                  target="_blank"
                  className="block"
                >
                  AI Commit Classifier
                  <br />
                  <span className="text-xs text-gray-500">
                    The tool utilising our AI NLP model
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://drive.google.com/file/d/1swedlrjc0KrED4Cz1RtUNDBk9Ns3KS5H/view?usp=sharing"
                  target="_blank"
                  className="block"
                >
                  Report
                  <br />
                  <span className="text-xs text-gray-500">
                    Our Academic Report
                  </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
