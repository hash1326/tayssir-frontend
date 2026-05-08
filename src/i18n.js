import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  EN: {
    translation: {
      "navbar": {
        "about": "About Us",
        "features": "Features",
        "testimonials": "Testimonials",
        "faq": "FAQ",
        "how it works": "How It Works",
        "login": "Log In",
        "signup": "Sign Up"
      },
      "hero": {
        "title": "Master Your Future With",
        "subtitle": "Learn smarter with high-quality lessons and practical courses",
        "search_placeholder": "What do you want to learn?",
        "search_btn": "Search",
        "get_started": "Get Started",
        "watch_demo": "Watch Demo"
      },
      "features": {
        "header": "Everything you need to succeed",
        "subheader": "Cutting-edge features designed to provide a premium learning experience.",
        "chat": {
          "tag": "Communication",
          "title": "Student-Teacher Interaction",
          "desc": "Send messages and chat with your teachers for personalized guidance, academic support, and real-time help with your studies."
        },
        "library": {
          "tag": "Resources",
          "title": "Digital Library",
          "desc": "Access a comprehensive digital library containing thousands of e-books, research papers, and interactive study materials at your fingertips."
        },
        "grades": {
          "tag": "Academic Success",
          "title": "Performance & Grades",
          "desc": "Track your academic journey with detailed progress charts, automated grading systems, and insightful feedback on your performance."
        },
        "video": {
          "tag": "Live Learning",
          "title": "Live and Recorded Lessons",
          "desc": "Attend live classes with teachers or watch recorded lessons anytime to review and learn at your own pace."
        }
      },
      "how_it_works": {
        "title": "Your Journey to Mastery",
        "subtitle": "A professional 5-step process tailored for teachers and students.",
        "step1": { "title": "Create an Account", "desc": "Sign up on the platform by creating your personal account." },
        "step2": { "title": "Choose Your Role", "desc": "Select whether you want to join as a Student or a Teacher." },
        "teacher": {
          "title": "For Teachers",
          "step3": { "title": "Create a Classroom", "desc": "Teachers create a digital classroom for their course." },
          "step4": { "title": "Upload Learning Materials", "desc": "Add lesson videos, summaries, and exercises to help students learn." },
          "step5": { "title": "Interact with Students", "desc": "Communicate with students and answer their questions." }
        },
        "student": {
          "title": "For Students",
          "step3": { "title": "Join a Classroom", "desc": "Students join a classroom using a class code or invitation link from the teacher." },
          "step4": { "title": "Access Learning Materials", "desc": "Watch videos, read summaries, and access study materials." },
          "step5": { "title": "Practice and Ask Questions", "desc": "Complete exercises and communicate with the teacher when needed." }
        }
      },
      "about": {
        "subtitle": "About Tayssir",
        "heading_line1": "Education Designed for",
        "heading_line2": "Real Results",
        "intro": "Tayssir is a next-generation learning platform built to bridge the gap between teachers and students. We provide the digital infrastructure for serious, outcome-focused education.",
        "stat1": "Active Students",
        "stat2": "Expert Teachers",
        "stat3": "Satisfaction Rate",
        "badge_text": "EdTech Platform in Algeria",
        "card1_title": "Accessible Learning",
        "card1_desc": "Study from anywhere, at any time. Our platform adapts to your schedule, whether you're preparing for exams or expanding your professional skills.",
        "card2_title": "Direct Teacher Connection",
        "card2_desc": "Communicate directly with your teachers through integrated messaging, get personalized feedback, and receive guidance without leaving the platform.",
        "card3_title": "Measurable Progress",
        "card3_desc": "Track your academic journey in real-time with automated grades, performance analytics, and detailed progress reports that highlight your strengths."
      },
      "testimonials": {
        "title": "Student Opinions",
        "see_another": "See Another Opinion"
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "q1": "What is Tayssir?",
        "a1": "Tayssir is an online learning platform where teachers can create digital classrooms to share lessons, videos, summaries, and exercises with their students in one place.",
        "q2": "How does the classroom work?",
        "a2": "Teachers create a classroom for their course and add learning materials such as: Lesson videos, Lesson summaries, Exercises and practice materials, and Announcements for students. Students can access all these resources from the same classroom.",
        "q3": "Can students communicate with the teacher?",
        "a3": "Yes. Students can send messages to the teacher through the platform to ask questions or get help.",
        "q4": "Can I watch the lessons anytime?",
        "a4": "Yes. Video lessons uploaded by the teacher can be watched anytime, allowing students to learn at their own pace.",
        "q5": "Are there exercises to practice?",
        "a5": "Yes. Teachers can upload exercises and practice materials to help students apply what they learn.",
        "q6": "How can I join a classroom?",
        "a6": "Students can join a classroom using a classroom code or an invitation link provided by the teacher.",
        "q7": "Can I download lesson summaries and materials?",
        "a7": "Yes. Students can download summaries and learning materials shared by the teacher in the classroom.",
        "q8": "Who can use Tayssir?",
        "a8": "Tayssir is designed for both teachers and students who want an organized and interactive learning environment."
      },
      "footer": {
        "desc": "Empowering students and teachers with innovative learning tools and comprehensive course management everywhere.",
        "programs": "Programs",
        "live": "Live Classes",
        "library": "Digital Library",
        "grades": "Grade Tracking",
        "schedule": "Modern Schedule",
        "contact": "Contact Info",
        "rights": "All rights reserved."
      }
    }
  },
  AR: {
    translation: {
      "navbar": {
        "about": "حولنا",
        "features": "المميزات",
        "testimonials": "آراء الطلاب",
        "faq": "الأسئلة الشائعة",
        "how it works": "كيفية العمل",
        "login": "تسجيل الدخول",
        "signup": "اشترك الآن"
      },
      "hero": {
        "title": "اتقن مستقبلك مع",
        "subtitle": "تعلم بشكل أكثر ذكاءً مع دروس عالية الجودة ودورات عملية",
        "search_placeholder": "ماذا تريد أن تتعلم؟",
        "search_btn": "بحث",
        "get_started": "ابدأ الآن",
        "watch_demo": "عرض تجريبي"
      },
      "features": {
        "header": "كل ما تحتاجه للنجاح",
        "subheader": "ميزات متطورة مصممة لتوفير تجربة تعليمية متميزة.",
        "chat": {
          "tag": "التواصل",
          "title": "التفاعل بين الطالب والمعلم",
          "desc": "أرسل الرسائل والدردشة مع أساتذتك للحصول على توجيه شخصي ودعم أكاديمي ومساعدة فورية في دراستك."
        },
        "library": {
          "tag": "المصادر",
          "title": "المكتبة الرقمية",
          "desc": "الوصول إلى مكتبة رقمية شاملة تحتوي على آلاف الكتب الإلكترونية والأوراق البحثية والمواد الدراسية التفاعلية."
        },
        "grades": {
          "tag": "النجاح الأكاديمي",
          "title": "الأداء والدرجات",
          "desc": "تتبع رحلتك الأكاديمية من خلال مخططات تقدم مفصلة وأنظمة تقييم آلية وملاحظات ثاقبة حول أدائك."
        },
        "video": {
          "tag": "تعلم مباشر",
          "title": "دروس مباشرة ومسجلة",
          "desc": "احضر دروساً مباشرة مع المعلمين أو شاهد الدروس المسجلة في أي وقت للمراجعة والتعلم بالسرعة التي تناسبك."
        }
      },
      "how_it_works": {
        "title": "رحلتك نحو الإتقان",
        "subtitle": "عملية احترافية من 5 خطوات مصممة للمعلمين والطلاب.",
        "step1": { "title": "إنشاء حساب", "desc": "سجل في المنصة من خلال إنشاء حسابك الشخصي." },
        "step2": { "title": "اختر دورك", "desc": "حدد ما إذا كنت تريد الانضمام كطالب أو كمعلم." },
        "teacher": {
          "title": "للمعلمين",
          "step3": { "title": "إنشاء فصل دراسي", "desc": "ينشئ المعلمون فصلاً دراسيًا رقميًا لمساقاتهم." },
          "step4": { "title": "رفع المواد التعليمية", "desc": "أضف مقاطع فيديو الدروس والملخصات والتمارين لمساعدة الطلاب على التعلم." },
          "step5": { "title": "التفاعل مع الطلاب", "desc": "تواصل مع الطلاب وأجب على استفساراتهم وأسئلتهم." }
        },
        "student": {
          "title": "للطلاب",
          "step3": { "title": "الانضمام إلى فصل دراسي", "desc": "ينضم الطلاب إلى الفصل الدراسي باستخدام رمز الفصل أو رابط دعوة من المعلم." },
          "step4": { "title": "الوصول إلى المواد التعليمية", "desc": "شاهد مقاطع الفيديو، واقرأ الملخصات، واطلع على المواد الدراسية." },
          "step5": { "title": "التدرب وطرح الأسئلة", "desc": "أكمل التمارين وتواصل مع المعلم عند الحاجة." }
        }
      },
      "about": {
        "subtitle": "حول تيسير",
        "heading_line1": "تعليم مصمم",
        "heading_line2": "لنتائج حقيقية",
        "intro": "تيسير منصة تعليمية متطورة تهدف إلى ردم الفجوة بين المعلمين والطلاب، وتوفير بنية تحتية رقمية لتعليم جاد يركز على النتائج.",
        "stat1": "طالب نشط",
        "stat2": "معلم متخصص",
        "stat3": "نسبة الرضا",
        "badge_text": "منصة التعليم الرقمي في الجزائر",
        "card1_title": "تعلم في أي مكان",
        "card1_desc": "ادرس من أي مكان وفي أي وقت. منصتنا تتكيف مع جدولك الزمني، سواء كنت تستعد للامتحانات أو توسع مهاراتك المهنية.",
        "card2_title": "تواصل مباشر مع المعلم",
        "card2_desc": "تواصل مع معلميك مباشرة عبر نظام المراسلة المدمج، واحصل على تغذية راجعة شخصية وتوجيه دون مغادرة المنصة.",
        "card3_title": "تقدم ملموس وقابل للقياس",
        "card3_desc": "تابع رحلتك الأكاديمية بشكل فوري من خلال الدرجات التلقائية وتحليل الأداء والتقارير التفصيلية التي تبرز نقاط قوتك."
      },
      "testimonials": {
        "title": "آراء الطلاب",
        "see_another": "رأي آخر"
      },
      "faq": {
        "title": "الأسئلة الشائعة",
        "q1": "ما هو تيسير؟",
        "a1": "تيسير منصة تعليمية عبر الإنترنت حيث يمكن للمعلمين إنشاء فصول دراسية رقمية لمشاركة الدروس ومقاطع الفيديو والملخصات والتمارين مع طلابهم في مكان واحد.",
        "q2": "كيف يعمل الفصل الدراسي؟",
        "a2": "يُنشئ المعلم فصلًا دراسيًا لمادته ويضيف مواد تعليمية مثل: فيديوهات الدروس، ملخصات الدروس، تمارين ومواد تدريبية، وإعلانات للطلاب. يمكن للطلاب الوصول إلى كل هذه الموارد من نفس الفصل.",
        "q3": "هل يمكن للطلاب التواصل مع المعلم؟",
        "a3": "نعم. يمكن للطلاب إرسال رسائل إلى المعلم من خلال المنصة لطرح الأسئلة أو الحصول على المساعدة.",
        "q4": "هل يمكنني مشاهدة الدروس في أي وقت؟",
        "a4": "نعم. يمكن مشاهدة دروس الفيديو التي يرفعها المعلم في أي وقت، مما يسمح للطلاب بالتعلم بالسرعة التي تناسبهم.",
        "q5": "هل توجد تمارين للتدريب؟",
        "a5": "نعم. يمكن للمعلمين رفع تمارين ومواد تدريبية لمساعدة الطلاب على تطبيق ما يتعلمونه.",
        "q6": "كيف يمكنني الانضمام إلى فصل دراسي؟",
        "a6": "يمكن للطلاب الانضمام إلى فصل دراسي باستخدام رمز الفصل أو رابط دعوة يقدمه المعلم.",
        "q7": "هل يمكنني تحميل ملخصات الدروس والمواد؟",
        "a7": "نعم. يمكن للطلاب تحميل الملخصات والمواد التعليمية التي يشاركها المعلم في الفصل الدراسي.",
        "q8": "من يمكنه استخدام تيسير؟",
        "a8": "تم تصميم تيسير لكل من المعلمين والطلاب الذين يريدون بيئة تعليمية منظمة وتفاعلية."
      },
      "footer": {
        "desc": "تمكين الطلاب والمعلمين بأدوات تعليمية مبتكرة وإدارة شاملة للدورات في كل مكان.",
        "programs": "البرامج",
        "live": "دروس مباشرة",
        "library": "المكتبة الرقمية",
        "grades": "تتبع الدرجات",
        "schedule": "جدول حديث",
        "contact": "معلومات الاتصال",
        "rights": "جميع الحقوق محفوظة."
      }
    }
  },
  FR: {
    translation: {
      "navbar": {
        "about": "À Propos",
        "features": "Fonctionnalités",
        "testimonials": "Témoignages",
        "faq": "FAQ",
        "how it works": "Comment ça marche",
        "login": "Connexion",
        "signup": "S'inscrire"
      },
      "hero": {
        "title": "Maîtrisez Votre Avenir Avec",
        "subtitle": "Apprenez plus intelligemment avec des leçons de haute qualité",
        "search_placeholder": "Que voulez-vous apprendre ?",
        "search_btn": "Rechercher",
        "get_started": "Commencer",
        "watch_demo": "Voir Démo"
      },
      "features": {
        "header": "Tout ce dont vous avez besoin pour réussir",
        "subheader": "Des fonctionnalités de pointe conçues pour offrir une expérience d'apprentissage premium.",
        "chat": {
          "tag": "Communication",
          "title": "Interaction Étudiant-Professeur",
          "desc": "Envoyez des messages et chattez avec vos professeurs pour un accompagnement personnalisé et une aide en temps réel."
        },
        "library": {
          "tag": "Ressources",
          "title": "Bibliothèque Numérique",
          "desc": "Accédez à une bibliothèque numérique complète contenant des milliers d'e-books et de supports d'étude interactifs."
        },
        "grades": {
          "tag": "Réussite Académique",
          "title": "Performance & Notes",
          "desc": "Suivez votre parcours académique avec des graphiques de progression détaillés et des systèmes de notation automatisés."
        },
        "video": {
          "tag": "Direct",
          "title": "Cours en Direct et Enregistrés",
          "desc": "Assistez aux cours en direct avec des professeurs ou regardez les leçons enregistrées à tout moment pour réviser et apprendre à votre propre rythme."
        }
      },
      "how_it_works": {
        "title": "Votre Parcours vers la Maîtrise",
        "subtitle": "Un processus professionnel en 5 étapes conçu pour les enseignants et les élèves.",
        "step1": { "title": "Créer un Compte", "desc": "Inscrivez-vous sur la plateforme en créant votre compte personnel." },
        "step2": { "title": "Choisir Votre Rôle", "desc": "Sélectionnez si vous souhaitez rejoindre en tant qu'élève ou enseignant." },
        "teacher": {
          "title": "Pour les Enseignants",
          "step3": { "title": "Créer une Classe", "desc": "Les enseignants créent une classe numérique pour leur cours." },
          "step4": { "title": "Téléverser le Matériel", "desc": "Ajoutez des vidéos, des résumés et des exercices pour aider les élèves." },
          "step5": { "title": "Interagir avec les Élèves", "desc": "Communiquez avec les élèves et répondez à leurs questions." }
        },
        "student": {
          "title": "Pour les Élèves",
          "step3": { "title": "Rejoindre une Classe", "desc": "Les élèves rejoignent une classe via un code ou un lien d'invitation." },
          "step4": { "title": "Accéder au Matériel", "desc": "Regardez les vidéos, lisez les résumés et accédez aux supports." },
          "step5": { "title": "Pratiquer et Questionner", "desc": "Complétez les exercices et communiquez avec l'enseignant." }
        }
      },
      "about": {
        "subtitle": "À propos de Tayssir",
        "heading_line1": "Un enseignement conçu pour",
        "heading_line2": "des résultats concrets",
        "intro": "Tayssir est une plateforme éducative nouvelle génération qui comble le fossé entre enseignants et étudiants, en fournissant une infrastructure numérique moderne pour un apprentissage sérieux et orienté résultats.",
        "stat1": "Étudiants actifs",
        "stat2": "Enseignants experts",
        "stat3": "Taux de satisfaction",
        "badge_text": "Plateforme EdTech en Algérie",
        "card1_title": "Apprentissage accessible",
        "card1_desc": "Étudiez de n'importe où, à tout moment. Notre plateforme s'adapte à votre emploi du temps, que vous prépariez des examens ou que vous développiez vos compétences.",
        "card2_title": "Connexion directe avec l'enseignant",
        "card2_desc": "Communiquez directement avec vos enseignants via la messagerie intégrée, recevez des retours personnalisés et obtenez des conseils sans quitter la plateforme.",
        "card3_title": "Progrès mesurables",
        "card3_desc": "Suivez votre parcours académique en temps réel grâce à des notes automatisées, des analyses de performance et des rapports détaillés qui mettent en valeur vos points forts."
      },
      "testimonials": {
        "title": "Avis des Étudiants",
        "see_another": "Voir un autre avis"
      },
      "faq": {
        "title": "Foire Aux Questions",
        "q1": "Qu'est-ce que Tayssir ?",
        "a1": "Tayssir est une plateforme d'apprentissage en ligne où les enseignants peuvent créer des classes numériques pour partager des leçons, des vidéos, des résumés et des exercices avec leurs élèves en un seul endroit.",
        "q2": "Comment fonctionne la salle de classe ?",
        "a2": "Les enseignants créent une classe pour leur cours et ajoutent des supports d'apprentissage tels que : vidéos de cours, résumés de cours, exercices et matériels de pratique, et annonces pour les étudiants. Les étudiants peuvent accéder à toutes ces ressources à partir de la même classe.",
        "q3": "Les étudiants peuvent-ils communiquer avec l'enseignant ?",
        "a3": "Oui. Les étudiants peuvent envoyer des messages à l'enseignant via la plateforme pour poser des questions ou obtenir de l'aide.",
        "q4": "Puis-je regarder les leçons à tout moment ?",
        "a4": "Oui. Les leçons vidéo téléchargées par l'enseignant peuvent être visionnées à tout moment, permettant aux étudiants d'apprendre à leur propre rythme.",
        "q5": "Y a-t-il des exercices pour s'entraîner ?",
        "a5": "Oui. Les enseignants peuvent télécharger des exercices et des supports de pratique pour aider les étudiants à appliquer ce qu'ils apprennent.",
        "q6": "Comment puis-je rejoindre une classe ?",
        "a6": "Les étudiants peuvent rejoindre une classe en utilisant un code de classe ou un lien d'invitation fourni par l'enseignant.",
        "q7": "Puis-je télécharger les résumés et supports de cours ?",
        "a7": "Oui. Les étudiants peuvent télécharger les résumés et les supports d'apprentissage partagés par l'enseignant dans la classe.",
        "q8": "Qui peut utiliser Tayssir ?",
        "a8": "Tayssir est conçu pour les enseignants et les étudiants qui souhaitent un environnement d'apprentissage organisé et interactif."
      },
      "footer": {
        "desc": "Responsabiliser les étudiants et les enseignants avec des outils d'apprentissage innovants partout.",
        "programs": "Programmes",
        "live": "Cours en Direct",
        "library": "Bibliothèque Numérique",
        "grades": "Suivi des Notes",
        "schedule": "Emploi du Temps",
        "contact": "Contact",
        "rights": "Tous droits réservés."
      }
    }
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
