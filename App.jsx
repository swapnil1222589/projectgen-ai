import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Info, 
  Copy, 
  Download, 
  Save, 
  Trash2, 
  Search, 
  Github, 
  Youtube, 
  Code2, 
  Rocket, 
  FileText,
  ChevronRight,
  Sun,
  Moon,
  CheckCircle2,
  X
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';

/**
 * PROJECTGEN AI - FULL STACK ARCHITECTURE
 * 1. UI: React + Tailwind CSS (SaaS Blue Gradient)
 * 2. AI: Gemini 2.5 Flash (Structured JSON)
 * 3. DB: Firebase Firestore (Cloud Storage)
 * 4. AUTH: Anonymous/Custom Session Persistence
 */

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'projectgen-ai-v1';
const apiKey = ""; // API Key handled by environment

const SYSTEM_PROMPT = `You are a Senior AI Product Architect. Convert the user's project idea into a professional documentation package.
Respond ONLY in valid JSON:
{
  "projectName": "Name",
  "problemStatement": "Text",
  "solution": "Text",
  "features": ["Item"],
  "mvpFeatures": ["Item"],
  "techStack": { "frontend": "S", "backend": "S", "database": "S", "tools": ["T"] },
  "resumeDescription": "Bulleted STAR points",
  "githubReadme": "# Markdown",
  "elevatorPitch": "30s pitch",
  "demoVideoScript": "Script"
}`;

// --- UI Components ---

const LoadingOverlay = ({ message }) => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white p-6 text-center">
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-400 animate-pulse" />
    </div>
    <h3 className="text-xl font-bold mb-2">Architecting Documentation</h3>
    <p className="text-slate-400 max-w-xs animate-pulse text-sm">{message}</p>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const NavButton = ({ active, icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600'}`}
  >
    <Icon size={20} />
    {label && <span>{label}</span>}
  </button>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generation State
  const [ideaInput, setIdeaInput] = useState('');
  const [currentProject, setCurrentProject] = useState(null);

  // Auth Lifecycle
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth:", err); }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  // Sync Projects
  useEffect(() => {
    if (!user) return;
    const q = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }, (err) => console.error(err));
  }, [user]);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const generateProject = async () => {
    if (!ideaInput.trim()) return notify("Please enter an idea.");
    setIsGenerating(true);
    
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: ideaInput }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await res.json();
      const content = JSON.parse(data.candidates[0].content.parts[0].text);
      setCurrentProject(content);
      setActiveTab('generator');
    } catch (err) {
      notify("Generation failed. Check your API settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToCloud = async () => {
    if (!currentProject || !user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), {
        ...currentProject,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      notify("Roadmap saved to History!");
    } catch (err) { notify("Save failed."); }
  };

  const copy = (txt, lbl) => {
    const el = document.createElement('textarea');
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    notify(`${lbl} copied!`);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(currentProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.projectName.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
        
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col z-40">
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Rocket className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight dark:text-white">ProjectGen</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <NavButton active={activeTab === 'dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
            <NavButton active={activeTab === 'generator'} icon={PlusCircle} label="New Project" onClick={() => setActiveTab('generator')} />
            <NavButton active={activeTab === 'history'} icon={History} label="History" onClick={() => setActiveTab('history')} />
            <NavButton active={activeTab === 'about'} icon={Info} label="About" onClick={() => setActiveTab('about')} />
          </nav>
          <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <span className="text-sm font-bold uppercase tracking-wider">{isDarkMode ? 'Dark' : 'Light'}</span>
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:ml-64 p-6 md:p-12 min-h-screen">
          {activeTab === 'dashboard' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header>
                <h2 className="text-4xl font-black tracking-tight">Project Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">Convert your vision into technical reality.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-blue-500">
                  <FileText className="text-blue-500 mb-2" size={32} />
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Generated</p>
                  <h3 className="text-3xl font-black">{projects.length}</h3>
                </Card>
                <Card className="p-6 border-l-4 border-l-purple-500">
                  <Code2 className="text-purple-500 mb-2" size={32} />
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">AI Status</p>
                  <h3 className="text-3xl font-black">Connected</h3>
                </Card>
                <Card className="p-6 border-l-4 border-l-emerald-500">
                  <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Sync State</p>
                  <h3 className="text-3xl font-black">Cloud Live</h3>
                </Card>
              </div>

              <Card className="p-10 bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden border-none shadow-2xl">
                <div className="relative z-10 max-w-lg space-y-6">
                  <h3 className="text-3xl font-black leading-tight">Fast-track your next development.</h3>
                  <p className="text-blue-100">Describe your project and we'll generate everything from the GitHub README to the Resume description.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="e.g. A crypto dashboard for tracking NFT whales..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder:text-blue-200"
                      value={ideaInput}
                      onChange={(e) => setIdeaInput(e.target.value)}
                    />
                    <button onClick={generateProject} className="px-8 py-4 bg-white text-blue-700 font-black rounded-xl hover:bg-blue-50 shadow-xl transition-all active:scale-95">
                      Generate
                    </button>
                  </div>
                </div>
                <Code2 className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12" />
              </Card>
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black tracking-tight">{currentProject ? currentProject.projectName : "New Roadmap"}</h2>
                  <p className="text-slate-500 font-medium">Architecture & Documentation</p>
                </div>
                {currentProject && (
                  <div className="flex gap-2">
                    <button onClick={saveToCloud} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"><Save size={18} /> Save</button>
                    <button onClick={download} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-lg hover:bg-slate-300 transition-all"><Download size={18} /> Export</button>
                  </div>
                )}
              </div>

              {!currentProject ? (
                <Card className="p-16 text-center border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50">
                  <Rocket className="mx-auto text-blue-500 mb-6 animate-bounce" size={64} />
                  <h3 className="text-2xl font-bold mb-4">Ready to architect?</h3>
                  <textarea 
                    className="w-full max-w-lg mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-lg focus:ring-4 focus:ring-blue-500/10 focus:outline-none mb-6 h-32"
                    placeholder="Briefly describe your project idea..."
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                  />
                  <button onClick={generateProject} className="block mx-auto px-12 py-4 bg-blue-600 text-white font-black text-lg rounded-2xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all">Start Generating</button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
                    <Card className="p-8">
                      <h4 className="text-lg font-black mb-4 flex items-center gap-2"><FileText className="text-blue-500" size={20} /> Project Summary</h4>
                      <div className="space-y-4">
                        <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Problem</label>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentProject.problemStatement}</p>
                        </div>
                        <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                          <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 block mb-1">Solution</label>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{currentProject.solution}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-0 overflow-hidden">
                      <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                        <h4 className="text-lg font-black flex items-center gap-2"><Github size={20} /> README.md</h4>
                        <button onClick={() => copy(currentProject.githubReadme, "Markdown")} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-blue-500 transition-all"><Copy size={18} /></button>
                      </div>
                      <pre className="bg-slate-900 text-slate-300 p-8 text-sm overflow-x-auto max-h-[400px] font-mono leading-relaxed">
                        {currentProject.githubReadme}
                      </pre>
                    </Card>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 bg-slate-900 text-white border-none shadow-xl">
                      <h4 className="text-lg font-black mb-4 flex items-center gap-2"><Code2 className="text-blue-400" size={20} /> Tech Stack</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Frontend</span><span className="font-bold text-blue-400">{currentProject.techStack.frontend}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Backend</span><span className="font-bold text-indigo-400">{currentProject.techStack.backend}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Database</span><span className="font-bold text-emerald-400">{currentProject.techStack.database}</span></div>
                      </div>
                    </Card>

                    <Card className="p-8">
                      <h4 className="text-lg font-black mb-4">MVP Scope</h4>
                      <ul className="space-y-3">
                        {currentProject.mvpFeatures.map((f, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-8 bg-blue-600 text-white border-none shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-100">Resume Impact</h4>
                        <button onClick={() => copy(currentProject.resumeDescription, "Resume bullets")}><Copy size={16} /></button>
                      </div>
                      <p className="text-sm italic leading-relaxed text-blue-50 opacity-90">{currentProject.resumeDescription}</p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl font-black tracking-tight">Project Vault</h2>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="Search roadmaps..." 
                    className="pl-12 pr-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.filter(p => p.projectName.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                    <Card key={p.id} className="group overflow-hidden flex flex-col hover:border-blue-500/50">
                      <div className="p-6 flex-1 space-y-3">
                        <div className="flex justify-between">
                          <h5 className="font-black text-xl group-hover:text-blue-600 transition-colors">{p.projectName}</h5>
                          <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', p.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">{p.problemStatement}</p>
                        <div className="flex gap-2 pt-2">
                          <span className="text-[10px] font-black uppercase bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded">{p.techStack.frontend}</span>
                        </div>
                      </div>
                      <button onClick={() => { setCurrentProject(p); setActiveTab('generator'); }} className="w-full py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 text-sm font-bold text-blue-600 flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                        Open Document <ChevronRight size={16} />
                      </button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 opacity-20"><History size={80} className="mx-auto" /><p className="mt-4 font-bold">No history found</p></div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-3xl mx-auto space-y-12 py-10 animate-in fade-in text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-12">
                <Rocket size={48} className="text-white -rotate-12" />
              </div>
              <h2 className="text-5xl font-black tracking-tight">Built for Architects</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                ProjectGen AI is a developer-first tool built to eliminate the 'blank page' syndrome. We transform vague ideas into high-fidelity technical roadmap documentation instantly.
              </p>
              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                  <h6 className="font-bold text-blue-600 mb-2">Rapid Prototyping</h6>
                  <p className="text-sm text-slate-500">Generate tech stacks and feature lists to validate ideas faster than your competitors.</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                  <h6 className="font-bold text-blue-600 mb-2">Career Ready</h6>
                  <p className="text-sm text-slate-500">Get resume-ready descriptions that translate your technical work into professional value.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {isGenerating && <LoadingOverlay message="Our AI Architect is drafting your comprehensive project roadmap..." />}
        {notification && (
          <div className="fixed bottom-10 right-10 bg-slate-900 dark:bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-right-10 border border-white/10">
            <CheckCircle2 size={20} />
            <span className="font-bold">{notification}</span>
          </div>
        )}

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-50">
          <NavButton active={activeTab === 'dashboard'} icon={LayoutDashboard} onClick={() => setActiveTab('dashboard')} />
          <NavButton active={activeTab === 'generator'} icon={PlusCircle} onClick={() => setActiveTab('generator')} />
          <NavButton active={activeTab === 'history'} icon={History} onClick={() => setActiveTab('history')} />
        </nav>
      </div>
    </div>
  );
}