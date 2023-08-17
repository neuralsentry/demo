"use client";

import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownCircle, Info } from "lucide-react";
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
      minNumLines: 10
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
  const [displayProgress, setDisplayProgress] = useState(false);

  const funcs = useQuery({
    queryKey: ["functions"],
    queryFn: getFunctions,
    refetchOnWindowFocus: false
  });

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
        if (prediction === labels[i]) {
          return acc;
        }
        return [...acc, i];
      }, [] as number[]);
    },
    [funcs.data]
  );

  return (
    <main className="mb-20">
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

      <dialog id="quiz_complete_modal" className="modal w-full pt-5 sm:pt-0">
        <form
          method="dialog"
          className="modal-box max-w-lg w-full pb-16 sm:pb-0"
        >
          <h3 className="font-bold text-5xl text-center text-secondary">
            {miliseconds === 0 ? "Time's up!" : "Challenge Completed!"}
          </h3>

          <p className="mt-6">
            You have completed the challenge. Don't worry if you didn't get a
            good score!
          </p>

          <section className="mt-4 flex flex-col items-center pb-4 border rounded-lg px-4 border-base-200">
            <p className="mt-4 text-lg  text-center">
              <span className="font-semibold">Progress </span>
              <span className="text-xs text-gray-500">(Correct / Total)</span>
            </p>
            <div
              className="mt-2 grid items-center gap-x-7"
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
            <div className="divider max-w-sm mx-auto w-full">vs</div>
            <div
              className="grid items-center gap-x-7"
              style={{
                gridTemplateColumns: "minmax(0, max-content) minmax(0, 1fr)"
              }}
            >
              <div className="indicator">
                <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
                  <div
                    className="tooltip"
                    data-tip={"Trained on 30,000 functions"}
                  >
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
                  <div
                    className="tooltip"
                    data-tip={"Trained on 30,000 functions"}
                  >
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
                  <div
                    className="tooltip"
                    data-tip={"Trained on 70,000 functions"}
                  >
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
                  <div
                    className="tooltip"
                    data-tip={"Trained on 70,000 functions"}
                  >
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
          </section>

          <section className="mt-4 py-4 flex gap-y-4 flex-col text-justify">
            <h4 className="font-bold text-xl text-center">
              What's This All About?
            </h4>
            <p>
              The purpose of this challenge is to demonstrate the effectiveness
              of using AI to detect vulnerabilities.
            </p>
            <p>
              AI models are able to identify vulnerable functions with{" "}
              <span className="font-bold text-success">high accuracy</span> and
              are <span className="font-bold text-success">very fast</span>. On
              the other hand, humans are{" "}
              <span className="font-bold text-error">slow</span>,{" "}
              <span className="font-bold text-error">inaccurate</span>, and
              require{" "}
              <span className="font-bold text-error">advanced expertise</span>.
            </p>
          </section>

          <section className="mt-4 flex gap-y-4 flex-col text-justify">
            <h4 className="font-bold text-xl text-center">
              What is NeuralSentry's Goal?
            </h4>
            <p>
              AI technology can revolutionise the software security industry by
              enforcing more robust code. However, one huge problem with AI is
              that it requires <span className="font-bold">a lot of data</span>{" "}
              to be effective.
            </p>

            <p>
              With that, in this project we researched the application of AI for{" "}
              <span className="font-bold">dataset curation</span> and{" "}
              <span className="font-bold">vulnerability detection</span>. The AI
              models featured in this challenge is the culmination of our
              research.
            </p>
            <p>
              Click the button below to learn more! Or, better yet, come on down
              to{" "}
              <Link href="/public" target="_blank">
                <span className="font-bold text-secondary">T2033</span>
                <span className="text-xs text-gray-600 ml-1">(3A67)</span>
              </Link>{" "}
              so we can answer your questions in person!
            </p>
          </section>
          <div className="mt-5 modal-action justify-between">
            <button className="btn">Close</button>
            <Link href="/about" className="btn btn-primary">
              Learn more
            </Link>
          </div>
        </form>
      </dialog>

      <header className="flex justify-center sm:justify-start mt-20 sm:mt-5">
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

      <header
        className={clsx(
          "flex flex-col items-center justify-between mt-5 text-center",
          "sm:flex-row sm:text-start sm:items-end"
        )}
      >
        <div>
          <h2 className="mt-2 text-3xl font-bold">{currentHeading}</h2>
          <h3 className="mt-2 text-gray-400">
            If you're not sure, just guess!
          </h3>
        </div>
        <div className="font-mono  mt-4 md:mt-0">
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
            code={funcs.data[
              userAnswers.length > 9 ? 9 : userAnswers.length
            ].code.trim()}
            language="cpp"
          />
        ) : (
          <div>Failed to load functions</div>
        )}
      </div>

      <div
        className={clsx(
          "md:border-none",
          "flex flex-col-reverse md:flex-row justify-center items-center mx-auto mt-0 md:mt-4 gap-x-10",
          "fixed top-0 left-2/4 transform -translate-x-2/4 z-10 md:relative rounded-b-xl border border-t-0 border-gray-500",
          "bg-base-100 md:bg-inherit px-4 py-2 md:p-0 w-full max-w-sm  md:max-w-full",
          "transition-transform duration-500 ease-in-out z-10",
          !displayProgress && "-translate-y-[200px] md:translate-y-0"
        )}
      >
        <button
          className="btn btn-circle md:hidden mt-4 btn-primary fixed bottom-[-20px] scale-75"
          onClick={() => setDisplayProgress((prev) => !prev)}
        >
          <ChevronDownCircle
            size={30}
            className={clsx(
              "transition-transform duration-500 ease-in-out",
              displayProgress && "rotate-180"
            )}
          />
        </button>
        <h3 className="mt-2 text-center mb-4 md:hidden">
          Progress{" "}
          <span className="text-xs text-gray-500">(Correct / Total)</span>
        </h3>
        <div
          className="mt-4 grid items-center gap-x-7"
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
        <div className="divider max-w-sm md:divider-horizontal mx-auto w-full">
          vs
        </div>
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

      <div className="flex flex-col">
        <div className="flex flex-col mt-10 md:mt-4 gap-y-5">
          {["Vulnerable", "Not Vulnerable"].map((choice, i) => {
            const isActive = choiceIndex === i;
            return (
              <div
                key={`${choice}-${i}`}
                className={clsx(
                  "border p-4 rounded-xl border-neutral",
                  isStarted && !isComplete
                    ? [
                        "cursor-pointer bg-opacity-40",
                        "hover:border-gray-500",
                        isActive && "bg-gray-700 border-gray-500"
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
            isComplete && ["btn-secondary"]
          )}
          onClick={
            isComplete
              ? () => window.location.reload()
              : isStarted
              ? handleNextClick
              : handleStartClick
          }
          disabled={!isComplete && isStarted && choiceIndex === -1}
        >
          {isComplete ? "Restart" : isStarted ? "Next" : "Start"}
        </button>
      </div>
    </main>
  );
}
