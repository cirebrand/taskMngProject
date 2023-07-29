import React, { FC } from "react"
import "../styles/Global.css"
import "../styles/PopUpMsg.css"

interface Props {
  message: string
  onButtonClick: () => void
}

const PopUpMsg: FC<Props> = ({ message, onButtonClick }) => (
  <div className="popup">
    <div className="popup_inner">
      <div
        style={{
          whiteSpace: "pre-wrap",
          marginBottom: "10px",
          fontSize: "20px",
        }}
      >
        {message}
      </div>
      <button
        onClick={onButtonClick}
        className="roundButton"
        style={{
          fontSize: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        Continue
      </button>
    </div>
  </div>
)

export default PopUpMsg
