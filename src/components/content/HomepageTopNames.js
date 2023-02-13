import React from "react";

// Delete this when we have real data
// I made them objects so we can add more data later - 🍔
const topAuditors = [
  {
    name: "jalapeno",
  },
  {
    name: "artichoke",
  },
  {
    name: "tuber",
  },
  {
    name: "corn_flour",
  },
  {
    name: "rye",
  },
  {
    name: "orange_peels",
  },
  {
    name: "pickle",
  },
  {
    name: "remoulade",
  },
  {
    name: "raisin",
  },
  {
    name: "spinach",
  },
  {
    name: "orange_peels",
  },
  {
    name: "pickle",
  },
  {
    name: "spinach",
  },
  {
    name: "tuber",
  },
  {
    name: "corn_flour",
  },
  {
    name: "Join them →",
  },
];

const HomepageTopNames = () => {
  return (
    <div className="hero__top-auditors full-width">
      <div className="limited-width">
        <h2 className="type__headline__s">
          Your journey as an auditor begins now
        </h2>
        <p className="type__subline__s">Become one of the best</p>
        <ul className="hero__top-auditors-list">
          {topAuditors.map((auditor) => (
            <li key={auditor.name} className="hero__top-auditor">
              <span className="hero__top-auditor-name">{auditor.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomepageTopNames;
