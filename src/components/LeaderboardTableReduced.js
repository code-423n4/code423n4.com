import React from "react";
import { useTable, useSortBy } from "react-table";

import LeaderboardHandle from "./LeaderboardHandle";

const LeaderboardTableReduced = ({ results, isLoading, reduced }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: (props) => {
          return <p>{props.flatRows.indexOf(props.row) + 1}</p>;
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
              {props.value.toLocaleString("en-US", {
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
        Header: "Med",
        accessor: "medRisk",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__med",
      },
      {
        Header: "Gas",
        accessor: "gasOptz",
        sortDescFirst: true,
        className: "table__cell--number leaderboard__gas",
      },
    ],
    []
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
        <div {...getTableProps()} className="leaderboard-table__headers">
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
        ) : !isLoading ? (
          <ul className="leaderboard__error">
            <li>Fetching results...</li>
          </ul>
        ) : (
          <ul className="leaderboard__error">
            <li>No results to show. Try changing filter criteria</li>
          </ul>
        )}
      </div>

      {/* <table {...getTableProps()} className="leaderboard-table table--zebra">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "sort-desc"
                        : "sort-asc"
                      : "" + (column.isNumber ? " table__column--numbers" : "")
                  }
                >
                  {column.render("Header")}
                  <span className="sort-direction">
                    {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {rows.length > 0 && !isLoading ? (
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps([
                        {
                          className: cell.column.className,
                        },
                      ])}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        ) : !isLoading ? (
          <tbody>
            <tr>
              <td colSpan="9" className="center">
                <h3 className="skeleton-loader">Fetching results...</h3>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="9" className="center">
                No results to show. Try changing filter criteria
              </td>
            </tr>
          </tbody>
        )}
      </table> */}
    </>
  );
};

export default LeaderboardTableReduced;
