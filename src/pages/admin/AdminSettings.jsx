import React, { useState, useRef } from 'react';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';
import AdminTopbar from '../../components/AdminDashboard/AdminTopbar';
import { 
  Settings, CreditCard, ToggleRight, Globe, Shield, 
  ChevronRight, Check, Image as ImageIcon, Link2
} from 'lucide-react';
import '../../styles/teacher_pages/dashboard.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Consolidated state for backend submission
  const [config, setConfig] = useState({
    // General
    platformName: 'Tayssir Education',
    supportEmail: 'support@tayssir.dz',
    contactPhone: '+213 555 123 456',
    defaultLanguage: 'English',
    platformTagline: 'Empowering Algerian Students with Premium Education',
    
    // Payment
    defaultCurrency: 'Algerian Dinar (DZD)',
    platformFee: 15,
    receiverRip: '00799999000000000000',
    satimTerminalId: 'SATIM_TER_00123',
    
    // Features & Payment Toggles
    maintenanceMode: false,
    newRegistrations: true,
    emailVerification: true,
    publicTeacherDirectory: true,
    studentReviews: true,
    baridiMob: true,
    eccp: true,
    creditCard: false,
    
    // SEO
    globalMetaTitle: 'Tayssir | Premium Online Learning Platform in Algeria',
    globalMetaDescription: 'Join Tayssir to access premium educational content, live classes, and interactive learning tools designed for students across Algeria.',
    facebookPage: 'https://facebook.com/tayssir.dz',
    instagramProfile: 'https://instagram.com/tayssir.dz',
    
    // Security
    force2fa: true,
    sessionTimeout: 120,
    allowedIps: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // This console.log is a direct reference for the backend developer
    console.log("Submitting Platform Settings to Backend API:", JSON.stringify(config, null, 2));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="main-content dashboard-bg admin-main-bg">
        <AdminTopbar />
        
        <div className="content">
          <div className="set-wrapper" style={{ margin: 0, maxWidth: '1100px' }}>
            <div className="set-header">
              <h2 className="admin-page-title">Platform Settings</h2>
              <p className="admin-page-sub">Configure platform-wide preferences, integrations, and operational features.</p>
            </div>
            
            <div className="set-layout">
              {/* Settings Sidebar */}
              <div className="set-sidebar">
                <button 
                  className={`set-nav-item ${activeTab === 'general' ? 'active' : ''}`}
                  onClick={() => setActiveTab('general')}
                >
                  <div className="set-nav-left">
                    <Settings size={18} />
                    <span>General</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'payment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payment')}
                >
                  <div className="set-nav-left">
                    <CreditCard size={18} />
                    <span>Payment Methods</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'features' ? 'active' : ''}`}
                  onClick={() => setActiveTab('features')}
                >
                  <div className="set-nav-left">
                    <ToggleRight size={18} />
                    <span>Platform Features</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'seo' ? 'active' : ''}`}
                  onClick={() => setActiveTab('seo')}
                >
                  <div className="set-nav-left">
                    <Globe size={18} />
                    <span>SEO & Web</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`set-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <div className="set-nav-left">
                    <Shield size={18} />
                    <span>Security</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              </div>
              
              {/* Settings Content */}
              <div className="set-content">
                
                {/* ── GENERAL TAB ── */}
                {activeTab === 'general' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">General Information</h3>
                    <p className="set-panel-sub">Basic information that represents your educational platform.</p>

                    <div className="prof-avatar-row" style={{ marginBottom: '30px' }}>
                      <div className="prof-avatar-wrap" style={{ width: '80px', height: '80px', borderRadius: '12px' }}>
                        <div className="prof-avatar-placeholder" style={{ background: 'var(--menu-grad-1)', borderRadius: '12px' }}>
                          <ImageIcon size={32} color="white" />
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} />
                      </div>
                      <div className="prof-avatar-info">
                        <div className="prof-avatar-name" style={{ fontSize: '15px' }}>Platform Logo</div>
                        <div className="prof-avatar-role">Visible on sidebar and public pages</div>
                        <div className="prof-avatar-btns">
                          <button className="prof-upload-btn" onClick={() => fileInputRef.current?.click()}>
                            Change Logo
                          </button>
                        </div>
                        <p className="prof-avatar-hint">Recommended size: 256x256px (PNG with transparent background)</p>
                      </div>
                    </div>

                    <div className="prof-form">
                      <div className="prof-form-row">
                        <div className="set-input-group">
                          <label className="set-label">Platform Name</label>
                          <div className="set-input-wrap">
                            <input type="text" name="platformName" value={config.platformName} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="set-input-group">
                          <label className="set-label">Support Email</label>
                          <div className="set-input-wrap">
                            <input type="email" name="supportEmail" value={config.supportEmail} onChange={handleChange} />
                          </div>
                        </div>
                      </div>

                      <div className="prof-form-row">
                        <div className="set-input-group">
                          <label className="set-label">Contact Phone</label>
                          <div className="set-input-wrap">
                            <input type="tel" name="contactPhone" value={config.contactPhone} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="set-input-group">
                          <label className="set-label">Default Language</label>
                          <div className="set-input-wrap">
                            <select 
                              name="defaultLanguage" 
                              value={config.defaultLanguage} 
                              onChange={handleChange}
                              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                            >
                              <option value="English">English</option>
                              <option value="French (Français)">French (Français)</option>
                              <option value="Arabic (العربية)">Arabic (العربية)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="set-input-group">
                        <label className="set-label">Platform Tagline (Short description)</label>
                        <div className="set-input-wrap">
                          <input type="text" name="platformTagline" value={config.platformTagline} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      {isSaved && <div className="prof-saved-toast" style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}><Check size={16} /> Saved</div>}
                      <button className="set-btn-save" onClick={handleSave}>Save General Changes</button>
                    </div>
                  </div>
                )}

                {/* ── PAYMENT TAB ── */}
                {activeTab === 'payment' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Payment Methods</h3>
                    <p className="set-panel-sub">Configure local and international payment gateways.</p>

                    <div className="prof-form-row" style={{ marginBottom: '32px' }}>
                      <div className="set-input-group" style={{ marginBottom: 0 }}>
                        <label className="set-label">Default Currency</label>
                        <div className="set-input-wrap">
                          <select 
                            name="defaultCurrency"
                            value={config.defaultCurrency}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                          >
                            <option value="Algerian Dinar (DZD)">Algerian Dinar (DZD)</option>
                            <option value="US Dollar (USD)">US Dollar (USD)</option>
                            <option value="Euro (EUR)">Euro (EUR)</option>
                          </select>
                        </div>
                      </div>
                      <div className="set-input-group" style={{ marginBottom: 0 }}>
                        <label className="set-label">Platform Fee (%)</label>
                        <div className="set-input-wrap">
                          <input type="number" name="platformFee" value={config.platformFee} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="set-list">
                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Baridi Mob</h4>
                          <p>Allow students to pay via Algérie Poste's Baridi Mob app using RIP.</p>
                        </div>
                        <div className={`set-toggle ${config.baridiMob ? 'on' : 'off'}`} onClick={() => handleToggle('baridiMob')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                      
                      {config.baridiMob && (
                        <div className="set-input-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '-12px', marginBottom: '24px' }}>
                          <label className="set-label">Receiver RIP (Relevé d'Identité Postal)</label>
                          <div className="set-input-wrap">
                            <input type="text" name="receiverRip" value={config.receiverRip} onChange={handleChange} />
                          </div>
                        </div>
                      )}

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>ECCP (Edahabia Card)</h4>
                          <p>Direct online payment integration with Algérie Poste SATIM gateway.</p>
                        </div>
                        <div className={`set-toggle ${config.eccp ? 'on' : 'off'}`} onClick={() => handleToggle('eccp')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      {config.eccp && (
                        <div className="set-input-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '-12px', marginBottom: '24px' }}>
                          <label className="set-label">SATIM Terminal ID</label>
                          <div className="set-input-wrap">
                            <input type="text" name="satimTerminalId" placeholder="Enter Term ID provided by Algérie Poste" value={config.satimTerminalId} onChange={handleChange} />
                          </div>
                        </div>
                      )}

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>International Credit Cards (Stripe)</h4>
                          <p>Accept payments via Visa and Mastercard for international students.</p>
                        </div>
                        <div className={`set-toggle ${config.creditCard ? 'on' : 'off'}`} onClick={() => handleToggle('creditCard')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      {isSaved && <div className="prof-saved-toast" style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}><Check size={16} /> Saved</div>}
                      <button className="set-btn-save" onClick={handleSave}>Save Payment Settings</button>
                    </div>
                  </div>
                )}

                {/* ── FEATURES TAB ── */}
                {activeTab === 'features' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Platform Features</h3>
                    <p className="set-panel-sub">Enable or disable core functionality across the platform.</p>

                    <div className="set-list">
                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Maintenance Mode</h4>
                          <p>Disable access to the platform for all users except Administrators.</p>
                        </div>
                        <div className={`set-toggle ${config.maintenanceMode ? 'on' : 'off'}`} onClick={() => handleToggle('maintenanceMode')} style={{ background: config.maintenanceMode ? '#ef4444' : '#e2e8f0' }}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Open Registrations</h4>
                          <p>Allow new students and teachers to create accounts.</p>
                        </div>
                        <div className={`set-toggle ${config.newRegistrations ? 'on' : 'off'}`} onClick={() => handleToggle('newRegistrations')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Require Email Verification</h4>
                          <p>Force users to verify their email address before accessing classrooms.</p>
                        </div>
                        <div className={`set-toggle ${config.emailVerification ? 'on' : 'off'}`} onClick={() => handleToggle('emailVerification')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Public Teacher Directory</h4>
                          <p>Allow unregistered visitors to browse your list of teachers.</p>
                        </div>
                        <div className={`set-toggle ${config.publicTeacherDirectory ? 'on' : 'off'}`} onClick={() => handleToggle('publicTeacherDirectory')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>

                      <div className="set-row">
                        <div className="set-row-info">
                          <h4>Course Reviews & Ratings</h4>
                          <p>Allow students to rate and review courses they have completed.</p>
                        </div>
                        <div className={`set-toggle ${config.studentReviews ? 'on' : 'off'}`} onClick={() => handleToggle('studentReviews')}>
                          <div className="set-toggle-knob"></div>
                        </div>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      {isSaved && <div className="prof-saved-toast" style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}><Check size={16} /> Saved</div>}
                      <button className="set-btn-save" onClick={handleSave}>Save Features</button>
                    </div>
                  </div>
                )}

                {/* ── SEO & WEB TAB ── */}
                {activeTab === 'seo' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">SEO & Web Presence</h3>
                    <p className="set-panel-sub">Optimize your platform for search engines and social media sharing.</p>

                    <div className="prof-form">
                      <div className="set-input-group">
                        <label className="set-label">Global Meta Title</label>
                        <div className="set-input-wrap">
                          <input type="text" name="globalMetaTitle" value={config.globalMetaTitle} onChange={handleChange} />
                        </div>
                      </div>
                      
                      <div className="set-input-group">
                        <label className="set-label">Global Meta Description</label>
                        <div className="set-input-wrap">
                          <textarea 
                            className="prof-bio-textarea"
                            name="globalMetaDescription"
                            rows={3} 
                            value={config.globalMetaDescription}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '32px', marginBottom: '16px' }}>Social Connect</h4>
                      
                      <div className="prof-form-row">
                        <div className="set-input-group">
                          <label className="set-label"><Link2 size={14} /> Facebook Page</label>
                          <div className="set-input-wrap">
                            <input type="url" name="facebookPage" value={config.facebookPage} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="set-input-group">
                          <label className="set-label"><Link2 size={14} /> Instagram Profile</label>
                          <div className="set-input-wrap">
                            <input type="url" name="instagramProfile" value={config.instagramProfile} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      {isSaved && <div className="prof-saved-toast" style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}><Check size={16} /> Saved</div>}
                      <button className="set-btn-save" onClick={handleSave}>Save SEO Settings</button>
                    </div>
                  </div>
                )}

                {/* ── SECURITY TAB ── */}
                {activeTab === 'security' && (
                  <div className="set-panel animate-fade-in">
                    <h3 className="set-panel-title">Security & Access</h3>
                    <p className="set-panel-sub">Manage platform security policies and administrator access.</p>

                    <div className="set-box" style={{ marginTop: '24px' }}>
                      <div className="set-box-icon">
                        <Shield size={22} />
                      </div>
                      <div className="set-box-info">
                        <h4>Force 2FA for Administrators</h4>
                        <p>Require Two-Factor Authentication for all admin accounts.</p>
                      </div>
                      <div className={`set-toggle ${config.force2fa ? 'on' : 'off'}`} onClick={() => handleToggle('force2fa')}>
                        <div className="set-toggle-knob"></div>
                      </div>
                    </div>

                    <div className="prof-form" style={{ marginTop: '32px' }}>
                      <div className="set-input-group">
                        <label className="set-label">Session Timeout (Minutes)</label>
                        <div className="set-input-wrap" style={{ maxWidth: '200px' }}>
                          <input type="number" name="sessionTimeout" value={config.sessionTimeout} onChange={handleChange} />
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Automatically log out inactive administrators after this time.</p>
                      </div>

                      <div className="set-input-group" style={{ marginTop: '24px' }}>
                        <label className="set-label">Allowed Admin IP Addresses</label>
                        <div className="set-input-wrap">
                          <textarea 
                            className="prof-bio-textarea"
                            name="allowedIps"
                            rows={3} 
                            placeholder="e.g. 192.168.1.1 (Leave empty to allow all IPs)"
                            value={config.allowedIps}
                            onChange={handleChange}
                          />
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Restrict admin dashboard access to specific IP addresses. One per line.</p>
                      </div>
                    </div>

                    <div className="set-save-footer">
                      {isSaved && <div className="prof-saved-toast" style={{ marginRight: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}><Check size={16} /> Saved</div>}
                      <button className="set-btn-save" onClick={handleSave}>Save Security Settings</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;

