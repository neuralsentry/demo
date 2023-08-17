"use client";

import clsx from "clsx";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { axios } from "@/shared/axios";
import { CodeBlock } from "@/app/challenge/components/code-block";

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

async function getCVEs(
  limit = 10,
  page = 1,
  includeCode = true
): Promise<CVE[]> {
  const res = await axios.get("/cves", {
    params: {
      limit,
      page,
      num_lines: 1000000000, // get all functions
      include_code: includeCode ? "" : undefined
    }
  });

  return res.data.data;
}

async function getCVEsCount(): Promise<number> {
  const res = await axios.get("/cves/count");

  return res.data.data.count;
}

export type CVE = {
  id: number;
  name: string;
  funcs: Func[];
};

export type Func = {
  id: number;
  code: string;
  labels: number;
  num_lines: number;
  cve_name: string;
  model_predictions: ModelPrediction[];
};

export type ModelPrediction = {
  id: number;
  prediction: number;
  probability: number;
  model_id: number;
  func_id: number;
};

export function CVEsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("search", search);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams]
  );

  useEffect(() => {
    handleSearch(search);
  }, [search]);

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  function nextPage() {
    if (count.data && page === Math.ceil(count.data / itemsPerPage)) {
      return;
    }
    setPage((prev) => prev + 1);
  }

  function prevousPage() {
    if (page === 1) {
      return;
    }
    setPage((prev) => prev - 1);
  }

  const handlePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`${pathname}?${params.toString()}`);
    },
    [page]
  );

  useEffect(() => {
    handlePage(page);
  }, [page]);

  const [itemsPerPage, setItemsPerPage] = useState(
    Number(searchParams.get("itemsPerPage")) || 2
  );

  const handleItemsPerPage = useCallback(
    (itemsPerPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("itemsPerPage", String(itemsPerPage));
      router.push(`${pathname}?${params.toString()}`);
    },
    [itemsPerPage]
  );

  useEffect(() => {
    handleItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  const cves = useQuery({
    queryKey: ["cves", page, itemsPerPage],
    queryFn: async () => getCVEs(itemsPerPage, page),
    keepPreviousData: true
  });
  const count = useQuery({ queryKey: ["cvesCount"], queryFn: getCVEsCount });

  const [funcIndex, setFuncIndex] = useState(0);

  return (
    <div>
      <div className="mt-5 flex flex-col-reverse items-center gap-y-2 md:items-end md:flex-row md:justify-between">
        <div>
          <select
            className="select select-bordered join-item select-sm"
            defaultValue="2"
            onChange={(e) => {
              setItemsPerPage(+e.target.value);
            }}
          >
            <option>2</option>
            <option>5</option>
            <option>10</option>
          </select>
          <span className="ml-2 text-sm text-gray-400">per page</span>
        </div>

        <div>
          <div className="join">
            <div>
              <div>
                <input
                  className="input input-bordered join-item input-sm"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <select
              className="select select-bordered join-item select-sm"
              defaultValue="All"
              disabled
            >
              <option>All</option>
              <option>CVE</option>
              <option>CWE</option>
              <option>Description</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-2 overflow-x-auto">
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
            {cves.isLoading ? (
              <tr>
                <td className="text-center" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : cves.isError ? (
              <tr>
                <td className="text-center" colSpan={5}>
                  Error
                </td>
              </tr>
            ) : (
              cves.data.map((cve) => {
                const correctPredictionsV1 = cve.funcs.reduce(
                  (acc, func) =>
                    acc +
                    func.model_predictions?.filter(
                      (p) => p.prediction === 1 && p.model_id === 1
                    ).length,
                  0
                );
                const correctPredictionsV2 = cve.funcs.reduce(
                  (acc, func) =>
                    acc +
                    func.model_predictions?.filter(
                      (p) => p.prediction === 1 && p.model_id === 2
                    ).length,
                  0
                );

                return (
                  <tr className="hover" key={cve.id}>
                    <th>{cve.id}</th>
                    <td>
                      <div className="indicator">
                        <a
                          className="link link-hover"
                          href={`https://nvd.nist.gov/vuln/detail/${cve.name}`}
                          target="_blank"
                        >
                          <ExternalLink className="indicator-item z-[-10]" size={14} />
                          <span className="pr-2">{cve.name}</span>
                        </a>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs px-5"
                        onClick={() => {
                          setFuncIndex(0);
                          (window as any)[`${cve.name}-modal`].showModal();
                        }}
                      >
                        {cve.funcs.length}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-x-4">
                        <div className="indicator">
                          <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
                            <div
                              className="tooltip"
                              data-tip={"Trained on 30,000 functions"}
                            >
                              <Info
                                size={14}
                                strokeWidth={3}
                                className="mb-1"
                              />
                            </div>
                          </span>
                          <p className="font-light text-gray-300 text-xs">V1</p>
                        </div>
                        <div>
                          <p className="font-light text-gray-300 text-xs">
                            {correctPredictionsV1} of {cve.funcs.length} correct
                          </p>
                          <progress
                            className="progress progress-success w-56"
                            value={correctPredictionsV1}
                            max={cve.funcs.length}
                          ></progress>
                        </div>
                      </div>
                      <div className="flex items-center gap-x-4 mt-2">
                        <div className="indicator">
                          <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
                            <div
                              className="tooltip"
                              data-tip={"Trained on 70,000 functions"}
                            >
                              <Info
                                size={14}
                                strokeWidth={3}
                                className="mb-1"
                              />
                            </div>
                          </span>
                          <p className="font-light text-gray-300 text-xs">V2</p>
                        </div>
                        <div>
                          <p className="font-light text-gray-300 text-xs">
                            {correctPredictionsV2} of {cve.funcs.length} correct
                          </p>
                          <progress
                            className="progress progress-success w-56"
                            value={correctPredictionsV2}
                            max={cve.funcs.length}
                          ></progress>
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-xs btn-ghost px-5"
                        onClick={() => {
                          setFuncIndex(0);
                          (window as any)[`${cve.name}-modal`].showModal();
                        }}
                      >
                        View
                      </button>
                      <dialog id={`${cve.name}-modal`} className="modal">
                        <form method="dialog" className="modal-box">
                          <h3 className="font-bold text-xl text-center">
                            {cve.name}
                          </h3>
                          <p className="mt-2 text-sm text-gray-400 text-center">
                            Showing {funcIndex + 1} of {cve.funcs.length}{" "}
                            functions
                          </p>

                          <p className="mt-2 text-xs text-gray-400 text-center">
                            Predictions:
                          </p>
                          <div className="mt-1 flex justify-center items-center gap-x-2">
                            <div
                              className={clsx(
                                "badge",
                                cve.funcs[funcIndex]?.labels ==
                                  cve.funcs[funcIndex]?.model_predictions?.[0]
                                    ?.prediction
                                  ? "badge-success"
                                  : "badge-error"
                              )}
                            >
                              V1
                            </div>
                            <div
                              className={clsx(
                                "badge",
                                cve.funcs[funcIndex]?.labels ==
                                  cve.funcs[funcIndex]?.model_predictions?.[1]
                                    ?.prediction
                                  ? "badge-success"
                                  : "badge-error"
                              )}
                            >
                              V2
                            </div>
                          </div>
                          <CodeBlock
                            className="max-h-[210px] rounded-md mt-4"
                            code={cve.funcs[funcIndex]?.code}
                            language="cpp"
                          />
                          <div className="mt-5 gap-x-5 flex justify-between items-end">
                            <div
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                if (funcIndex > 0) {
                                  setFuncIndex(funcIndex - 1);
                                }
                              }}
                            >
                              Previous
                            </div>
                            <div
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                if (funcIndex < cve.funcs.length - 1) {
                                  setFuncIndex(funcIndex + 1);
                                }
                              }}
                            >
                              Next
                            </div>
                          </div>
                          <div className="modal-action">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn mx-auto">Close</button>
                          </div>
                        </form>
                      </dialog>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-y-2 flex-col-reverse md:flex-row justify-between ">
        <div>
          <p className="text-sm text-gray-400">
            Showing
            {cves.data?.length ? " " + page : " 0"} of{" "}
            {count.data ? Math.ceil((count.data as number) / itemsPerPage) : 0}{" "}
            pages, {count.data} CVEs
          </p>
        </div>

        <div className="join">
          {[cves.isSuccess, count.isSuccess].every(Boolean) && (
            <>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={prevousPage}
              >
                Previous
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={() => setPage(1)}
              >
                1
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={() => setPage(2)}
              >
                2
              </button>
              <button className="join-item btn btn-disabled btn-sm">
                {page}
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={() =>
                  setPage(Math.ceil((count.data as number) / itemsPerPage) - 1)
                }
              >
                {Math.ceil((count.data as number) / itemsPerPage) - 1}
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={() =>
                  setPage(Math.ceil((count.data as number) / itemsPerPage))
                }
              >
                {Math.ceil((count.data as number) / itemsPerPage)}
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={nextPage}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
