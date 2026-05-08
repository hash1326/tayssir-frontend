import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../../styles/landing_page/navbar.css";
import logoImg from "../../assets/images/logo2.png";

function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'AR', name: 'Arabic' },
    { code: 'FR', name: 'French' }
  ];

  const userEmail = localStorage.getItem("currentUserEmail");
  const userRole = userEmail ? localStorage.getItem(userEmail + "_role") : null;
  const isLoggedIn = !!userEmail && !!userRole;

  const currentLangCode = i18n.language.toUpperCase().split('-')[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
    // Handle RTL specifically for Arabic
    document.documentElement.dir = code === 'AR' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="navbar dark:!bg-[#0f172a] dark:!border-b dark:!border-white/10 dark:!text-white">
      <div className="navbar-logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <img src={logoImg} alt="Tayssir Logo" style={{ height: '48px' }} />
          <span style={{ fontWeight: 800, fontSize: '1.75rem', color: '#2563eb' }}>Tayssir</span>
        </Link>
      </div>
      <ul className="navbar-links [&>li>a]:dark:!text-zinc-300 hover:[&>li>a]:dark:!text-white">
        <li><a href="/#about">{t('navbar.about')}</a></li>
        <li><a href="/#features">{t('navbar.features')}</a></li>
        <li><a href="/#how-it-works">{t('navbar.how it works')}</a></li>
        <li><a href="/#testimonials">{t('navbar.testimonials')}</a></li>
        <li><a href="/#faq">{t('navbar.faq')}</a></li>
      </ul>
      <div className="navbar-right">
        <div className="language-switcher">
          <button
            className="lang-btn dark:!bg-[#1e293b] dark:!text-white dark:!border-white/10"
            onClick={() => setLangOpen(!langOpen)}
          >
            <Globe size={18} />
            <span>{currentLangCode}</span>
            <ChevronDown size={14} className={langOpen ? 'rotate' : ''} />
          </button>

          {langOpen && (
            <div className="lang-dropdown dark:!bg-[#1e293b] dark:!border-white/10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-option ${currentLangCode === lang.code ? 'active' : ''} dark:hover:!bg-[#1a1a1a] dark:!text-zinc-300`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="navbar-buttons">
          {isLoggedIn ? (
            <Link 
              to={userRole === 'teacher' ? "/teacher-dashboard" : "/student-dashboard"} 
              className="btn-login" 
              style={{ textDecoration: 'none' }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-login dark:!text-white" style={{ textDecoration: 'none' }}>
                {t('navbar.login')}
              </Link>
              <button className="btn-signup" onClick={() => navigate('/signup')}>{t('navbar.signup')}</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
