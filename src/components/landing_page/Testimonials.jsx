import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, User, MessageSquarePlus, X } from "lucide-react";
import "../../styles/landing_page/testimonials.css";

const initialTestimonials = [];

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="tform-stars">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    className={`tform-star-btn ${star <= (hovered || value) ? "active" : ""}`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(star)}
                    aria-label={`Rate ${star} stars`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Star size={22} fill={star <= (hovered || value) ? "#fbbf24" : "none"} />
                </motion.button>
            ))}
        </div>
    );
}

function Testimonials() {
    const { t } = useTranslation();
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [form, setForm] = useState({ name: "", department: "", review: "", rating: 0 });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.review.trim() || form.rating === 0) {
            setError("Please fill in your name, review, and select a rating.");
            return;
        }
        const newEntry = {
            name: form.name.trim(),
            department: form.department.trim() || "Tayssir User",
            review: form.review.trim(),
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=4f46e5&color=fff&size=200`,
            rating: form.rating,
        };
        setTestimonials([newEntry, ...testimonials]);
        setForm({ name: "", department: "", review: "", rating: 0 });
        setSubmitted(true);
        setShowForm(false);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <section className="testimonials" id="testimonials">
            {/* Header */}
            <motion.div 
                className="testimonials-header"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                <h2>{t('testimonials.title')}</h2>
                <p>Real feedback from learners around the globe</p>
            </motion.div>

            {/* Cards Marquee */}
            {testimonials.length > 0 ? (
                <motion.div 
                    className="testimonials-marquee-container"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="testimonials-marquee-track">
                        {Array.from({ length: Math.max(2, Math.ceil(12 / testimonials.length)) })
                            .flatMap(() => testimonials)
                            .map((item, index) => (
                            <div key={index} className={`testimonial-card ${index === 0 ? 'testimonial-card--new' : ''}`}>
                                <div className="testimonial-top">
                                    <div className="testimonial-stars">
                                        {Array.from({ length: item.rating }).map((_, i) => (
                                            <span key={i} className="star filled">★</span>
                                        ))}
                                    </div>
                                    <p className="testimonial-review">"{item.review}"</p>
                                </div>
                                <div className="testimonial-user-info">
                                    <img src={item.image} alt={item.name} className="testimonial-avatar" />
                                    <div className="user-details">
                                        <h4>{item.name}</h4>
                                        <span>{item.department}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    className="testimonials-empty-state"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}
                >
                    <p>No reviews yet. Be the first to share your experience!</p>
                </motion.div>
            )}

            {/* Success Message Outside */}
            {submitted && !showForm && (
                <motion.div 
                    className="tform-success-toast"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    ✅ Thank you! Your review has been added.
                </motion.div>
            )}

            {/* Review Form Toggle */}
            <AnimatePresence mode="wait">
                {!showForm ? (
                    <motion.div 
                        key="button"
                        className="testimonials-action"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        viewport={{ once: true }}
                    >
                        <motion.button 
                            className="btn-write-review" 
                            onClick={() => setShowForm(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <MessageSquarePlus size={20} />
                            Write a Review
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="form"
                        className="tform-wrapper"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                    >
                        <div className="tform-inner">
                            <button className="tform-close" onClick={() => setShowForm(false)} aria-label="Close">
                                <X size={24} />
                            </button>
                            <div className="tform-label">
                                <User size={16} />
                                Share Your Experience
                            </div>
                            <h3 className="tform-title">What do you think about Tayssir?</h3>
                            <p className="tform-sub">Your review will appear instantly in the section above.</p>

                            <form className="tform" onSubmit={handleSubmit} noValidate>
                                <div className="tform-row">
                                    <div className="tform-group">
                                        <label htmlFor="tform-name">Your Name *</label>
                                        <input
                                            id="tform-name"
                                            name="name"
                                            type="text"
                                            placeholder="e.g. Ahmed Benali"
                                            value={form.name}
                                            onChange={handleChange}
                                            maxLength={60}
                                        />
                                    </div>
                                    <div className="tform-group">
                                        <label htmlFor="tform-dept">Role / Subject</label>
                                        <input
                                            id="tform-dept"
                                            name="department"
                                            type="text"
                                            placeholder="e.g. Math Teacher, Student..."
                                            value={form.department}
                                            onChange={handleChange}
                                            maxLength={60}
                                        />
                                    </div>
                                </div>

                                <div className="tform-group">
                                    <label>Your Rating *</label>
                                    <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                                </div>

                                <div className="tform-group">
                                    <label htmlFor="tform-review">Your Review *</label>
                                    <textarea
                                        id="tform-review"
                                        name="review"
                                        rows={4}
                                        placeholder="Tell us about your experience with Tayssir..."
                                        value={form.review}
                                        onChange={handleChange}
                                        maxLength={300}
                                    />
                                    <span className="tform-char-count">{form.review.length}/300</span>
                                </div>

                                {error && <p className="tform-error">{error}</p>}

                                <motion.button 
                                    type="submit" 
                                    className="tform-submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Send size={16} />
                                    Post Review
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

export default Testimonials;
