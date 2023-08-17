"use client";

import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";
import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInterval, useLocalStorage } from "usehooks-ts";

import { CodeBlock } from "./components/code-block";
import { ProgressIndicator } from "./components/progress-indicator.component";
import { axios } from "@/shared/axios";
import { Func } from "../ai/components/cves-table";
import { useQuery } from "@tanstack/react-query";

async function getFunctions(): Promise<Func[]> {
  const res = await axios.get("/functions", {
    params: {
      randomise: true,
      limit: 10,
      maxNumLines: 10,
      minNumLines: 5
    }
  });

  return res.data.data;
}

const headings = [
  "Hmmm, what about this one?",
  "What about this one?!",
  "Is this one vulnerable?",
  "Can you spot the flaw?",
  "Interesting 🤔",
  "This looks super suspicious!",
  "What do you think?",
  "This one is tricky!",
  "I'm not sure about this one...",
  "Whoa, this one is tough!"
];

type Question = {
  id: number;
  function: string;
  labels: number;
  cve?: string;
};

type ModelQuestionPrediction = {
  id: number;
  question_id: number;
  prediction: number;
};

// const modelQuestionPredictions: ModelQuestionPrediction[] = Array(10)
//   .fill(0)
//   .map((_, i) => ({
//     id: i + 1,
//     question_id: i + 1,
//     model: "StarEncoder",
//     description:
//       "StarEncoder model trained on a balanced dataset of 71,214 functions from 508 different C/C++ projects.",
//     num_epochs: 10,
//     eval_split: 0.1,
//     revision: "61806c08f5760d5c21d3dcafc7a81f0e55561f19",
//     model_url:
//       "https://huggingface.co/neuralsentry/vulnerabilityDetection-StarEncoder-BigvulCvefixesDevignReveal",
//     prediction: Math.random() > 0.7 ? 1 : 0
//   }));

const cpuIterationsPerSecond = 1;
const gpuIterationsPerSecond = 70;

export default function Start() {
  const [CPUCurrent, setCPUCurrent] = useState(0);
  const [GPUCurrent, setGPUCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [choiceIndex, setChoiceIndex] = useState(-1);
  const [miliseconds, setMiliseconds] = useState(30 * 1000);
  const [isStarted, setIsStarted] = useState(false);
  const [displayHelp, setDisplayHelp] = useLocalStorage("displayHelp", true);

  const funcs = useQuery({ queryKey: ["functions"], queryFn: getFunctions });

  const handleStartClick = () => {
    setIsStarted(true);
  };

  const incorrectUserAnswerIndexes = useMemo(
    () =>
      funcs.isSuccess &&
      userAnswers.reduce((acc, answer, i) => {
        const func = funcs.data[i];
        if (answer === func.labels) {
          return acc;
        }
        return [...acc, i];
      }, [] as number[]),
    [userAnswers]
  );

  const isComplete = userAnswers.length === 10 || miliseconds === 0;

  useInterval(() => {
    if (!isStarted) {
      return;
    }

    if (CPUCurrent === 10) {
      return;
    }
    setCPUCurrent((current) => current + 1);
  }, 1000 / cpuIterationsPerSecond);

  useInterval(() => {
    if (!isStarted) {
      return;
    }

    if (GPUCurrent === 10) {
      return;
    }
    setGPUCurrent((current) => current + 1);
  }, 1000 / gpuIterationsPerSecond);

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    if (miliseconds === 0) {
      return;
    }

    if (isComplete) {
      return;
    }

    const interval = setInterval(() => {
      setMiliseconds((prev) => prev - 10);
    }, 10);

    return () => clearInterval(interval);
  }, [miliseconds, isStarted, isComplete]);

  function handleNextClick() {
    if (userAnswers.length === 10) {
      return;
    }
    if (choiceIndex === -1) {
      return;
    }
    setUserAnswers((answers) => [...answers, choiceIndex === 0 ? 1 : 0]);
    setChoiceIndex(-1);
  }

  function handleChoiceClick(index: number) {
    if (!isStarted) {
      return;
    }

    setChoiceIndex((prev) => (index === prev ? -1 : index));
  }

  const currentHeading = useMemo(() => {
    if (userAnswers.length === 0) {
      return "Is this function vulnerable?";
    }

    const random = Math.floor(Math.random() * headings.length);
    return headings[random];
  }, [userAnswers]);

  useEffect(() => {
    if (displayHelp && window) {
      (window as any).help_modal?.close();
      (window as any).help_modal?.showModal();
    }
  }, [displayHelp]);

  useEffect(() => {
    if (isComplete) {
      (window as any).quiz_complete_modal?.close();
      (window as any).quiz_complete_modal?.showModal();
    }
  }, [isComplete]);

  const getModelPredictionErrorIndexes = useCallback(
    (modelPredictions: number[], labels: number[]) => {
      return modelPredictions.reduce((acc, prediction, i) => {
        console.log(prediction, labels[i]);
        if (prediction === labels[i]) {
          return acc;
        }
        return [...acc, i];
      }, [] as number[]);
    },
    [funcs.data]
  );

  return (
    <main className="mb-10">
      <dialog id="help_modal" className="modal w-full">
        <form method="dialog" className="modal-box max-w-lg w-full">
          <h3 className="font-bold text-xl">Instructions</h3>
          <section className="py-4 flex gap-y-4 flex-col">
            <p>
              You will be given 10 C/C++ functions, where some are vulnerable
              and some are not.
            </p>
            <p>
              Try to correctly classify as many functions as possible within the
              30s time limit.
            </p>
            <p>
              You also have a strong competitor! Our AI model will also try to
              classify the functions. You can see yours and the AI's progress
              below:
            </p>
            <Image
              className="rounded-xl border border-gray-700 shadow-xl"
              src="/progress-indicator.png"
              width={600}
              height={200}
              alt="Progress indicator"
            />
            <p>
              Press ESC key or click the button below to close. Then, you may
              click the start button to begin the timer.
            </p>
          </section>
          <div className="modal-action">
            <button className="btn" onClick={() => setDisplayHelp(false)}>
              Close
            </button>
          </div>
        </form>
      </dialog>

      <dialog id="quiz_complete_modal" className="modal w-full">
        <form method="dialog" className="modal-box max-w-lg w-full">
          <h3 className="font-bold text-5xl text-center text-secondary">
            {miliseconds === 0 ? "Time's up!" : "Quiz complete!"}
          </h3>
          <section className="py-4 flex gap-y-4 flex-col text-justify">
            <p>
              You have completed the challenge. Don't worry if you didn't get a
              good score!
            </p>
            <p>
              The purpose of this challenge is actually to demonstrate the
              effectiveness of using AI to detect vulnerabilities.
            </p>
            <p>
              You may have noticed that the AI model is able to classify the
              functions with{" "}
              <span className="font-bold text-secondary">high accuracy</span>{" "}
              and is <span className="font-bold text-secondary">very fast</span>
              .
            </p>
            <p>
              These models were trained as part of our research. However, this
              is just a small portion of our research.
            </p>{" "}
            <p>
              Click the button below to learn more! Or, better yet, come on down
              to <span className="font-bold text-secondary ">T69 #2913</span> so
              we can share more!
            </p>
          </section>
          <div className="modal-action justify-between">
            <button
              className="btn"
              onClick={() => {
                window.location.reload();
              }}
            >
              Try again
            </button>
            <Link href="/about" className="btn btn-primary">
              Learn more
            </Link>
          </div>
        </form>
      </dialog>

      <header className="flex items-end justify-between mt-5">
        <div>
          <h1>
            <span className="text-6xl font-bold text-secondary">
              {String(isComplete ? 10 : userAnswers.length + 1).padStart(
                2,
                "0"
              )}
            </span>
            <span className="text-xl text-gray-500">
              / {funcs?.data?.length} Questions
            </span>
          </h1>
        </div>
      </header>

      <header className="flex items-end justify-between mt-5">
        <div>
          <h2 className="mt-2 text-3xl font-bold">{currentHeading}</h2>
          <h3 className="mt-2 text-gray-400">
            If you're not sure, just guess!
          </h3>
        </div>
        <div className="font-mono">
          <span className="ml-5 text-4xl">
            {(miliseconds / 1000).toFixed(2)}
          </span>
          <span className="ml-1">left</span>
        </div>
      </header>

      <div className="mt-5">
        {funcs.isLoading ? (
          <div className="h-[240px] w-full bg-base-200 bg-opacity-20 flex justify-center items-center">
            Loading ...
          </div>
        ) : funcs.isSuccess ? (
          <CodeBlock
            code={funcs.data[userAnswers.length].code}
            language="cpp"
          />
        ) : (
          <div>Failed to load functions</div>
        )}
      </div>

      <div className="flex justify-center items-center mx-auto mt-4 gap-x-10">
        <div
          className="grid items-center gap-x-7"
          style={{
            gridTemplateColumns: "minmax(0, max-content) minmax(0, 1fr)"
          }}
        >
          <p className="font-bold">You</p>
          <ProgressIndicator
            total={10}
            current={userAnswers.length}
            errorIndexes={incorrectUserAnswerIndexes || []}
          />
        </div>

        <div className="divider divider-horizontal">vs</div>

        <div
          className="grid items-center gap-x-7"
          style={{
            gridTemplateColumns: "minmax(0, max-content) minmax(0, 1fr)"
          }}
        >
          <div className="indicator">
            <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
              <div className="tooltip" data-tip={"Trained on 30,000 functions"}>
                <Info size={14} strokeWidth={3} />
              </div>
            </span>
            <p>
              AI <span className="text-xs text-gray-500">V1, CPU</span>
            </p>
          </div>
          <ProgressIndicator
            total={10}
            current={CPUCurrent}
            errorIndexes={
              funcs.isSuccess
                ? getModelPredictionErrorIndexes(
                    funcs.data.reduce((acc, func) => {
                      const prediction = (
                        func.model_predictions.find(
                          (p) => p.model_id == 1
                        ) as any
                      ).prediction;
                      return [...acc, prediction];
                    }, [] as number[]),
                    funcs.data.map((f) => f.labels)
                  )
                : []
            }
          />
          <div className="indicator">
            <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
              <div className="tooltip" data-tip={"Trained on 30,000 functions"}>
                <Info size={14} strokeWidth={3} />
              </div>
            </span>
            <p>
              AI <span className="text-xs text-gray-500">V1, GPU</span>
            </p>
          </div>
          <ProgressIndicator
            total={10}
            current={GPUCurrent}
            errorIndexes={
              funcs.isSuccess
                ? getModelPredictionErrorIndexes(
                    funcs.data.reduce((acc, func) => {
                      const prediction = (
                        func.model_predictions.find(
                          (p) => p.model_id == 1
                        ) as any
                      ).prediction;
                      return [...acc, prediction];
                    }, [] as number[]),
                    funcs.data.map((f) => f.labels)
                  )
                : []
            }
          />

          <div className="indicator">
            <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
              <div className="tooltip" data-tip={"Trained on 70,000 functions"}>
                <Info size={14} strokeWidth={3} />
              </div>
            </span>
            <p>
              AI <span className="text-xs text-gray-500">V2, GPU</span>
            </p>
          </div>
          <ProgressIndicator
            total={10}
            current={CPUCurrent}
            errorIndexes={
              funcs.isSuccess
                ? getModelPredictionErrorIndexes(
                    funcs.data.reduce((acc, func) => {
                      const prediction = (
                        func.model_predictions.find(
                          (p) => p.model_id == 2
                        ) as any
                      ).prediction;
                      return [...acc, prediction];
                    }, [] as number[]),
                    funcs.data.map((f) => f.labels)
                  )
                : []
            }
          />
          <div className="indicator">
            <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
              <div className="tooltip" data-tip={"Trained on 70,000 functions"}>
                <Info size={14} strokeWidth={3} />
              </div>
            </span>
            <p>
              AI <span className="text-xs text-gray-500">V2, GPU</span>
            </p>
          </div>
          <ProgressIndicator
            total={10}
            current={GPUCurrent}
            errorIndexes={
              funcs.isSuccess
                ? getModelPredictionErrorIndexes(
                    funcs.data.reduce((acc, func) => {
                      const prediction = (
                        func.model_predictions.find(
                          (p) => p.model_id == 2
                        ) as any
                      ).prediction;
                      return [...acc, prediction];
                    }, [] as number[]),
                    funcs.data.map((f) => f.labels)
                  )
                : []
            }
          />
        </div>
      </div>

      <div className="flex flex-col mt-10 gap-y-5">
        {["Vulnerable", "Not Vulnerable"].map((choice, i) => {
          const isActive = choiceIndex === i;
          return (
            <div
              key={`${choice}-${i}`}
              className={clsx(
                "border p-4 rounded-xl border-neutral",
                isStarted && !isComplete
                  ? [
                      "cursor-pointer",
                      "hover:border-gray-500",
                      isActive && ["border-gray-500", "bg-opacity-20"]
                    ]
                  : ["text-gray-600", "border-neutral-900"]
              )}
              onClick={() => handleChoiceClick(i)}
            >
              {choice}
            </div>
          );
        })}
      </div>

      <button
        className={clsx(
          "mt-10 btn btn-primary w-full",
          !isStarted && ["btn-secondary"],
          isStarted && (isComplete || choiceIndex === -1) && ["btn-disabled"]
        )}
        onClick={isStarted ? handleNextClick : handleStartClick}
        disabled={isComplete}
      >
        {isStarted ? "Next" : "Start"}
      </button>
    </main>
  );
}
