export const SUPABASE_URL = "https://cthzaefwrouuoabxplpl.supabase.co";
export const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHphZWZ3cm91dW9hYnhwbHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTk5MjEsImV4cCI6MjA4OTI3NTkyMX0.Yw7qp1PdduCe_u_juk0Z6dB_DrXV-7j6H8tDYKMICC0";

export const cities = [
  { id: "yaounde", label: { fr: "Yaoundé", en: "Yaoundé" }, emoji: "🏙️" },
  { id: "douala",  label: { fr: "Douala",  en: "Douala"  }, emoji: "🌊" },
  { id: "limbe",   label: { fr: "Limbé",   en: "Limbé"   }, emoji: "🌋" },
  { id: "buea",    label: { fr: "Buea",    en: "Buea"    }, emoji: "⛰️" },
];

export const categories = [
  { id: "all",         icon: "🔍", label: { fr: "Tous",        en: "All"        } },
  { id: "plumber",     icon: "🔧", label: { fr: "Plombier",    en: "Plumber"    } },
  { id: "electrician", icon: "💡", label: { fr: "Électricien", en: "Electrician" } },
  { id: "cleaner",     icon: "🧹", label: { fr: "Nettoyage",   en: "Cleaner"    } },
  { id: "catering",    icon: "🍽️", label: { fr: "Traiteur",    en: "Catering"   } },
  { id: "mechanic",    icon: "🔩", label: { fr: "Mécanicien",  en: "Mechanic"   } },
  { id: "welder",      icon: "⚙️", label: { fr: "Soudeur",     en: "Welder"     } },
];

export const plans = [
  { id: "basic", price: 2000, color: "#555", features: { fr: ["✔ Profil sur FixCam", "✔ Clients peuvent appeler", "✔ Visible dans recherches", "✔ Support basique"], en: ["✔ Profile on FixCam", "✔ Clients can call you", "✔ Visible in search", "✔ Basic support"] } },
  { id: "premium", price: 5000, color: "#E07B39", popular: true, features: { fr: ["✔ Tout le plan Basique", "⭐ Badge Premium affiché", "✅ Badge Vérifié affiché", "🔝 En tête des recherches", "📣 Recommandé aux clients", "🚀 Support prioritaire"], en: ["✔ Everything in Basic", "⭐ Premium badge shown", "✅ Verified badge shown", "🔝 Top of search results", "📣 Recommended to clients", "🚀 Priority support"] } },
];

export const categoryColors = { plumber:"#E07B39", electrician:"#2D7DD2", cleaner:"#F15BB5", catering:"#FF6B35", mechanic:"#3BB273", welder:"#9B5DE5" };
export const getAvatar = (name) => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
export const enrichWorker = (w) => ({ ...w, avatar: getAvatar(w.name), color: categoryColors[w.category] || "#888", premium: w.plan === "premium", reviews: w.review_count || 0, about: { fr: w.about_fr || "", en: w.about_en || "" }, skills: w.skills || [], reviewsList: [] });

export const T = {
  fr: {
    appName: "FixCam", tagline: "Trouvez un artisan de confiance près de chez vous",
    searchPlaceholder: "Plombier, soudeur, traiteur...", allCities: "Toutes les villes",
    categories: "Catégories", topArtisans: "Artisans Populaires", postJob: "Publier un Travail",
    available: "Disponible", unavailable: "Occupé", reviews: "avis",
    whatsapp: "WhatsApp", call: "Appeler", back: "Retour",
    skills: "Compétences", location: "Localisation",
    aboutMe: "À propos", recentReviews: "Avis Récents",
    postJobTitle: "Décrivez votre besoin", jobDesc: "Ex: Besoin d'un traiteur pour 50 personnes...",
    jobCategory: "Catégorie", jobCity: "Ville", submit: "Publier",
    joinTitle: "Rejoignez FixCam", joinDesc: "Choisissez votre plan et commencez à recevoir des clients",
    name: "Nom complet", phone: "Téléphone (MTN/Orange)", skill: "Compétence", zone: "Quartier",
    city: "Ville", register: "S'inscrire", hero_cta: "Trouver un Artisan", hero_cta2: "Je suis Artisan",
    nav_home: "Accueil", nav_search: "Chercher", nav_post: "Publier",
    fcfa: "FCFA", perMonth: "/mois", verified: "Vérifié", premium: "Premium",
    mostPopular: "Populaire", found: "artisan(s) trouvé(s)", noResults: "Aucun artisan trouvé",
    jobPosted: "Publié! 🎉", jobPostedDesc: "Les artisans disponibles dans votre ville vont vous contacter.",
    choosePlan: "Choisissez votre plan", paymentVia: "Paiement via MTN Money ou Orange Money",
    basicPlan: "Basique", premiumPlan: "Premium", backHome: "Retour à l'accueil",
    successTitle: "Demande envoyée! 🎉", successDesc: "Suivez les étapes de paiement pour activer votre compte.",
    password: "Mot de passe", login: "Se connecter", loginTitle: "Connexion Artisan",
    loginDesc: "Accédez à votre tableau de bord", noAccount: "Pas encore inscrit?",
    dashboard: "Tableau de bord", myPlan: "Mon Plan",
    availability: "Disponibilité", availableNow: "Disponible", notAvailable: "Non disponible",
    jobsNearby: "Travaux dans ma ville", logout: "Se déconnecter",
    wrongCredentials: "Téléphone ou mot de passe incorrect", passwordPlaceholder: "Créer un mot de passe",
    noJobs: "Aucun travail publié pour l'instant",
  },
  en: {
    appName: "FixCam", tagline: "Find a trusted local worker near you",
    searchPlaceholder: "Plumber, welder, catering...", allCities: "All cities",
    categories: "Categories", topArtisans: "Popular Workers", postJob: "Post a Job",
    available: "Available", unavailable: "Busy", reviews: "reviews",
    whatsapp: "WhatsApp", call: "Call", back: "Back",
    skills: "Skills", location: "Location",
    aboutMe: "About Me", recentReviews: "Recent Reviews",
    postJobTitle: "Describe your need", jobDesc: "Ex: Need a caterer for 50 people...",
    jobCategory: "Category", jobCity: "City", submit: "Post Job",
    joinTitle: "Join FixCam", joinDesc: "Choose your plan and start receiving clients",
    name: "Full Name", phone: "Phone (MTN/Orange)", skill: "Main Skill", zone: "Neighborhood",
    city: "City", register: "Register", hero_cta: "Find a Worker", hero_cta2: "I'm a Worker",
    nav_home: "Home", nav_search: "Search", nav_post: "Post",
    fcfa: "FCFA", perMonth: "/month", verified: "Verified", premium: "Premium",
    mostPopular: "Popular", found: "worker(s) found", noResults: "No workers found",
    jobPosted: "Posted! 🎉", jobPostedDesc: "Available workers in your city will contact you.",
    choosePlan: "Choose your plan", paymentVia: "Payment via MTN Money or Orange Money",
    basicPlan: "Basic", premiumPlan: "Premium", backHome: "Back to Home",
    successTitle: "Request sent! 🎉", successDesc: "Follow the payment steps to activate your account.",
    password: "Password", login: "Login", loginTitle: "Worker Login",
    loginDesc: "Access your dashboard", noAccount: "Not registered yet?",
    dashboard: "Dashboard", myPlan: "My Plan",
    availability: "Availability", availableNow: "Available", notAvailable: "Not Available",
    jobsNearby: "Jobs in my city", logout: "Logout",
    wrongCredentials: "Wrong phone or password", passwordPlaceholder: "Create a password",
    noJobs: "No jobs posted yet",
  }
};
