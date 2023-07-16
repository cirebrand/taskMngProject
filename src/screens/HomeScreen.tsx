import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import {} from "../static/images/MainScreenImages"
import { fishBackground } from "../static/images/globalImages"
import { useAuth } from "../auth-context"
import { useNavigate } from "react-router-dom"
import { start } from "repl"

export const HomeScreen = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  //THIS SHOULD BE THE DISPLAYNAME.
  //Use this to getOne -> displayname from the database
  const displayName = auth.account?.DISPLAY_NAME

  // HOW TO GET ACCOUNT INFORMATION, for populating and stuff
  //console.log(auth.account)

  const homeScreenStyle = {
    backgroundImage: `url(${fishBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  }

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [importance, setImportance] = useState<number | undefined>(undefined)

  return (
    <div style={homeScreenStyle}>
      <h1>Welcome to the Main Page, {displayName}</h1>
      <p>This is the main page content.</p>
      <div style={{ width: "25%" }}>
        <div style={{ marginRight: "5px" }}>Start Date</div>
        <input
          type="text"
          className="getInputStyle"
          placeholder="START DATE"
          value={startDate}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "START DATE")}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div style={{ width: "25%" }}>
        <div style={{ marginRight: "5px" }}>End Date</div>
        <input
          type="text"
          className="getInputStyle"
          placeholder="END DATE"
          value={endDate}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "END DATE")}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="importance-select">Select Importance:</label>
        <select
          id="importance-select"
          value={importance || ""}
          onChange={(event) => setImportance(parseInt(event.target.value))}
        >
          <option value="">Select an option</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <button
        onClick={() => {
          const body = {
            START_DATE: startDate,
            END_DATE: endDate,
            IMPORTANCE: importance,
          }
          console.log(body)
        }}
      >
        test
      </button>
    </div>
  )
}
