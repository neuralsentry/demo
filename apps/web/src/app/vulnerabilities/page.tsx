import { ExternalLink } from "lucide-react";
import Link from "next/link";

async function getFunctions() {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/functions`);
  url.searchParams.append("limit", "10");
  const res = await fetch(url.toString(), {
    cache: "no-cache"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch functions");
  }

  return res.json();
}

async function getCVEs(limit: number = 10, page: number = 1): Promise<CVE[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/cves`);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("page", page.toString());
  url.searchParams.append("num_lines", "1000000000".toString());
  const res = await fetch(url.toString(), {
    cache: "no-cache"
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CVEs");
  }

  const data = await res.json();

  return data.data;
}

type CVE = {
  id: number;
  name: string;
  funcs: Func[];
};

type Func = {
  id: number;
  code: string;
  labels: number;
  num_lines: number;
  cve_name: string;
  model_predictions: ModelPrediction[];
};

type ModelPrediction = {
  id: number;
  prediction: number;
  probability: number;
  model_id: number;
  func_id: number;
};

export default async function Vulnerabilities() {
  let data: CVE[] = [];
  try {
    data = await getCVEs();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }

  return (
    <main className="mb-10">
      <h1 className="text-center text-5xl font-bold mt-10">Vulnerabilities</h1>
      <h2 className="text-center text-lg mt-2">
        Here's all the vulnerable functions our models can detect
      </h2>
      <div className="mt-10 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>CVE</th>
              <th>Num. Functions</th>
              <th>Model Prediction</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((cve) => {
              const correctPredictions = cve.funcs.reduce(
                (acc, func) =>
                  acc +
                  func.model_predictions?.filter((p) => p.prediction === 1)
                    .length,
                0
              );

              return (
                <tr className="hover">
                  <th>{cve.id}</th>
                  <td>
                    <div className="indicator">
                      <a
                        className="link link-hover"
                        href={`https://nvd.nist.gov/vuln/detail/${cve.name}`}
                        target="_blank"
                      >
                        <ExternalLink className="indicator-item" size={14} />
                        <span className="pr-2">{cve.name}</span>
                      </a>
                    </div>
                  </td>
                  <td>
                    <Link
                      className="btn btn-xs px-5"
                      href={`/cve/${cve.name}#functions`}
                    >
                      {cve.funcs.length}
                    </Link>
                  </td>
                  <td>
                    <p className="font-light text-gray-300 text-xs">
                      {correctPredictions} of {cve.funcs.length} correct
                    </p>
                    <progress
                      className="progress progress-success w-56"
                      value={correctPredictions}
                      max={cve.funcs.length}
                    ></progress>
                  </td>
                  <td>
                    <Link
                      className="btn btn-xs btn-ghost px-5"
                      href={`/cve/${cve.name}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
