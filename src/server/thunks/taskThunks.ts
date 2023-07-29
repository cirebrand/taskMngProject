import { Task } from "../models/index"
import { client } from "../server"

/* TASKS */

export async function createTask(username: string, newItem: Partial<Task>) {
  const result = await client
    .db("task-manager")
    .collection("users")
    .updateOne(
      { USERNAME: username },
      { $addToSet: { TASKS: newItem } },
      { upsert: true } // Enable upsert to insert a new document if it doesn't exist
    )

  if (result.modifiedCount === 1 || result.upsertedCount === 1) {
    return { success: true }
  } else {
    return { success: false }
  }
}

export async function getTasks(username: string) {
  const tasks = await client
    .db("task-manager")
    .collection("users")
    .findOne({ USERNAME: username }, { projection: { TASKS: 1 } })

  if (tasks) {
    return tasks.TASKS
  } else {
    return []
  }
}

export async function findTaskTitle(username: string, title: string) {
  const findTitle = await client
    .db("task-manager")
    .collection("users")
    .findOne({
      USERNAME: username,
      TASKS: { $elemMatch: { TITLE: title } },
    })

  if (findTitle) {
    return true
  } else {
    return false
  }
}

export async function saveTask(
  username: string,
  newItem: Partial<Task>,
  title: string
) {
  const result = await client
    .db("task-manager")
    .collection("users")
    .findOneAndUpdate(
      {
        USERNAME: username,
        TASKS: { $elemMatch: { TITLE: title } },
      },
      {
        $set: { "TASKS.$": newItem },
      }
    )

  if (result.ok === 1 && result.value) {
    return true
  } else {
    return false
  }
}

/* TAGS */

export async function createTag(username: string, newTag: string) {
  const result = await client
    .db("task-manager")
    .collection("users")
    .updateOne(
      { USERNAME: username },
      { $addToSet: { TAGS: newTag } },
      { upsert: true } // Enable upsert to insert a new document if it doesn't exit
    )

  if (result.modifiedCount === 1 || result.upsertedCount === 1) {
    return { success: true }
  } else {
    return { success: false }
  }
}

export async function deleteTask(username: string, title: string) {
  const result = await client
    .db("task-manager")
    .collection("users")
    .updateOne({ USERNAME: username }, { $pull: { TASKS: { TITLE: title } } })

  return result.modifiedCount > 0
}

export async function findTag(username: string, tag: string) {
  const findTitle = await client
    .db("task-manager")
    .collection("users")
    .findOne({ USERNAME: username, TAGS: tag })

  if (findTitle) {
    return true
  } else {
    return false
  }
}

export async function getTags(username: string) {
  const tags = await client
    .db("task-manager")
    .collection("users")
    .findOne({ USERNAME: username }, { projection: { TAGS: 1 } })

  if (tags) {
    return tags.TAGS
  } else {
    return []
  }
}

export async function deleteTag(username: string, tag: string) {
  const result = await client
    .db("task-manager")
    .collection("users")
    .updateOne({ USERNAME: username }, { $pull: { TAGS: tag } })

  return result.modifiedCount > 0
}

export async function findTagHasTask(username: string, tag: string) {
  const findTagHasTask = await client
    .db("task-manager")
    .collection("users")
    .findOne({
      USERNAME: username,
      TASKS: { $elemMatch: { TAG: tag } },
    })

  if (findTagHasTask) {
    return true
  } else {
    return false
  }
}
