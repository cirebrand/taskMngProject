import { User } from "../models/userModel"
import { client } from "../server"

//Create User (post)
export async function createUser(user: User) {
  const result = await client
    .db("task-manager")
    .collection("users")
    .insertOne(user)
  // console.log(`New listing ID: ${result.insertedId}`)
}

/* 
  EXAMPLE (get) - DO NOT USE
*/
//Get Usernames
export async function getAllUsernames() {
  const usernames = await client
    .db("task-manager")
    .collection("users")
    .find({}, { projection: { USERNAME: 1 } }) // Only get username
    .toArray()

  if (usernames.length > 0) {
    return usernames.map((user) => user.USERNAME)
  } else {
    console.log("No usernames found.")
    return []
  }
}
/* HOW TO USE (Get Usernames) -> .tsx file */
// const fetchUsers = async () => {
//   try {
//     const response = await axios.get(
//       "http://localhost:4000/login/getUsernames"
//     )
//     setUsernames(response.data.usernames)
//   } catch (error) {
//     console.error(error)
//   }
// }

//Find Account (post)
export async function findAccount(user: Partial<User>) {
  const account = await client
    .db("task-manager")
    .collection("users")
    .findOne({ USERNAME: user.USERNAME })

  if (account) {
    if (account.PASSWORD === user.PASSWORD) {
      return account //user obj. info
      //return { validUsername: true, validPassword: true }
    } else return { validUsername: true, validPassword: false }
  } else return { validUsername: false, validPassword: false }
}

//Username exist (post)
export async function findUsername(user: Partial<User>) {
  const username = await client
    .db("task-manager")
    .collection("users")
    .findOne({ USERNAME: user.USERNAME })

  if (username) return true
  else return false
}

//Username exist (post)
export async function findEmail(user: Partial<User>) {
  const email = await client
    .db("task-manager")
    .collection("users")
    .findOne({ EMAIL: user.EMAIL })

  if (email) return true
  else return false
}
