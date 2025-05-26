import React, { useState, useEffect } from 'react';
import './Settings.css';

const tabList = [
  { key: 'profile', label: 'Profile' },
  { key: 'account', label: 'Account' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'security', label: 'Security' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'billing', label: 'Billing' },
  { key: 'support', label: 'Support' },
];

const CustomCheckbox: React.FC<{checked?: boolean, onChange?: (v: boolean) => void}> = ({checked = false, onChange}) => {
  const [isChecked, setIsChecked] = useState(checked);
  useEffect(() => { setIsChecked(checked); }, [checked]);
  return (
    <span
      tabIndex={0}
      role="checkbox"
      aria-checked={isChecked}
      className={`custom-checkbox${isChecked ? ' checked' : ''}`}
      onClick={() => { setIsChecked(!isChecked); onChange && onChange(!isChecked); }}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { setIsChecked(!isChecked); onChange && onChange(!isChecked); } }}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, border: '2px solid #2563eb', background: isChecked ? '#2563eb' : 'transparent', cursor: 'pointer', marginRight: 10, transition: 'background 0.18s, border 0.18s' }}
    >
      {isChecked && (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 10.5L9 14.5L15 7.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </span>
  );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('yourpro-dark-mode');
    if (stored === 'true') setDarkMode(true);
  }, []);

  // Apply dark mode class to body and persist
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('yourpro-dark-mode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('yourpro-dark-mode', 'false');
    }
  }, [darkMode]);

  return (
    <div>
      <h1 className="settings-title">Settings</h1>
      <div className="settings-tabs">
        {tabList.map(tab => (
          <button
            key={tab.key}
            className={`settings-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'profile' && (
        <section>
          <h2>Profile</h2>
          <div className="settings-field"><label>Full Name</label><input type="text" placeholder="Your name" className="settings-input" /></div>
          <div className="settings-field"><label>Email</label><input type="email" placeholder="Your email" className="settings-input" /></div>
          <div className="settings-field"><label>Profile Picture</label><input type="file" className="settings-input" /></div>
        </section>
      )}
      {activeTab === 'account' && (
        <section>
          <h2>Account</h2>
          <div className="settings-field"><label>Password</label><input type="password" placeholder="Change password" className="settings-input" /><button className="settings-btn">Change</button></div>
          <div className="settings-field"><label>Location</label><input type="text" placeholder="Enter your location" className="settings-input" /><button className="settings-btn">Update</button></div>
          <div className="settings-field"><label>Language</label><select className="settings-input"><option>English</option><option>Spanish</option><option>French</option></select></div>
        </section>
      )}
      {activeTab === 'notifications' && (
        <section>
          <h2>Notifications</h2>
          <div className="settings-field"><label>Email Notifications</label><CustomCheckbox /> Receive updates by email</div>
          <div className="settings-field"><label>Push Notifications</label><CustomCheckbox /> Enable push notifications</div>
          <div className="settings-field"><label>Newsletter</label><CustomCheckbox /> Subscribe to newsletter</div>
        </section>
      )}
      {activeTab === 'appearance' && (
        <section>
          <h2>Appearance</h2>
          <div className="settings-field settings-toggle-row"><label>Dark Mode</label><label className="switch"><input type="checkbox" checked={darkMode} onChange={() => setDarkMode(v => !v)} /><span className="slider round"></span></label></div>
          <div className="settings-field settings-toggle-row"><label>Large Text</label><label className="switch"><input type="checkbox" checked={largeText} onChange={() => setLargeText(v => !v)} /><span className="slider round"></span></label></div>
          <div className="settings-field"><label>Theme Color</label><select className="settings-input"><option>Default</option><option>Blue</option><option>Green</option><option>Purple</option></select></div>
        </section>
      )}
      {activeTab === 'security' && (
        <section>
          <h2>Security</h2>
          <div className="settings-field settings-toggle-row"><label>Two-Factor Authentication</label><label className="switch"><input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(v => !v)} /><span className="slider round"></span></label><span className="settings-toggle-label">{twoFactor ? 'Enabled' : 'Disabled'}</span></div>
          <div className="settings-field"><label>Change Security Question</label><input type="text" placeholder="New security question" className="settings-input" /></div>
          <div className="settings-field"><label>Account Recovery Email</label><input type="email" placeholder="Recovery email" className="settings-input" /></div>
        </section>
      )}
      {activeTab === 'integrations' && (
        <section>
          <h2>Integrations</h2>
          <div className="settings-field"><label>Connect Google</label><button className="settings-btn">Connect</button></div>
          <div className="settings-field"><label>Connect Slack</label><button className="settings-btn">Connect</button></div>
          <div className="settings-field"><label>API Key</label><input type="text" value="••••••••••••" readOnly className="settings-input" /><button className="settings-btn">Copy</button></div>
        </section>
      )}
      {activeTab === 'billing' && (
        <section>
          <h2>Billing</h2>
          <div className="settings-field"><label>Payment Method</label><select className="settings-input"><option>Visa</option><option>Mastercard</option><option>PayPal</option></select></div>
          <div className="settings-field"><label>Billing Address</label><input type="text" placeholder="Billing address" className="settings-input" /></div>
          <div className="settings-field"><label>Invoices</label><button className="settings-btn">View Invoices</button></div>
        </section>
      )}
      {activeTab === 'support' && (
        <section>
          <h2>Support</h2>
          <div className="settings-field"><label>Contact Support</label><button className="settings-btn">Email Us</button></div>
          <div className="settings-field"><label>Help Center</label><button className="settings-btn">Open Help Center</button></div>
          <div className="settings-field"><label>Report a Problem</label><button className="settings-btn">Report</button></div>
        </section>
      )}
    </div>
  );
};

export default Settings; 