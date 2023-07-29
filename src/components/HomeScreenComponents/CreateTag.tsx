import React, { FC, useState, useEffect } from "react"
import { useAuth } from "../../auth-context"
import "../../styles/Global.css"
import "../../styles/CreateTag.css"
import axios from "axios"
import Select from "react-select"

interface Props {
  onButtonClick: () => void
}

const CreateTag: FC<Props> = ({ onButtonClick }) => {
  const auth = useAuth()

  //Account information, from auth
  const username = auth.account?.USERNAME

  //Tags
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])

  //New Tag - Error messages
  const [success, setSuccess] = useState<boolean>(false)
  const [emptyTag, setEmptyTag] = useState<boolean>(false)
  const [duplicate, setDuplicate] = useState<boolean>(false)

  //Your Tag - Error messages
  const tagsOptions =
    tags?.map((tag) => ({
      value: tag,
      label: tag,
    })) ?? []

  const [optionTag, setOptionTag] = useState<{
    value: string
    label: string
  } | null>(null)

  const [succDelete, setSuccDelete] = useState<boolean>(false)
  const [failDelete, setFailDelete] = useState<boolean>(false)
  const [tagHasTask, setTagHasTask] = useState<boolean>(false)

  const handleDelete = async () => {
    const tagHasTask = await findTagHasTask()
    //Check if Tag belongs to a task
    if (tagHasTask) {
      setTagHasTask(true)
      return
    }

    try {
      const flaggedTag = optionTag?.value
      const response = await axios.post(
        "http://localhost:4000/home/deleteTag",
        {
          username,
          flaggedTag,
        }
      )
      const deleted = response.data.deletedTag

      if (deleted) setSuccDelete(true)
      else setFailDelete(true)

      loadTags()
    } catch (e) {
      console.error(e)
    }
  }

  const loadTags = async () => {
    try {
      const response = await axios.get("http://localhost:4000/home/getTags", {
        params: {
          username: username,
        },
      })
      const tags = response.data

      if (tags) setTags(tags.tags)
    } catch (e) {
      console.error(e)
    }
  }

  const findTag = async () => {
    try {
      //api calls
      const response = await axios.post("http://localhost:4000/home/findTag", {
        username,
        tag,
      })
      const found = response.data.foundTag

      if (found) return true
      else return false
    } catch (e) {
      console.error(e)
    }
  }

  const findTagHasTask = async () => {
    try {
      const optionTagValue = optionTag?.value

      //api calls
      const response = await axios.post(
        "http://localhost:4000/home/findTagHasTask",
        {
          username,
          optionTagValue,
        }
      )
      const found = response.data.foundTagHasTask

      if (found) return true
      else return false
    } catch (e) {
      console.error(e)
    }
  }

  const createTag = async () => {
    if (!tag) {
      setEmptyTag(true)
      return //end
    }

    const tagUsed = await findTag()
    if (tagUsed) {
      setDuplicate(true)
      return //end
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/home/createTag",
        {
          username,
          tag,
        }
      )

      loadTags()
      setSuccess(true)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (success) setSuccess(false)
    if (emptyTag) setEmptyTag(false)
    if (duplicate) setDuplicate(false)
  }, [tag])

  useEffect(() => {
    //remove msg
    setSuccDelete(false)
    setFailDelete(false)
  }, [optionTag])

  useEffect(() => {
    loadTags()
  }, [])

  return (
    <>
      <div className="tagPopup">
        <div
          className="tagPopup_inner"
          style={{ width: "400px", minWidth: "400px" }}
        >
          <div
            style={{
              marginBottom: "10px",
              fontSize: "30px",
              fontWeight: "bolder",
            }}
          >
            Tag Options.
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ width: "100%", marginBottom: "3px" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ fontSize: "20px", marginRight: "6px" }}>
                    New Tag
                  </div>
                  {success && (
                    <div style={{ color: "green", fontStyle: "italic" }}>
                      success
                    </div>
                  )}
                  {duplicate && (
                    <div style={{ color: "red", fontStyle: "italic" }}>
                      Tag used
                    </div>
                  )}
                  {emptyTag && (
                    <div style={{ color: "red", fontStyle: "italic" }}>
                      Please type tag
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  className="getInputStyle"
                  placeholder="NEW TAG"
                  value={tag}
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "NEW TAG")}
                  onChange={(e) => {
                    setTag(e.target.value)
                  }}
                />
              </div>
              <button
                style={{
                  fontSize: "20px",
                  width: "125px",
                  marginRight: "10px",
                }}
                onClick={() => {
                  setTag("") //empty selection
                  //reset error messages
                  setDuplicate(false)
                  setEmptyTag(false)
                  setSuccess(false)
                  createTag()
                }}
                className="roundButton"
              >
                Create
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ width: "100%", marginBottom: "5px" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ fontSize: "20px", marginRight: "6px" }}>
                    Your Tags
                  </div>
                  {succDelete && (
                    <div style={{ color: "green", fontStyle: "italic" }}>
                      Deleted
                    </div>
                  )}
                  {failDelete && (
                    <div style={{ color: "red", fontStyle: "italic" }}>
                      Select a Tag
                    </div>
                  )}
                  {tagHasTask && (
                    <div style={{ color: "red", fontStyle: "italic" }}>
                      Tag belongs to Task
                    </div>
                  )}
                </div>
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      width: "100%",
                      border: 0,
                      boxShadow: "none",
                    }),
                    option: (provided) => ({
                      ...provided,
                      height: 40,
                    }),
                  }}
                  className="SelectGetInputStyle"
                  options={tagsOptions}
                  placeholder="Select option"
                  isSearchable={true}
                  value={optionTag || null}
                  onChange={(e) => {
                    setOptionTag(e)
                  }}
                />
              </div>
              <button
                style={{ fontSize: "20px", width: "125px" }}
                className="roundButton"
                onClick={() => {
                  setOptionTag(null) //empty selection
                  //reset error messages
                  setSuccDelete(false)
                  setFailDelete(false)
                  setTagHasTask(false)
                  handleDelete()
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div
            style={{
              marginTop: "25px",
              display: "flex",
            }}
          >
            <button
              style={{
                fontSize: "20px",
              }}
              className="linkBlue"
              onClick={() => {
                onButtonClick()
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateTag
