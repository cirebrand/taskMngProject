import React, { useState, useEffect, useContext } from "react"
import { useMountlessEffect } from "../hooks/useMountlessEffect"
import { useNavigate } from "react-router-dom"
import "../styles/Global.css"
import "../styles/LoginScreen.css"
import { VolleyBall, mountainBackground } from "../static/images/globalImages"
import axios from "axios"
import { User } from "../server/models/index"
import { useAuth } from "../auth-context"

export const LoginScreen = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [validPassword, setValidPassword] = useState(true)
  const [validUsername, setValidUsername] = useState(true)

  const findAccount = async () => {
    try {
      const body: Partial<User> = {
        USERNAME: username!,
        PASSWORD: password!,
      }
      const response = await axios.post(
        "http://localhost:4000/login/findAccount",
        body
      )
      const validityInfo = response.data.validityInfo

      //Error msg flags
      if ("USERNAME" in validityInfo) return validityInfo
      //if (validityInfo.validUsername && validityInfo.validPassword) return true
      if (validityInfo.validUsername) {
        setValidUsername(true)
        setValidPassword(false)
      } else {
        setValidUsername(false)
        setValidPassword(true)
      }
      setPassword("") // reset password
      return false
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogin = async () => {
    const data = await findAccount()
    if (!data) return
    auth.onLogIn(data) //Auth set Acc. info
    navigate("/HomeScreen")
  }

  return (
    <>
      <div className="screen">
        <img
          src={mountainBackground}
          alt="background"
          className="background-image"
        />
        <div className="container">
          <div
            className="rectangle-wrap"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "30px",
                  fontWeight: "bolder",
                }}
              >
                Login.
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "5px" }}>Your Username</div>
                  {!validUsername && (
                    <div style={{ color: "orange", fontStyle: "italic" }}>
                      Invalid Username
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="getInputStyle"
                  placeholder="..."
                  value={username}
                  onFocus={(e) => {
                    e.target.placeholder = ""
                    setValidUsername(true)
                  }}
                  onBlur={(e) => (e.target.placeholder = "...")}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleLogin()
                    }
                  }}
                />
              </div>
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ marginRight: "5px" }}>Your Password</div>
                  {!validPassword && (
                    <div style={{ color: "orange", fontStyle: "italic" }}>
                      Invalid Password
                    </div>
                  )}
                </div>
                <input
                  type="password"
                  className="getInputStyle"
                  placeholder="..."
                  value={password}
                  onFocus={(e) => {
                    e.target.placeholder = ""
                    setValidPassword(true)
                  }}
                  onBlur={(e) => (e.target.placeholder = "...")}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleLogin()
                    }
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{ fontSize: "20px", margin: "10px" }}
                  className="roundButton"
                  onClick={() => {
                    handleLogin()
                  }}
                >
                  Sign in
                </button>
              </div>
              <div style={{ display: "flex" }}>
                <button
                  className="linkBlue"
                  style={{ paddingInlineEnd: "15px" }}
                  onClick={() => {
                    navigate("/MakeAccount")
                  }}
                >
                  Don't have an account?
                </button>
                <button
                  className="linkBlue"
                  onClick={() => {
                    navigate("/ForgotPassword")
                  }}
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </div>
          {/* <img src={VolleyBall} alt="testLogo" className="login-logo" /> */}
        </div>
      </div>
    </>
  )
}
