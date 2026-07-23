import { useState } from 'react';

const initialFormState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  theme: 'Light',
  emailNotifications: true,
  language: 'English',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name, value, formState) {
  switch (name) {
    case 'fullName':
      return value.trim() ? '' : 'Full Name is required.';
    case 'email':
      if (!value.trim()) return 'Email is required.';
      return emailPattern.test(value.trim()) ? '' : 'Please enter a valid email address.';
    case 'password':
      return value.length >= 8 ? '' : 'Password must be at least 8 characters long.';
    case 'confirmPassword':
      if (!value) return 'Please confirm your password.';
      return value === formState.password ? '' : 'Passwords do not match.';
    default:
      return '';
  }
}

function validateForm(formState) {
  return {
    fullName: validateField('fullName', formState.fullName, formState),
    email: validateField('email', formState.email, formState),
    password: validateField('password', formState.password, formState),
    confirmPassword: validateField('confirmPassword', formState.confirmPassword, formState),
  };
}

export default function App() {
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');

  const currentErrors = validateForm(formState);
  const isFormValid = Object.values(currentErrors).every((error) => !error);

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormState((previous) => ({
      ...previous,
      [name]: nextValue,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const errorMessage = validateField(name, value, formState);

    setErrors((previous) => ({
      ...previous,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formState);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setSaveMessage('');
      return;
    }

    setSaveMessage('Settings saved successfully.');
  };

  return (
    <main className="page-shell">
      <section className="settings-card" aria-labelledby="settings-heading">
        <h1 id="settings-heading">Settings</h1>
        <p className="subtitle">Manage your account preferences.</p>

        <form className="settings-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formState.fullName}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby="fullName-error"
            />
            {errors.fullName ? <p id="fullName-error" className="error-message">{errors.fullName}</p> : null}
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.email)}
              aria-describedby="email-error"
            />
            {errors.email ? <p id="email-error" className="error-message">{errors.email}</p> : null}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="password-error"
            />
            {errors.password ? <p id="password-error" className="error-message">{errors.password}</p> : null}
          </div>

          <div className="field-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formState.confirmPassword}
              onChange={handleFieldChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby="confirmPassword-error"
            />
            {errors.confirmPassword ? (
              <p id="confirmPassword-error" className="error-message">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="field-group">
            <label htmlFor="theme">Theme</label>
            <select id="theme" name="theme" value={formState.theme} onChange={handleFieldChange}>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          <div className="field-group checkbox-field">
            <label htmlFor="emailNotifications" className="checkbox-label">
              <input
                id="emailNotifications"
                name="emailNotifications"
                type="checkbox"
                checked={formState.emailNotifications}
                onChange={handleFieldChange}
              />
              Enable email notifications
            </label>
          </div>

          <fieldset className="field-group radio-group">
            <legend>Language</legend>
            <div className="radio-options">
              {['English', 'Español', 'Français'].map((language) => (
                <label key={language} className="radio-label">
                  <input
                    type="radio"
                    name="language"
                    value={language}
                    checked={formState.language === language}
                    onChange={handleFieldChange}
                  />
                  {language}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="save-button" disabled={!isFormValid}>
            Save Settings
          </button>

          {saveMessage ? <p className="success-message">{saveMessage}</p> : null}
        </form>
      </section>
    </main>
  );
}
