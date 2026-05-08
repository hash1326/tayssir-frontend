import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "../../styles/landing_page/features.css";

// Importing images from assets
import chatImg from "../../assets/images/feature_chat.png";
import libraryImg from "../../assets/images/feature_library.png";

const Features = () => {
  const { t } = useTranslation();

  const featuresData = [
    {
      id: 1,
      tag: t('features.chat.tag'),
      title: t('features.chat.title'),
      description: t('features.chat.desc'),
      image: chatImg,
      icons: ["💬", "✉️", "👨‍🏫"],
      reverse: false
    },
    {
      id: 2,
      tag: t('features.library.tag'),
      title: t('features.library.title'),
      description: t('features.library.desc'),
      image: libraryImg,
      icons: ["📚", "📁", "🔍"],
      reverse: true
    },
    {
      id: 3,
      tag: t('features.grades.tag'),
      title: t('features.grades.title'),
      description: t('features.grades.desc'),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      icons: ["📈", "🏆", "📊"],
      reverse: false
    },
    {
      id: 4,
      tag: t('features.video.tag'),
      title: t('features.video.title'),
      description: t('features.video.desc'),
      image: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=800",
      icons: ["🎥", "📅", "⏱️"],
      reverse: true
    }
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
  };

  return (
    <section className="features-section dark:bg-[#0f172a]" id="features">
      <div className="features-container">
        <motion.div 
          className="features-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <h2 className="dark:text-white">{t('features.header')}</h2>
          <p className="dark:text-zinc-400">{t('features.subheader')}</p>
        </motion.div>

        <div className="feature-cards-grid">
          {featuresData.map((feature, index) => (
            <motion.div 
              key={feature.id} 
              className={`feature-card ${feature.reverse ? 'reverse' : ''} dark:bg-[#1e293b] dark:border-white/10 dark:shadow-none`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
            >
              <div className="feature-content">
                <span className="feature-tag dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50">{feature.tag}</span>
                <h3 className="dark:text-white">{feature.title}</h3>
                <p className="dark:text-zinc-400">{feature.description}</p>
                <div className="feature-icons-mini">
                  {feature.icons.map((icon, i) => (
                    <motion.div 
                      key={i} 
                      className={`mini-icon ${i === 0 ? 'icon-blue' : i === 1 ? 'icon-purple' : 'icon-orange'}`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {icon}
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div 
                className="feature-image-container"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img src={feature.image} alt={feature.title} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
