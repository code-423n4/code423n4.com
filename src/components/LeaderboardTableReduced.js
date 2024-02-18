import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";

import LeaderboardHandle from "./LeaderboardHandle";

const LeaderboardTableReduced = (props) => {
  const [results, setResults] = useState(props.results);

  useEffect(() => {
    // the built-in sortBy function does not sort numbers with decimals accurately
    // so in order get the correct ranking, multiply the award total by 100 before
    // sorting and then divide by 100 again before rendering
    setResults(
      props.results.map((finding) => ({
        ...finding,
        awardTotal: finding.awardTotal * 100,
      }))
    );
  }, [props.results]);

  const { isLoading } = props;
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: (props) => {
          const sortedType = props.allColumns[2].isSorted
            ? props.allColumns[2].isSortedDesc
              ? "desc"
              : "asc"
            : "none";
          let rank;
          switch (sortedType) {
            case "desc":
              rank = <p>{props.flatRows.indexOf(props.row) + 1}</p>;
              break;
            case "asc":
              const totalRank = props.flatRows.length;
              const currentIndex = props.flatRows.indexOf(props.row);
              const currentRank = totalRank - currentIndex;
              rank = <p>{currentRank}</p>;
              break;
            case "none":
              const sortedRank = props.flatRows.sort(function (a, b) {
                return b.values.awardTotal - a.values.awardTotal;
              });
              rank = <p>{sortedRank.indexOf(props.row) + 1}</p>;
              break;
            default:
              rank = <p>{props.flatRows.indexOf(props.row) + 1}</p>;
          }
          return rank;
        },
        className: "leaderboard__rank",
      },
      {
        Header: "Competitor",
        Cell: (props) => (
          <LeaderboardHandle
            handle={props.row.original.handle}
            image={props.row.original.image}
            link={props.row.original.link}
            members={props.row.original.members}
          />
        ),
        className: "leaderboard__competitor",
      },
      {
        Header: "USD",
        accessor: "awardTotal",
        sortDescFirst: true,
        className: "leaderboard__award-amount",
        Cell: (props) => {
          return (
            <span className="award-amount">
              {(props.value / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          );
        },
      },
      {
        Header: "Total",
        accessor: "allFindings",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__total",
      },
      {
        Header: "High",
        accessor: "highRisk",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__high",
      },
      {
        Header: "(Solo)",
        accessor: "soloHigh",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__high-solo",
      },
      {
        Header: "Med",
        accessor: "medRisk",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__med",
      },
      {
        Header: "(Solo)",
        accessor: "soloMed",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__med-solo",
      },
      {
        Header: "Gas",
        accessor: "gasOptz",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__gas",
      },
    ],
    [results]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: results,
      initialState: {
        sortBy: [
          {
            id: "awardTotal",
            desc: true,
          },
        ],
      },
    },
    useSortBy
  );

  return (
    <>
      <div className="leaderboard-table-reduced__wrapper">
        <div
          {...getTableProps()}
          className="leaderboard-table__headers"
          id="column__headers"
        >
          {headerGroups.map((headerGroup) => (
            <ul {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <li
                  {...column.getHeaderProps(
                    column.getSortByToggleProps([
                      {
                        className: column.className,
                      },
                    ])
                  )}
                >
                  {column.render("Header")}
                  <span className="sort-direction">
                    {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
        {rows.length > 0 && !isLoading ? (
          <div
            {...getTableBodyProps()}
            className="leaderboard-table-reduced__body"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <ul {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <li
                        {...cell.getCellProps([
                          {
                            className: cell.column.className,
                          },
                        ])}
                      >
                        {cell.render("Cell")}
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
        ) : isLoading ? (
          <ul className="leaderboard__loading">
            <li>Fetching results...</li>
          </ul>
        ) : (
          <ul className="leaderboard__error">
            <li>No results to show. Try changing filter criteria</li>
          </ul>
        )}
      </div>
    </>
  );
};

export default LeaderboardTableReduced;
