import { useState, useEffect } from "react";

const SUPABASE_URL = "https://cthzaefwrouuoabxplpl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHphZWZ3cm91dW9hYnhwbHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTk5MjEsImV4cCI6MjA4OTI3NTkyMX0.Yw7qp1PdduCe_u_juk0Z6dB_DrXV-7j6H8tDYKMICC0";

const supabase = {
  from: (table) => ({
    select: (cols = "*") => ({
      order: (col, opts) => fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${cols}&order=${col}${opts?.ascending===false?".desc":""}`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      }).then(r => r.json()).then(data => ({ data, error: null })).catch(error => ({ data: null, error })),
      then: (resolve) => fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${cols}`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      }).then(r => r.json()).then(data => resolve({ data, error: null })).catch(error => resolve({ data: null, error }))
    })
  }),
  insert: (table, values) => fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(values)
  }).then(r => ({ error: r.ok ? null : "Error" })).catch(error => ({ error }))
};

const T = {
  fr: {
    appName: "FixCam", tagline: "Trouvez un artisan de confiance près de chez vous",
    searchPlaceholder: "Plombier, soudeur, traiteur...", allCities: "Toutes les villes",
    categories: "Catégories", topArtisans: "Artisans Populaires", postJob: "Publier un Travail",
    available: "Disponible", unavailable: "Occupé", reviews: "avis",
    whatsapp: "WhatsApp", call: "Appeler", back: "Retour",
    skills: "Compétences", location: "Localisation", negotiate: { fr: "Prix à convenir", en: "Price to agree" },
    aboutMe: "À propos", recentReviews: "Avis Récents",
    postJobTitle: "Décrivez votre besoin", jobDesc: "Ex: Besoin d'un traiteur pour 50 personnes...",
    jobCategory: "Catégorie", jobCity: "Ville", submit: "Publier",
    joinTitle: "Rejoignez FixCam", joinDesc: "Choisissez votre plan et commencez à recevoir des clients",
    name: "Nom complet", phone: "Téléphone (MTN/Orange)", skill: "Compétence", zone: "Quartier",
    city: "Ville", register: "S'inscrire", hero_cta: "Trouver un Artisan", hero_cta2: "Je suis Artisan",
    nav_home: "Accueil", nav_search: "Chercher", nav_post: "Publier", nav_join: "S'inscrire",
    fcfa: "FCFA", perMonth: "/mois", verified: "Vérifié", premium: "Premium",
    mostPopular: "Populaire", selectPlan: "Choisir",
    paySteps: ["Choisissez votre plan ci-dessous", "Envoyez le montant via MTN/Orange Money au", "Envoyez votre reçu par WhatsApp au même numéro", "Compte activé sous 24h ✅"],
    adminNumber: "677 000 000",
    successTitle: "Demande envoyée! 🎉", successDesc: "Suivez les étapes de paiement pour activer votre compte.",
    backHome: "Retour à l'accueil",
    found: "artisan(s) trouvé(s)", noResults: "Aucun artisan trouvé",
    jobPosted: "Publié! 🎉", jobPostedDesc: "Les artisans disponibles dans votre ville vont vous contacter.",
    choosePlan: "Choisissez votre plan",
    paymentVia: "Paiement via MTN Money ou Orange Money",
    basicPlan: "Basique", premiumPlan: "Premium",
    password: "Mot de passe", login: "Se connecter", loginTitle: "Connexion Artisan",
    loginDesc: "Accédez à votre tableau de bord", noAccount: "Pas encore inscrit?",
    hasAccount: "Déjà inscrit? Se connecter",
    dashboard: "Tableau de bord", myProfile: "Mon Profil", myPlan: "Mon Plan",
    availability: "Disponibilité", availableNow: "Disponible", notAvailable: "Non disponible",
    jobsNearby: "Travaux dans ma ville", logout: "Se déconnecter",
    welcomeBack: "Bon retour", postedOn: "Publié le",
    wrongCredentials: "Téléphone ou mot de passe incorrect",
    passwordPlaceholder: "Créer un mot de passe",
    noJobs: "Aucun travail publié pour l'instant",
    profileUpdated: "Profil mis à jour!",
  },
  en: {
    appName: "FixCam", tagline: "Find a trusted local worker near you",
    searchPlaceholder: "Plumber, welder, catering...", allCities: "All cities",
    categories: "Categories", topArtisans: "Popular Workers", postJob: "Post a Job",
    available: "Available", unavailable: "Busy", reviews: "reviews",
    whatsapp: "WhatsApp", call: "Call", back: "Back",
    skills: "Skills", location: "Location", negotiate: { fr: "Prix à convenir", en: "Price to agree" },
    aboutMe: "About Me", recentReviews: "Recent Reviews",
    postJobTitle: "Describe your need", jobDesc: "Ex: Need a caterer for 50 people...",
    jobCategory: "Category", jobCity: "City", submit: "Post Job",
    joinTitle: "Join FixCam", joinDesc: "Choose your plan and start receiving clients",
    name: "Full Name", phone: "Phone (MTN/Orange)", skill: "Main Skill", zone: "Neighborhood",
    city: "City", register: "Register", hero_cta: "Find a Worker", hero_cta2: "I'm a Worker",
    nav_home: "Home", nav_search: "Search", nav_post: "Post", nav_join: "Join",
    fcfa: "FCFA", perMonth: "/month", verified: "Verified", premium: "Premium",
    mostPopular: "Popular", selectPlan: "Choose",
    paySteps: ["Choose your plan below", "Send the amount via MTN/Orange Money to", "Send your receipt via WhatsApp to the same number", "Account activated within 24h ✅"],
    adminNumber: "677 000 000",
    successTitle: "Request sent! 🎉", successDesc: "Follow the payment steps to activate your account.",
    backHome: "Back to Home",
    found: "worker(s) found", noResults: "No workers found",
    jobPosted: "Posted! 🎉", jobPostedDesc: "Available workers in your city will contact you.",
    choosePlan: "Choose your plan",
    paymentVia: "Payment via MTN Money or Orange Money",
    basicPlan: "Basic", premiumPlan: "Premium",
    password: "Password", login: "Login", loginTitle: "Worker Login",
    loginDesc: "Access your dashboard", noAccount: "Not registered yet?",
    hasAccount: "Already registered? Login",
    dashboard: "Dashboard", myProfile: "My Profile", myPlan: "My Plan",
    availability: "Availability", availableNow: "Available", notAvailable: "Not Available",
    jobsNearby: "Jobs in my city", logout: "Logout",
    welcomeBack: "Welcome back", postedOn: "Posted on",
    wrongCredentials: "Wrong phone or password",
    passwordPlaceholder: "Create a password",
    noJobs: "No jobs posted yet",
    profileUpdated: "Profile updated!",
  }
};

const cities = [
  { id: "yaounde", label: { fr: "Yaoundé", en: "Yaoundé" }, emoji: "🏙️" },
  { id: "douala",  label: { fr: "Douala",  en: "Douala"  }, emoji: "🌊" },
  { id: "limbe",   label: { fr: "Limbé",   en: "Limbé"   }, emoji: "🌋" },
  { id: "buea",    label: { fr: "Buea",    en: "Buea"    }, emoji: "⛰️" },
];

const categories = [
  { id: "all",         icon: "🔍", label: { fr: "Tous",        en: "All"        } },
  { id: "plumber",     icon: "🔧", label: { fr: "Plombier",    en: "Plumber"    } },
  { id: "electrician", icon: "💡", label: { fr: "Électricien", en: "Electrician" } },
  { id: "cleaner",     icon: "🧹", label: { fr: "Nettoyage",   en: "Cleaner"    } },
  { id: "catering",    icon: "🍽️", label: { fr: "Traiteur",    en: "Catering"   } },
  { id: "mechanic",    icon: "🔩", label: { fr: "Mécanicien",  en: "Mechanic"   } },
  { id: "welder",      icon: "⚙️", label: { fr: "Soudeur",     en: "Welder"     } },
];

const plans = [
  {
    id: "basic", price: 2000, color: "#555",
    features: {
      fr: ["✔ Profil sur FixCam", "✔ Clients peuvent appeler", "✔ Visible dans recherches", "✔ Support basique"],
      en: ["✔ Profile on FixCam", "✔ Clients can call you", "✔ Visible in search", "✔ Basic support"]
    }
  },
  {
    id: "premium", price: 5000, color: "#E07B39", popular: true,
    features: {
      fr: ["✔ Tout le plan Basique", "⭐ Badge Premium affiché", "✅ Badge Vérifié affiché", "🔝 En tête des recherches", "📣 Recommandé aux clients", "🚀 Support prioritaire"],
      en: ["✔ Everything in Basic", "⭐ Premium badge shown", "✅ Verified badge shown", "🔝 Top of search results", "📣 Recommended to clients", "🚀 Priority support"]
    }
  },
];

const categoryColors = {
  plumber:"#E07B39", electrician:"#2D7DD2", cleaner:"#F15BB5",
  catering:"#FF6B35", mechanic:"#3BB273", welder:"#9B5DE5"
};
const getAvatar = (name) => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const enrichWorker = (w) => ({
  ...w,
  avatar: getAvatar(w.name),
  color: categoryColors[w.category] || "#888",
  premium: w.plan === "premium",
  reviews: w.review_count || 0,
  about: { fr: w.about_fr || "", en: w.about_en || "" },
  skills: w.skills || [],
  reviewsList: [],
});

const Stars = ({ rating }) => (
  <span style={{ color:"#F4A261", fontSize:13 }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}
    <span style={{ color:"#999", marginLeft:3, fontSize:11 }}>{rating}</span>
  </span>
);

const Badge = ({ type, label }) => {
  if (type==="premium") return <span style={{ background:"linear-gradient(90deg,#F4A261,#E07B39)", color:"#fff", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, fontFamily:"'Syne',sans-serif" }}>⭐ {label}</span>;
  if (type==="verified") return <span style={{ background:"#e8f5e9", color:"#2a8a50", fontSize:9, fontWeight:800, padding:"2px 8px", borderRadius:20, fontFamily:"'Syne',sans-serif" }}>✅ {label}</span>;
  return null;
};

export default function App() {
  const [lang, setLang] = useState("fr");
  const [page, setPage] = useState("home");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [jobForm, setJobForm] = useState({ desc:"", category:"plumber", city:"yaounde" });
  const [joinForm, setJoinForm] = useState({ name:"", phone:"", skill:"plumber", zone:"", city:"yaounde", plan:"basic", password:"" });
  const [loginForm, setLoginForm] = useState({ phone:"", password:"", error:"", loading:false });
  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = T[lang];

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/workers?select=*&order=plan.desc,rating.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.json())
      .then(data => { setArtisans((data||[]).map(enrichWorker)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sorted = [...artisans].sort((a,b) => {
    if (a.premium && !b.premium) return -1;
    if (!a.premium && b.premium) return 1;
    return b.rating - a.rating;
  });

  const filtered = sorted.filter(a => {
    const matchCat  = selectedCat==="all"  || a.category===selectedCat;
    const matchCity = selectedCity==="all" || a.city===selectedCity;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.zone.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });

  const goTo = (p) => { setPage(p); setSelectedArtisan(null); setSubmitted(false); };

  const ArtisanCard = ({ a, full=false }) => (
    <div onClick={() => { setSelectedArtisan(a); setPage("profile"); }}
      style={{ background:"#fff", borderRadius:16, padding:"14px 16px", display:"flex", gap:13, cursor:"pointer", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", border: a.premium?"1.5px solid #F4A26144":"1px solid #f0ece6", position:"relative", overflow:"hidden", transition:"transform 0.18s,box-shadow 0.18s" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.13)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)"}}>
      {a.premium && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#F4A261,#E07B39)" }} />}
      <div style={{ width:54, height:54, borderRadius:"50%", background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff", fontSize:17, flexShrink:0, boxShadow:`0 3px 10px ${a.color}44` }}>
        {a.avatar}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:3 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"#1a1a1a" }}>{a.name}</span>
          {a.premium && <Badge type="premium" label={t.premium} />}
          {a.verified && <Badge type="verified" label={t.verified} />}
        </div>
        <div style={{ fontSize:11, color:"#aaa", marginBottom:3 }}>
          📍 {a.zone}, {cities.find(c=>c.id===a.city)?.label[lang]} · {categories.find(c=>c.id===a.category)?.icon} {categories.find(c=>c.id===a.category)?.label[lang]}
        </div>
        <Stars rating={a.rating} />
        <div style={{ fontSize:10, color:"#ccc", marginTop:1 }}>{a.reviews} {t.reviews}</div>
      </div>
      <div style={{ textAlign:"right", display:"flex", flexDirection:"column", justifyContent:"space-between", flexShrink:0 }}>
        <span style={{ background:a.available?"#3BB27322":"#ff444422", color:a.available?"#2a8a50":"#cc2200", fontSize:9, padding:"3px 8px", borderRadius:20, fontWeight:700, fontFamily:"'Syne',sans-serif", whiteSpace:"nowrap" }}>
          {a.available?t.available:t.unavailable}
        </span>
        <div style={{ background:"#f8f5f0", borderRadius:10, padding:"4px 8px", textAlign:"center" }}>
          <div style={{ fontSize:9, color:"#aaa", fontFamily:"'Syne',sans-serif" }}>{lang==="fr"?"Prix":"Price"}</div>
          <div style={{ fontSize:10, fontWeight:700, color:"#888", fontFamily:"'Syne',sans-serif" }}>{lang==="fr"?"À convenir":"Negotiable"}</div>
        </div>
      </div>
    </div>
  );

  const ProfilePage = ({ a }) => (
    <div style={{ paddingBottom:100 }}>
      <div style={{ background:`linear-gradient(135deg,${a.color}18,${a.color}33)`, padding:"28px 20px 24px" }}>
        <button onClick={() => { setPage("search"); setSelectedArtisan(null); }}
          style={{ background:"rgba(255,255,255,0.9)", border:"none", borderRadius:20, padding:"6px 14px", cursor:"pointer", marginBottom:16, fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:600 }}>
          ← {t.back}
        </button>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:70, height:70, borderRadius:"50%", background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", flexShrink:0, boxShadow:`0 4px 20px ${a.color}55` }}>
            {a.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, color:"#1a1a1a", marginBottom:5 }}>{a.name}</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}>
              {a.premium && <Badge type="premium" label={t.premium} />}
              {a.verified && <Badge type="verified" label={t.verified} />}
            </div>
            <Stars rating={a.rating} />
            <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{a.reviews} {t.reviews}</div>
            <div style={{ marginTop:6 }}>
              <span style={{ background:a.available?"#3BB27322":"#ff444422", color:a.available?"#2a8a50":"#cc2200", fontSize:10, padding:"3px 10px", borderRadius:20, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>
                {a.available?`● ${t.available}`:`● ${t.unavailable}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 20px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          <div style={{ background:"#f8f5f0", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Syne',sans-serif", marginBottom:2 }}>📍 {t.location}</div>
            <div style={{ fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:13 }}>{a.zone}, {cities.find(c=>c.id===a.city)?.label[lang]}</div>
          </div>
          <div style={{ background:"#fff8f3", borderRadius:12, padding:"12px 14px", border:"1px solid #F4A26133" }}>
            <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Syne',sans-serif", marginBottom:2 }}>💰 {lang==="fr"?"Tarif":"Rate"}</div>
            <div style={{ fontWeight:700, fontFamily:"'Syne',sans-serif", fontSize:13, color:"#E07B39" }}>{lang==="fr"?"À convenir directement":"Agree directly with worker"}</div>
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, marginBottom:8 }}>{t.aboutMe}</div>
          <p style={{ fontSize:13, color:"#555", lineHeight:1.6, margin:0 }}>{a.about[lang]}</p>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, marginBottom:8 }}>{t.skills}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {a.skills.map(s => <span key={s} style={{ background:`${a.color}18`, color:a.color, padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600, fontFamily:"'Syne',sans-serif" }}>{s}</span>)}
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, marginBottom:8 }}>{t.recentReviews}</div>
          {a.reviewsList.map((r,i) => (
            <div key={i} style={{ background:"#f8f5f0", borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontWeight:700, fontSize:12, fontFamily:"'Syne',sans-serif" }}>{r.name}</span>
                <Stars rating={r.stars} />
              </div>
              <div style={{ fontSize:12, color:"#555" }}>{r.text[lang]}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <a href={`https://wa.me/237${a.phone}`} target="_blank" rel="noreferrer"
            style={{ background:"#25D366", color:"#fff", borderRadius:14, padding:"14px", textAlign:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, textDecoration:"none", display:"block" }}>
            💬 {t.whatsapp}
          </a>
          <a href={`tel:+237${a.phone}`}
            style={{ background:a.color, color:"#fff", borderRadius:14, padding:"14px", textAlign:"center", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, textDecoration:"none", display:"block" }}>
            📞 {t.call}
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"#faf7f2", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        input,textarea,select{font-family:'DM Sans',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .btn{transition:transform 0.14s,opacity 0.14s;cursor:pointer}
        .btn:active{transform:scale(0.97)}
        .cat{transition:all 0.18s;cursor:pointer}
        .cat:hover{transform:translateY(-2px)}
      `}</style>

      {/* TOPBAR */}
      <div style={{ background:"#1a1a1a", padding:"13px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
        <div onClick={() => goTo("home")} style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:"#F4A261", cursor:"pointer" }}>
          🔧 {t.appName}
        </div>
        <button className="btn" onClick={() => setLang(lang==="fr"?"en":"fr")}
          style={{ background:"#F4A261", border:"none", borderRadius:20, padding:"5px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, color:"#1a1a1a" }}>
          {lang==="fr"?"EN":"FR"}
        </button>
      </div>

      <div style={{ paddingBottom:85, animation:"fadeUp 0.35s ease" }}>
        {loading && (
          <div style={{ textAlign:"center", padding:"80px 20px" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🔧</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"#1a1a1a", marginBottom:8 }}>FixCam</div>
            <div style={{ fontSize:13, color:"#aaa" }}>{lang==="fr"?"Chargement...":"Loading..."}</div>
          </div>
        )}
        {!loading && <>
        {page==="home" && (
          <div>
            <div style={{ background:"linear-gradient(135deg,#1a1a1a 0%,#2d1f0e 100%)", padding:"36px 20px 40px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"#F4A26112" }} />
              <div style={{ position:"absolute", bottom:-20, left:-20, width:110, height:110, borderRadius:"50%", background:"#E07B3912" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                <div style={{ fontSize:10, color:"#F4A261", fontFamily:"'Syne',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:10, textTransform:"uppercase" }}>
                  📍 Yaoundé · Douala · Limbé · Buea
                </div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:25, color:"#fff", lineHeight:1.25, marginBottom:10 }}>{t.tagline}</h1>
                <p style={{ color:"#999", fontSize:13, marginBottom:24, lineHeight:1.55 }}>
                  {lang==="fr" ? "Plombiers, électriciens, traiteurs, soudeurs — trouvez le bon artisan en quelques secondes." : "Plumbers, electricians, caterers, welders — find the right worker in seconds."}
                </p>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn" onClick={() => goTo("search")}
                    style={{ background:"#F4A261", color:"#1a1a1a", border:"none", borderRadius:12, padding:"13px 20px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, flex:1 }}>
                    🔍 {t.hero_cta}
                  </button>
                  <button className="btn" onClick={() => goTo("join")}
                    style={{ background:"transparent", color:"#F4A261", border:"2px solid #F4A261", borderRadius:12, padding:"13px 16px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13 }}>
                    {t.hero_cta2}
                  </button>
                </div>
              </div>
            </div>

            {/* Cities */}
            <div style={{ padding:"22px 20px 0" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:12, color:"#1a1a1a" }}>📍 {lang==="fr"?"Nos villes":"Our cities"}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {cities.map(c => (
                  <button key={c.id} className="cat"
                    onClick={() => { setSelectedCity(c.id); setSelectedCat("all"); goTo("search"); }}
                    style={{ background:"#fff", border:"2px solid #f0ece6", borderRadius:14, padding:"12px 6px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{c.emoji}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:10, color:"#333" }}>{c.label[lang]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{ padding:"22px 20px 0" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:12, color:"#1a1a1a" }}>{t.categories}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9 }}>
                {categories.filter(c=>c.id!=="all").map(cat => (
                  <button key={cat.id} className="cat"
                    onClick={() => { setSelectedCat(cat.id); setSelectedCity("all"); goTo("search"); }}
                    style={{ background:"#fff", border:"2px solid #f0ece6", borderRadius:14, padding:"14px 8px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                    <div style={{ fontSize:26, marginBottom:5 }}>{cat.icon}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:11, color:"#444" }}>{cat.label[lang]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Artisans */}
            <div style={{ padding:"22px 20px 0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{t.topArtisans}</div>
                <button onClick={() => goTo("search")} style={{ background:"none", border:"none", color:"#F4A261", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                  {lang==="fr"?"Voir tous →":"See all →"}
                </button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {sorted.filter(a=>a.premium).slice(0,4).map(a => <ArtisanCard key={a.id} a={a} />)}
              </div>
            </div>

            {/* Post Job CTA */}
            <div style={{ margin:"22px 20px 0" }}>
              <div className="cat" onClick={() => goTo("post")}
                style={{ background:"linear-gradient(135deg,#E07B39,#F4A261)", borderRadius:18, padding:"20px", cursor:"pointer" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:"#fff", marginBottom:4 }}>📋 {t.postJob}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.88)" }}>
                  {lang==="fr"?"Décrivez votre besoin, les artisans vous contactent directement.":"Describe your need, workers contact you directly."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH */}
        {page==="search" && !selectedArtisan && (
          <div style={{ padding:"20px 20px 0" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, marginBottom:14, color:"#1a1a1a" }}>
              🔍 {lang==="fr"?"Trouver un Artisan":"Find a Worker"}
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPlaceholder}
              style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, marginBottom:12, outline:"none", background:"#fff" }} />
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:6, marginBottom:10 }}>
              <button className="cat" onClick={() => setSelectedCity("all")}
                style={{ background:selectedCity==="all"?"#1a1a1a":"#fff", color:selectedCity==="all"?"#F4A261":"#555", border:`2px solid ${selectedCity==="all"?"#1a1a1a":"#f0ece6"}`, borderRadius:20, padding:"6px 14px", whiteSpace:"nowrap", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:11 }}>
                🌍 {t.allCities}
              </button>
              {cities.map(c => (
                <button key={c.id} className="cat" onClick={() => setSelectedCity(c.id)}
                  style={{ background:selectedCity===c.id?"#1a1a1a":"#fff", color:selectedCity===c.id?"#F4A261":"#555", border:`2px solid ${selectedCity===c.id?"#1a1a1a":"#f0ece6"}`, borderRadius:20, padding:"6px 14px", whiteSpace:"nowrap", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:11 }}>
                  {c.emoji} {c.label[lang]}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:6, marginBottom:12 }}>
              {categories.map(cat => (
                <button key={cat.id} className="cat" onClick={() => setSelectedCat(cat.id)}
                  style={{ background:selectedCat===cat.id?"#F4A261":"#fff", color:selectedCat===cat.id?"#1a1a1a":"#555", border:`2px solid ${selectedCat===cat.id?"#F4A261":"#f0ece6"}`, borderRadius:20, padding:"6px 13px", whiteSpace:"nowrap", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:11 }}>
                  {cat.icon} {cat.label[lang]}
                </button>
              ))}
            </div>
            <div style={{ fontSize:11, color:"#bbb", marginBottom:10, fontFamily:"'Syne',sans-serif" }}>{filtered.length} {t.found}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map(a => <ArtisanCard key={a.id} a={a} />)}
              {filtered.length===0 && (
                <div style={{ textAlign:"center", padding:"50px 20px", color:"#bbb" }}>
                  <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:15 }}>{t.noResults}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile" && selectedArtisan && <ProfilePage a={selectedArtisan} />}

        {/* POST JOB */}
        {page==="post" && (
          <div style={{ padding:"24px 20px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, marginBottom:6, color:"#1a1a1a" }}>📋 {t.postJob}</div>
            <p style={{ fontSize:12, color:"#aaa", marginBottom:22 }}>
              {lang==="fr"?"Décrivez votre besoin. Les artisans disponibles dans votre ville vous contacteront.":"Describe your need. Available workers in your city will contact you."}
            </p>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"40px 10px", animation:"fadeUp 0.4s ease" }}>
                <div style={{ fontSize:56, marginBottom:14 }}>✅</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#1a1a1a", marginBottom:8 }}>{t.jobPosted}</div>
                <p style={{ color:"#888", fontSize:13, marginBottom:24 }}>{t.jobPostedDesc}</p>
                <button className="btn" onClick={() => { setSubmitted(false); goTo("home"); }}
                  style={{ background:"#1a1a1a", color:"#F4A261", border:"none", borderRadius:14, padding:"14px 28px", fontFamily:"'Syne',sans-serif", fontWeight:700 }}>
                  {t.backHome}
                </button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                {[
                  { label:t.jobCategory, key:"category", type:"select", options:categories.filter(c=>c.id!=="all") },
                  { label:t.jobCity, key:"city", type:"cityselect" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{f.label}</label>
                    <select value={jobForm[f.key]} onChange={e=>setJobForm({...jobForm,[f.key]:e.target.value})}
                      style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>
                      {f.type==="select" ? f.options.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label[lang]}</option>)
                        : cities.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label[lang]}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.postJobTitle}</label>
                  <textarea value={jobForm.desc} onChange={e=>setJobForm({...jobForm,desc:e.target.value})}
                    placeholder={t.jobDesc} rows={5}
                    style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, resize:"none", outline:"none", background:"#fff" }} />
                </div>
                <button className="btn" onClick={async () => {
                  if (!jobForm.desc.trim()) return;
                  await fetch(`${SUPABASE_URL}/rest/v1/jobs`, {
                    method:"POST",
                    headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" },
                    body: JSON.stringify({ description:jobForm.desc, category:jobForm.category, city:jobForm.city })
                  });
                  setSubmitted(true);
                }}
                  style={{ background:jobForm.desc.trim()?"#1a1a1a":"#e0e0e0", color:jobForm.desc.trim()?"#F4A261":"#aaa", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 }}>
                  📤 {t.submit}
                </button>
              </div>
            )}
          </div>
        )}

        {/* JOIN */}
        {page==="join" && (
          <div style={{ padding:"24px 20px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, marginBottom:6, color:"#1a1a1a" }}>👷 {t.joinTitle}</div>
            <p style={{ fontSize:12, color:"#aaa", marginBottom:20 }}>{t.joinDesc}</p>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"30px 10px", animation:"fadeUp 0.4s ease" }}>
                <div style={{ fontSize:56, marginBottom:14 }}>🎉</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:"#1a1a1a", marginBottom:8 }}>{t.successTitle}</div>
                <p style={{ color:"#888", fontSize:13, marginBottom:16 }}>{t.successDesc}</p>
                <div style={{ background:"#fff8f3", border:"1.5px solid #F4A26144", borderRadius:14, padding:"18px", marginBottom:20, textAlign:"left" }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, marginBottom:12, color:"#E07B39" }}>💳 {t.paymentVia}</div>
                  {t.paySteps.map((step,i) => (
                    <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                      <span style={{ background:"#E07B39", color:"#fff", width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{i+1}</span>
                      <span style={{ fontSize:12, color:"#555", lineHeight:1.5 }}>
                        {step}{(i===1||i===2) ? <strong style={{ color:"#1a1a1a" }}> {t.adminNumber}</strong> : ""}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="btn" onClick={() => { setSubmitted(false); goTo("home"); }}
                  style={{ background:"#1a1a1a", color:"#F4A261", border:"none", borderRadius:14, padding:"14px 28px", fontFamily:"'Syne',sans-serif", fontWeight:700 }}>
                  {t.backHome}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, marginBottom:12, color:"#1a1a1a" }}>💎 {t.choosePlan}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  {plans.map(plan => (
                    <div key={plan.id} className="cat"
                      onClick={() => setJoinForm({...joinForm,plan:plan.id})}
                      style={{ background:joinForm.plan===plan.id?"#1a1a1a":"#fff", borderRadius:16, padding:"16px 14px", border:joinForm.plan===plan.id?`2px solid ${plan.color}`:"2px solid #f0ece6", position:"relative", overflow:"hidden" }}>
                      {plan.popular && (
                        <div style={{ position:"absolute", top:8, right:8, background:"linear-gradient(90deg,#F4A261,#E07B39)", color:"#fff", fontSize:8, fontWeight:800, padding:"2px 7px", borderRadius:20, fontFamily:"'Syne',sans-serif" }}>
                          {t.mostPopular}
                        </div>
                      )}
                      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:joinForm.plan===plan.id?"#F4A261":"#1a1a1a", marginBottom:4 }}>
                        {plan.id==="basic"?t.basicPlan:t.premiumPlan}
                      </div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, color:plan.color, marginBottom:8 }}>
                        {plan.price.toLocaleString()} <span style={{ fontSize:10, fontWeight:600 }}>{t.fcfa}{t.perMonth}</span>
                      </div>
                      {plan.features[lang].map((f,i) => (
                        <div key={i} style={{ fontSize:10, color:joinForm.plan===plan.id?"#bbb":"#777", lineHeight:1.5, marginBottom:2 }}>{f}</div>
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    {key:"name", label:t.name, placeholder:"Jean-Pierre Mvondo", type:"text"},
                    {key:"phone", label:t.phone, placeholder:"6XX XXX XXX", type:"tel"},
                    {key:"zone", label:t.zone, placeholder:lang==="fr"?"Bastos, Akwa...":"Bastos, Akwa...", type:"text"},
                    {key:"password", label:t.password, placeholder:t.passwordPlaceholder, type:"password"},
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{f.label}</label>
                      <input type={f.type} value={joinForm[f.key]} onChange={e=>setJoinForm({...joinForm,[f.key]:e.target.value})}
                        placeholder={f.placeholder}
                        style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, outline:"none", background:"#fff" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.skill}</label>
                    <select value={joinForm.skill} onChange={e=>setJoinForm({...joinForm,skill:e.target.value})}
                      style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>
                      {categories.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label[lang]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.city}</label>
                    <select value={joinForm.city} onChange={e=>setJoinForm({...joinForm,city:e.target.value})}
                      style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>
                      {cities.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label[lang]}</option>)}
                    </select>
                  </div>
                  {joinForm.error && (
                    <div style={{ background:"#fee2e2", color:"#cc2200", borderRadius:12, padding:"10px 14px", fontSize:12, fontFamily:"'Syne',sans-serif" }}>
                      ⚠️ {joinForm.error}
                    </div>
                  )}
                  <button className="btn"
                    onClick={async () => {
                      if (!joinForm.name.trim()||!joinForm.phone.trim()||!joinForm.zone.trim()) {
                        setJoinForm({...joinForm, error: lang==="fr"?"Veuillez remplir tous les champs!":"Please fill in all fields!"});
                        return;
                      }
                      setJoinForm({...joinForm, loading: true, error: null});
                      try {
                        const res = await fetch(`${SUPABASE_URL}/rest/v1/workers`, {
                          method:"POST",
                          headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" },
                          body: JSON.stringify({ name:joinForm.name.trim(), phone:joinForm.phone.trim(), category:joinForm.skill, city:joinForm.city, zone:joinForm.zone.trim(), plan:joinForm.plan, available:true, verified:false, rating:0, review_count:0 })
                        });
                        if (res.ok) {
                          setSubmitted(true);
                        } else {
                          const err = await res.json();
                          setJoinForm({...joinForm, loading:false, error: err.message || (lang==="fr"?"Erreur, réessayez.":"Error, please try again.")});
                        }
                      } catch(e) {
                        setJoinForm({...joinForm, loading:false, error: lang==="fr"?"Erreur de connexion.":"Connection error."});
                      }
                    }}
                    style={{ background:(joinForm.name&&joinForm.phone&&joinForm.zone)?"#E07B39":"#e0e0e0", color:(joinForm.name&&joinForm.phone&&joinForm.zone)?"#fff":"#aaa", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 }}>
                    {joinForm.loading ? (lang==="fr"?"Envoi...":"Sending...") : `🚀 ${t.register}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        </>}
      </div>

        {/* LOGIN */}
        {page==="login" && !worker && (
          <div style={{ padding:"24px 20px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:19, marginBottom:6, color:"#1a1a1a" }}>🔐 {t.loginTitle}</div>
            <p style={{ fontSize:12, color:"#aaa", marginBottom:24 }}>{t.loginDesc}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {loginForm.error && (
                <div style={{ background:"#fee2e2", color:"#cc2200", borderRadius:12, padding:"10px 14px", fontSize:12, fontFamily:"'Syne',sans-serif" }}>
                  ⚠️ {loginForm.error}
                </div>
              )}
              {[
                {key:"phone", label:t.phone, placeholder:"6XX XXX XXX", type:"tel"},
                {key:"password", label:t.password, placeholder:"••••••••", type:"password"},
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} value={loginForm[f.key]} onChange={e=>setLoginForm({...loginForm,[f.key]:e.target.value})}
                    placeholder={f.placeholder}
                    style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, outline:"none", background:"#fff" }} />
                </div>
              ))}
              <button className="btn"
                onClick={async () => {
                  if (!loginForm.phone.trim()||!loginForm.password.trim()) return;
                  setLoginForm({...loginForm, loading:true, error:""});
                  try {
                    const res = await fetch(`${SUPABASE_URL}/rest/v1/workers?phone=eq.${loginForm.phone.trim()}&password=eq.${loginForm.password.trim()}&select=*`, {
                      headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` }
                    });
                    const data = await res.json();
                    if (data && data.length > 0) {
                      setWorker(enrichWorker(data[0]));
                      const jobsRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?city=eq.${data[0].city}&category=eq.${data[0].category}&select=*&order=created_at.desc`, {
                        headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` }
                      });
                      const jobsData = await jobsRes.json();
                      setJobs(jobsData || []);
                      setPage("dashboard");
                      setLoginForm({phone:"", password:"", error:"", loading:false});
                    } else {
                      setLoginForm({...loginForm, loading:false, error:t.wrongCredentials});
                    }
                  } catch(e) {
                    setLoginForm({...loginForm, loading:false, error:"Connection error"});
                  }
                }}
                style={{ background:(loginForm.phone&&loginForm.password)?"#1a1a1a":"#e0e0e0", color:(loginForm.phone&&loginForm.password)?"#F4A261":"#aaa", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14 }}>
                {loginForm.loading ? "..." : `🔐 ${t.login}`}
              </button>
              <div style={{ textAlign:"center", fontSize:12, color:"#aaa" }}>
                <span>{t.noAccount} </span>
                <button onClick={() => goTo("join")} style={{ background:"none", border:"none", color:"#E07B39", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{lang==="fr"?"S'inscrire":"Register"}</button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {page==="dashboard" && worker && (
          <div style={{ padding:"0 0 20px" }}>
            {/* Header */}
            <div style={{ background:`linear-gradient(135deg,#1a1a1a,#2d1f0e)`, padding:"28px 20px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:11, color:"#F4A261", fontFamily:"'Syne',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{t.dashboard}</div>
                <button onClick={() => { setWorker(null); setPage("home"); }}
                  style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:20, padding:"5px 12px", color:"#aaa", fontSize:11, fontFamily:"'Syne',sans-serif", cursor:"pointer" }}>
                  {t.logout}
                </button>
              </div>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:60, height:60, borderRadius:"50%", background:worker.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Syne',sans-serif", flexShrink:0, boxShadow:`0 4px 16px ${worker.color}55` }}>
                  {worker.avatar}
                </div>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:"#fff", marginBottom:4 }}>{worker.name}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {worker.premium && <Badge type="premium" label={t.premium} />}
                    {worker.verified && <Badge type="verified" label={t.verified} />}
                  </div>
                  <div style={{ fontSize:11, color:"#888", marginTop:4 }}>📍 {worker.zone}, {cities.find(c=>c.id===worker.city)?.label[lang]}</div>
                </div>
              </div>
            </div>

            <div style={{ padding:"20px 20px 0" }}>
              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                <div style={{ background:"#fff", borderRadius:14, padding:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6" }}>
                  <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Syne',sans-serif", marginBottom:4 }}>💎 {t.myPlan}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color: worker.premium?"#E07B39":"#555" }}>
                    {worker.premium ? t.premiumPlan : t.basicPlan}
                  </div>
                </div>
                <div style={{ background:"#fff", borderRadius:14, padding:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6" }}>
                  <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Syne',sans-serif", marginBottom:4 }}>📋 {lang==="fr"?"Travaux":"Jobs"}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:"#1a1a1a" }}>{jobs.length}</div>
                </div>
              </div>

              {/* Availability toggle */}
              <div style={{ background:"#fff", borderRadius:14, padding:"16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:"#1a1a1a", marginBottom:2 }}>{t.availability}</div>
                  <div style={{ fontSize:11, color: worker.available?"#2a8a50":"#cc2200" }}>
                    {worker.available ? `● ${t.availableNow}` : `● ${t.notAvailable}`}
                  </div>
                </div>
                <button className="btn"
                  onClick={async () => {
                    const newAvail = !worker.available;
                    await fetch(`${SUPABASE_URL}/rest/v1/workers?id=eq.${worker.id}`, {
                      method:"PATCH",
                      headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" },
                      body: JSON.stringify({ available: newAvail })
                    });
                    setWorker({...worker, available: newAvail});
                  }}
                  style={{ background: worker.available?"#fee2e2":"#dcfce7", color: worker.available?"#cc2200":"#2a8a50", border:"none", borderRadius:20, padding:"8px 16px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                  {worker.available ? (lang==="fr"?"Passer Occupé":"Set Busy") : (lang==="fr"?"Passer Disponible":"Set Available")}
                </button>
              </div>

              {/* Jobs nearby */}
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, marginBottom:12, color:"#1a1a1a" }}>
                📋 {t.jobsNearby}
              </div>
              {jobs.length === 0 ? (
                <div style={{ textAlign:"center", padding:"30px 20px", color:"#bbb" }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13 }}>{t.noJobs}</div>
                </div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {jobs.map(job => (
                    <div key={job.id} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ background:`${worker.color}18`, color:worker.color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, fontFamily:"'Syne',sans-serif" }}>
                          {categories.find(c=>c.id===job.category)?.icon} {categories.find(c=>c.id===job.category)?.label[lang]}
                        </span>
                        <span style={{ fontSize:10, color:"#bbb" }}>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize:13, color:"#444", lineHeight:1.5, marginBottom:8 }}>{job.description}</div>
                      {job.client_phone && (
                        <a href={`https://wa.me/237${job.client_phone}`} target="_blank" rel="noreferrer"
                          style={{ background:"#25D366", color:"#fff", borderRadius:10, padding:"8px 14px", fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:700, textDecoration:"none", display:"inline-block" }}>
                          💬 {lang==="fr"?"Contacter client":"Contact client"}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upgrade banner for basic users */}
              {!worker.premium && (
                <div style={{ background:"linear-gradient(135deg,#E07B39,#F4A261)", borderRadius:16, padding:"18px", marginTop:20, cursor:"pointer" }}
                  onClick={() => goTo("join")}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:"#fff", marginBottom:4 }}>⭐ {lang==="fr"?"Passer en Premium":"Upgrade to Premium"}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.88)" }}>
                    {lang==="fr"?"Apparaissez en tête des recherches + badge vérifié!":"Appear at top of search + verified badge!"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#fff", borderTop:"1px solid #f0ece6", display:"grid", gridTemplateColumns:"repeat(4,1fr)", padding:"8px 0 14px", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)", zIndex:100 }}>
        {[
          {id:"home", icon:"🏠", label:t.nav_home},
          {id:"search", icon:"🔍", label:t.nav_search},
          {id:"post", icon:"📋", label:t.nav_post},
          {id: worker ? "dashboard" : "login", icon:"👷", label: worker ? t.dashboard : t.login},
        ].map(nav => (
          <button key={nav.id} onClick={() => goTo(nav.id)}
            style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"4px 0" }}>
            <span style={{ fontSize:19 }}>{nav.icon}</span>
            <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:9, color:page===nav.id?"#F4A261":"#ccc" }}>{nav.label}</span>
            {page===nav.id && <div style={{ width:4, height:4, borderRadius:"50%", background:"#F4A261" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
