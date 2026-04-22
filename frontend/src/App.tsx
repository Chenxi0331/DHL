import { useState } from 'react';
import { SOPList } from './components/SOPList';
import { SOPDetailModal } from './components/SOPDetailModal';
import { ManualIngestionForm } from './components/ManualIngestionForm';
import type { KnowledgeArticle } from './types';
import { Menu, User } from 'lucide-react';

function App() {
  const [selectedSop, setSelectedSop] = useState<KnowledgeArticle | null>(null);
  const [refreshList, setRefreshList] = useState(0);

  const handleIngestionSuccess = () => {
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FA] w-full font-sans">
      {/* Header */}
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
              <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: List */}
        <div className="flex-grow lg:w-2/3 xl:w-3/4">
          <SOPList 
            onSelectSop={setSelectedSop} 
            refreshTrigger={refreshList} 
          />
        </div>

        {/* Right Column: Ingestion Testing Form */}
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

export default App;
