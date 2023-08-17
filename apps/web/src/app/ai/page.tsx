import { PredictionTables } from "./components/prediction-tables";

export default async function Vulnerabilities() {
  return (
    <main className="mb-10">
      <h1 className="text-center text-5xl font-bold mt-10">AI Predictions</h1>
      <PredictionTables />
    </main>
  );
}
