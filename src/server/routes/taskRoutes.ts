import {
  createTask,
  getTasks,
  findTaskTitle,
  createTag,
  findTag,
  getTags,
  deleteTag,
  findTagHasTask,
  deleteTask,
  saveTask,
} from "../thunks/index"
import { Router, Request, Response } from "express"

const router = Router()

/* TASKS */

router.post("/home/createTask", async (req: Request, res: Response) => {
  try {
    const obj = req.body // Object with info
    const taskAdded = await createTask(obj.username, obj.body)

    res.status(200).json({ taskAdded })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.get("/home/getTasks", async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string
    const tasks = await getTasks(username)

    res.status(200).json({ tasks })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/home/findTaskTitle", async (req: Request, res: Response) => {
  try {
    const obj = req.body
    const foundTaskTitle = await findTaskTitle(obj.username, obj.title)

    res.status(200).json({ foundTaskTitle })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/home/deleteTask", async (req: Request, res: Response) => {
  try {
    const obj = req.body
    const deletedTask = await deleteTask(obj.username, obj.flaggedTask)

    res.status(200).json({ deletedTask })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/home/saveTask", async (req: Request, res: Response) => {
  try {
    const obj = req.body // Object with info
    const taskSaved = await saveTask(obj.username, obj.body, obj.taskTitleKey)

    res.status(200).json({ taskSaved })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

/* TAGS */

router.post("/home/createTag", async (req: Request, res: Response) => {
  try {
    const obj = req.body // Object with info
    const tagAdded = await createTag(obj.username, obj.tag)

    res.status(200).json({ tagAdded })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})
router.post("/home/findTag", async (req: Request, res: Response) => {
  try {
    const obj = req.body
    const foundTag = await findTag(obj.username, obj.tag)

    res.status(200).json({ foundTag })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.get("/home/getTags", async (req: Request, res: Response) => {
  try {
    const username = req.query.username as string
    const tags = await getTags(username)

    res.status(200).json({ tags })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/home/deleteTag", async (req: Request, res: Response) => {
  try {
    const obj = req.body
    const deletedTag = await deleteTag(obj.username, obj.flaggedTag)

    res.status(200).json({ deletedTag })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/home/findTagHasTask", async (req: Request, res: Response) => {
  try {
    const obj = req.body
    const foundTagHasTask = await findTagHasTask(
      obj.username,
      obj.optionTagValue
    )

    res.status(200).json({ foundTagHasTask })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

export default router
