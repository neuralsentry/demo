"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";

import { axios } from "@/shared/axios";
import clsx from "clsx";

export function NonVulnerableTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div>
      <div className="mt-5 flex flex-col-reverse items-center gap-y-2 md:items-end md:flex-row md:justify-between">
        <div>
          <select
            className="select select-bordered join-item select-sm"
            defaultValue="10"
            disabled
          >
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
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
                  disabled
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
    </div>
  );
}
