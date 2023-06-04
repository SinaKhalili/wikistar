import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import {
  type Session,
  SupabaseClient,
  type User,
  createClient
} from "@supabase/supabase-js"
import cssText from "data-text:~/contentstyle.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"

import { supabase } from "~/core/supabase"
import { StarIconFilled, StarIconUnfilled } from "~/icons"

import "./contentstyle.css"

export const config: PlasmoCSConfig = {
  matches: ["https://en.wikipedia.org/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
  document.querySelector("#right-navigation")

const WikistarButton = () => {
  const [isStarred, setIsStarred] = useState(false)
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null
  )

  const [session, setSession] = useStorage<Session>({
    key: "session",
    instance: new Storage({
      area: "local"
    })
  })

  const doStar = async () => {
    const link = window.location.href
    const title = document.title.trimEnd().replace(" - Wikipedia", "")
    let thumbnail_url = null

    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
          title
        )}&prop=pageimages&format=json&pithumbsize=300`
      )
      const data = await response.json()
      const pageId = Object.keys(data.query.pages)[0]
      thumbnail_url = data.query.pages[pageId]?.thumbnail?.source
    } catch (e) {
      console.error(e)
    }

    const { data: insertData, error } = await supabaseClient
      .from("wikistars")
      .insert([
        {
          user_id: session.user.id,
          link,
          title,
          thumbnail_url
        }
      ])
  }

  const checkForStar = async () => {
    if (!session) return
    if (!supabaseClient) return
    try {
      console.log(supabaseClient)
      const { error, data } = await supabaseClient
        .from("wikistars")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("link", window.location.href)
        .single()

      console.log(data)
      if (error) {
        setIsStarred(false)
        console.error(error)
        return
      }
      if (data) {
        setIsStarred(true)
      }
    } catch (e) {
      setIsStarred(false)
      console.error(e)
    }
  }

  useEffect(() => {
    checkForStar()
  }, [session, supabaseClient])

  useEffect(() => {
    try {
      const supabase = createClient(
        process.env.PLASMO_PUBLIC_SUPABASE_URL,
        process.env.PLASMO_PUBLIC_SUPABASE_KEY,
        {
          global: {
            headers: { Authorization: `Bearer ${session?.access_token}` }
          }
        }
      )
      setSupabaseClient(supabase)
    } catch (e) {
      console.error(e)
    }
  }, [session])

  const removeStar = async () => {
    if (!session) return
    if (!supabaseClient) return
    try {
      await supabaseClient
        .from("wikistars")
        .delete()
        .eq("user_id", session.user.id)
        .eq("link", window.location.href)
    } catch (e) {
      console.error(e)
    }
  }

  const handleStar = () => {
    if (!isStarred) {
      doStar()
      setIsStarred(!isStarred)
    }
    if (isStarred) {
      removeStar()
      setIsStarred(!isStarred)
    }
  }

  if (!session) return null
  return (
    <div className="wikistar-container">
      <button className="wikistar-button" onClick={handleStar}>
        {isStarred ? <StarIconFilled /> : <StarIconUnfilled />}
        {isStarred ? "Starred" : "Star"}
      </button>
    </div>
  )
}

export default WikistarButton
