"use client";

import clsx from "clsx";
import { useState } from "react";

import { CVEsTable } from "./cves-table";
import { NonVulnerableTable } from "./non-vulnerable-table";

export function PredictionTables() {
  const [selectVulnerable, setSelectVulnerable] = useState(true);

  return (
    <h2 className="mt-5 text-center text-lg">
      <span>Here's all the</span>
      <div className="mx-2 align-middle max-w-fit rounded-md items-center inline-flex p-[2px] bg-base-200">
        <button
          className={clsx(
            "btn join-item btn-xs btn-secondary",
            !selectVulnerable && "btn-ghost text-gray-400 font-normal"
          )}
          onClick={() => setSelectVulnerable(true)}
        >
          Vulnerable
        </button>
        <button
          className={clsx(
            "btn join-item btn-xs btn-success",
            selectVulnerable && "btn-ghost text-gray-400 font-normal"
          )}
          onClick={() => setSelectVulnerable(false)}
        >
          Non-vulnerable
        </button>
      </div>
      <span>functions predicted by our AI models</span>
      {selectVulnerable ? <CVEsTable /> : <NonVulnerableTable />}
    </h2>
  );
}
