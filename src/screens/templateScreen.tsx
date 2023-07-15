import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const templateScreen = () => {
  const navigate = useNavigate()

  const [x, setX] = useState()

  useEffect(() => {
    console.log("")
  }, [])

  return (
    <>
      <div>x</div>
    </>
  )
}
