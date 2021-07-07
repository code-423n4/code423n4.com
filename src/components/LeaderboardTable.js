import React from "react";
import { map, pick } from "lodash";
import { useTable, useSortBy } from "react-table";
import LeaderboardHandle from "./LeaderboardHandle";

const LeaderboardTable = ({ results }) => {
  const columns = React.useMemo(
    () => [
          {
            Header: "Competitor",
            accessor: "handle",
            defaultCanSort: false,
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
                <span>
                  {props.value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              );
            },
          },
          {
            Header: "All",
            accessor: "allFindings",
            sortDescFirst: true,
          },
          {
            Header: "High",
            accessor: "highRisk",
            sortDescFirst: true,
          },
          {
            Header: "Med",
            accessor: "medRisk",
            sortDescFirst: true,
          },
          {
            Header: "Gas",
            accessor: "gasOptz",
            sortDescFirst: true,
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
    <table {...getTableProps()}>
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
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
