import React, { useState } from 'react';
import { Loader2, Lock, User, LogOut, LayoutDashboard, GraduationCap, BookOpen, KeyRound, Eye, EyeOff, Mail, Send } from 'lucide-react';

// --- TYPES & CIRCULAR CARD (Same as before - No Change) ---
interface Marks { assg: string; int1: string; int2: string; }
interface Subject { name: string; attendance: string; marks: Marks; }
interface StudentData { success: boolean; rollNo: string; name: string; subjects: Subject[]; }

const CircularCard = ({ title, value, marks, colorClass, strokeColor }: any) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const numValue = parseFloat(value?.replace('%', '') || '0');
  const offset = circumference - (numValue / 100) * circumference;
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-between hover:shadow-md transition-all relative overflow-hidden group h-full">
      <h3 className="font-bold text-gray-700 text-lg mb-4 text-center line-clamp-1">{title}</h3>
      <div className="relative mb-6">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-gray-100" />
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={`${strokeColor} transition-all duration-1000 ease-out`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center"><span className={`text-2xl font-bold ${colorClass}`}>{value}</span></div>
      </div>
      {marks && (<div className="w-full grid grid-cols-3 gap-2 mt-auto"><div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100"><div className="text-[10px] text-gray-400 font-bold tracking-wider">ASSG</div><div className="text-xs font-bold text-gray-700 mt-1">{marks.assg || '-'}</div></div><div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100"><div className="text-[10px] text-gray-400 font-bold tracking-wider">INT 1</div><div className="text-xs font-bold text-gray-700 mt-1">{marks.int1 || '-'}</div></div><div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100"><div className="text-[10px] text-gray-400 font-bold tracking-wider">INT 2</div><div className="text-xs font-bold text-gray-700 mt-1">{marks.int2 || '-'}</div></div></div>)}
    </div>
  );
};

// --- MAIN COMPONENT ---
const Attendance = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [roll, setRoll] = useState('');
  const [pass, setPass] = useState('');
  const [email, setEmail] = useState(''); // New State for Email
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [showPass, setShowPass] = useState(false);

  // 👇 PASTE NEW URL HERE
  const API_URL = "https://script.google.com/macros/s/AKfycbwq7PAy_JwkKde75mxED2zYdV2KB_l5l-afh6J4zG4j_qV2BDFbklY9RpGo_PF6YVF4uQ/exec"; 

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (mode === 'register' && pass !== confirmPass) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Build URL based on mode
      let url = `${API_URL}?action=${mode}&roll=${roll}`;
      if (mode === 'login') url += `&pass=${pass}`;
      if (mode === 'register') url += `&pass=${pass}&email=${email}`; // Send Email too
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (mode === 'login') {
          setStudent(data);
          setIsLoggedIn(true);
        } else {
          setSuccessMsg(data.message);
          if(mode === 'register') setMode('login'); // Go to login after register
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network Error. Check internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const getColors = (val: string) => {
    const num = parseFloat(val?.replace('%', '') || '0');
    if (num >= 75) return { text: 'text-emerald-600', stroke: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (num >= 60) return { text: 'text-amber-600', stroke: 'text-amber-500', bg: 'bg-amber-50' };
    return { text: 'text-rose-600', stroke: 'text-rose-500', bg: 'bg-rose-50' };
  };

  // --- UI SCREENS ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-purple-200/40 rounded-full blur-3xl"></div>

        <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/60 z-10 border border-white">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
             <GraduationCap className="text-blue-600 w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Student Portal</h2>
          <p className="text-gray-400 text-sm mb-6 text-center">
            {mode === 'forgot' ? 'Recover Password' : 'Manage your academic profile'}
          </p>

          {/* TABS */}
          {mode !== 'forgot' && (
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button onClick={() => {setMode('login'); setError(''); setSuccessMsg('')}} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Login</button>
              <button onClick={() => {setMode('register'); setError(''); setSuccessMsg('')}} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Register</button>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleAuth}>
            
            {/* ROLL NUMBER (Always visible) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Roll Number</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
                <input type="number" value={roll} onChange={(e)=>setRoll(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="e.g. 141730" />
              </div>
            </div>

            {/* EMAIL (Only for Register) */}
            {mode === 'register' && (
              <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="student@college.edu" />
                </div>
              </div>
            )}

            {/* PASSWORD (Hidden in Forgot Mode) */}
            {mode !== 'forgot' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
                  <input type={showPass ? "text" : "password"} value={pass} onChange={(e)=>setPass(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-12 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors">
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* CONFIRM PASSWORD (Only for Register) */}
            {mode === 'register' && (
              <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Confirm Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
                  <input type="password" value={confirmPass} onChange={(e)=>setConfirmPass(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="Re-enter password" />
                </div>
              </div>
            )}

            {/* FORGOT LINK */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => {setMode('forgot'); setError(''); setSuccessMsg('')}} className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            {/* ERROR / SUCCESS MESSAGES */}
            {error && <div className="text-rose-500 text-sm font-medium text-center bg-rose-50 py-2.5 rounded-xl border border-rose-100">{error}</div>}
            {successMsg && <div className="text-emerald-600 text-sm font-medium text-center bg-emerald-50 py-2.5 rounded-xl border border-emerald-100">{successMsg}</div>}
            
            {/* ACTION BUTTON */}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] mt-2 disabled:opacity-70 flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 
                (mode === 'login' ? "Access Dashboard" : 
                 mode === 'register' ? "Create Account" : 
                 <>Send Password <Send className="w-4 h-4" /></>
                )
              }
            </button>

            {/* BACK TO LOGIN (Only for Forgot) */}
            {mode === 'forgot' && (
               <button type="button" onClick={() => setMode('login')} className="w-full text-gray-400 font-bold text-sm py-2 hover:text-gray-600 transition-colors">
                 Back to Login
               </button>
            )}

          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (NO CHANGES) ---
  const totalAtt = student?.subjects.reduce((acc, curr) => acc + parseFloat(curr.attendance || '0'), 0) || 0;
  const avgAtt = (totalAtt / (student?.subjects.length || 1)).toFixed(1) + '%';
  const overallColors = getColors(avgAtt);

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-10 font-sans">
      <nav className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2"><div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard className="text-white w-5 h-5"/></div><span className="font-bold text-gray-800 text-lg">EduPortal</span></div>
        <button onClick={() => setIsLoggedIn(false)} className="bg-gray-100 hover:bg-red-50 hover:text-red-500 p-2.5 rounded-xl text-gray-500 transition-colors"><LogOut className="w-5 h-5" /></button>
      </nav>
      <div className="max-w-6xl mx-auto px-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10"><h1 className="text-3xl font-bold text-gray-900 mb-6 px-2">Hello, {student?.name} 👋</h1><div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group"><div className="relative z-10 text-center md:text-left mb-6 md:mb-0"><p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Overall Performance</p><h2 className="text-5xl font-black text-gray-800 tracking-tight">{avgAtt}</h2><div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold ${overallColors.bg} ${overallColors.text}`}>{parseFloat(avgAtt) < 75 ? "⚠️ Low Attendance" : "✅ Excellent Standing"}</div></div><div className="relative z-10 scale-110"><CircularCard title="" value={avgAtt} colorClass={overallColors.text} strokeColor={overallColors.stroke} bgClass="" /></div><div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-60 -z-0"></div></div></div>
        <div className="flex items-center gap-2 mb-6 px-2"><BookOpen className="w-5 h-5 text-blue-600" /><h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subject Wise Details</h3></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{student?.subjects.map((sub, idx) => {const style = getColors(sub.attendance); return (<CircularCard key={idx} title={sub.name} value={sub.attendance} marks={sub.marks} colorClass={style.text} strokeColor={style.stroke} bgClass={style.bg} />);})}</div>
      </div>
    </div>
  );
};
export default Attendance;
