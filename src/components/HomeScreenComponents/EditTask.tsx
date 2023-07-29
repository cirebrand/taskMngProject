import React, { FC, useState, useEffect } from "react"
import { useAuth } from "../../auth-context"
import { Task } from "../../server/models/index"
import { PopUpMsg } from "../index"
import { CreateTag } from "./index"
import "../../styles/Global.css"
import "../../styles/CreateTask.css"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Select from "react-select"

interface Props {
  gridTask: Partial<Task> //Grid selected?
  tasks: Partial<Task>[] //List of Tasks
  onButtonClick: (changed: boolean) => void
}

const EditTask = ({ gridTask, tasks, onButtonClick }: Props) => {
  const auth = useAuth()

  //Account information, from auth
  const username = auth.account?.USERNAME

  //SAVE TASK KEY
  const [task, setTask] = useState<Partial<Task>>()

  //Params editable?
  const [paramsEdit, setParamsEdit] = useState<boolean>(false)
  const [originalTitle, setOriginalTitle] = useState("") //Fix for "Title Aready used"

  /* Task body */
  //Dates
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  //Info
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  //Other
  const [priority, setPriority] = useState("o")
  const [tag, setTag] = useState<string | undefined>("")
  const [status, setStatus] = useState("Not Started")

  const [reminder, setReminder] = useState<Date | null>(null)
  const [remindOption, setRemindOption] = useState("")

  //Error PopUp
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [popUpMsg, setPopUpMsg] = useState<boolean>(false)

  //Tag PopUp
  const [popUpTag, setPopUpTag] = useState<boolean>(false)

  //Delete Confirmation
  const [deleteTask, setDeleteTask] = useState<boolean>(false)

  //Select Tasks Data
  const [taskTitles, setTaskTitles] = useState<string[]>([])
  const tasksTitleOptions = [
    ...(tasks?.map((task) => ({
      value: task.TITLE ? task.TITLE : "",
      label: task.TITLE ? task.TITLE : "",
    })) ?? []),
  ]

  const [optionTask, setOptionTask] = useState<{
    value: string
    label: string
  } | null>(null)

  // //Select Tags Data
  const [tags, setTags] = useState<string[]>([])
  const tagsOptions =
    tags?.map((tag) => ({
      value: tag,
      label: tag,
    })) ?? []

  const [optionTag, setOptionTag] = useState<{
    value: string
    label: string
  } | null>(null)

  const findTaskTitle = async () => {
    try {
      //api calls
      const response = await axios.post(
        "http://localhost:4000/home/findTaskTitle",
        { username, title }
      )
      const found = response.data.foundTaskTitle

      if (found) return true
      else return false
    } catch (e) {
      console.error(e)
    }
  }

  const loadTags = async () => {
    try {
      const response = await axios.get("http://localhost:4000/home/getTags", {
        params: {
          username: username,
        },
      })
      const tags = response.data

      if (tags) setTags(tags.tags)
    } catch (e) {
      console.error(e)
    }
  }

  const validateInfo = (titleUsed: boolean) => {
    let valid = true

    setErrorMsg("") //empty out msg
    if (!title) {
      setErrorMsg((c) => (c += "- Please type Title\n"))
      valid = false
    } else if (titleUsed) {
      setErrorMsg((c) => (c += "- Title already used\n"))
      valid = false
    }
    if (!endDate) {
      setErrorMsg((c) => (c += "- Please set End Date\n"))
      valid = false
    }
    if (!tag) {
      setErrorMsg((c) => (c += "- Please set Tag\n"))
      valid = false
    }
    if (reminder && !remindOption) {
      setErrorMsg((c) => (c += "- Please set Remind Option\n"))
      valid = false
    }
    if (!valid) setPopUpMsg(true) //Show error
    return valid
  }

  const noneSelectedDeleteMsg = () => {
    if (task === null || task === undefined) {
      setErrorMsg("") //empty out msg
      setErrorMsg((c) => (c += "Please select a Task"))
      setPopUpMsg(true) //show error
      return true
    }
    return false
  }

  const deleteSuccMsg = () => {
    setErrorMsg("") //empty out msg
    setErrorMsg((c) => (c += "Task Deleted"))
    setPopUpMsg(true) //show error
  }

  const handleDeleteTask = async () => {
    try {
      const flaggedTask = optionTask?.value || task
      const response = await axios.post(
        "http://localhost:4000/home/deleteTask",
        {
          username,
          flaggedTask,
        }
      )
      const deleted = response.data.deletedTask

      console.log(deleted)

      deleteSuccMsg()
      onButtonClick(true) //Exit and update Tasks
    } catch (e) {
      console.error(e)
    }
  }

  const saveTask = async () => {
    const titleUsed = await findTaskTitle()

    //If same title do not check for dup title
    if (title !== originalTitle) {
      if (!validateInfo(!!titleUsed)) return
    } //cancel save

    try {
      const taskTitleKey = task?.TITLE //Key to find current task selection

      const body: Partial<Task> = {
        START_DATE: startDate ? startDate.toLocaleDateString("en-CA") : "",
        END_DATE: endDate ? endDate.toLocaleDateString("en-CA") : "",
        TITLE: title,
        DESCRIPTION: description,
        COMMENTS: [],
        TAG: tag,
        PRIORITY: priority ? priority : "-",
        STATUS: status,
        REMINDER: reminder ? reminder.toLocaleDateString("en-CA") : "",
        REMIND_BY: remindOption,
      }
      const response = await axios.post("http://localhost:4000/home/saveTask", {
        username,
        body,
        taskTitleKey,
      })
      onButtonClick(true) //Everything Good, Exit
      //const info = response.data
      //console.log(info.taskAdded.success) //false = duplicate entry
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    //Fix reminder
    if (reminder) {
      if (startDate && reminder < startDate) setReminder(null)
      if (endDate && reminder > endDate) setReminder(null)
    }
  }, [startDate, endDate])

  useEffect(() => {
    //On empty reminder, clear remindOption
    if (reminder === null) setRemindOption("")
  }, [reminder])

  useEffect(() => {
    //Set task from search
    if (optionTask) {
      const foundTask = tasks.filter((task) => task.TITLE === optionTask.value)
      if (foundTask) {
        setTask(foundTask[0])

        //For saving
        setParamsEdit(true) //Allow editing Params + Delete and Save
        setOriginalTitle(foundTask[0].TITLE!) //Original Title
      }
    }
  }, [optionTask])

  useEffect(() => {
    //Set OptionTask selection from parent
    if (gridTask) {
      const toOption = {
        value: gridTask.TITLE ? gridTask.TITLE : "",
        label: gridTask.TITLE ? gridTask.TITLE : "",
      }
      setOptionTask(toOption)
    }
  }, [])

  useEffect(() => {
    loadTags()
  }, [])

  useEffect(() => {
    //Set params
    if (task) {
      setTitle(task.TITLE ? task.TITLE : "")
      setDescription(task.DESCRIPTION ? task.DESCRIPTION : "")
      setStartDate(task.START_DATE ? new Date(task.START_DATE) : null)
      setEndDate(task.END_DATE ? new Date(task.END_DATE) : null)
      setTag(task.TAG ? task.TAG : "")
      setOptionTag(task.TAG ? { value: task.TAG, label: task.TAG } : null)
      setPriority(task.PRIORITY ? task.PRIORITY : "")
      setStatus(task.STATUS ? task.STATUS : "")
      setReminder(task.REMINDER ? new Date(task.REMINDER) : null)
      setRemindOption(task.REMIND_BY ? task.REMIND_BY : "")
    }
  }, [task])

  return (
    <>
      {popUpMsg && (
        <PopUpMsg
          message={!!errorMsg ? errorMsg : ""}
          onButtonClick={() => {
            setPopUpMsg(false)
          }}
        />
      )}
      {popUpTag && (
        <CreateTag
          onButtonClick={() => {
            setPopUpTag(false)
            loadTags()
          }}
        />
      )}
      <div className="taskPopup">
        <div
          className="taskPopup_inner"
          style={{ width: "600px", minWidth: "600px" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
              <h1 style={{ margin: "0px" }}>Tasks.</h1>
              {task === undefined && optionTask === null && (
                <div style={{ marginTop: "auto", marginBottom: "5px" }}>
                  Please select a Task...
                </div>
              )}
            </div>
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
              options={tasksTitleOptions}
              placeholder="Select option"
              isSearchable={true}
              value={optionTask || null}
              onChange={(e) => {
                setOptionTask(e)
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "10px",
              fontSize: "30px",
              fontWeight: "bolder",
            }}
          >
            Edit Task.
          </div>
          <div
            style={{
              marginBottom: "10px",
              fontSize: "20px",
            }}
          >
            <div style={{ flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div>
                  <div style={{ color: "blue" }}>Title*</div>
                  <input
                    disabled={!paramsEdit}
                    type="text"
                    className="getInputStyle"
                    style={{ width: "50%" }}
                    placeholder="TITLE"
                    value={title}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "TITLE")}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <div>Description</div>
                  <textarea
                    disabled={!paramsEdit}
                    style={{
                      fontFamily: "inherit",
                      paddingTop: "5px",
                      width: "100%",
                      height: "200px",
                    }}
                    className="getInputStyle"
                    placeholder="DESCRIPTION"
                    value={description}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "DESCRIPTION")}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                }}
              >
                <div>
                  <div>Start Date</div>
                  <DatePicker
                    disabled={!paramsEdit}
                    className="getInputStyle"
                    placeholderText="MM/DD/YYYY"
                    selected={startDate}
                    maxDate={endDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
                <div>
                  <div style={{ color: "blue" }}>End Date*</div>
                  <DatePicker
                    disabled={!paramsEdit}
                    className="getInputStyle"
                    placeholderText="MM/DD/YYYY"
                    minDate={startDate}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "20px",
                  }}
                >
                  <div style={{ width: "200px" }}>
                    <div style={{ color: "blue" }}>Tag*</div>
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          width: 200,
                          border: 0,
                          boxShadow: "none",
                        }),
                        option: (provided) => ({
                          ...provided,
                          height: 40,
                        }),
                      }}
                      isDisabled={!paramsEdit}
                      className="SelectGetInputStyle"
                      options={tagsOptions}
                      placeholder="Select an option"
                      isSearchable={true}
                      onChange={(e) => {
                        setOptionTag(e)
                        setTag(e?.value)
                      }}
                      value={optionTag || null}
                    />
                  </div>
                  <div>
                    <div>Create Tag</div>
                    <button
                      disabled={!paramsEdit}
                      onClick={() => {
                        setPopUpTag(true)
                      }}
                      className="roundButton"
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        fontSize: "15px",
                      }}
                    >
                      NEW
                    </button>
                  </div>
                  <div>
                    <div>Priority</div>
                    <select
                      disabled={!paramsEdit}
                      className="getInputStyle"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
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
                      disabled={!paramsEdit}
                      className="getInputStyle"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Finished">Finished</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>
                    <div>Reminder</div>
                    <DatePicker
                      disabled={!paramsEdit}
                      className="getInputStyle"
                      placeholderText="MM/DD/YYYY"
                      selected={reminder}
                      minDate={startDate}
                      maxDate={endDate}
                      onChange={(date) => setReminder(date)}
                    />
                  </div>
                  {reminder && (
                    <div style={{ width: "150px" }}>
                      <div style={{ color: !reminder ? "grey" : "" }}>
                        Remind Option
                      </div>
                      <select
                        disabled={!reminder}
                        style={
                          !reminder
                            ? { color: "grey", outline: "2px solid grey" }
                            : {}
                        }
                        className="getInputStyle"
                        value={remindOption}
                        onChange={(e) => setRemindOption(e.target.value)}
                      >
                        <option value="">Choose</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <button
              disabled={!paramsEdit}
              onClick={() => {
                saveTask() //Save task handler
              }}
              className="roundButton"
              style={{
                fontSize: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "20px",
                //margin: "0 auto",
                marginTop: "5px",
              }}
            >
              Save Task
            </button>
            <button
              onClick={() => {
                onButtonClick(false)
              }}
              style={{ fontSize: "20px" }}
              className="linkBlue"
            >
              Cancel
            </button>
            {!deleteTask && ( //Warning delete
              <button
                disabled={!paramsEdit}
                onClick={() => {
                  const noneSelected = noneSelectedDeleteMsg()
                  if (!noneSelected) setDeleteTask(true)
                }}
                className="roundButtonCaution"
                style={{
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "auto",
                  //margin: "0 auto",
                  marginTop: "5px",
                }}
              >
                Delete
              </button>
            )}
            {deleteTask && ( //Actual delete
              <button
                onClick={() => {
                  handleDeleteTask()
                }}
                className="roundButtonCaution"
                style={{
                  fontSize: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "auto",
                  //margin: "0 auto",
                  marginTop: "5px",
                }}
              >
                Confirm Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default EditTask
