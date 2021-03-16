import React from "react";
import { map, pick } from "lodash";
import { useTable, useSortBy } from 'react-table'

const LeaderboardTable = ({results}) => {

  const columns = React.useMemo(
    () => [
      {
        Header: 'Leaderboard',
        columns: [
          {
            Header: "Competitor",
            accessor: "handle"
          },
          {
            Header: "Winnings",
            accessor: "awardTotal"
          }
        ]
      },
    ],
    []
  )
 
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data: results }, useSortBy)
    
  return (
     <table {...getTableProps()}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
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
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
   )
}

export default LeaderboardTable;

