import React, { useState, useEffect } from "react"
import { Task } from "../../server/models/index"

type ColumnType = {
  key: keyof Task
  header: string
}

interface GridProps {
  tasks: Partial<Task>[]
  onTaskSelect: (task: Partial<Task>) => void
}

const Grid = ({ tasks, onTaskSelect }: GridProps) => {
  const columns: ColumnType[] = [
    { key: "TITLE", header: "Title" },
    { key: "START_DATE", header: "Start Date" },
    { key: "END_DATE", header: "End Date" },
    { key: "TAG", header: "Tag" },
    { key: "PRIORITY", header: "Priority" },
    { key: "STATUS", header: "Status" },
  ]

  // State variable to store the index of the selected row
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  // Click event handler for row click
  const handleRowClick = (rowIndex: number, task: Partial<Task>) => {
    setSelectedRowIndex(rowIndex)
    onTaskSelect(task) //Pass task to parent
  }

  useEffect(() => {
    //reset selection on tasks changing
    setSelectedRowIndex(null)
  }, [tasks])

  return (
    <>
      <div>
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <h1 style={{ marginTop: "10px", marginBottom: "5px" }}>Tasks.</h1>
          <div
            style={{
              marginTop: "auto",
              paddingBottom: "10px",
              fontSize: "25px",
            }}
          >
            total: [{tasks.length}]
          </div>
        </div>
        <div
          style={{
            backgroundColor: "white",
            //Make scroll, x height
            height: "500px",
            maxHeight: "500px",
            overflowY: "auto",
            position: "relative", // Add relative position to the container
            borderBottom: "1px solid grey",
          }}
        >
          <table style={{ width: "100%" }}>
            <thead
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      textAlign: "start",
                      fontSize: "20px",
                      backgroundColor: "white",
                    }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
              <tr>
                <td
                  colSpan={columns.length}
                  style={
                    {
                      //borderBottom: "1px solid black",
                      //backgroundColor: "white",
                    }
                  }
                ></td>
              </tr>
            </thead>
            <tbody>
              {tasks.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor:
                      rowIndex === selectedRowIndex
                        ? "#A6BCF0"
                        : rowIndex % 2 === 0
                        ? "white"
                        : "rgb(230, 230, 230)",
                    fontSize: "17px",
                    cursor: "pointer", // Add cursor
                  }}
                  onClick={() => handleRowClick(rowIndex, row)} //On row click
                >
                  {columns.map((column) => (
                    <td key={column.key}>{row[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Grid
