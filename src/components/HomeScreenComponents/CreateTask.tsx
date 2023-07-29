import React, { FC, useState, useEffect } from "react"
import { useAuth } from "../../auth-context"
import { Task } from "../../server/models/index"
import "../../styles/Global.css"
import "../../styles/CreateTask.css"
import axios from "axios"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { PopUpMsg } from "../index"
import { CreateTag } from "./index"
import Select from "react-select"

interface Props {
  onButtonClick: (changed: boolean) => void
}

const CreateTask: FC<Props> = ({ onButtonClick }) => {
  const auth = useAuth()

  //Account information, from auth
  const username = auth.account?.USERNAME

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

  // //Select Tags Data
  const [tags, setTags] = useState<string[]>([])
  const tagsOptions =
    tags?.map((tag) => ({
      value: tag,
      label: tag,
    })) ?? []

  //Error PopUp
  const [errorMsg, setErrorMsg] = useState<string>("")
  const [popUpMsg, setPopUpMsg] = useState<boolean>(false)

  //Tag PopUp
  const [popUpTag, setPopUpTag] = useState<boolean>(false)

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

  const createTask = async () => {
    const titleUsed = await findTaskTitle()

    if (!validateInfo(!!titleUsed)) return //cancel

    try {
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
      const response = await axios.post(
        "http://localhost:4000/home/createTask",
        {
          username,
          body,
        }
      )
      onButtonClick(true) //Everything Good, Exit
      //const info = response.data
      //console.log(info.taskAdded.success) //false = duplicate entry
    } catch (e) {
      console.log(e)
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
    loadTags()
  }, [])

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
          <div
            style={{
              marginBottom: "10px",
              fontSize: "30px",
              fontWeight: "bolder",
            }}
          >
            Create Task.
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
                      className="SelectGetInputStyle"
                      options={tagsOptions}
                      placeholder="Select an option"
                      isSearchable={true}
                      onChange={(e) => {
                        setTag(e?.value)
                      }}
                    />
                  </div>
                  <div>
                    <div>Create Tag</div>
                    <button
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
              onClick={() => {
                createTask()
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
              Create Task
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
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateTask
