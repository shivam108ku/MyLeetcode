import React, { useEffect, useState } from "react";

// Helper to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Optionally: helper for rank badges
const getRankBadge = (rank) => {
  const colors = [
    "bg-gradient-to-r from-amber-400 to-yellow-200 text-black",
    "bg-gradient-to-r from-gray-400 to-slate-200 text-black",
    "bg-gradient-to-r from-yellow-700 to-orange-400 text-white",
  ];
  return (
    <span
      className={`inline-block min-w-8 px-2 py-1 rounded-full font-bold text-sm ${
        colors[rank] || "bg-base-200"
      }`}
    >
      {rank + 1}
    </span>
  );
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(formatDate(new Date()));
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      setError("");
      try {
        // replace with your actual endpoint
        const res = await fetch(
          `https://myleetcode.onrender.com/user/daily?date=${date}`
        );
        const data = await res.json();
        setLeaderboard(data);
      } catch {
        setError("Failed to fetch leaderboard.");
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, [date]);

  return (
    <div className="w-[50vh] border-t rounded-2xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight bg-gradient-to-r from-green-400 via-green-100 to-balck bg-clip-text text-transparent drop-shadow">
        Daily Leaderboard
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="date"
          value={date}
          max={formatDate(new Date())}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered input-primary max-w-xs"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              className="animate-pulse h-10 w-full rounded bg-base-200 mb-2"
              key={i}
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-base-content/70 text-center animate-fade-in">
          No submissions yet for this day.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-b-3xl border border-green-700">
          <table className="table w-full bg-base-100 shadow-xl  ">
            <thead>
              <tr className="text-base-content font-semibold text-lg border-b border-base-200">
                <th className="px-2 py-3">Rank</th>
                <th className="px-2 py-3">User</th>
                <th className="px-2 py-3 text-center">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr
                  key={entry.userId}
                  className={`transition hover:bg-base-300 ${
                    idx === 0
                      ? "bg-gradient-to-r from-zinc-100 to-yellow-00/90 dark:from-yellow-900/50 dark:to-gren-800/70"
                      : ""
                  }`}
                >
                  {/* Rank with medal color */}
                  <td className="font-bold px-2 py-3 text-center align-middle">
                    {getRankBadge(idx)}
                  </td>

                  {/* User: avatar + name/email */}
                  <td className="flex gap-3 items-center py-2 px-2 min-w-[130px]">
                    {entry.profile_img ? (
                      <img
                        src={entry.profile_img}
                        alt={entry.name || entry.email}
                        className="w-9 h-9 object-cover rounded-full border border-base-300 shadow"
                        loading="lazy"
                      />
                    ) : (
                      <span className="w-9 h-9 flex items-center justify-center rounded-full bg-base-200 text-xl font-bold text-base-content/60 select-none">
                        {entry.name
                          ? entry.name.charAt(0).toUpperCase()
                          : entry.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span>
                      <span className="font-semibold text-base-content">
                        {entry.name || ""}
                      </span>
                       
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-2 px-2 text-center">
                    <span className="badge badge-success font-mono py-2 px-4 text-base md:text-lg">
                      {entry.dailyScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
