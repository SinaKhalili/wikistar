import { FaGithubAlt } from "react-icons/fa"

export const ShowLogin = () => {
  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage()
  }
  return (
    <button className="signin-button" onClick={handleOpenOptions}>
      <h2 className="signin-margin">
        <FaGithubAlt />
      </h2>
      <p>sign in with github</p>
    </button>
  )
}
