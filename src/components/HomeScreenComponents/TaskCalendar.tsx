import React, { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "../../styles/TaskCalendar.css"

const TaskCalendar = () => {
  const [date, setDate] = useState(new Date())
  const [tasks, setTasks] = useState([
    { id: 1, title: "Task 1", date: "2023-07-21" },
    { id: 2, title: "Task 2", date: "2023-07-22" },
    { id: 3, title: "Task 3", date: "2023-07-22" },
    // Add more tasks here with different dates
  ])

  const handleDateClick = (date: Date) => {
    setDate(date)
  }

  const tasksForSelectedDate = tasks.filter(
    (task) => task.date === formatDate(date)
  )

  const handleResetClick = () => {
    setDate(new Date())
  }

  return (
    <div>
      <h1>Task Calendar</h1>
      <Calendar onClickDay={handleDateClick} value={date} />
      <button
        onClick={() => {
          handleResetClick()
        }}
      >
        Reset
      </button>
      <h2>Tasks for {formatDate(date)}:</h2>
      {tasksForSelectedDate.length === 0 ? (
        <p>No tasks for this date.</p>
      ) : (
        <ul>
          {tasksForSelectedDate.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Helper function to format date as 'YYYY-MM-DD'
const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default TaskCalendar
