import { clsx } from "clsx";

type IndicatorProps = {
  width?: number;
  height?: number;
  status?: "success" | "error" | "neutral" | "current";
};

function Indicator({
  width = 20,
  height = 5,
  status = "neutral"
}: IndicatorProps) {
  return (
    <div
      className={clsx(
        `w-[20px]`,
        `h-[5px]`,
        {
          "bg-success": status === "success",
          "bg-error": status === "error",
          "bg-neutral": status === "neutral",
          "bg-gray-300": status === "current"
        },
        "rounded-sm",
        "block"
      )}
    ></div>
  );
}

type ProgressIndicatorProps = {
  total: number;
  current: number;
  errorIndexes?: number[];
};

export function ProgressIndicator({
  total,
  current,
  errorIndexes = []
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center h-10 gap-2">
      {Array(total)
        .fill(0)
        .map((_, i) => {
          const isComplete = i < current;
          const isError = errorIndexes.includes(i);

          let label = "neutral";
          if (isComplete) {
            label = isError ? "error" : "success";
          }
          if (i === current) {
            label = "current";
          }

          return <Indicator key={i} status={label as any} />;
        })}
    </div>
  );
}
