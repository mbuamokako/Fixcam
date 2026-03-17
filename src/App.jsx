import { useState, useEffect } from "react";
import { SUPABASE_URL, SUPABASE_KEY, cities, categories, plans, enrichWorker, T, categoryColors } from "./constants.jsx";

// ── Badges & Stars ──────────────────────────────────────────
const Stars = ({ rating }) => (
  <span style={{ color:"#F4A261", fontSize:13 }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}
    <span style={{ color:"#999", marginLeft:3, fontSize:11 }}>{rating}</span>
  </span>
);
const Badge = ({ type, label }) => {
  if (type==="premium") return <span style={{ background:"linear-gradient(90deg,#F4A261,#ff8c42)", color:"#fff", fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:20, fontFamily:"'Outfit',sans-serif", letterSpacing:0.3, boxShadow:"0 2px 8px rgba(244,162,97,0.4)" }}>⭐ {label}</span>;
  if (type==="verified") return <span style={{ background:"#dcfce7", color:"#16a34a", fontSize:9, fontWeight:700, padding:"3px 9px", borderRadius:20, fontFamily:"'Outfit',sans-serif", letterSpacing:0.3 }}>✅ {label}</span>;
  return null;
};

// ── Main App ────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("fr");
  const [page, setPage] = useState("home");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [jobForm, setJobForm] = useState({ desc:"", category:"plumber", city:"yaounde" });
  const [joinForm, setJoinForm] = useState({ name:"", phone:"", skill:"plumber", zone:"", city:"yaounde", plan:"basic", password:"", error:"", loading:false });
  const [loginForm, setLoginForm] = useState({ phone:"", password:"", error:"", loading:false });
  const [submitted, setSubmitted] = useState(false);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState(null);
  const [jobs, setJobs] = useState([]);
  const t = T[lang];

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/workers?select=*&order=plan.desc,rating.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => { setArtisans((data||[]).map(enrichWorker)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const sorted = [...artisans].sort((a,b) => { if (a.premium && !b.premium) return -1; if (!a.premium && b.premium) return 1; return b.rating - a.rating; });
  const filtered = sorted.filter(a => {
    const matchCat = selectedCat==="all" || a.category===selectedCat;
    const matchCity = selectedCity==="all" || a.city===selectedCity;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.zone.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });
  const goTo = (p) => { setPage(p); setSelectedArtisan(null); setSubmitted(false); };

  // ── Artisan Card ──────────────────────────────────────────
  const ArtisanCard = ({ a }) => (
    <div className="card" onClick={() => { setSelectedArtisan(a); setPage("profile"); }}
      style={{ background:"#fff", borderRadius:20, overflow:"hidden", boxShadow: a.premium?"0 4px 20px rgba(244,162,97,0.15)":"0 4px 16px rgba(0,0,0,0.07)", border: a.premium?"1.5px solid rgba(244,162,97,0.3)":"1.5px solid #f0ece6", position:"relative" }}>
      {a.premium && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#F4A261,#ff8c42,#F4A261)", backgroundSize:"200% 100%", animation:"shimmer 2s infinite linear" }} />}
      <div style={{ padding:"16px 16px 14px", display:"flex", gap:14, alignItems:"center" }}>
        {/* Avatar with ring */}
        <div style={{ position:"relative", flexShrink:0 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${a.color},${a.color}cc)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit',sans-serif", fontWeight:800, color:"#fff", fontSize:18, boxShadow:`0 4px 14px ${a.color}55` }}>{a.avatar}</div>
          {a.available && <div style={{ position:"absolute", bottom:2, right:2, width:12, height:12, borderRadius:"50%", background:"#22c55e", border:"2px solid #fff" }} />}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#111", marginBottom:4, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            {a.name}
          </div>
          <div style={{ display:"flex", gap:4, marginBottom:5, flexWrap:"wrap" }}>
            {a.premium && <Badge type="premium" label={t.premium} />}
            {a.verified && <Badge type="verified" label={t.verified} />}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <Stars rating={a.rating} />
            <span style={{ fontSize:10, color:"#bbb" }}>({a.reviews})</span>
          </div>
        </div>
        <div style={{ flexShrink:0, textAlign:"right" }}>
          <div style={{ background:`${a.color}15`, borderRadius:10, padding:"6px 10px", marginBottom:4 }}>
            <div style={{ fontSize:18 }}>{categories.find(c=>c.id===a.category)?.icon}</div>
          </div>
          <div style={{ fontSize:9, color:"#bbb", fontFamily:"'Outfit',sans-serif", fontWeight:600 }}>{categories.find(c=>c.id===a.category)?.label[lang]}</div>
        </div>
      </div>
      {/* Bottom strip */}
      <div style={{ background:"#fafaf8", borderTop:"1px solid #f0ece6", padding:"8px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:11, color:"#aaa", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>📍 {a.zone}, {cities.find(c=>c.id===a.city)?.label[lang]}</div>
        <div style={{ fontSize:10, fontWeight:700, color:a.available?"#22c55e":"#f87171", fontFamily:"'Outfit',sans-serif" }}>{a.available?`● ${t.available}`:`● ${t.unavailable}`}</div>
      </div>
    </div>
  );

  // ── Profile Page ──────────────────────────────────────────
  const ProfilePage = ({ a }) => (
    <div style={{ paddingBottom:100 }}>
      <div style={{ background:`linear-gradient(135deg,${a.color}18,${a.color}33)`, padding:"28px 20px 24px" }}>
        <button onClick={() => { setPage("search"); setSelectedArtisan(null); }} style={{ background:"rgba(255,255,255,0.9)", border:"none", borderRadius:20, padding:"6px 14px", cursor:"pointer", marginBottom:16, fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:600 }}>← {t.back}</button>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <div style={{ width:70, height:70, borderRadius:"50%", background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif", flexShrink:0, boxShadow:`0 4px 20px ${a.color}55` }}>{a.avatar}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:"#1a1a1a", marginBottom:5 }}>{a.name}</div>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}>{a.premium && <Badge type="premium" label={t.premium} />}{a.verified && <Badge type="verified" label={t.verified} />}</div>
            <Stars rating={a.rating} />
            <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{a.reviews} {t.reviews}</div>
            <div style={{ marginTop:6 }}><span style={{ background:a.available?"#3BB27322":"#ff444422", color:a.available?"#2a8a50":"#cc2200", fontSize:10, padding:"3px 10px", borderRadius:20, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>{a.available?`● ${t.available}`:`● ${t.unavailable}`}</span></div>
          </div>
        </div>
      </div>
      <div style={{ padding:"20px 20px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:18 }}>
          <div style={{ background:"#f8f5f0", borderRadius:12, padding:"12px 14px" }}>
            <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Outfit',sans-serif", marginBottom:2 }}>📍 {t.location}</div>
            <div style={{ fontWeight:700, fontFamily:"'Outfit',sans-serif", fontSize:13 }}>{a.zone}, {cities.find(c=>c.id===a.city)?.label[lang]}</div>
          </div>
          <div style={{ background:"#fff8f3", borderRadius:12, padding:"12px 14px", border:"1px solid #F4A26133" }}>
            <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Outfit',sans-serif", marginBottom:2 }}>💰 {lang==="fr"?"Tarif":"Rate"}</div>
            <div style={{ fontWeight:700, fontFamily:"'Outfit',sans-serif", fontSize:13, color:"#E07B39" }}>{lang==="fr"?"À convenir directement":"Agree directly with worker"}</div>
          </div>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:8 }}>{t.aboutMe}</div>
          <p style={{ fontSize:13, color:"#555", lineHeight:1.6, margin:0 }}>{a.about[lang]}</p>
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:8 }}>{t.skills}</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>{a.skills.map(s => <span key={s} style={{ background:`${a.color}18`, color:a.color, padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600, fontFamily:"'Outfit',sans-serif" }}>{s}</span>)}</div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:8 }}>{t.recentReviews}</div>
          {a.reviewsList.map((r,i) => (<div key={i} style={{ background:"#f8f5f0", borderRadius:12, padding:"12px 14px", marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ fontWeight:700, fontSize:12, fontFamily:"'Outfit',sans-serif" }}>{r.name}</span><Stars rating={r.stars} /></div><div style={{ fontSize:12, color:"#555" }}>{r.text[lang]}</div></div>))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <a href={`https://wa.me/237${a.phone}`} target="_blank" rel="noreferrer" style={{ background:"#25D366", color:"#fff", borderRadius:14, padding:"14px", textAlign:"center", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, textDecoration:"none", display:"block" }}>💬 {t.whatsapp}</a>
          <a href={`tel:+237${a.phone}`} style={{ background:a.color, color:"#fff", borderRadius:14, padding:"14px", textAlign:"center", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, textDecoration:"none", display:"block" }}>📞 {t.call}</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:"#fafaf8", fontFamily:"'Plus Jakarta Sans',sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        body{background:#0f0f0f}
        input,textarea,select{font-family:'Plus Jakarta Sans',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .btn{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer}
        .btn:active{transform:scale(0.95)!important}
        .btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(244,162,97,0.3)}
        .cat{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer}
        .cat:hover{transform:translateY(-3px) scale(1.02)}
        .cat:active{transform:scale(0.96)}
        .card{transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer}
        .card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.15)!important}
        .card:active{transform:scale(0.98)}
        input:focus,textarea:focus,select:focus{border-color:#F4A261!important;box-shadow:0 0 0 3px rgba(244,162,97,0.15)!important}
      `}</style>

      {/* TOPBAR */}
      <div style={{ background:"rgba(15,15,15,0.95)", backdropFilter:"blur(20px)", padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100, borderBottom:"1px solid rgba(244,162,97,0.15)" }}>
        <div onClick={() => goTo("home")} style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:20, background:"linear-gradient(90deg,#F4A261,#ff8c42)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", cursor:"pointer", letterSpacing:-0.5 }}>⚡ {t.appName}</div>
        <button className="btn" onClick={() => setLang(lang==="fr"?"en":"fr")} style={{ background:"rgba(244,162,97,0.15)", border:"1px solid rgba(244,162,97,0.4)", borderRadius:20, padding:"6px 14px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, color:"#F4A261" }}>{lang==="fr"?"EN 🌍":"FR 🌍"}</button>
      </div>

      <div style={{ paddingBottom:85, animation:"fadeUp 0.35s ease" }}>
        {loading && (<div style={{ textAlign:"center", padding:"80px 20px" }}><div style={{ fontSize:40, marginBottom:16 }}>🔧</div><div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:16, color:"#1a1a1a", marginBottom:8 }}>FixCam</div><div style={{ fontSize:13, color:"#aaa" }}>{lang==="fr"?"Chargement...":"Loading..."}</div></div>)}
        {!loading && <>

        {/* HOME */}
        {page==="home" && (
          <div>
            <div style={{ background:"linear-gradient(160deg,#0f0f0f 0%,#1a1108 50%,#0f0f0f 100%)", padding:"40px 20px 44px", position:"relative", overflow:"hidden" }}>
              {/* decorative blobs */}
              <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(244,162,97,0.18),transparent 70%)" }} />
              <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,140,66,0.12),transparent 70%)" }} />
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(244,162,97,0.05),transparent 70%)" }} />
              <div style={{ position:"relative", zIndex:1 }}>
                {/* city pills */}
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:20 }}>
                  {["Yaoundé","Douala","Limbé","Buea"].map(c => (
                    <span key={c} style={{ background:"rgba(244,162,97,0.12)", border:"1px solid rgba(244,162,97,0.25)", color:"#F4A261", fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, fontFamily:"'Outfit',sans-serif", letterSpacing:0.3 }}>📍 {c}</span>
                  ))}
                </div>
                <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:28, color:"#fff", lineHeight:1.2, marginBottom:12, letterSpacing:-0.5 }}>{t.tagline}</h1>
                <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:28, lineHeight:1.6 }}>{lang==="fr"?"Plombiers, électriciens, traiteurs, soudeurs — trouvez le bon artisan en quelques secondes.":"Plumbers, electricians, caterers, welders — find the right worker in seconds."}</p>
                {/* search bar in hero */}
                <div style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:16, padding:"12px 16px", display:"flex", gap:10, alignItems:"center", marginBottom:16 }}
                  onClick={() => goTo("search")}>
                  <span style={{ fontSize:16 }}>🔍</span>
                  <span style={{ color:"rgba(255,255,255,0.4)", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{t.searchPlaceholder}</span>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button className="btn" onClick={() => goTo("search")} style={{ background:"linear-gradient(135deg,#F4A261,#ff8c42)", color:"#fff", border:"none", borderRadius:14, padding:"14px 20px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, flex:1, boxShadow:"0 8px 24px rgba(244,162,97,0.4)" }}>🔍 {t.hero_cta}</button>
                  <button className="btn" onClick={() => goTo("join")} style={{ background:"rgba(244,162,97,0.12)", color:"#F4A261", border:"1px solid rgba(244,162,97,0.3)", borderRadius:14, padding:"14px 16px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13 }}>{t.hero_cta2}</button>
                </div>
              </div>
            </div>

            <div style={{ padding:"24px 20px 0" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, marginBottom:12, color:"#888", textTransform:"uppercase", letterSpacing:1 }}>📍 {lang==="fr"?"Nos villes":"Our cities"}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {cities.map(c => (
                  <button key={c.id} className="cat" onClick={() => { setSelectedCity(c.id); setSelectedCat("all"); goTo("search"); }}
                    style={{ background:"#fff", border:"1.5px solid #f0ece6", borderRadius:16, padding:"14px 6px", textAlign:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.06)", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#F4A261,#ff8c42)", opacity:0.6 }} />
                    <div style={{ fontSize:24, marginBottom:5 }}>{c.emoji}</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:10, color:"#333" }}>{c.label[lang]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding:"24px 20px 0" }}>
              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, marginBottom:12, color:"#888", textTransform:"uppercase", letterSpacing:1 }}>{t.categories}</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {categories.filter(c=>c.id!=="all").map((cat,i) => (
                  <button key={cat.id} className="cat" onClick={() => { setSelectedCat(cat.id); setSelectedCity("all"); goTo("search"); }}
                    style={{ background:"#fff", border:"1.5px solid #f0ece6", borderRadius:18, padding:"18px 8px", textAlign:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.06)", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${["#F4A26108","#2D7DD208","#F15BB508","#FF6B3508","#3BB27308","#9B5DE508"][i]},transparent)` }} />
                    <div style={{ fontSize:28, marginBottom:6, position:"relative" }}>{cat.icon}</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:11, color:"#333", position:"relative" }}>{cat.label[lang]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding:"22px 20px 0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:15, color:"#1a1a1a" }}>{t.topArtisans}</div>
                <button onClick={() => goTo("search")} style={{ background:"none", border:"none", color:"#F4A261", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{lang==="fr"?"Voir tous →":"See all →"}</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>{sorted.filter(a=>a.premium).slice(0,4).map(a => <ArtisanCard key={a.id} a={a} />)}</div>
            </div>

            <div style={{ margin:"22px 20px 0" }}>
              <div className="card" onClick={() => goTo("post")} style={{ background:"linear-gradient(135deg,#111,#1a1a1a)", borderRadius:20, padding:"22px 20px", cursor:"pointer", border:"1px solid rgba(244,162,97,0.2)", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle,rgba(244,162,97,0.2),transparent 70%)" }} />
                <div style={{ position:"relative" }}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:17, color:"#fff", marginBottom:6 }}>📋 {t.postJob}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:14, lineHeight:1.5 }}>{lang==="fr"?"Décrivez votre besoin, les artisans vous contactent directement.":"Describe your need, workers contact you directly."}</div>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"linear-gradient(135deg,#F4A261,#ff8c42)", borderRadius:10, padding:"8px 14px" }}>
                    <span style={{ color:"#fff", fontSize:12, fontWeight:700, fontFamily:"'Outfit',sans-serif" }}>{lang==="fr"?"Publier maintenant →":"Post now →"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH */}
        {page==="search" && !selectedArtisan && (
          <div style={{ padding:"20px 20px 0" }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:19, marginBottom:14, color:"#1a1a1a" }}>🔍 {lang==="fr"?"Trouver un Artisan":"Find a Worker"}</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPlaceholder} style={{ width:"100%", padding:"13px 16px", borderRadius:14, border:"1.5px solid #e8e8e8", fontSize:13, marginBottom:12, outline:"none", background:"#fff", transition:"all 0.2s", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }} />
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:6, marginBottom:10 }}>
              <button className="cat" onClick={() => setSelectedCity("all")} style={{ background:selectedCity==="all"?"#1a1a1a":"#fff", color:selectedCity==="all"?"#F4A261":"#555", border:`2px solid ${selectedCity==="all"?"#1a1a1a":"#f0ece6"}`, borderRadius:20, padding:"6px 14px", whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:11 }}>🌍 {t.allCities}</button>
              {cities.map(c => (<button key={c.id} className="cat" onClick={() => setSelectedCity(c.id)} style={{ background:selectedCity===c.id?"#1a1a1a":"#fff", color:selectedCity===c.id?"#F4A261":"#555", border:`2px solid ${selectedCity===c.id?"#1a1a1a":"#f0ece6"}`, borderRadius:20, padding:"6px 14px", whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:11 }}>{c.emoji} {c.label[lang]}</button>))}
            </div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:6, marginBottom:12 }}>
              {categories.map(cat => (<button key={cat.id} className="cat" onClick={() => setSelectedCat(cat.id)} style={{ background:selectedCat===cat.id?"#F4A261":"#fff", color:selectedCat===cat.id?"#1a1a1a":"#555", border:`2px solid ${selectedCat===cat.id?"#F4A261":"#f0ece6"}`, borderRadius:20, padding:"6px 13px", whiteSpace:"nowrap", fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:11 }}>{cat.icon} {cat.label[lang]}</button>))}
            </div>
            <div style={{ fontSize:11, color:"#bbb", marginBottom:10, fontFamily:"'Outfit',sans-serif" }}>{filtered.length} {t.found}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map(a => <ArtisanCard key={a.id} a={a} />)}
              {filtered.length===0 && (<div style={{ textAlign:"center", padding:"50px 20px", color:"#bbb" }}><div style={{ fontSize:44, marginBottom:12 }}>🔍</div><div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:15 }}>{t.noResults}</div></div>)}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {page==="profile" && selectedArtisan && <ProfilePage a={selectedArtisan} />}

        {/* POST JOB */}
        {page==="post" && (
          <div style={{ padding:"24px 20px" }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:19, marginBottom:6, color:"#1a1a1a" }}>📋 {t.postJob}</div>
            <p style={{ fontSize:12, color:"#aaa", marginBottom:22 }}>{lang==="fr"?"Décrivez votre besoin. Les artisans disponibles dans votre ville vous contacteront.":"Describe your need. Available workers in your city will contact you."}</p>
            {submitted ? (
              <div style={{ textAlign:"center", padding:"40px 10px", animation:"fadeUp 0.4s ease" }}>
                <div style={{ fontSize:56, marginBottom:14 }}>✅</div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:20, color:"#1a1a1a", marginBottom:8 }}>{t.jobPosted}</div>
                <p style={{ color:"#888", fontSize:13, marginBottom:24 }}>{t.jobPostedDesc}</p>
                <button className="btn" onClick={() => { setSubmitted(false); goTo("home"); }} style={{ background:"#1a1a1a", color:"#F4A261", border:"none", borderRadius:14, padding:"14px 28px", fontFamily:"'Outfit',sans-serif", fontWeight:700 }}>{t.backHome}</button>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                <div>
                  <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.jobCategory}</label>
                  <select value={jobForm.category} onChange={e=>setJobForm({...jobForm,category:e.target.value})} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>
                    {categories.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label[lang]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.jobCity}</label>
                  <select value={jobForm.city} onChange={e=>setJobForm({...jobForm,city:e.target.value})} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>
                    {cities.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label[lang]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.postJobTitle}</label>
                  <textarea value={jobForm.desc} onChange={e=>setJobForm({...jobForm,desc:e.target.value})} placeholder={t.jobDesc} rows={5} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, resize:"none", outline:"none", background:"#fff" }} />
                </div>
                <button className="btn" onClick={async () => {
                  if (!jobForm.desc.trim()) return;
                  await fetch(`${SUPABASE_URL}/rest/v1/jobs`, { method:"POST", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" }, body: JSON.stringify({ description:jobForm.desc, category:jobForm.category, city:jobForm.city }) });
                  setSubmitted(true);
                }} style={{ background:jobForm.desc.trim()?"#1a1a1a":"#e0e0e0", color:jobForm.desc.trim()?"#F4A261":"#aaa", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14 }}>📤 {t.submit}</button>
              </div>
            )}
          </div>
        )}

        {/* JOIN */}
        {page==="join" && (
          <div style={{ padding:"24px 20px" }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:19, marginBottom:6, color:"#1a1a1a" }}>👷 {t.joinTitle}</div>
            <p style={{ fontSize:12, color:"#aaa", marginBottom:20 }}>{t.joinDesc}</p>
            {submitted ? (
              <div style={{ padding:"10px 0", animation:"fadeUp 0.4s ease" }}>
                <div style={{ textAlign:"center", marginBottom:20 }}>
                  <div style={{ fontSize:48, marginBottom:10 }}>🎉</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:20, color:"#1a1a1a", marginBottom:6 }}>{lang==="fr"?"Inscription réussie!":"Registration successful!"}</div>
                  <p style={{ color:"#888", fontSize:13 }}>{lang==="fr"?"Finalisez votre inscription en effectuant le paiement ci-dessous.":"Complete your registration by making the payment below."}</p>
                </div>

                {/* Payment amount */}
                <div style={{ background:"linear-gradient(135deg,#1a1a1a,#2d1f0e)", borderRadius:16, padding:"20px", marginBottom:16, textAlign:"center" }}>
                  <div style={{ fontSize:11, color:"#F4A261", fontFamily:"'Outfit',sans-serif", fontWeight:700, letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>{lang==="fr"?"Montant à payer":"Amount to pay"}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:36, color:"#fff" }}>{joinForm.plan==="premium"?"5.000":"2.000"} <span style={{ fontSize:16, color:"#F4A261" }}>FCFA</span></div>
                  <div style={{ fontSize:12, color:"#aaa", marginTop:4 }}>{joinForm.plan==="premium"?"Plan Premium ⭐":"Plan Basique"} · {lang==="fr"?"par mois":"per month"}</div>
                </div>

                {/* MTN Payment */}
                <div style={{ background:"#fff8e1", border:"1.5px solid #FFD54F", borderRadius:14, padding:"16px", marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#FFD54F", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>📱</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, color:"#1a1a1a" }}>MTN Mobile Money</div>
                  </div>
                  <div style={{ fontSize:12, color:"#555", lineHeight:1.8 }}>
                    1. {lang==="fr"?"Composez":"Dial"} <strong>*126#</strong><br/>
                    2. {lang==="fr"?"Choisissez Transfert d'argent":"Choose Transfer money"}<br/>
                    3. {lang==="fr"?"Envoyez":"Send"} <strong>{joinForm.plan==="premium"?"5000":"2000"} FCFA</strong> {lang==="fr"?"au numéro:":"to number:"}<br/>
                    <div style={{ background:"#FFD54F44", borderRadius:8, padding:"8px 12px", marginTop:6, fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:16, color:"#1a1a1a", textAlign:"center" }}>📞 682 735 988</div>
                  </div>
                </div>

                {/* Orange Payment */}
                <div style={{ background:"#fff3e0", border:"1.5px solid #FF9800", borderRadius:14, padding:"16px", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#FF9800", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>📱</div>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, color:"#1a1a1a" }}>Orange Money</div>
                  </div>
                  <div style={{ fontSize:12, color:"#555", lineHeight:1.8 }}>
                    1. {lang==="fr"?"Composez":"Dial"} <strong>#150*50#</strong><br/>
                    2. {lang==="fr"?"Choisissez Envoyer de l'argent":"Choose Send money"}<br/>
                    3. {lang==="fr"?"Envoyez":"Send"} <strong>{joinForm.plan==="premium"?"5000":"2000"} FCFA</strong> {lang==="fr"?"au numéro:":"to number:"}<br/>
                    <div style={{ background:"#FF980044", borderRadius:8, padding:"8px 12px", marginTop:6, fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:16, color:"#1a1a1a", textAlign:"center" }}>📞 695 548 173</div>
                  </div>
                </div>

                {/* Reference input */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>
                    {lang==="fr"?"📋 Entrez votre référence de paiement":"📋 Enter your payment reference"}
                  </label>
                  <input type="text" value={joinForm.reference||""} onChange={e=>setJoinForm({...joinForm,reference:e.target.value})}
                    placeholder={lang==="fr"?"Ex: TXN123456789":"Ex: TXN123456789"}
                    style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, outline:"none", background:"#fff" }} />
                  <div style={{ fontSize:11, color:"#aaa", marginTop:5 }}>{lang==="fr"?"Le numéro de transaction reçu par SMS après le paiement":"The transaction number received by SMS after payment"}</div>
                </div>

                <button className="btn" onClick={async () => {
                  if (!joinForm.reference?.trim()) { alert(lang==="fr"?"Veuillez entrer votre référence de paiement!":"Please enter your payment reference!"); return; }
                  // Save reference to database
                  await fetch(`${SUPABASE_URL}/rest/v1/workers?phone=eq.${joinForm.phone}`, { method:"PATCH", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" }, body: JSON.stringify({ payment_reference: joinForm.reference.trim(), payment_status:"pending" }) });
                  // Send WhatsApp notification
                  const msg = encodeURIComponent(`🔔 *Nouvelle inscription FixCam!*

👤 Nom: ${joinForm.name}
📞 Téléphone: ${joinForm.phone}
🔧 Compétence: ${joinForm.skill}
📍 Quartier: ${joinForm.zone}
🏙️ Ville: ${joinForm.city}
💎 Plan: ${joinForm.plan==="premium"?"Premium (5,000 FCFA)":"Basique (2,000 FCFA)"}
🧾 Référence: ${joinForm.reference}

⏳ En attente de vérification`);
                  window.open(`https://wa.me/237695548173?text=${msg}`, "_blank");
                  goTo("home");
                }}
                  style={{ width:"100%", background:"#25D366", color:"#fff", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14 }}>
                  ✅ {lang==="fr"?"J'ai payé — Envoyer confirmation":"I've paid — Send confirmation"}
                </button>
                <div style={{ textAlign:"center", fontSize:11, color:"#aaa", marginTop:10 }}>
                  {lang==="fr"?"Votre compte sera activé sous 24h après vérification":"Your account will be activated within 24h after verification"}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:12, color:"#1a1a1a" }}>💎 {t.choosePlan}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                  {plans.map(plan => (
                    <div key={plan.id} className="cat" onClick={() => setJoinForm({...joinForm,plan:plan.id})} style={{ background:joinForm.plan===plan.id?"#1a1a1a":"#fff", borderRadius:16, padding:"16px 14px", border:joinForm.plan===plan.id?`2px solid ${plan.color}`:"2px solid #f0ece6", position:"relative", overflow:"hidden" }}>
                      {plan.popular && <div style={{ position:"absolute", top:8, right:8, background:"linear-gradient(90deg,#F4A261,#E07B39)", color:"#fff", fontSize:8, fontWeight:800, padding:"2px 7px", borderRadius:20, fontFamily:"'Outfit',sans-serif" }}>{t.mostPopular}</div>}
                      <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:13, color:joinForm.plan===plan.id?"#F4A261":"#1a1a1a", marginBottom:4 }}>{plan.id==="basic"?t.basicPlan:t.premiumPlan}</div>
                      <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:19, color:plan.color, marginBottom:8 }}>{plan.price.toLocaleString()} <span style={{ fontSize:10, fontWeight:600 }}>{t.fcfa}{t.perMonth}</span></div>
                      {plan.features[lang].map((f,i) => (<div key={i} style={{ fontSize:10, color:joinForm.plan===plan.id?"#bbb":"#777", lineHeight:1.5, marginBottom:2 }}>{f}</div>))}
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
                      <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{f.label}</label>
                      <input type={f.type} value={joinForm[f.key]||""} onChange={e=>setJoinForm({...joinForm,[f.key]:e.target.value})} placeholder={f.placeholder} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, outline:"none", background:"#fff" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.skill}</label>
                    <select value={joinForm.skill} onChange={e=>setJoinForm({...joinForm,skill:e.target.value})} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>{categories.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label[lang]}</option>)}</select>
                  </div>
                  <div>
                    <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{t.city}</label>
                    <select value={joinForm.city} onChange={e=>setJoinForm({...joinForm,city:e.target.value})} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, background:"#fff", outline:"none" }}>{cities.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label[lang]}</option>)}</select>
                  </div>
                  {joinForm.error && <div style={{ background:"#fee2e2", color:"#cc2200", borderRadius:12, padding:"10px 14px", fontSize:12, fontFamily:"'Outfit',sans-serif" }}>⚠️ {joinForm.error}</div>}
                  <button className="btn" onClick={async () => {
                    if (!joinForm.name.trim()||!joinForm.phone.trim()||!joinForm.zone.trim()||!joinForm.password.trim()) { setJoinForm({...joinForm, error: lang==="fr"?"Veuillez remplir tous les champs!":"Please fill in all fields!"}); return; }
                    setJoinForm({...joinForm, loading:true, error:""});
                    try {
                      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/register_worker`, { method:"POST", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json" }, body: JSON.stringify({ p_name:joinForm.name.trim(), p_phone:joinForm.phone.trim(), p_password:joinForm.password.trim(), p_category:joinForm.skill, p_city:joinForm.city, p_zone:joinForm.zone.trim(), p_plan:joinForm.plan }) });
                      if (res.ok || res.status===200) { setSubmitted(true); } else { const err = await res.json(); setJoinForm({...joinForm, loading:false, error: err.message||(lang==="fr"?"Erreur, réessayez.":"Error, please try again.")}); }
                    } catch(e) { setJoinForm({...joinForm, loading:false, error:lang==="fr"?"Erreur de connexion.":"Connection error."}); }
                  }} style={{ background:(joinForm.name&&joinForm.phone&&joinForm.zone&&joinForm.password)?"#E07B39":"#e0e0e0", color:(joinForm.name&&joinForm.phone&&joinForm.zone&&joinForm.password)?"#fff":"#aaa", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14 }}>
                    {joinForm.loading?"...":`🚀 ${t.register}`}
                  </button>
                  <div style={{ textAlign:"center", fontSize:12, color:"#aaa" }}>
                    <span>{lang==="fr"?"Déjà inscrit?":"Already registered?"} </span>
                    <button onClick={() => goTo("login")} style={{ background:"none", border:"none", color:"#E07B39", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{t.login}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOGIN */}
        {page==="login" && !worker && (
          <div style={{ padding:"24px 20px" }}>
            <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:19, marginBottom:6, color:"#1a1a1a" }}>🔐 {t.loginTitle}</div>
            <p style={{ fontSize:12, color:"#aaa", marginBottom:24 }}>{t.loginDesc}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {loginForm.error && <div style={{ background:"#fee2e2", color:"#cc2200", borderRadius:12, padding:"10px 14px", fontSize:12, fontFamily:"'Outfit',sans-serif" }}>⚠️ {loginForm.error}</div>}
              {[{key:"phone",label:t.phone,placeholder:"6XX XXX XXX",type:"tel"},{key:"password",label:t.password,placeholder:"••••••••",type:"password"}].map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:12, color:"#555", display:"block", marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} value={loginForm[f.key]} onChange={e=>setLoginForm({...loginForm,[f.key]:e.target.value})} placeholder={f.placeholder} style={{ width:"100%", padding:"12px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:13, outline:"none", background:"#fff" }} />
                </div>
              ))}
              <button className="btn" onClick={async () => {
                if (!loginForm.phone.trim()||!loginForm.password.trim()) return;
                setLoginForm({...loginForm, loading:true, error:""});
                try {
                  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/check_worker_login`, { method:"POST", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json" }, body: JSON.stringify({ p_phone: loginForm.phone.trim(), p_password: loginForm.password.trim() }) });
                  const data = await res.json();
                  if (data && data.length > 0) {
                    setWorker(enrichWorker(data[0]));
                    const jobsRes = await fetch(`${SUPABASE_URL}/rest/v1/jobs?city=eq.${data[0].city}&category=eq.${data[0].category}&select=*&order=created_at.desc`, { headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}` } });
                    setJobs((await jobsRes.json()) || []);
                    setPage("dashboard");
                    setLoginForm({phone:"", password:"", error:"", loading:false});
                  } else { setLoginForm({...loginForm, loading:false, error:t.wrongCredentials}); }
                } catch(e) { setLoginForm({...loginForm, loading:false, error:"Connection error"}); }
              }} style={{ background:(loginForm.phone&&loginForm.password)?"#1a1a1a":"#e0e0e0", color:(loginForm.phone&&loginForm.password)?"#F4A261":"#aaa", border:"none", borderRadius:14, padding:"15px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14 }}>
                {loginForm.loading?"...":`🔐 ${t.login}`}
              </button>
              <div style={{ textAlign:"center", fontSize:12, color:"#aaa" }}>
                <span>{t.noAccount} </span>
                <button onClick={() => goTo("join")} style={{ background:"none", border:"none", color:"#E07B39", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>{lang==="fr"?"S'inscrire":"Register"}</button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {page==="dashboard" && worker && (
          <div style={{ paddingBottom:20 }}>
            <div style={{ background:"linear-gradient(135deg,#1a1a1a,#2d1f0e)", padding:"28px 20px 24px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <div style={{ fontSize:11, color:"#F4A261", fontFamily:"'Outfit',sans-serif", fontWeight:700, textTransform:"uppercase", letterSpacing:1 }}>{t.dashboard}</div>
                <button onClick={() => { setWorker(null); setPage("home"); }} style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:20, padding:"5px 12px", color:"#aaa", fontSize:11, fontFamily:"'Outfit',sans-serif", cursor:"pointer" }}>{t.logout}</button>
              </div>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:60, height:60, borderRadius:"50%", background:worker.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Outfit',sans-serif", flexShrink:0, boxShadow:`0 4px 16px ${worker.color}55` }}>{worker.avatar}</div>
                <div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:17, color:"#fff", marginBottom:4 }}>{worker.name}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{worker.premium && <Badge type="premium" label={t.premium} />}{worker.verified && <Badge type="verified" label={t.verified} />}</div>
                  <div style={{ fontSize:11, color:"#888", marginTop:4 }}>📍 {worker.zone}, {cities.find(c=>c.id===worker.city)?.label[lang]}</div>
                </div>
              </div>
            </div>

            <div style={{ padding:"20px 20px 0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                <div style={{ background:"#fff", borderRadius:14, padding:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6" }}>
                  <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Outfit',sans-serif", marginBottom:4 }}>💎 {t.myPlan}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, color:worker.premium?"#E07B39":"#555" }}>{worker.premium?t.premiumPlan:t.basicPlan}</div>
                </div>
                <div style={{ background:"#fff", borderRadius:14, padding:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6" }}>
                  <div style={{ fontSize:10, color:"#aaa", fontFamily:"'Outfit',sans-serif", marginBottom:4 }}>📋 {lang==="fr"?"Travaux":"Jobs"}</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, color:"#1a1a1a" }}>{jobs.length}</div>
                </div>
              </div>

              <div style={{ background:"#fff", borderRadius:14, padding:"16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:13, color:"#1a1a1a", marginBottom:2 }}>{t.availability}</div>
                  <div style={{ fontSize:11, color:worker.available?"#2a8a50":"#cc2200" }}>{worker.available?`● ${t.availableNow}`:`● ${t.notAvailable}`}</div>
                </div>
                <button className="btn" onClick={async () => {
                  const newAvail = !worker.available;
                  await fetch(`${SUPABASE_URL}/rest/v1/workers?id=eq.${worker.id}`, { method:"PATCH", headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${SUPABASE_KEY}`, "Content-Type":"application/json", Prefer:"return=minimal" }, body: JSON.stringify({ available:newAvail }) });
                  setWorker({...worker, available:newAvail});
                }} style={{ background:worker.available?"#fee2e2":"#dcfce7", color:worker.available?"#cc2200":"#2a8a50", border:"none", borderRadius:20, padding:"8px 16px", fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                  {worker.available?(lang==="fr"?"Passer Occupé":"Set Busy"):(lang==="fr"?"Passer Disponible":"Set Available")}
                </button>
              </div>

              <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:700, fontSize:14, marginBottom:12, color:"#1a1a1a" }}>📋 {t.jobsNearby}</div>
              {jobs.length===0 ? (
                <div style={{ textAlign:"center", padding:"30px 20px", color:"#bbb" }}><div style={{ fontSize:36, marginBottom:8 }}>📭</div><div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13 }}>{t.noJobs}</div></div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {jobs.map(job => (
                    <div key={job.id} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:"1px solid #f0ece6" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ background:`${worker.color}18`, color:worker.color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, fontFamily:"'Outfit',sans-serif" }}>{categories.find(c=>c.id===job.category)?.icon} {categories.find(c=>c.id===job.category)?.label[lang]}</span>
                        <span style={{ fontSize:10, color:"#bbb" }}>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize:13, color:"#444", lineHeight:1.5, marginBottom:8 }}>{job.description}</div>
                      {job.client_phone && <a href={`https://wa.me/237${job.client_phone}`} target="_blank" rel="noreferrer" style={{ background:"#25D366", color:"#fff", borderRadius:10, padding:"8px 14px", fontSize:12, fontFamily:"'Outfit',sans-serif", fontWeight:700, textDecoration:"none", display:"inline-block" }}>💬 {lang==="fr"?"Contacter client":"Contact client"}</a>}
                    </div>
                  ))}
                </div>
              )}

              {!worker.premium && (
                <div style={{ background:"linear-gradient(135deg,#E07B39,#F4A261)", borderRadius:16, padding:"18px", marginTop:20, cursor:"pointer" }} onClick={() => goTo("join")}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:14, color:"#fff", marginBottom:4 }}>⭐ {lang==="fr"?"Passer en Premium":"Upgrade to Premium"}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.88)" }}>{lang==="fr"?"Apparaissez en tête des recherches + badge vérifié!":"Appear at top of search + verified badge!"}</div>
                </div>
              )}
            </div>
          </div>
        )}

        </>}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, zIndex:100 }}>
        <div style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(0,0,0,0.06)", display:"grid", gridTemplateColumns:"repeat(4,1fr)", padding:"10px 8px 18px", boxShadow:"0 -8px 32px rgba(0,0,0,0.1)" }}>
          {[
            {id:"home", icon:"🏠", label:t.nav_home},
            {id:"search", icon:"🔍", label:t.nav_search},
            {id:"post", icon:"📋", label:t.nav_post},
            {id: worker?"dashboard":"login", icon:"👷", label: worker?t.dashboard:t.login},
          ].map(nav => {
            const active = page===nav.id || (nav.id==="dashboard" && page==="dashboard") || (nav.id==="login" && page==="login");
            return (
              <button key={nav.id} onClick={() => goTo(nav.id)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0", position:"relative" }}>
                <div style={{ width:40, height:34, borderRadius:12, background:active?"linear-gradient(135deg,#F4A261,#ff8c42)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", boxShadow:active?"0 4px 12px rgba(244,162,97,0.4)":"none" }}>
                  <span style={{ fontSize:18, filter:active?"none":"grayscale(30%)" }}>{nav.icon}</span>
                </div>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:600, fontSize:9, color:active?"#F4A261":"#bbb", transition:"color 0.2s" }}>{nav.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
