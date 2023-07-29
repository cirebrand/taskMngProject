// const mongoose = require("mongoose")

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
// })

// const User = mongoose.model("User", userSchema)

import { Task } from "./index"

export type User = {
  USERNAME: string
  PASSWORD: string
  EMAIL: string
  DISPLAY_NAME: string
  TASKS: Task[]
}
