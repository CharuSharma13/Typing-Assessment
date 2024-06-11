import React from "react";

function Stats({ timer, wordCount, charCount, accuracy }) {
  const stats = {
    "Words/min": wordCount,
    "Chars/min": charCount,
    "% accuracy": accuracy,
  };
  return (
    <div className="stats">
      <div className="timer">
        <h1>{timer}</h1>
        <p>Seconds</p>
      </div>
      <div className="counts">
        {Object.keys(stats).map((items, index) => {
          return (
            <div className="count" key={index}>
              <div>
                <h1>{stats[items]}</h1>
              </div>
              <p>{items}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stats;
