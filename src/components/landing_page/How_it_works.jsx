import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    UserPlus,
    UserCheck,
    Layout,
    UploadCloud,
    MessageSquare,
    LogIn,
    BookOpen,
    PenTool,
} from "lucide-react";
import "../../styles/landing_page/how_it_works.css";

function HowItWorks() {
    const { t } = useTranslation();

    const teacherSteps = [
        { num: "03", icon: <Layout size={22} />, title: t('how_it_works.teacher.step3.title'), desc: t('how_it_works.teacher.step3.desc') },
        { num: "04", icon: <UploadCloud size={22} />, title: t('how_it_works.teacher.step4.title'), desc: t('how_it_works.teacher.step4.desc') },
        { num: "05", icon: <MessageSquare size={22} />, title: t('how_it_works.teacher.step5.title'), desc: t('how_it_works.teacher.step5.desc') },
    ];

    const studentSteps = [
        { num: "03", icon: <LogIn size={22} />, title: t('how_it_works.student.step3.title'), desc: t('how_it_works.student.step3.desc') },
        { num: "04", icon: <BookOpen size={22} />, title: t('how_it_works.student.step4.title'), desc: t('how_it_works.student.step4.desc') },
        { num: "05", icon: <PenTool size={22} />, title: t('how_it_works.student.step5.title'), desc: t('how_it_works.student.step5.desc') },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } }
    };

    const pathVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <section className="hiw-section" id="how-it-works">
            {/* Header */}
            <motion.div 
                className="hiw-header"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
                }}
            >
                <h2 className="hiw-title">{t('how_it_works.title')}</h2>
                <p className="hiw-subtitle">{t('how_it_works.subtitle')}</p>
            </motion.div>

            {/* Common Steps — Timeline */}
            <motion.div 
                className="hiw-timeline"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                {/* Step 1 */}
                <motion.div className="hiw-timeline-step" variants={itemVariants}>
                    <div className="hiw-step-left">
                        <span className="hiw-step-num">01</span>
                        <div className="hiw-step-line" />
                    </div>
                    <div className="hiw-step-body">
                        <motion.div 
                            className="hiw-step-icon-wrap common-icon"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <UserPlus size={22} />
                        </motion.div>
                        <div className="hiw-step-text">
                            <h3>{t('how_it_works.step1.title')}</h3>
                            <p>{t('how_it_works.step1.desc')}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div className="hiw-timeline-step" variants={itemVariants}>
                    <div className="hiw-step-left">
                        <span className="hiw-step-num">02</span>
                        <div className="hiw-step-line hiw-step-line--split" />
                    </div>
                    <div className="hiw-step-body">
                        <motion.div 
                            className="hiw-step-icon-wrap common-icon"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <UserCheck size={22} />
                        </motion.div>
                        <div className="hiw-step-text">
                            <h3>{t('how_it_works.step2.title')}</h3>
                            <p>{t('how_it_works.step2.desc')}</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Fork label */}
            <motion.div 
                className="hiw-fork"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
            >
                <div className="hiw-fork-line" />
                <span className="hiw-fork-label">Pick Your Path</span>
                <div className="hiw-fork-line" />
            </motion.div>

            {/* Dual Pathway */}
            <div className="hiw-paths">
                {/* Teacher Path */}
                <motion.div 
                    className="hiw-path teacher-path"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={pathVariants}
                >
                    <div className="hiw-path-header">
                        <div className="hiw-path-dot teacher-dot" />
                        <h4 className="hiw-path-title">{t('how_it_works.teacher.title')}</h4>
                    </div>
                    <motion.div className="hiw-path-steps" variants={containerVariants}>
                        {teacherSteps.map((s, i) => (
                            <motion.div className="hiw-path-step" key={i} variants={itemVariants}>
                                <div className="hiw-path-step-left">
                                    <motion.div 
                                        className="hiw-path-icon teacher-icon"
                                        whileHover={{ scale: 1.15 }}
                                    >
                                        {s.icon}
                                    </motion.div>
                                    {i < teacherSteps.length - 1 && <div className="hiw-path-connector teacher-connector" />}
                                </div>
                                <div className="hiw-path-step-content">
                                    <span className="hiw-path-num">{s.num}</span>
                                    <h5>{s.title}</h5>
                                    <p>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Student Path */}
                <motion.div 
                    className="hiw-path student-path"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={pathVariants}
                >
                    <div className="hiw-path-header">
                        <div className="hiw-path-dot student-dot" />
                        <h4 className="hiw-path-title">{t('how_it_works.student.title')}</h4>
                    </div>
                    <motion.div className="hiw-path-steps" variants={containerVariants}>
                        {studentSteps.map((s, i) => (
                            <motion.div className="hiw-path-step" key={i} variants={itemVariants}>
                                <div className="hiw-path-step-left">
                                    <motion.div 
                                        className="hiw-path-icon student-icon"
                                        whileHover={{ scale: 1.15 }}
                                    >
                                        {s.icon}
                                    </motion.div>
                                    {i < studentSteps.length - 1 && <div className="hiw-path-connector student-connector" />}
                                </div>
                                <div className="hiw-path-step-content">
                                    <span className="hiw-path-num">{s.num}</span>
                                    <h5>{s.title}</h5>
                                    <p>{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default HowItWorks;
