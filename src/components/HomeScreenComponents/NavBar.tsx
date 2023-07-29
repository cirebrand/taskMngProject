import "../../styles/Global.css"
import { useNavigate } from "react-router-dom"

const NavBar = () => {
  const navigate = useNavigate()

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "4vh",
          backgroundColor: "white",
          padding: "10px",
          alignItems: "center",
          paddingLeft: "25px",
          paddingRight: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <h1 style={{ flexShrink: "0" }}>Task Manager App</h1>
        </div>
        <div
          style={{
            display: "flex",
            marginLeft: "auto",
            gap: "10px",
          }}
        >
          <button
            style={{ width: "100px", fontSize: "15px" }}
            className="roundButton"
          >
            Settings
          </button>
          <button
            style={{ width: "100px", fontSize: "15px" }}
            className="roundButton"
            onClick={() => {
              navigate("/")
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  )
}

export default NavBar
