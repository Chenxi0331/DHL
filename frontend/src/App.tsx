import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SOPList } from './components/SOPList';
import { SOPDetailModal } from './components/SOPDetailModal';
import { ManualIngestionForm } from './components/ManualIngestionForm';
import { Login } from './components/Login';
import type { KnowledgeArticle } from './types';
import { Menu, LogOut } from 'lucide-react';
import axios from 'axios';

// Setup global axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('dhl_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Dashboard() {
  const [selectedSop, setSelectedSop] = useState<KnowledgeArticle | null>(null);
  const [refreshList, setRefreshList] = useState(0);
  const navigate = useNavigate();

  const handleIngestionSuccess = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('dhl_token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA] w-full font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden">
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-[#FFCC00] w-9 h-9 rounded shadow-sm flex items-center justify-center font-black italic text-[#D40511] text-lg tracking-tighter">
                  DHL
                </div>
                <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">AutoSOP Engine</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-sm font-semibold text-gray-700">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        <div className="flex-grow lg:w-2/3 xl:w-3/4">
          <SOPList 
            onSelectSop={setSelectedSop} 
            refreshTrigger={refreshList} 
          />
        </div>
        <div className="lg:w-1/3 xl:w-1/4">
          <div className="sticky top-24">
            <ManualIngestionForm onSuccess={handleIngestionSuccess} />
          </div>
        </div>
      </main>

      <SOPDetailModal 
        sop={selectedSop} 
        onClose={() => setSelectedSop(null)} 
      />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('dhl_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
