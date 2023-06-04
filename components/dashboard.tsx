import { FaArrowRight } from "react-icons/fa"

type StarDataT = {
  created_at: string
  link: string
  title: string
  thumbnail_url: string
}

interface IDashboardProps {
  user: any
  stars: StarDataT[]
}

const toEnglish = (date: string) => {
  const d = new Date(date)
  // we want it to be like "July 4, 2021"
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}

export const Dashboard = ({ user, stars }: IDashboardProps) => {
  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  const openLink = (link: string) => {
    chrome.tabs.create({ url: link })
  }

  return (
    <div className="w100 flex-left column">
      <h1 className="serif greeting">
        Hello, {user.identities[0].identity_data.full_name}
      </h1>
      <div>
        <button className="logout-button" onClick={handleOpenOptions}>
          <div className="flex">
            manage account <FaArrowRight className="mx10" />
          </div>
        </button>
      </div>
      <div className="w100">
        {stars.length > 0 ? (
          <div className="flex-column mx10 w100">
            <h2 className="serif my10">My Stars</h2>
            <ul className="no-list-style w100">
              {stars.map((star) => (
                <li className="wiki-list-item w100">
                  <div>
                    <a
                      className="pointer wiki-list-item-a"
                      onClick={() => openLink(star.link)}>
                      {star.title}
                    </a>
                    <p className="wiki-list-item-p">
                      Starred on {toEnglish(star.created_at)}
                    </p>
                  </div>
                  <img
                    className="wiki-list-item-img"
                    src={star.thumbnail_url}
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
