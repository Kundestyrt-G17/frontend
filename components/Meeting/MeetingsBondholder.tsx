import React, { useMemo } from "react";

import { IMeeting } from "../../schemas/meeting";
import { IUser } from "../../schemas/user";

import { useTable } from "react-table";
import { useRouter } from "next/router";
import styles from "./Meetings.module.css";

interface MeetingsBondholderProps {
  meetings: IMeeting[];
  user: IUser;
}
export default function MeetingsBondholder(props: MeetingsBondholderProps) {
  const { meetings, user } = props;

  const matchedMeetings = meetings.filter((m) => {
    return m.votes.some((vote) => vote.company === user.company);
  });

  const data = useMemo(() => matchedMeetings, []);
  const columns = useMemo(
    () => [
      {
        Header: "Meeting Name",
        accessor: "meetingName",
      },
      {
        Header: "ISIN",
        accessor: "isin",
      },
      {
        Header: "Date",
        accessor: "date",
      },
    ],
    []
  );
  const tableInstance = useTable<any>({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;
  const router = useRouter();
  const handleRowClick = (row: any) => {
    router.push(`/vote/?meeting=${row.original._id}`);
  };
  return (
    <table {...getTableProps()} style={{ borderSpacing: 0, width: "100%" }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className={styles.tableHeader}>
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
            <tr
              {...row.getRowProps()}
              onClick={() => handleRowClick(row)}
              className={styles.tableRow}
            >
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} className={styles.tableCell}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
