import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import {} from "../static/images/MainScreenImages"
import { fishBackground } from "../static/images/globalImages"
import { useAuth } from "../auth-context"
import { useNavigate } from "react-router-dom"

export const HomeScreen = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  //THIS SHOULD BE THE DISPLAYNAME.
  //Use this to getOne -> displayname from the database
  const displayName = auth.account?.DISPLAY_NAME

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

  const [test, setTest] = useState("")

  return (
    <div style={homeScreenStyle}>
      <h1>Welcome to the Main Page, {displayName}</h1>
      <p>This is the main page content.</p>
      <button
        onClick={() => {
          console.log(auth.isLoggedIn)
          console.log(auth.account)
        }}
      >
        test
      </button>
      <div style={{ width: "25%" }}>
        <div style={{ color: "blue", fontStyle: "italic" }}>Login Info*</div>
        <div style={{ marginRight: "5px" }}>Username</div>
        <input
          type="text"
          className="getInputStyle"
          placeholder="NEW USERNAME"
          value={test}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "NEW USERNAME")}
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault()
            }
          }}
          onChange={(e) => setTest(e.target.value.replace(/\s/g, ""))}
        />
      </div>
    </div>
  )
}
