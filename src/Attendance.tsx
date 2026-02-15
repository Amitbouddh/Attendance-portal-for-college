import React, { useState } from 'react';
import { Loader2, Lock, LogOut, LayoutDashboard, GraduationCap, BookOpen, User } from 'lucide-react';

// --- TYPES ---
interface Marks {
  assg: string;
  int1: string;
  int2: string;
}

interface Subject {
  name: string;
  attendance: string;
  marks: Marks;
}

interface StudentData {
  found: boolean;
  rollNo: string;
  name: string;
  subjects: Subject[];
}

// --- HELPER COMPONENT: CIRCULAR PROGRESS CARD ---
const CircularCard = ({ title, value, marks, colorClass, strokeColor }: any) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const numValue = parseFloat(value.replace('%', ''));
  const offset = circumference - (numValue / 100) * circumference;

  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-between hover:shadow-md transition-all relative overflow-hidden group h-full">
      
      {/* Subject Title */}
      <h3 className="font-bold text-gray-700 text-lg mb-4 text-center line-clamp-1">{title}</h3>

      {/* Circle Chart */}
      <div className="relative mb-6">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-100"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${strokeColor} transition-all duration-1000 ease-out`}
          />
        </svg>
        
        {/* Percentage Text inside Circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{value}</span>
        </div>
      </div>

      {/* Marks Section (Bottom Pills) */}
      {marks && (
        <div className="w-full grid grid-cols-3 gap-2 mt-auto">
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">ASSG</div>
            <div className="text-xs font-bold text-gray-700 mt-1">{marks.assg || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">INT 1</div>
            <div className="text-xs font-bold text-gray-700 mt-1">{marks.int1 || '-'}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
            <div className="text-[10px] text-gray-400 font-bold tracking-wider">INT 2</div>
            <div className="text-xs font-bold text-gray-700 mt-1">{marks.int2 || '-'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const Attendance = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roll, setRoll] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);

  // 👇 PASTE YOUR GOOGLE SCRIPT WEB APP URL HERE
  const API_URL = "https://script.google.com/macros/s/AKfycbwvEBlcI8BgacG9zx_bjzGZzF-w_t4OkM4dG_cXBDS4liWVu3gaCWib50hAR4WSLFdnGw/exec"; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?roll=${roll}&pass=${pass}`);
      const data = await response.json();

      if (data.error || !data.found) {
        setError("Invalid Roll Number or Password.");
      } else {
        setStudent(data);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError("Network Error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getColors = (val: string) => {
    const num = parseFloat(val.replace('%', ''));
    if (num >= 75) return { text: 'text-emerald-600', stroke: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (num >= 60) return { text: 'text-amber-600', stroke: 'text-amber-500', bg: 'bg-amber-50' };
    return { text: 'text-rose-600', stroke: 'text-rose-500', bg: 'bg-rose-50' };
  };

  // --- LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-purple-200/40 rounded-full blur-3xl"></div>

        <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/60 z-10 border border-white">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
             <GraduationCap className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Student Portal</h2>
          <p className="text-gray-400 text-sm mb-8 text-center">Enter credentials to view dashboard</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Roll Number</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
                <input type="number" value={roll} onChange={(e)=>setRoll(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="141730" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-300" />
                <input type="password" value={pass} onChange={(e)=>setPass(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300" placeholder="••••••" />
              </div>
            </div>
            {error && <div className="text-rose-500 text-sm font-medium text-center bg-rose-50 py-2.5 rounded-xl border border-rose-100">{error}</div>}
            
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98] mt-2 disabled:opacity-70 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ---
  
  // Logic to calculate overall attendance for the Header Card
  const totalAtt = student?.subjects.reduce((acc, curr) => acc + parseFloat(curr.attendance), 0) || 0;
  const avgAtt = (totalAtt / (student?.subjects.length || 1)).toFixed(1) + '%';
  const overallColors = getColors(avgAtt);

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-10 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 p-2 rounded-lg"><LayoutDashboard className="text-white w-5 h-5"/></div>
           <span className="font-bold text-gray-800 text-lg">EduPortal</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="bg-gray-100 hover:bg-red-50 hover:text-red-500 p-2.5 rounded-xl text-gray-500 transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Welcome Section */}
        <div className="mb-10">
           <h1 className="text-3xl font-bold text-gray-900 mb-6 px-2">Hello, {student?.name} 👋</h1>
           
           {/* BIG OVERALL SUMMARY CARD */}
           <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
              <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Overall Performance</p>
                <h2 className="text-5xl font-black text-gray-800 tracking-tight">{avgAtt}</h2>
                <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-bold ${overallColors.bg} ${overallColors.text}`}>
                  {parseFloat(avgAtt) < 75 ? "⚠️ Low Attendance" : "✅ Excellent Standing"}
                </div>
              </div>
              
              {/* Decorative Circle for Overall */}
              <div className="relative z-10 scale-110">
                <CircularCard title="" value={avgAtt} colorClass={overallColors.text} strokeColor={overallColors.stroke} bgClass="" />
              </div>

              {/* Background Decoration */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-60 -z-0"></div>
           </div>
        </div>

        {/* Section Divider */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subject Wise Details</h3>
        </div>

        {/* GRID OF CIRCULAR CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {student?.subjects.map((sub, idx) => {
            const style = getColors(sub.attendance);
            return (
              <CircularCard 
                key={idx}
                title={sub.name}
                value={sub.attendance}
                marks={sub.marks}
                colorClass={style.text}
                strokeColor={style.stroke}
                bgClass={style.bg}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Attendance;