import { useEffect, useState } from 'react';
import axios from 'axios';
import type { KnowledgeArticle } from '../types';
import { Search, Loader2, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SOPListProps {
  onSelectSop: (sop: KnowledgeArticle) => void;
  refreshTrigger: number;
}

export const SOPList = ({ onSelectSop, refreshTrigger }: SOPListProps) => {
  const [sops, setSops] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSops = async () => {
      try {
        setLoading(true);
        // Assuming backend is running on 3000
        const response = await axios.get('http://localhost:3000/knowledge'); 
        setSops(response.data);
      } catch (err) {
        console.error('Failed to fetch SOPs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSops();
  }, [refreshTrigger]);

  const filtered = sops.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || (s.category && s.category.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-gray-500 mt-1">Browse automatically generated SOP articles.</p>
        </div>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-dhl-yellow focus:border-dhl-yellow transition-colors sm:text-sm"
            placeholder="Search SOPs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="w-10 h-10 text-dhl-yellow animate-spin" />
          <p className="text-gray-500 font-medium tracking-wide">Loading knowledge base...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No SOPs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sop, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={sop._id}
              onClick={() => onSelectSop(sop)}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${sop.category ? 'bg-dhl-yellow/20 text-[#D40511]' : 'bg-gray-100 text-gray-600'}`}>
                  {(sop.category || 'Uncategorized').toUpperCase()}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-dhl-yellow/10 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-dhl-red" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{sop.title}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-3 flex-grow leading-relaxed">
                {sop.originalContent}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50 font-medium">
                <span className="flex items-center text-dhl-red">
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  {sop.structuredSteps.length} Steps
                </span>
                <span>{new Date(sop.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
