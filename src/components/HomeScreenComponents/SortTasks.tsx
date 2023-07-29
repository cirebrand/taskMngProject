import React, { useState, useEffect } from "react"
import { Task } from "../../server/models/index"
import { Grid } from "./index"
import "../../styles/Global.css"
import Select from "react-select"

const SortTasks = ({
  tasks,
  tags,
  onSortTasksChange, // New prop for the callback function
}: {
  tasks: Partial<Task>[]
  tags: string[]
  onSortTasksChange: (sortedTasks: Partial<Task>[]) => void // Callback function type
}) => {
  //Check Boxes (Sorting)
  const [sortEndDate, setSortEndDate] = useState<boolean>(false)
  const [sortTag, setSortTag] = useState("")
  const [sortPriority, setSortPriority] = useState("")
  const [sortStatus, setSortStatus] = useState("")
  const [sortTitle, setSortTitle] = useState("")

  //Your Tag - Error messages
  const tagsOptions = [
    { value: "", label: "none" }, // Add none tag at beginning
    ...(tags?.map((tag) => ({
      value: tag,
      label: tag,
    })) ?? []),
  ]

  const [optionTag, setOptionTag] = useState<{
    value: string
    label: string
  } | null>(null)

  //Your Task - Error messages
  const tasksOptions = [
    { value: "", label: "none" }, // Add none tag at beginning
    ...(tasks?.map((task) => ({
      value: task.TITLE ? task.TITLE : "",
      label: task.TITLE ? task.TITLE : "",
    })) ?? []),
  ]

  const [optionTask, setOptionTask] = useState<{
    value: string
    label: string
  } | null>(null)

  /* Task Copy 
    Sorted by (?)
  */
  const [sortedTasks, setSortedTasks] = useState<Partial<Task>[]>([])

  const SortTasksFilter = () => {
    let tasksCopy = [...tasks]

    // console.log(sortPriority)

    if (sortEndDate) {
      tasksCopy.sort((a, b) => {
        const endDateA = a.END_DATE
          ? new Date(a.END_DATE).getTime()
          : new Date().getTime()
        const endDateB = b.END_DATE
          ? new Date(b.END_DATE).getTime()
          : new Date().getTime()

        return endDateA - endDateB
      })
    }
    if (sortPriority) {
      tasksCopy = tasksCopy.filter((task) => task.PRIORITY === sortPriority)
    }
    if (sortStatus) {
      tasksCopy = tasksCopy.filter((task) => task.STATUS === sortStatus)
    }
    if (sortTag) {
      tasksCopy = tasksCopy.filter((task) => task.TAG === sortTag)
    }
    if (sortTitle) {
      tasksCopy = tasksCopy.filter((task) => task.TITLE === sortTitle)
    }

    setSortedTasks([...tasksCopy])
  }

  useEffect(() => {
    SortTasksFilter()
  }, [sortEndDate, sortPriority, sortStatus, sortTag, sortTitle])

  useEffect(() => {
    //On initial (load)
    setSortedTasks([...tasks])
  }, [])

  useEffect(() => {
    //If parent info updates
    setSortedTasks([...tasks]) //Update tasks
    SortTasksFilter() //Sort tasks
  }, [tasks])

  useEffect(() => {
    //Send sorted tasks to parent on change
    onSortTasksChange(sortedTasks)
  }, [sortedTasks])

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#8592C9",
          width: "fit-content",
          borderRadius: "15px",
          padding: "5px",
        }}
      >
        <h1 style={{ margin: "0px", marginLeft: "10px" }}>Sort Options.</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "20px",
            backgroundColor: "white",
            padding: "10px",
            margin: "5px",
            borderRadius: "10px",
          }}
        >
          <div>Title</div>
          <Select
            styles={{
              control: (provided) => ({
                ...provided,
                width: "100%",
                border: 0,
                boxShadow: "none",
              }),
              option: (provided) => ({
                ...provided,
                height: 40,
              }),
            }}
            className="SelectGetInputStyle"
            options={tasksOptions}
            placeholder="Select option"
            isSearchable={true}
            value={optionTask || null}
            onChange={(e) => {
              setOptionTask(e)
              setSortTitle(e!.value)
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "15px",
            fontSize: "20px",
            backgroundColor: "white",
            padding: "10px",
            margin: "5px",
            borderRadius: "10px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            End Date
            <input
              style={{ margin: "0" }}
              type="checkbox"
              checked={sortEndDate}
              onChange={() => {
                setSortEndDate(!sortEndDate)
              }}
            />
          </label>

          <div>
            <div>Priority</div>
            <select
              className="getInputStyle"
              value={sortPriority}
              onChange={(e) => setSortPriority(e.target.value)}
            >
              <option value="">none</option>
              <option value="++">++</option>
              <option value="+">+</option>
              <option value="o">o</option>
              <option value="-">-</option>
              <option value="--">--</option>
            </select>
          </div>

          <div>
            <div>Status</div>
            <select
              className="getInputStyle"
              value={sortStatus}
              onChange={(e) => setSortStatus(e.target.value)}
            >
              <option value="">none</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Finished">Finished</option>
            </select>
          </div>

          <div style={{ width: "200px", marginBottom: "5px" }}>
            <div>Tag</div>
            <Select
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: "100%",
                  border: 0,
                  boxShadow: "none",
                }),
                option: (provided) => ({
                  ...provided,
                  height: 40,
                }),
              }}
              className="SelectGetInputStyle"
              options={tagsOptions}
              placeholder="Select option"
              isSearchable={true}
              value={optionTag || null}
              onChange={(e) => {
                setOptionTag(e)
                setSortTag(e!.value)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SortTasks
