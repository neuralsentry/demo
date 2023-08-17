"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Github } from "lucide-react";

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
        <div className="sm:px-4 xl:max-w-6xl mx-auto w-screen">
          <div className="navbar">
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
              <ul className="menu menu-horizontal gap-x-1">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <div className="dropdown dropdown-hover">
                  <li>
                    <Link href="/challenge">Challenge</Link>
                  </li>
                  <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 border-base-300 border rounded-box w-52">
                    <li>
                      <Link href="/leaderboard">Leaderboard</Link>
                    </li>
                    <li>
                      <Link href="/vulnerabilities">Vulnerabilities</Link>
                    </li>
                  </ul>
                </div>
                <li>
                  <Link href="/about">About</Link>
                </li>
              </ul>
            </div>

            <div className="navbar-end gap-x-2 hidden lg:flex">
              <div className="dropdown dropdown-hover dropdown-end">
                <button className="btn btn-square btn-outline btn-sm border-neutral-600">
                  <Github size={20} />
                </button>
                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 border border-base-300 rounded-box w-52">
                  <li>
                    <Link
                      href="https://github.com/neuralsentry"
                      target="_blank"
                    >
                      Homepage
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://github.com/neuralsentry/vulnfix-commit-llm-classifier"
                      target="_blank"
                    >
                      Commit Classifier
                    </Link>
                  </li>
                </ul>
              </div>

              <button className="btn btn-square btn-outline btn-sm border-neutral-600 hidden sm:flex">
                <Link
                  href="https://huggingface.co/neuralsentry"
                  target="_blank"
                >
                  <Image
                    src="/huggingface.svg"
                    alt="HuggingFace Logo"
                    width={29}
                    height={29}
                  />
                </Link>
              </button>
            </div>
          </div>

          <div className="p-0 m-0 divider"></div>
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="mobile-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-100 border-r border-base-300">
          <li>
            <h2 className="menu-title">Main</h2>
            <ul>
              <li>
                <Link href="/" onClick={() => setDrawer(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/challenge" onClick={() => setDrawer(false)}>
                  Challenge
                </Link>
              </li>

              <li>
                <Link href="/about" onClick={() => setDrawer(false)}>
                  About
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Challenge</h2>
            <ul>
              <li>
                <Link href="/leaderboard" onClick={() => setDrawer(false)}>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/vulnerabilities" onClick={() => setDrawer(false)}>
                  Vulnerabilities
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Our Work</h2>
            <ul>
              <li>
                <a href="https://github.com/neuralsentry" target="_blank">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/neuralsentry/vulnfix-commit-llm-classifier"
                  target="_blank"
                >
                  AI Commit Classifier
                </a>
              </li>
              <li>
                <a href="https://huggingface.co/neuralsentry" target="_blank">
                  HuggingFace
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
