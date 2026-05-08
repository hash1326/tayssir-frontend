import { Search, PlayCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/landing_page/hero.css";
import homeImg from "../../assets/images/home.jpg";

function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } }
  };

  return (
    <section className="hero" style={{ 
      backgroundImage: `url(${homeImg})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="hero-overlay"></div>
      
      <div className="hero-container">
        
        <motion.div 
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="badge-dot"></span>
            Join 10,000+ students today
          </motion.div>

          <motion.h3 variants={itemVariants} className="hero-title">
            {t('hero.title')} <span className="text-gradient">Tayssir</span>
          </motion.h3>

          <motion.p variants={itemVariants} className="hero-description">
            {t('hero.subtitle')}
          </motion.p>

          <motion.div variants={itemVariants} className="hero-search-box">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder={t('hero.search_placeholder')} />
            <button className="btn-search">{t('hero.search_btn')}</button>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-actions">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary" 
              onClick={() => navigate("/signup")}
            >
              {t('hero.get_started')}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
            >
              <PlayCircle size={20} />
              {t('hero.watch_demo')}
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15K+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Professors</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Courses</span>
            </div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}

export default Hero;
