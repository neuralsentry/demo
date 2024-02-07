import Link from "next/link";
import { Banner } from "./banner";

export default function Home() {
  return (
    <main className="flex flex-col items-center mb-52 md:mb-32 2xl:mb-12 px-2">
      <Banner />
      <header className="flex flex-col items-center text-center mt-[100px]">
        <h1 className="text-5xl md:text-6xl font-bold max-w-[500px] lg:max-w-full">
          Are you up for a <span className="text-secondary">challenge</span>?
        </h1>
        <p className="py-6 mt-2 max-w-[40ch] md:max-w-[50ch] lg:max-w-[60ch]">
          Test your skills and see if you can beat our Artificial Intelligence
          (AI) models in detecting vulnerabilities.
        </p>
        <div className="mt-10 gap-x-5">
          <Link href="/challenge">
            <button className="btn  btn-secondary btn-wide">Yes</button>
          </Link>
          <div className="divider">or</div>
          <Link href="/about">
            <button className="btn btn-wide">Learn more</button>
          </Link>
        </div>
      </header>
    </main>
  );
}
