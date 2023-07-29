import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Global.css"
import "../styles/ForgotPassword.css"
import { mountainBackground } from "../static/images/globalImages"

/*
!!!!!!


On continue auth, open change pass div. (Cotinue/Save) div { && }


!!!!!!
*/

export const ForgotPassword = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const [checkUsername, setCheckUsername] = useState(true)
  const [checkEmail, setCheckEmail] = useState(false)

  useEffect(() => {
    //console.log("")
  }, [])

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
              <div style={{}}>
                <div
                  style={{
                    marginBottom: "10px",
                    fontSize: "30px",
                    fontWeight: "bolder",
                  }}
                >
                  Forgot Password.
                </div>
                <div>
                  <div style={{ color: "blue", fontStyle: "italic" }}>
                    Please enter your account username or email
                  </div>
                  <div
                    style={{
                      display: "inlineFlex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <label style={{ marginRight: "10px" }}>
                      <input
                        type="checkbox"
                        checked={checkUsername}
                        onChange={() => {
                          setCheckEmail(false)
                          setCheckUsername(true)
                        }}
                      />
                      Username
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkEmail}
                        onChange={() => {
                          setCheckUsername(false)
                          setCheckEmail(true)
                        }}
                      />
                      Email
                    </label>
                  </div>
                </div>
                {checkUsername && (
                  <div>
                    <div>Username</div>
                    <input
                      type="text"
                      className="getInputStyle"
                      placeholder="NEW USERNAME"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "NEW USERNAME")}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                )}
                {checkEmail && (
                  <div>
                    <div>Email</div>
                    <input
                      type="text"
                      className="getInputStyle"
                      placeholder="YOUR EMAIL"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "YOUR EMAIL")}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
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
                  onClick={() => {
                    /*This should open change pass model*/
                  }}
                  className="roundButton"
                >
                  Continue
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  className="linkBlue"
                  onClick={() => {
                    navigate("/")
                  }}
                >
                  Back to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
