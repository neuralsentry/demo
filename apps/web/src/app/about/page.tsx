export default function About() {
  return (
    <main className="mb-10">
      <h1 className="text-center text-5xl font-bold mt-10">About</h1>

      <h2 className="text-3xl font-bold mt-10">Q&A</h2>

      <div
        tabIndex={0}
        className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
      >
        <div className="collapse-title text-xl font-medium">
          <em>Who</em> is the team?
        </div>
        <div className="collapse-content">
          <p>
            We are a group of final year students pursuing the{" "}
            <span
              className="tooltip tooltip-right underline decoration-dotted"
              data-tip="Diploma in
              Infocomm Security Management"
            >
              <abbr>DISM</abbr>
            </span>{" "}
            in Singapore Polytechnic. Our team comprises of Edison, Isaac,
            Aldrich, Ryan and Kaizer. Collaboratively, the team engaged with our
            sponsor, DSO National Laboratories to address the problem statement
            presented for our Final Year Project,{" "}
            <em>"Applying large language models to source code bug finding"</em>
            .<br></br>
          </p>
        </div>
      </div>

      <div
        tabIndex={0}
        className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
      >
        <div className="collapse-title text-xl font-medium">
          <em>What</em> is the team's goal?
        </div>
        <div className="collapse-content">
          <p>
            The original objective of the project aimed to use OpenAI's{" "}
            <span
              className="tooltip underline decoration-dotted"
              data-tip="The model that powers ChatGPT"
            >
              GPT-3.5-Turbo<sup>ⓘ</sup>
            </span>{" "}
            to detect bugs in source code. However, after additional research
            and consideration, the team and sponsors decided to broaden the
            scope of the project towards{" "}
            <b>
              Training and Evaluating Open-Source{" "}
              <span
                className="tooltip underline decoration-dotted"
                data-tip="Large Language Models"
              >
                LLMs
              </span>{" "}
              for Deep Learning-based Vulnerability Detection
            </b>
            . This shift was due to the constraints of closed-source LLMs such
            as OpenAI's GPT-3.5-Turbo, which included <em>financial costs</em>,{" "}
            <em>inability to tweak model parameters</em>, and{" "}
            <em>lack of support for fine-tuning and transfer learning</em>.
          </p>
        </div>
      </div>

      <div
        tabIndex={0}
        className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
      >
        <div className="collapse-title text-xl font-medium">
          <em>Why</em> did the team choose this project?
        </div>
        <div className="collapse-content">
          <p>
            Having a quality dataset is crucial for training any Artificial
            Intelligence model as it can vastly impact a model's overall
            performance. However, the{" "}
            <b>
              current dataset curation methods do not have a efficient and
              accurate way of curating quality dataset specifically for
              vulnerability detection
            </b>
            . Thus, the team decided to created an <em>automated tool</em> that
            can alleviate the burden of manually curating quality datasets of
            vulnerable functions that can be used for{" "}
            <em>Vulnerability Detection</em>.
          </p>
        </div>
      </div>

      <div
        tabIndex={0}
        className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
      >
        <div className="collapse-title text-xl font-medium">
          <em>How</em> did the team go about the project?
        </div>
        <div className="collapse-content">
          <p>
            The team proposed and created a{" "}
            <b>
              Vulnerability Fixing Commit (VFC) Classifier which utilizes
              Natural Language Processing (NLP)
            </b>{" "}
            to process and classify VFCs and non-VFCs. The utilization our VFC
            Classifier has enabled the team to make use of codes on open source
            repositories on GitHub to classify commit messages and extract the
            respective functions that was attributing to the vulnerability.
            <br></br>
            <br></br>
            Our VFC Classifier, is capable of classifying over{" "}
            <b>
              600,000 commits and extracting 500,000 functions within 2 hours
            </b>
            . For reference, this is <b>4000 times faster</b> than the current
            state-of-the-art Devign dataset which took 600 hours to manually
            label 50,000 commits and 30,000 functions.
            <br></br>
            <br></br>
            With the dataset curated using our VFC Classifier,{" "}
            <b>we trained our very own vulnerability detection model</b> and
            achieved an <b>accuracy and F1 score of 89%</b>. Our vulnerability
            detection model has shown significant improvement compared on past
            models (GPT-2, CodeT5, CodeBERT) with a{" "}
            <b>higher average F1 of 54%</b>. This notable improvement is mainly
            attributed to the wide range of vulnerabilities that was extracted
            and classified from the different repositories using our VFC
            classifier.
          </p>
        </div>
      </div>

      <div
        tabIndex={0}
        className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
      >
        <div className="collapse-title text-xl font-medium">
          <em>What</em> does the team contribute as a whole?
        </div>
        <div className="collapse-content">
          <div className="px-5">
            <ul className="list-disc">
              <li>
                <p>
                  The team released a{" "}
                  <b>dataset of 3,500 Vulnerability-fixing Commits (VFCs)</b>,
                  curated from 10 distinct C/C++ repositories on GitHub that
                  took 40 man-hours of manual labelling. The team enriched this
                  dataset by amassing 4 prominent VFC datasets: BigVul, Devign,
                  CVEfixes, and Linux Kernel CVEs, totaling 36,625 commits.{" "}
                  <b>
                    Our compiled dataset is publicly available to help further
                    research.
                  </b>
                </p>
              </li>
              <br></br>
              <li>
                <p>
                  The team incorporated a{" "}
                  <b>
                    fine-tuned StarEncoder model into a VFC classification tool
                  </b>
                  , along with <b>function extraction capabilities</b>. This
                  tool can be used to{" "}
                  <b>curate large datasets of vulnerable functions</b> to aid
                  researchers in Deep Learning-based Vulnerability Detection
                  (VD).
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
