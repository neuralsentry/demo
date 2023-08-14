export default function Leaderboard() {
  return (
    <main className="mb-10">
      <section className="w-full">
        <h1 className="text-center text-5xl font-bold mt-10">Leaderboard</h1>
        <table className="table mt-10">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Score</th>
              <th>Num. Correct</th>
              <th>Time Taken</th>
              <th>Datetime</th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover">
              <th>1</th>
              <td>AI (GPU)</td>
              <td>1,000 points</td>
              <td>10</td>
              <td>0.14 seconds</td>
              <td>17 August 2023, 2:45 PM</td>
            </tr>
            <tr className="hover">
              <th>1</th>
              <td>AI (CPU)</td>
              <td>980 points</td>
              <td>10</td>
              <td>10.00 seconds</td>
              <td>17 August 2023, 3:12 PM</td>
            </tr>
            <tr className="hover">
              <th>3</th>
              <td>Borat Sagdiyev</td>
              <td>498 points</td>
              <td>5</td>
              <td>2.44 seconds</td>
              <td>18 August 2023, 5:21 PM</td>
            </tr>
            <tr className="hover">
              <th>1</th>
              <td>Brice Swanson</td>
              <td>222 points</td>
              <td>3</td>
              <td>2 minutes 10.41 seconds</td>
              <td>18 August 2023, 4:53 PM</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
