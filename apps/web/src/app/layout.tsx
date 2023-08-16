import Image from "next/image";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Link from "next/link";
import { Github } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Challenge | NeuralSentry",
  description: "Generated by create next app"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="xl:max-w-6xl px-4 mx-auto">
          <div className="navbar">
            <div className="navbar-start">
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
            <div className="navbar-end flex gap-x-2">
              <div className="dropdown dropdown-hover">
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
              <button className="btn btn-square btn-outline btn-sm border-neutral-600">
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
      </body>
    </html>
  );
}
