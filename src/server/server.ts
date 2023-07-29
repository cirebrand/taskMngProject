import { MongoClient } from "mongodb"

import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import taskRoutes from "./routes/taskRoutes"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/", userRoutes, taskRoutes)

app.listen(4000, () => {
  console.log(`Server is running on port 4000`)
})

const uri =
  "mongodb+srv://EricH:tmp123@taskmngapp-cluster.zd1b44k.mongodb.net/sample_mflix?retryWrites=true&w=majority"

export const client = new MongoClient(uri)

async function main() {
  try {
    await client.connect()

    console.log("Connection running")
  } catch (e) {
    console.error(e)
  } //finally {
  //   await client.close()
  // }
}

main().catch(console.error)

//List all databases
// async function listDatabases(client: MongoClient) {
//   const databasesList = await client.db().admin().listDatabases()

//   console.log("Databases:")
//   databasesList.databases.forEach((db) => {
//     console.log(`- ${db.name}`)
//   })
// }
