import {
  createUser,
  getAllUsernames,
  findAccount,
  findUsername,
  findEmail,
} from "../thunks/index"
import { Router, Request, Response } from "express"

const router = Router()

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const user = req.body // Object with info
    await createUser(user)

    res.status(200).json({ message: "User created successfully" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

/* 
  EXAMPLE (get) - DO NOT USE
*/
router.get("/login/getUsernames", async (req: Request, res: Response) => {
  try {
    const usernames = await getAllUsernames()

    res.status(200).json({ usernames })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/login/findAccount", async (req, res) => {
  try {
    const username = req.body
    const validityInfo = await findAccount(username)

    res.status(200).json({ validityInfo })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/login/findUsername", async (req, res) => {
  try {
    const username = req.body
    const foundUsername = await findUsername(username)

    res.status(200).json({ foundUsername })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

router.post("/login/findEmail", async (req, res) => {
  try {
    const email = req.body
    const foundEmail = await findEmail(email)

    res.status(200).json({ foundEmail })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Something went wrong" })
  }
})

export default router
