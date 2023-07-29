import React, { useState, useEffect } from "react"
import {} from "../static/images/MainScreenImages"
import { fishBackground } from "../static/images/globalImages"
import { useAuth } from "../auth-context"
import "../styles/Global.css"
import {
  NavBar,
  CreateTask,
  CreateTag,
  TaskCalendar,
  SortTasks,
  Grid,
  EditTask,
} from "../components/HomeScreenComponents/index"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Task } from "../server/models/index"

export const HomeScreen = () => {
  const auth = useAuth()
  const navigate = useNavigate()

  //Account information, from auth
  const displayName = auth.account?.DISPLAY_NAME
  const username = auth.account?.USERNAME

  /*
    - Can set these anytime
    - tasks are not initialized but added when needed -> (taskThunks)
  */
  //Lists from User
  const [allReminders, setAllReminders] = useState<string[]>([]) //All tasks
  const [allComments, setAllComments] = useState<string[]>([]) //1 task

  //Lists
  const [tasks, setTasks] = useState<Partial<Task>[]>()
  const [tags, setTags] = useState<string[]>([])
  const [sortedTasks, setSortedTasks] = useState<Partial<Task>[]>([]) //From sortTasks component

  //PopUp States
  const [createTask, setCreateTask] = useState(false)
  const [createTag, setCreateTag] = useState(false)
  const [editTask, setEditTask] = useState(false)

  //Grid -> Edit Task
  const [selectedTask, setSelectedTask] = useState<Partial<Task>>()

  const loadTags = async () => {
    try {
      const response = await axios.get("http://localhost:4000/home/getTags", {
        params: {
          username: username,
        },
      })
      const tags = response.data

      setTags(tags.tags)
    } catch (e) {
      console.error(e)
    }
  }

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/home/getTasks", {
        params: {
          username: username,
        },
      })
      const tasks = response.data

      setTasks(tasks.tasks)
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateTaskClick = (value: boolean) => {
    setCreateTask(value)
  }
  const handleCreateTagClick = (value: boolean) => {
    setCreateTag(value)
  }
  const handleEditTaskClick = (value: boolean) => {
    setEditTask(value)
  }

  // Callback function to receive sortedTasks
  const handleSortTasksChange = (sortedTasks: Partial<Task>[]) => {
    setSelectedTask(selectedTask)
    setSortedTasks(sortedTasks)
  }

  const handleTaskSelect = (task: Partial<Task>) => {
    setSelectedTask(task)
    setEditTask(true) //Edit selected task
  }

  //Get lists
  useEffect(() => {
    loadTasks()
    loadTags()
  }, [])

  return (
    <>
      {createTask && (
        <CreateTask
          onButtonClick={(changed: boolean) => {
            handleCreateTaskClick(false)
            if (changed) {
              loadTasks() //Load tasks
            }
            loadTags() //Load Tags
          }}
        />
      )}
      {createTag && (
        <CreateTag
          onButtonClick={() => {
            handleCreateTagClick(false)
            loadTags() //Load Tags
          }}
        />
      )}
      {editTask && (
        <EditTask
          gridTask={selectedTask!}
          tasks={sortedTasks!}
          onButtonClick={(changed: boolean) => {
            setSelectedTask(undefined) //Better solutions...
            handleEditTaskClick(false)
            if (changed) {
              loadTasks() //Load tasks
            }
            loadTags() //Load Tags
          }}
        />
      )}
      <div style={{ backgroundColor: "#C6C9DA", height: "100vh" }}>
        <NavBar />
        <div
          style={{
            margin: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* <h1>Welcome back, {displayName}</h1> */}
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                backgroundColor: "#8592C9",
                width: "fit-content",
                borderRadius: "15px",
                alignItems: "center",
                padding: "5px",
              }}
            >
              <h1 style={{ margin: "0px" }}>Create/Edit.</h1>
              <button
                onClick={() => {
                  setCreateTask(true)
                }}
                style={{ width: "150px", fontSize: "20px" }}
                className="roundButton"
              >
                Create Task
              </button>
              <button
                onClick={() => {
                  setCreateTag(true)
                }}
                style={{ width: "150px", fontSize: "20px" }}
                className="roundButton"
              >
                Create Tag
              </button>
              <button
                onClick={() => {
                  setEditTask(true)
                }}
                style={{ width: "150px", fontSize: "20px" }}
                className="roundButton"
              >
                Edit Task
              </button>
            </div>

            <SortTasks
              tasks={tasks ? tasks : []}
              tags={tags}
              onSortTasksChange={handleSortTasksChange}
            />
          </div>

          <div
            style={{
              backgroundColor: "#8592C9",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          >
            <Grid tasks={sortedTasks} onTaskSelect={handleTaskSelect} />
          </div>
        </div>
      </div>
    </>
  )
}
