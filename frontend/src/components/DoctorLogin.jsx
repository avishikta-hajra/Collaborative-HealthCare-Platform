import { useState } from "react";

export default function DoctorLogin() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState("login"); // login | register

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#050D1A", display: "flex", alignItems: "stretch", overflow: "hidden" }}>
      <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes fadeIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .input-field { width:100%; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px 16px; color:#E8F0FE; font-family:inherit; font-size:15px; outline:none; transition:all 0.2s; }
    .input-field::placeholder { color:#4A6080; }
    .input-field:focus { border-color:#0099FF; background:rgba(0,153,255,0.04); box-shadow:0 0 0 4px rgba(0,153,255,0.06); }
    .btn-main { width:100%; background:linear-gradient(135deg,#0099FF,#00C9A7); border:none; color:#fff; font-family:inherit; font-weight:700; font-size:16px; padding:15px; border-radius:12px; cursor:pointer; transition:all 0.25s; letter-spacing:0.01em; }
    .btn-main:hover { transform:translateY(-2px); box-shadow:0 10px 35px rgba(0,153,255,0.25); }
    .btn-main:disabled { opacity:0.7; transform:none; }
    .social-btn { flex:1; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); color:#E8F0FE; font-family:inherit; font-weight:500; font-size:14px; padding:12px; border-radius:10px; cursor:pointer; transition:all 0.2s; }
    .social-btn:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.2); }
    .tab-btn { flex:1; padding:"12px 0"; background:transparent; border:none; color:#4A6080; font-family:inherit; font-weight:600; font-size:15px; cursor:pointer; transition:all 0.2s; padding:12px 0; border-bottom:2px solid transparent; }
    .tab-btn.active { color:#0099FF; border-bottom-color:#0099FF; }
    .feature-item { display:flex; align-items:flex-start; gap:14px; padding:18px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
    .feature-item:last-child { border-bottom:none; }
    `}</style>

      {/* LEFT PANEL */}
      <div style={{ flex: "0 0 45%", background: "linear-gradient(160deg, #071628 0%, #0A2440 50%, #071628 100%)", padding: "60px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,153,255,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,201,167,0.07), transparent 70%)", pointerEvents: "none" }} />

        <div>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 64 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#0099FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
            </div>
            <span style={{ color: "#E8F0FE", fontWeight: 700, fontSize: 18 }}>HealthBridge</span>
          </a>

          <div style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-block", background: "rgba(0,153,255,0.12)", color: "#0099FF", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(0,153,255,0.25)", marginBottom: 20 }}>DOCTOR PORTAL</span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,3vw,40px)", color: "#E8F0FE", lineHeight: 1.15, marginBottom: 16 }}>Your practice,<br /><span style={{ fontStyle: "italic", background: "linear-gradient(135deg,#0099FF,#00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>efficiently managed.</span></h2>
            <p style={{ color: "#6A84A0", fontSize: 15, lineHeight: 1.7, maxWidth: 360 }}>Manage appointments, conduct secure video consultations, and access your patients' records with ease.</p>
          </div>
        </div>

        <div>
          {[{ icon: "🩺", title: "Manage Appointments", desc: "View and modify your upcoming schedule." }, { icon: "📹", title: "Secure Video Calls", desc: "Encrypted consultations with patients." }, { icon: "💊", title: "E-Prescriptions", desc: "Prescribe and deliver medications digitally." }].map((f, i) => (
            <div key={i} className="feature-item">
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(0,153,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#E8F0FE", marginBottom: 3 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#6A84A0" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(0,153,255,0.06)", borderRadius: 14, border: "1px solid rgba(0,153,255,0.15)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#0099FF,#00C9A7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👍</div>
            <div>
              <div style={{ color: "#E8F0FE", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>"Trusted by doctors nationwide."</div>
              <div style={{ color: "#6A84A0", fontSize: 12 }}>Dr. Anil K., cardiologist</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px clamp(24px,5vw,72px)", animation: "fadeIn 0.5s ease" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#E8F0FE", marginBottom: 8 }}>Welcome back</h1>
            <p style={{ color: "#6A84A0", fontSize: 15 }}>Sign in to your doctor account</p>
          </div>

          {/* TABS */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 32, gap: 0 }}>
            <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
            <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Create Account</button>
          </div>

          {/* Social */}
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            <button className="social-btn">
              <span style={{ marginRight: 8 }}>G</span> Google
            </button>
            <button className="social-btn">
              <span style={{ marginRight: 8 }}>𝑓</span> Facebook
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "#4A6080", fontSize: 13 }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {tab === "register" && (
              <div>
                <label style={{ display: "block", color: "#94A3C0", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Full Name</label>
                <input className="input-field" placeholder="Dr. Name" />
              </div>
            )}
            <div>
              <label style={{ display: "block", color: "#94A3C0", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Email Address</label>
              <input className="input-field" type="email" placeholder="you@clinic.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ color: "#94A3C0", fontSize: 13, fontWeight: 500 }}>Password</label>
                {tab === "login" && <a href="#" style={{ color: "#0099FF", fontSize: 13, textDecoration: "none" }}>Forgot password?</a>}
              </div>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 48 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#4A6080", cursor: "pointer", fontSize: 18 }}>
                  {showPass ? "👁" : "🔒"}
                </button>
              </div>
            </div>
            {tab === "register" && (
              <div>
                <label style={{ display: "block", color: "#94A3C0", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Phone Number</label>
                <input className="input-field" placeholder="+91 98765 43210" />
              </div>
            )}
            {tab === "login" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="remember" style={{ accentColor: "#0099FF", width: 16, height: 16 }} checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} />
                <label htmlFor="remember" style={{ color: "#6A84A0", fontSize: 14, cursor: "pointer" }}>Remember me for 30 days</label>
              </div>
            )}
          </div>

          <button className="btn-main" style={{ marginTop: 28 }} onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                Signing in...
              </span>
            ) : tab === "login" ? "Sign In to Doctor Portal →" : "Create Doctor Account →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 24, color: "#4A6080", fontSize: 13 }}>
            {tab === "login" ? "Don't have an account? " : "Already registered? "}
            <span onClick={() => setTab(tab === "login" ? "register" : "login")} style={{ color: "#0099FF", cursor: "pointer", fontWeight: 600 }}>
              {tab === "login" ? "Create one free" : "Sign in"}
            </span>
          </p>

          <div style={{ marginTop: 40, padding: "16px", background: "rgba(255,107,107,0.06)", borderRadius: 12, border: "1px solid rgba(255,107,107,0.2)", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🚨</span>
            <div>
              <div style={{ color: "#FF6B6B", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Medical Emergency?</div>
              <div style={{ color: "#6A84A0", fontSize: 12 }}>Call <strong style={{ color: "#FF6B6B" }}>112</strong> or use our emergency feature</div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: 28, color: "#2D4060", fontSize: 12 }}>
            Not a doctor? <a href="/UserLogin" style={{ color: "#00C9A7", textDecoration: "none" }}>Patient Login</a> · <a href="/AdminLogin" style={{ color: "#845EF7", textDecoration: "none" }}>Admin Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}