import { useState, useEffect } from "react";

const SUPABASE_URL = "https://cthzaefwrouuoabxplpl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aHphZWZ3cm91dW9hYnhwbHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTk5MjEsImV4cCI6MjA4OTI3NTkyMX0.Yw7qp1PdduCe_u_juk0Z6dB_DrXV-7j6H8tDYKMICC0";
const ADMIN_PASSWORD = "M16mr75wong$";

const api = async (path, method="GET", body=null) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: body ? JSON.stringify(body) : null
  });
  if (method === "GET") return res.json();
  return res;
};

const categoryColors = { plumber:"#E07B39", electrician:"#2D7DD2", cleaner:"#F15BB5", catering:"#FF6B35", mechanic:"#3BB273", welder:"#9B5DE5" };
const categoryLabels = { plumber:"Plombier", electrician:"Électricien", cleaner:"Nettoyage", catering:"Traiteur", mechanic:"Mécanicien", welder:"Soudeur" };
const cityLabels = { yaounde:"Yaoundé", douala:"Douala", limbe:"Limbé", buea:"Buea" };

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [workers, setWorkers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const [requests, setRequests] = useState([]);

  const loadData = async () => {
    setLoading(true);
    const [w, j, r] = await Promise.all([
      api("workers?select=*&order=created_at.desc"),
      api("jobs?select=*&order=created_at.desc"),
      api("requests?select=*&order=created_at.desc")
    ]);
    setWorkers(w || []);
    setJobs(j || []);
    setRequests(r || []);
    setLoading(false);
  };

  useEffect(() => { if (loggedIn) loadData(); }, [loggedIn]);

  const updateWorker = async (id, updates) => {
    await api(`workers?id=eq.${id}`, "PATCH", updates);
    setWorkers(workers.map(w => w.id === id ? {...w, ...updates} : w));
    showToast("✅ Mis à jour!");
  };

  const deleteWorker = async (id) => {
    if (!window.confirm("Supprimer cet artisan?")) return;
    await api(`workers?id=eq.${id}`, "DELETE");
    setWorkers(workers.filter(w => w.id !== id));
    showToast("🗑️ Supprimé!");
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Supprimer ce travail?")) return;
    await api(`jobs?id=eq.${id}`, "DELETE");
    setJobs(jobs.filter(j => j.id !== id));
    showToast("🗑️ Supprimé!");
  };

  const premium = workers.filter(w => w.plan === "premium").length;
  const basic = workers.filter(w => w.plan === "basic").length;
  const revenue = (premium * 5000) + (basic * 2000);

  if (!loggedIn) return (
    <div style={{ minHeight:"100vh", background:"#1a1a1a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ background:"#fff", borderRadius:20, padding:"40px 32px", width:"90%", maxWidth:380, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔧</div>
        <div style={{ fontWeight:800, fontSize:22, color:"#1a1a1a", marginBottom:4 }}>FixCam Admin</div>
        <div style={{ fontSize:13, color:"#aaa", marginBottom:28 }}>Panneau d'administration</div>
        {error && <div style={{ background:"#fee2e2", color:"#cc2200", borderRadius:10, padding:"10px", fontSize:12, marginBottom:16 }}>⚠️ {error}</div>}
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&(password===ADMIN_PASSWORD?setLoggedIn(true):setError("Mot de passe incorrect!"))}
          placeholder="Mot de passe admin"
          style={{ width:"100%", padding:"13px 16px", borderRadius:14, border:"2px solid #f0ece6", fontSize:14, outline:"none", marginBottom:14, textAlign:"center" }} />
        <button onClick={() => password===ADMIN_PASSWORD ? setLoggedIn(true) : setError("Mot de passe incorrect!")}
          style={{ width:"100%", background:"#1a1a1a", color:"#F4A261", border:"none", borderRadius:14, padding:"14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, cursor:"pointer" }}>
          🔐 Se connecter
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f5f5f5", fontFamily:"'Syne',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px}`}</style>

      {toast && <div style={{ position:"fixed", top:20, right:20, background:"#1a1a1a", color:"#F4A261", padding:"10px 20px", borderRadius:20, fontWeight:700, fontSize:13, zIndex:999 }}>{toast}</div>}

      {/* TOPBAR */}
      <div style={{ background:"#1a1a1a", padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontWeight:800, fontSize:18, color:"#F4A261" }}>🔧 FixCam Admin</div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={loadData} style={{ background:"#F4A26122", color:"#F4A261", border:"none", borderRadius:20, padding:"5px 14px", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer" }}>🔄 Actualiser</button>
          <button onClick={() => setLoggedIn(false)} style={{ background:"#ff444422", color:"#ff4444", border:"none", borderRadius:20, padding:"5px 14px", fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer" }}>Déconnexion</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:"#fff", borderBottom:"1px solid #eee", display:"flex", padding:"0 24px", overflowX:"auto" }}>
        {[
          {id:"dashboard", icon:"📊", label:"Dashboard"},
          {id:"workers", icon:"👷", label:`Artisans (${workers.length})`},
          {id:"jobs", icon:"📋", label:`Travaux (${jobs.length})`},
          {id:"requests", icon:"📬", label:`Demandes (${requests?.length||0})`},
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background:"none", border:"none", borderBottom:tab===t.id?"3px solid #F4A261":"3px solid transparent", padding:"14px 20px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:13, color:tab===t.id?"#F4A261":"#888", cursor:"pointer", whiteSpace:"nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"24px", maxWidth:1000, margin:"0 auto" }}>
        {loading && <div style={{ textAlign:"center", padding:"40px", color:"#aaa" }}>Chargement...</div>}

        {/* DASHBOARD */}
        {!loading && tab==="dashboard" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16, marginBottom:28 }}>
              {[
                {label:"Total Artisans", value:workers.length, icon:"👷", color:"#2D7DD2"},
                {label:"Premium", value:premium, icon:"⭐", color:"#E07B39"},
                {label:"Basique", value:basic, icon:"📋", color:"#555"},
                {label:"Travaux postés", value:jobs.length, icon:"🔧", color:"#3BB273"},
                {label:"Revenus estimés", value:`${revenue.toLocaleString()} FCFA`, icon:"💰", color:"#F15BB5"},
                {label:"Villes actives", value:4, icon:"📍", color:"#9B5DE5"},
              ].map((stat,i) => (
                <div key={i} style={{ background:"#fff", borderRadius:16, padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${stat.color}` }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{stat.icon}</div>
                  <div style={{ fontWeight:800, fontSize:22, color:"#1a1a1a", marginBottom:4 }}>{stat.value}</div>
                  <div style={{ fontSize:12, color:"#888" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent signups */}
            <div style={{ background:"#fff", borderRadius:16, padding:"20px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16, color:"#1a1a1a" }}>🆕 Dernières inscriptions</div>
              {workers.slice(0,5).map(w => (
                <div key={w.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f5f5f5" }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:categoryColors[w.category]||"#888", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:12 }}>
                      {w.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>{w.name}</div>
                      <div style={{ fontSize:11, color:"#aaa" }}>{categoryLabels[w.category]} · {cityLabels[w.city]}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ background:w.plan==="premium"?"#F4A26122":"#f5f5f5", color:w.plan==="premium"?"#E07B39":"#888", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{w.plan==="premium"?"⭐ Premium":"Basique"}</span>
                    <span style={{ background:w.verified?"#e8f5e9":"#fee2e2", color:w.verified?"#2a8a50":"#cc2200", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{w.verified?"✅ Vérifié":"⏳ En attente"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKERS */}
        {!loading && tab==="workers" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {workers.map(w => (
              <div key={w.id} style={{ background:"#fff", borderRadius:16, padding:"18px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${categoryColors[w.category]||"#888"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
                  <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                    <div style={{ width:46, height:46, borderRadius:"50%", background:categoryColors[w.category]||"#888", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14, flexShrink:0 }}>
                      {w.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:"#1a1a1a", marginBottom:2 }}>{w.name}</div>
                      <div style={{ fontSize:12, color:"#888" }}>📞 {w.phone} · 📍 {w.zone}, {cityLabels[w.city]}</div>
                      <div style={{ fontSize:12, color:"#888" }}>🔧 {categoryLabels[w.category]} · 📅 {new Date(w.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ background:w.plan==="premium"?"#F4A26122":"#f5f5f5", color:w.plan==="premium"?"#E07B39":"#888", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{w.plan==="premium"?"⭐ Premium":"Basique"}</span>
                    <span style={{ background:w.verified?"#e8f5e9":"#fee2e2", color:w.verified?"#2a8a50":"#cc2200", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{w.verified?"✅ Vérifié":"⏳ En attente"}</span>
                    <span style={{ background:w.available?"#e8f5e9":"#fee2e2", color:w.available?"#2a8a50":"#cc2200", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{w.available?"🟢 Dispo":"🔴 Occupé"}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
                  {!w.verified && (
                    <button onClick={() => updateWorker(w.id, {verified:true})}
                      style={{ background:"#e8f5e9", color:"#2a8a50", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                      ✅ Vérifier
                    </button>
                  )}
                  {w.plan!=="premium" && (
                    <button onClick={() => updateWorker(w.id, {plan:"premium"})}
                      style={{ background:"#F4A26122", color:"#E07B39", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                      ⭐ Passer Premium
                    </button>
                  )}
                  {w.plan==="premium" && (
                    <button onClick={() => updateWorker(w.id, {plan:"basic"})}
                      style={{ background:"#f5f5f5", color:"#888", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                      ↓ Rétrograder Basique
                    </button>
                  )}
                  <button onClick={() => updateWorker(w.id, {available:!w.available})}
                    style={{ background:"#f0f0f0", color:"#555", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                    🔄 Toggle Dispo
                  </button>
                  <a href={`https://wa.me/237${w.phone}`} target="_blank" rel="noreferrer"
                    style={{ background:"#25D36622", color:"#25D366", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, textDecoration:"none" }}>
                    💬 WhatsApp
                  </a>
                  <button onClick={() => deleteWorker(w.id)}
                    style={{ background:"#fee2e2", color:"#cc2200", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
            {workers.length===0 && <div style={{ textAlign:"center", padding:"40px", color:"#aaa" }}>Aucun artisan inscrit</div>}
          </div>
        )}

        {/* REQUESTS */}
        {!loading && tab==="requests" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {(requests||[]).map(r => (
              <div key={r.id} style={{ background:"#fff", borderRadius:16, padding:"18px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${r.status==="pending"?"#F4A261":r.status==="accepted"?"#22c55e":"#f87171"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>👤 {r.client_name}</div>
                  <span style={{ background:r.status==="pending"?"#fff8f0":r.status==="accepted"?"#dcfce7":"#fee2e2", color:r.status==="pending"?"#E07B39":r.status==="accepted"?"#16a34a":"#cc2200", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                    {r.status==="pending"?"⏳ En attente":r.status==="accepted"?"✅ Accepté":"❌ Refusé"}
                  </span>
                </div>
                <div style={{ fontSize:12, color:"#555", marginBottom:6 }}>📞 {r.client_phone}</div>
                <div style={{ fontSize:13, color:"#444", lineHeight:1.5, marginBottom:8 }}>{r.description}</div>
                {r.preferred_date && <div style={{ fontSize:11, color:"#aaa", marginBottom:8 }}>📅 {r.preferred_date}</div>}
                <div style={{ fontSize:11, color:"#bbb" }}>{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))}
            {(!requests||requests.length===0) && <div style={{ textAlign:"center", padding:"40px", color:"#aaa" }}>Aucune demande</div>}
          </div>
        )}

        {/* JOBS */}
        {!loading && tab==="jobs" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {jobs.map(j => (
              <div key={j.id} style={{ background:"#fff", borderRadius:16, padding:"18px 20px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <span style={{ background:`${categoryColors[j.category]||"#888"}22`, color:categoryColors[j.category]||"#888", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>
                      {j.category==="plumber"?"🔧":j.category==="electrician"?"💡":j.category==="cleaner"?"🧹":j.category==="catering"?"🍽️":j.category==="mechanic"?"🔩":"⚙️"} {categoryLabels[j.category]}
                    </span>
                    <span style={{ background:"#f5f5f5", color:"#888", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>📍 {cityLabels[j.city]}</span>
                  </div>
                  <span style={{ fontSize:11, color:"#bbb" }}>{new Date(j.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ fontSize:13, color:"#444", lineHeight:1.6, marginBottom:12 }}>{j.description}</div>
                <div style={{ display:"flex", gap:8 }}>
                  {j.client_phone && (
                    <a href={`https://wa.me/237${j.client_phone}`} target="_blank" rel="noreferrer"
                      style={{ background:"#25D36622", color:"#25D366", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, textDecoration:"none" }}>
                      💬 Contacter client
                    </a>
                  )}
                  <button onClick={() => deleteJob(j.id)}
                    style={{ background:"#fee2e2", color:"#cc2200", border:"none", borderRadius:10, padding:"7px 14px", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
            {jobs.length===0 && <div style={{ textAlign:"center", padding:"40px", color:"#aaa" }}>Aucun travail posté</div>}
          </div>
        )}
      </div>
    </div>
  );
}
