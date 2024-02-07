"use client";

export function Banner() {
  return (
    <div className="bg-primary w-screen flex items-center justify-center px-10 lg:px-36 py-4 sm:py-2 flex-wrap">
        <h2 className="md:text-lg text-center">Featured in Singapore Polytechnic's I&I Showcase 2024!</h2>
        <a target="_blank" href="https://www.sp.edu.sg/soc/spii/spii2024"><button className="btn btn-secondary btn-sm min-w-[50%] sm:min-w-0 sm:ml-6">Learn more</button></a>
    </div>
  );
}