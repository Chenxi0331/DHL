import type { KnowledgeArticle } from '../types';
import { X, FileText, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SOPDetailModalProps {
  sop: KnowledgeArticle | null;
  onClose: () => void;
}

export const SOPDetailModal = ({ sop, onClose }: SOPDetailModalProps) => {
  if (!sop) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-gray-900">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 shadow-2xl"
        >
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dhl-yellow/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-dhl-red" />
              </div>
              <h2 className="text-xl font-bold">Standard Operating Procedure</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 md:p-8 flex-grow custom-scrollbar">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider ${sop.category ? 'bg-dhl-yellow text-black' : 'bg-gray-200 text-gray-700'}`}>
                  {(sop.category || 'UNCATEGORIZED').toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wider ${sop.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {sop.status.toUpperCase()}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider bg-blue-50 text-blue-700">
                  {sop.sourceType.toUpperCase()}
                </span>
                <span className="flex items-center text-xs text-gray-400 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(sop.createdAt).toLocaleString()}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{sop.title}</h1>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Original Context</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{sop.originalContent}</p>
                {sop.sourceFileUrl && (
                  <a href={sop.sourceFileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center text-sm font-semibold text-dhl-red hover:text-red-700 transition-colors">
                    View Original Source 
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle2 className="w-5 h-5 text-dhl-yellow mr-2" />
                Structured Steps
              </h3>
              <div className="space-y-4">
                {sop.structuredSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-dhl-yellow/50 transition-colors group bg-white">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:bg-dhl-yellow group-hover:text-black group-hover:border-dhl-yellow transition-all">
                      {idx + 1}
                    </div>
                    <div className="pt-1">
                      <p className="text-gray-700 font-medium leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
