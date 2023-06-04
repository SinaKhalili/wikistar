import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import {
  type Session,
  type SupabaseClient,
  type User,
  createClient
} from "@supabase/supabase-js"
import someCoolImage from "data-base64:~assets/icon.png"
import cssText2 from "data-text:~/popupstyle.css"
import cssText from "data-text:~/signinbutton.css"
import { useEffect, useState } from "react"

import { Dashboard } from "~/components/dashboard"
import { ShowLogin } from "~/components/showLogin"

import "./popupstyle.css"
import "~/signinbutton.css"

type StarDataT = {
  created_at: string
  link: string
  title: string
  thumbnail_url: string
}

function IndexPopup() {
  const [errorMsg, setErrorMsg] = useState("")
  const [myStars, setMyStars] = useState<StarDataT[]>([])
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(
    null
  )

  const [session, setSession] = useStorage<Session>({
    key: "session",
    instance: new Storage({
      area: "local"
    })
  })

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage()
  }

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

  useEffect(() => {
    async function init() {
      if (!session?.user) return
      if (!supabaseClient) return
      const { data, error } = await supabaseClient
        .from("wikistars")
        .select("title,created_at,link,thumbnail_url")
        .eq("user_id", session?.user.id)

      if (error) {
        console.error(error)
        return
      }
      if (data) {
        setMyStars(data)
      }
    }
    init()
  }, [supabaseClient, session])

  return (
    <div className="wikistar-popup flex-column">
      <div className="flex-between top">
        <div className="flex">
          <img className="logo" src={someCoolImage} alt="logo" />
          <h1 className="serif title">Wikistar</h1>
        </div>
        {session && (
          <>
            <img
              className="avatar"
              src={session?.user.identities[0].identity_data.avatar_url}
            />
          </>
        )}
      </div>

      <div className="flex w100">
        {errorMsg !== "" ? <span className="error">{errorMsg}</span> : <></>}
        {session?.user ? (
          <Dashboard stars={myStars} user={session.user} />
        ) : (
          <ShowLogin />
        )}
      </div>
    </div>
  )
}

export default IndexPopup
