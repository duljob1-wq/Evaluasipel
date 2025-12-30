import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateTraining } from './pages/CreateTraining';
import { RespondentView } from './pages/RespondentView';
import { ResultsView } from './pages/ResultsView';
import { Shield, ArrowRight, Play, QrCode, Hash, Activity } from 'lucide-react';
import { saveTraining, getTrainingByCode } from './services/storageService';
import { Training } from './types';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  return isAdmin ? <>{children}</> : <Navigate to="/admin" replace />;
};

// Landing Page (Dual Portal)
const LandingPage = () => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = inputCode.trim();
    
    if (!code) {
      setError('Mohon masukkan Kode atau Token.');
      return;
    }

    // SCENARIO 1: Short Code (5-6 chars)
    if (code.length <= 6) {
        const training = getTrainingByCode(code);
        if (training) {
            navigate(`/evaluate/${training.id}`);
        } else {
            setError('Kode tidak ditemukan di perangkat ini. Jika Anda menggunakan perangkat berbeda dengan Admin, mohon gunakan Link Lengkap.');
        }
        return;
    }

    // SCENARIO 2: Full Long Token (Base64 JSON)
    try {
      // Decode the token (Base64 -> JSON)
      const decodedJson = decodeURIComponent(escape(atob(code)));
      const trainingData: Training = JSON.parse(decodedJson);

      if (trainingData && trainingData.id) {
        // Save to local storage so RespondentView can access it
        saveTraining(trainingData);
        // Navigate
        navigate(`/evaluate/${trainingData.id}`);
      } else {
        setError('Token data rusak atau tidak valid.');
      }
    } catch (err) {
      console.error(err);
      setError('Format tidak dikenali. Pastikan kode disalin dengan benar.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 py-3 px-6 md:px-12 flex justify-between items-center relative z-20">
        
        {/* Left Side: Brand Stack */}
        <div className="flex items-center gap-3">
            {/* SIMEP Icon */}
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-indigo-100 shadow-lg">S</div>
            
            {/* Text Container */}
            <div className="flex flex-col justify-center">
                <span className="font-extrabold text-slate-800 text-lg leading-none tracking-tight">SIMEP</span>
            </div>
        </div>
        
        {/* Right Side: Login */}
        <div className="flex items-center gap-6">
            <Link to="/admin" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition flex items-center gap-2">
              <Shield size={16} /> <span className="hidden sm:inline">Admin Login</span>
            </Link>
        </div>
      </nav>

      {/* LOGO UPT - Positioned at absolute Top Left of Body, independent of center container */}
      <div className="w-full px-6 md:px-12 pt-8">
           <div className="flex items-center gap-4">
              <img 
                  src="https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/b/b8/East_Java_Coat_of_Arms.svg&w=200&output=png" 
                  alt="Logo Jatim" 
                  className="h-16 w-auto drop-shadow-sm"
              />
              <div className="text-left">
                  <p className="text-[11px] font-bold text-emerald-700 tracking-wider leading-tight uppercase">UPT Latkesmas</p>
                  <p className="text-2xl font-extrabold text-slate-800 leading-none tracking-tight my-0.5">MURNAJATI</p>
                  <p className="text-[11px] font-bold text-emerald-700 tracking-[0.2em] leading-tight uppercase">Jawa Timur</p>
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-7xl mx-auto w-full -mt-8 md:-mt-16">
        
        {/* Center Content Wrapper */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full">
            {/* Left: Hero Text */}
            <div className="flex-1 space-y-6 max-w-xl">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wide mb-2">
                SIMEP
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                SIMEP <br/>
                <span className="text-indigo-600 text-2xl md:text-3xl font-bold">(Sistem Informasi Monitoring dan Evaluasi Pelatihan)</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
                Platform profesional untuk monitoring dan evaluasi kualitas pelatihan, kinerja fasilitator, dan efektivitas penyelenggaraan secara real-time.
            </p>
            </div>

            {/* Right: Respondent Access Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Hash size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Akses Responden</h3>
                    <p className="text-xs text-slate-500">Masukkan Kode Akses atau Token</p>
                </div>
                </div>

                <form onSubmit={handleAccessSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kode (5 Karakter) atau Token
                    </label>
                    <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className={`w-full px-4 py-4 bg-slate-50 border rounded-xl focus:ring-2 focus:outline-none transition-all text-lg font-mono text-slate-800 placeholder:text-slate-400 ${
                        error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                    }`}
                    placeholder="Contoh: A7X9P"
                    />
                    {error && <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1 leading-snug">⚠️ {error}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                    Mulai Evaluasi
                    <Play size={18} className="fill-current group-hover:translate-x-1 transition-transform" />
                </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-50 text-center">
                <p className="text-xs text-slate-400">
                    Hubungi panitia jika Anda belum memiliki kode akses.
                </p>
                </div>
            </div>
            </div>
        </div>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create" element={
          <ProtectedRoute>
            <CreateTraining />
          </ProtectedRoute>
        } />
        <Route path="/admin/edit/:trainingId" element={
          <ProtectedRoute>
            <CreateTraining />
          </ProtectedRoute>
        } />
        <Route path="/admin/results/:trainingId" element={
          <ProtectedRoute>
            <ResultsView />
          </ProtectedRoute>
        } />

        <Route path="/evaluate/:trainingId" element={<RespondentView />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;