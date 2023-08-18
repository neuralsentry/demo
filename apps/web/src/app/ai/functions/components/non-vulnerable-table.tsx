"use client";

import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect, useMemo } from "react";

import { axios } from "@/shared/axios";
import clsx from "clsx";
import { useDebounce, useLocalStorage } from "usehooks-ts";
import { Func } from "./cves-table";
import { CodeBlock } from "@/app/challenge/components/code-block";

async function getNonVulnFunctions(limit = 10, page = 1): Promise<Func[]> {
  const res = await axios.get("/functions", {
    params: {
      limit,
      page,
      nonVulnOnly: true
    }
  });

  return res.data.data;
}
async function getNonVulnFunctionsCount(limit = 10, page = 1): Promise<number> {
  const res = await axios.get("/non-vulnerable-functions-count", {
    params: {
      limit,
      page,
      nonVulnOnly: true
    }
  });

  return res.data.data.count;
}

export function NonVulnerableTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);

  function calculateNumPages(items: number, perPage: number) {
    return Math.ceil(items / perPage);
  }

  function nextPage(numPages: number) {
    if (page >= numPages) return;
    setPage((prev) => prev + 1);
  }

  function prevousPage() {
    if (page === 1) return;
    setPage((prev) => prev - 1);
  }

  const [perPage, setPerPage] = useState(2);

  const [delay, setDelay] = useLocalStorage("delay", 1500);

  const debounced = useDebounce({ page, perPage }, delay);

  const funcs = useQuery({
    queryKey: ["non-vuln-functions", debounced],
    queryFn: () => getNonVulnFunctions(debounced.perPage, debounced.page),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  const count = useQuery({
    queryKey: ["non-vuln-functions-count", debounced],
    queryFn: () => getNonVulnFunctionsCount(debounced.perPage, debounced.page),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });

  const numPages = useMemo(() => {
    if (count.isSuccess) {
      return calculateNumPages(count.data, perPage);
    }
    return 1;
  }, [count.data, count.isSuccess, perPage]);

  const isLoading = useMemo(
    () =>
      [
        funcs.isLoading,
        count.isLoading,
        debounced.page !== page,
        debounced.perPage !== perPage
      ].some(Boolean),
    [
      funcs.isLoading,
      count.isLoading,
      debounced.page,
      page,
      debounced.perPage,
      perPage
    ]
  );

  return (
    <div>
      <section className="mt-5 flex flex-col-reverse items-center gap-y-2 md:items-end md:flex-row md:justify-between">
        <div className="flex items-center gap-x-4">
          <div>
            <select
              className="select select-bordered join-item select-sm"
              defaultValue="2"
            >
              <option>2</option>
              <option>5</option>
              <option>10</option>
            </select>
            <span className="ml-2 text-sm text-gray-400">per page</span>
          </div>
        </div>

        <div></div>
      </section>

      <div className="mt-2 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Function</th>
              <th>Model Prediction</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="text-center" colSpan={3}>
                  Loading...
                </td>
              </tr>
            ) : funcs.isError ? (
              <tr>
                <td className="text-center" colSpan={3}>
                  Error
                </td>
              </tr>
            ) : funcs.data?.length === 0 ? (
              <tr>
                <td className="text-center" colSpan={3}>
                  No data
                </td>
              </tr>
            ) : (
              funcs?.data?.map((func) => {
                const isV1Correct =
                  func.model_predictions.find((f) => f.model_id === 1)
                    ?.prediction === func.labels;
                const isV2Correct =
                  func.model_predictions.find((f) => f.model_id === 2)
                    ?.prediction === func.labels;

                return (
                  <tr key={"func" + func.id}>
                    <th>{func.id}</th>
                    <td>
                      <button
                        onClick={() => {
                          (window as any)[`func-${func.id}-modal`].showModal();
                        }}
                      >
                        View Code
                      </button>
                      <dialog id={`func-${func.id}-modal`} className="modal">
                        <form method="dialog" className="modal-box">
                          <h3 className="font-bold text-xl text-center">
                            Function #{func.id}
                          </h3>
                          <CodeBlock
                            className="max-h-[210px] rounded-md mt-4"
                            code={func.code}
                            language="cpp"
                          />
                          <div className="flex justify-center">
                            <button className="btn mt-4">Close</button>
                          </div>
                        </form>
                      </dialog>
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
                            {isV1Correct ? 1 : 0} of 1 correct
                          </p>
                          <progress
                            className="progress progress-success w-56"
                            value={isV1Correct ? 1 : 0}
                            max={1}
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
                            {isV2Correct ? 1 : 0} of 1 correct correct
                          </p>
                          <progress
                            className="progress progress-success w-56"
                            value={isV2Correct ? 1 : 0}
                            max={1}
                          ></progress>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-4 flex items-center gap-y-2 flex-col-reverse md:flex-row justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Showing {page} of{" "}
            {count.data ? calculateNumPages(count.data, perPage) : 1} pages,{" "}
            {count.data} functions
          </p>
        </div>

        <div className="join">
          {[funcs.isSuccess, count.isSuccess].every(Boolean) && (
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
                onClick={() => setPage(numPages - 1)}
              >
                {numPages - 1}
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={() => setPage(numPages)}
              >
                {numPages}
              </button>
              <button
                className="join-item btn border-base-300 btn-sm bg-base-100"
                onClick={() => nextPage(numPages)}
              >
                Next
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
