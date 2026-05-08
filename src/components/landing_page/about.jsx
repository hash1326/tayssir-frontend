import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "../../styles/landing_page/about.css";

function About() {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: "🎯",
      iconClass: "blue",
      title: t('about.card1_title'),
      desc: t('about.card1_desc'),
    },
    {
      icon: "🤝",
      iconClass: "purple",
      title: t('about.card2_title'),
      desc: t('about.card2_desc'),
    },
    {
      icon: "📈",
      iconClass: "green",
      title: t('about.card3_title'),
      desc: t('about.card3_desc'),
    },
  ];

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, type: "spring", bounce: 0.3 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.8, type: "spring", bounce: 0.3 } }
  };

  const pillarContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const pillarItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section className="about-section dark:bg-[#0f172a] dark:bg-none" id="about">
      <div className="about-container">

        {/* ── Hero Row: Text + Image ── */}
        <div className="about-hero-row">
          <motion.div 
            className="about-text-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textVariants}
          >
            <span className="about-eyebrow dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50">✦ {t('about.subtitle')}</span>
            <h2 className="about-heading dark:text-white">
              {t('about.heading_line1')} <span>{t('about.heading_line2')}</span>
            </h2>
            <p className="about-subheading dark:text-zinc-400">
              {t('about.intro')}
            </p>
          </motion.div>

          <motion.div 
            className="about-visual-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              className="about-visual-img dark:opacity-90"
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Students learning together"
            />
          </motion.div>
        </div>

        {/* ── Pillar Cards ── */}
        <motion.div 
          className="about-pillars"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={pillarContainer}
        >
          {pillars.map((p, i) => (
            <motion.div 
              key={i} 
              className="about-pillar-card dark:bg-[#1e293b] dark:border-white/10"
              variants={pillarItem}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.06)", transition: { duration: 0.2 } }}
            >
              <div className={`pillar-icon ${p.iconClass}`}>{p.icon}</div>
              <h3 className="pillar-title dark:text-white">{p.title}</h3>
              <p className="pillar-desc dark:text-zinc-400">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default About;
