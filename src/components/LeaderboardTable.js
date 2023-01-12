import React from "react";
import { useTable, useSortBy } from "react-table";

import LeaderboardHandle from "./LeaderboardHandle";

const LeaderboardTable = ({ results }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        Cell: (props) => {
          return <p>{props.flatRows.indexOf(props.row) + 1}</p>;
        },
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
      },
      {
        Header: "USD",
        accessor: "awardTotal",
        sortDescFirst: true,
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
      },
      {
        Header: "High",
        columns: [
          {
            Header: "All",
            accessor: "highRisk",
            sortDescFirst: true,
          },
          {
            Header: "Solo",
            accessor: "soloHigh",
            sortDescFirst: true,
          },
        ],
      },
      {
        Header: "Med",
        columns: [
          {
            Header: "All",
            accessor: "medRisk",
            sortDescFirst: true,
          },
          {
            Header: "Solo",
            accessor: "soloMed",
            sortDescFirst: true,
          },
        ],
      },
      {
        Header: "Gas",
        columns: [
          {
            Header: "All",
            accessor: "gasOptz",
            sortDescFirst: true,
          },
        ],
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
    <table {...getTableProps()} className="leaderboard-table">
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
                    : ""
                }
              >
                <span className="sort-direction">
                  {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                </span>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {rows.length > 0 ? (
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
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
    </table>
  );
};

export default LeaderboardTable;
