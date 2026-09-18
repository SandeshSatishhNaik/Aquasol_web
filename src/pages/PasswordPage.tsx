import React, { useState } from 'react';

export const PasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError(true);
    } else {
      setError(true); // Demo mode
    }
  };

  return (
    <div className="utility-page-wrap">
      <div className="utility-page-content w-password-page w-form">
        <form onSubmit={handleSubmit} className="utility-page-form w-password-page">
          <div className="password-page-icon-wrap">
            <img
              src="/assets/68bfe712ce59fa62677685ed_lock.svg"
              loading="lazy"
              alt=""
              className="password-page-icon"
            />
          </div>
          <h2 className="heading h2">Protected page</h2>
          <label htmlFor="pass" className="field-label-2 w-password-page">
            Password
          </label>
          <input
            className="text-field border w-password-page w-input"
            autoFocus
            maxLength={256}
            name="pass"
            placeholder="Enter your password"
            type="password"
            id="pass"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
          <div className="buttons-wrap no-top-padding">
            <input type="submit" className="button w-password-page w-button" value="Submit" />
          </div>
          {error && (
            <div className="w-password-page w-form-fail" style={{ display: 'block' }}>
              <div>Incorrect password. Please try again.</div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
