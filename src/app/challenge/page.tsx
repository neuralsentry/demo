"use client";

import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useInterval } from "usehooks-ts";

import { CodeBlock } from "./components/code-block";
import { ProgressIndicator } from "./components/progress-indicator.component";
import { clsx } from "clsx";

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
  cve_description?: string;
};

const questions: Question[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    function: `void Browser::WorkerCrashed(WebContents* source) {
  InfoBarTabHelper* infobar_helper =
      InfoBarTabHelper::FromWebContents(source);
  infobar_helper->AddInfoBar(new SimpleAlertInfoBarDelegate(
      infobar_helper,
      NULL,
      l10n_util::GetStringUTF16(IDS_WEBWORKER_CRASHED_PROMPT),
      true));
}
`,
    labels: 1,
    cve: "CVE-2021-21224",
    cve_description: "Use after free in Blink"
  }));

type ModelQuestionPrediction = {
  id: number;
  question_id: number;
  model: string;
  description: string;
  num_epochs: number;
  eval_split: number;
  revision: string;
  model_url: string;
  prediction: number;
};

const modelQuestionPredictions: ModelQuestionPrediction[] = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    question_id: i + 1,
    model: "StarEncoder",
    description:
      "StarEncoder model trained on a balanced dataset of 71,214 functions from 508 different C/C++ projects.",
    num_epochs: 10,
    eval_split: 0.1,
    revision: "61806c08f5760d5c21d3dcafc7a81f0e55561f19",
    model_url:
      "https://huggingface.co/neuralsentry/vulnerabilityDetection-StarEncoder-BigvulCvefixesDevignReveal",
    prediction: Math.random() > 0.7 ? 1 : 0
  }));

const cpuIterationsPerSecond = 1;
const gpuIterationsPerSecond = 70;

export default function Start() {
  const [CPUCurrent, setCPUCurrent] = useState(0);
  const [GPUCurrent, setGPUCurrent] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [choiceIndex, setChoiceIndex] = useState(-1);
  const [miliseconds, setMiliseconds] = useState(30 * 1000);
  const [isStarted, setIsStarted] = useState(false);

  const handleStartClick = () => {
    setIsStarted(true);
  };

  const incorrectUserAnswerIndexes = useMemo(
    () =>
      userAnswers.reduce((acc, answer, i) => {
        const question = questions[i];
        if (answer === question.labels) {
          return acc;
        }
        return [...acc, i];
      }, [] as number[]),
    [userAnswers]
  );

  const isComplete = userAnswers.length === 10;

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

  return (
    <main className="mb-10">
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
              / {questions.length} Questions
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
        <CodeBlock code={questions[0]["function"]} language="cpp" />
      </div>

      <div className="flex items-start justify-center mx-auto mt-10 gap-x-10">
        <div
          className="grid items-center mt-5 gap-x-7"
          style={{
            gridTemplateColumns: "minmax(0, max-content) minmax(0, 1fr)"
          }}
        >
          <p className="font-bold">You</p>
          <ProgressIndicator
            total={10}
            current={userAnswers.length}
            errorIndexes={incorrectUserAnswerIndexes}
          />
        </div>

        <div className="divider divider-horizontal">vs</div>

        <div
          className="grid items-center mt-5 gap-x-7"
          style={{
            gridTemplateColumns: "minmax(0, max-content) minmax(0, 1fr)"
          }}
        >
          <div className="indicator">
            <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
              <div className="tooltip" data-tip={`Ryzen 5 5600X, ${cpuIterationsPerSecond} iteration/s`}>
                <Info size={14} strokeWidth={3} />
              </div>
            </span>
            <p>
              AI <span className="text-xs text-gray-500">CPU</span>
            </p>
          </div>
          <ProgressIndicator
            total={10}
            current={CPUCurrent}
            errorIndexes={modelQuestionPredictions
              .filter((p) => p.prediction === 1)
              .map((p) => p.question_id)}
          />
          <div className="indicator">
            <span className="text-gray-700 rounded-full hover:text-gray-600 indicator-item">
              <div className="tooltip" data-tip={`NVIDIA GeForce RTX 3070 Ti, ${gpuIterationsPerSecond} iteration/s`}>
                <Info size={14} strokeWidth={3} />
              </div>
            </span>
            <p>
              AI <span className="text-xs text-gray-500">GPU</span>
            </p>
          </div>
          <ProgressIndicator
            total={10}
            current={GPUCurrent}
            errorIndexes={modelQuestionPredictions
              .filter((p) => p.prediction === 1)
              .map((p) => p.question_id)}
          />
        </div>
      </div>

      <div className="flex flex-col mt-10 gap-y-5">
        {["Vulnerable", "Not Vulnerable"].map((choice, i) => {
          const isActive = choiceIndex === i;
          return (
            <div
              className={clsx(
                "border p-4 rounded-xl border-neutral",
                isStarted && !isComplete
                  ? [
                      "cursor-pointer",
                      "hover:border-gray-400",
                      isActive && [
                        "border-primary",
                        "bg-primary",
                        "bg-opacity-20"
                      ]
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
