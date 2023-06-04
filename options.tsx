import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"
import type { Provider, Session, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import "./popupstyle.css"
import "./signinbutton.css"
import "./options.css"

import { supabase } from "~core/supabase"

function IndexOptions() {
  const [session, setSession] = useStorage<Session>({
    key: "session",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }
      if (!!data.session) {
        console.log(data.session)
        setSession(data.session)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        })
      }
    }

    init()
  }, [])

  const handleOAuthLogin = async (provider: Provider, scopes = "email") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        scopes,
        redirectTo: location.href
      }
    })
  }

  return (
    <main className="wh100">
      <div className="wh100">
        {session && (
          <div className="double-center wh100 white serif">
            <h1>
              Logged in as {session.user.identities[0].identity_data.full_name}{" "}
              {"<"}
              {session.user.email}
              {">"}
            </h1>
            <a
              className="logout-button pointer"
              onClick={() => {
                supabase.auth.signOut()
                setSession(null)
              }}>
              Logout?
            </a>
          </div>
        )}
        {!session && (
          <div className="w100 h100 double-center">
            <button
              className="signin-button"
              onClick={(e) => {
                handleOAuthLogin("github")
              }}>
              <h2>Sign in with GitHub</h2>
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default IndexOptions
