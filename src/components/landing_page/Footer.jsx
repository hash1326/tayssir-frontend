import React from "react";
import { useTranslation } from "react-i18next";
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  MessageCircle,
  BarChart
} from "lucide-react";
import "../../styles/landing_page/footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-section">
      {/* Subtle Background Pattern Elements */}
      <div className="footer-pattern">
        <BookOpen className="bg-icon icon-1" />
        <MessageCircle className="bg-icon icon-2" />
        <BarChart className="bg-icon icon-3" />
        <ShieldCheck className="bg-icon icon-4" />
      </div>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand & Social Column */}
          <div className="footer-column brand-col">
            <div className="footer-logo">
              <span className="logo-dot"></span>
              Tayssir
            </div>
            <p className="footer-description">
              {t('footer.desc')}
            </p>
            <div className="social-links">
              <a href="#" className="social-icon instagram"><Instagram size={20} /></a>
              <a href="#" className="social-icon facebook"><Facebook size={20} /></a>
              <a href="#" className="social-icon linkedin"><Linkedin size={20} /></a>
              <a href="#" className="social-icon github"><Github size={20} /></a>
            </div>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h3>{t('navbar.about')}</h3>
            <ul className="footer-links">
              <li><a href="#faq">{t('navbar.faq')}</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Quick Programs Column - The "Another Choice" */}
          <div className="footer-column">
            <h3>{t('footer.programs')}</h3>
            <ul className="footer-links">
              <li><a href="#features">{t('footer.live')} <ArrowRight size={14} className="hover-arrow" /></a></li>
              <li><a href="#features">{t('footer.library')} <ArrowRight size={14} className="hover-arrow" /></a></li>
              <li><a href="#features">{t('footer.grades')} <ArrowRight size={14} className="hover-arrow" /></a></li>
              <li><a href="#how-it-works">{t('footer.schedule')} <ArrowRight size={14} className="hover-arrow" /></a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-column contact-col">
            <h3>{t('footer.contact')}</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={18} className="contact-icon" />
                <span>support@tayssir.dz</span>
              </div>
              <div className="contact-item">
                <Phone size={18} className="contact-icon" />
                <span>+213 (0) xxxx xxxx</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>Algiers, Algeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Barrier */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tayssir Learning Platform. {t('footer.rights')}</p>
          <div className="bottom-links">
            <span>Powered by Innovation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
