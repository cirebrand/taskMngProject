import React, { useState, useEffect } from "react"
import { useMountlessEffect } from "../hooks/index"
import { useNavigate } from "react-router-dom"
import "../styles/Global.css"
import "../styles/MakeAccount.css"
import { mountainBackground } from "../static/images/globalImages"
import { PopUpMsg } from "../components/index"
import isEmail from "validator/lib/isEmail"
import { User } from "../server/models/userModel"
import axios from "axios"
import { useAuth } from "../auth-context"

export const MakeAccount = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState<string>("")
  const [validUsername, setValidUsername] = useState<boolean>(true)

  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [validPass, setValidPass] = useState<boolean>(true)
  const [passMatch, setPassMatch] = useState<boolean>(true)

  const [email, setEmail] = useState<string>("")
  const [validEmail, setValidEmail] = useState<boolean>(false)

  const [displayName, setDisplayName] = useState<string>("")
  const [validDisplayName, setValidDisplayName] = useState<boolean>(true)

  const [errorMsg, setErrorMsg] = useState<string>("")
  const [popUp, setPopUp] = useState<boolean>(false)

  useEffect(() => {
    //Load the data here. Only needs to be done once aka []
  }, [])

  useMountlessEffect(() => {
    if (password) {
      // Max Min length
      if (password.length > 50 || password.length < 5) setValidPass(false)
      else setValidPass(true)
    } else {
      setValidPass(true)
    }
    //Matching passwords
    if (!password || !confirmPassword) setPassMatch(true)
    else if (password !== confirmPassword) setPassMatch(false)
    else {
      setPassMatch(true)
    }
  }, [password, confirmPassword])

  useMountlessEffect(() => {
    if (email) setValidEmail(isEmail(email))
  }, [email])

  useMountlessEffect(() => {
    const regex = /^[a-zA-Z0-9.]+$/
    if (username) {
      setValidUsername(regex.test(username))
      if (username.length > 20 || username.length < 3) setValidUsername(false)
    } else setValidUsername(true)
  }, [username])

  useMountlessEffect(() => {
    /* Regex constraints */
    // const regex = /^[a-zA-Z0-9.]+$/
    // if (displayName) {
    //   setValidDisplayName(regex.test(displayName))
    //   if (displayName.length > 20) setValidDisplayName(false)
    // } else setValidDisplayName(true)

    if (displayName) {
      if (displayName.length > 20) setValidDisplayName(false)
      else setValidDisplayName(true)
    } else setValidDisplayName(true)
  }, [displayName])

  const handlePopUpClick = (value: boolean) => {
    setPopUp(value)
  }

  const findUsername = async () => {
    try {
      //api calls
      const body: Partial<User> = {
        USERNAME: username!,
      }

      const response = await axios.post(
        "http://localhost:4000/login/findUsername",
        body
      )
      const found = response.data.foundUsername

      if (found) return true
      else return false
    } catch (e) {
      console.error(e)
    }
  }

  const findEmail = async () => {
    try {
      //api calls
      const body: Partial<User> = {
        EMAIL: email!,
      }

      const response = await axios.post(
        "http://localhost:4000/login/findEmail",
        body
      )
      const found = response.data.foundEmail

      if (found) return true
      else return false
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateAccountClick = async () => {
    const usernameTaken = await findUsername()
    const emailTaken = await findEmail()

    if (!validateInfo(!!usernameTaken, !!emailTaken)) return //cancel

    try {
      //api calls
      const body: User = {
        USERNAME: username!,
        PASSWORD: password!,
        EMAIL: email!,
        DISPLAY_NAME: displayName!,
      }
      //Creates account on mongdoDB
      const response = await axios.post("http://localhost:4000/signup", body)

      auth.onLogIn(body)
      navigate("/HomeScreen")
    } catch (e) {
      console.error(e)
    }
  }

  const validateInfo = (usernameTaken: boolean, emailTaken: boolean) => {
    let valid = true

    setErrorMsg("") //empty out msg
    if (!username) {
      setErrorMsg((c) => (c += "- Please type username\n"))
      valid = false
    } else if (!validUsername) {
      setErrorMsg((c) => (c += "- Invalid username\n"))
      valid = false
    } else if (usernameTaken) {
      setErrorMsg((c) => (c += "- Username taken\n"))
      valid = false
    }
    if (!password || !confirmPassword) {
      setErrorMsg((c) => (c += "- Please type password\n"))
      valid = false
    } else if (!validPass) {
      setErrorMsg((c) => (c += "- Invalid password\n"))
      valid = false
    }
    if (!passMatch) {
      setErrorMsg((c) => (c += "- Passwords do not match\n"))
      valid = false
    }
    if (!email) {
      setErrorMsg((c) => (c += "- Please type email\n"))
      valid = false
    } else if (!validEmail) {
      setErrorMsg((c) => (c += "- Invalid email\n"))
      valid = false
    } else if (emailTaken) {
      setErrorMsg((c) => (c += "- Email taken\n"))
      valid = false
    }
    if (!displayName) {
      setErrorMsg((c) => (c += "- Please type display name\n"))
      valid = false
    } else if (!validDisplayName) {
      setErrorMsg((c) => (c += "- Invalid display name\n"))
      valid = false
    }
    if (!valid) handlePopUpClick(true) //Show error
    return valid
  }

  return (
    <>
      {popUp && (
        <PopUpMsg
          message={!!errorMsg ? errorMsg : ""}
          onButtonClick={() => {
            handlePopUpClick(false)
          }}
        />
      )}
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
              <div style={{}}>
                <div
                  style={{
                    marginBottom: "10px",
                    fontSize: "30px",
                    fontWeight: "bolder",
                  }}
                >
                  Create Account.
                </div>
                <div>
                  <div style={{ color: "blue", fontStyle: "italic" }}>
                    Login Info*
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "5px" }}>Username</div>
                    {!validUsername && (
                      <div style={{ color: "orange", fontStyle: "italic" }}>
                        Only ( a-z, A-Z, 0-9, . ) Min: 3 Max: 20 characters
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    className="getInputStyle"
                    placeholder="NEW USERNAME"
                    value={username}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "NEW USERNAME")}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "5px" }}>Password</div>
                    {!validPass && (
                      <div style={{ color: "orange", fontStyle: "italic" }}>
                        Min: 5 Max: 50 characters
                      </div>
                    )}
                  </div>
                  <input
                    type="password"
                    className="getInputStyle"
                    placeholder="NEW PASSWORD"
                    value={password}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "NEW PASSWORD")}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) =>
                      setPassword(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "5px" }}>Confirm Password</div>
                    {!passMatch && (
                      <div style={{ color: "orange", fontStyle: "italic" }}>
                        Passwords do not match
                      </div>
                    )}
                  </div>
                  <input
                    type="password"
                    className="getInputStyle"
                    placeholder="CONFIRM PASSWORD"
                    value={confirmPassword}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "CONFIRM PASSWORD")}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
                <div>
                  <div style={{ color: "blue", fontStyle: "italic" }}>
                    Account information*
                  </div>
                  <div>Email</div>
                  <input
                    type="text"
                    className="getInputStyle"
                    placeholder="YOUR EMAIL"
                    value={email}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "YOUR EMAIL")}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) =>
                      setEmail(e.target.value.replace(/\s/g, ""))
                    }
                  />
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "5px" }}>Display Name</div>
                    {!validDisplayName && (
                      <div style={{ color: "orange", fontStyle: "italic" }}>
                        Only ( a-z, A-Z, 0-9, . ) Max: 20 characters
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    className="getInputStyle"
                    placeholder="YOUR DISPLAY NAME"
                    value={displayName}
                    onFocus={(e) => (e.target.placeholder = "")}
                    onBlur={(e) => (e.target.placeholder = "YOUR DISPLAYNAME")}
                    onKeyDown={(e) => {
                      if (e.key === " ") {
                        e.preventDefault()
                      }
                    }}
                    onChange={(e) =>
                      setDisplayName(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  marginTop: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  style={{ fontSize: "20px" }}
                  onClick={async () => {
                    handleCreateAccountClick()
                  }}
                  className="greenButton"
                >
                  Create Account
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  className="linkBlue"
                  onClick={() => {
                    navigate("/")
                  }}
                >
                  Already have an account?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
