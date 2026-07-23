import { useState } from 'react'
import './App.css'

const initialSettings = {
  fullName: 'Jamie Carter',
  email: 'jamie@example.com',
  theme: 'dark',
  notifications: true,
  language: 'en',
}

function App() {
  const [settings, setSettings] = useState(initialSettings)
  const [savedMessage, setSavedMessage] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSavedMessage(`Settings saved for ${settings.fullName}.`)
  }

  return (
    <main className="settings-page">
      <section className="settings-card">
        <div className="settings-header">
          <div>
            <p className="eyebrow">Account preferences</p>
            <h1>Settings</h1>
          </div>
          <span className="status-pill">Active</span>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                value={settings.fullName}
                onChange={handleChange}
              />
            </label>

            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
              />
            </label>

            <label className="field">
              <span>Theme</span>
              <select name="theme" value={settings.theme} onChange={handleChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              <span>Enable email notifications</span>
            </label>
          </div>

          <fieldset className="language-group">
            <legend>Language</legend>
            <label>
              <input
                type="radio"
                name="language"
                value="en"
                checked={settings.language === 'en'}
                onChange={handleChange}
              />
              English
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="es"
                checked={settings.language === 'es'}
                onChange={handleChange}
              />
              Español
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="fr"
                checked={settings.language === 'fr'}
                onChange={handleChange}
              />
              Français
            </label>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Save changes
            </button>
            {savedMessage ? <p className="save-message">{savedMessage}</p> : null}
          </div>
        </form>
      </section>
    </main>
  )
}

export default App
