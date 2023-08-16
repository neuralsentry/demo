import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <header className="flex flex-col items-center text-center mt-[100px]">
        <h1 className="mt-10 text-6xl font-bold">
          Are you up for a <span className="text-secondary">challenge</span>?
        </h1>
        <p className="py-6 max-w-[60ch] mt-2">
          Test your skills and see if you can detect more vulnerable C/C++
          functions than our Artificial Intelligence (AI) model.
        </p>
        <div className="mt-10 gap-x-5">
          <Link href="/challenge">
            <button className="btn btn-secondary btn-wide">Yes</button>
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
