import { useState, useEffect } from 'react';
import type { KnowledgeArticle } from '../types';
import { X, FileText, CheckCircle2, Clock, ChevronRight, Edit2, Trash2, Plus, Minus, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface SOPDetailModalProps {
  sop: KnowledgeArticle | null;
  onClose: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const SOPDetailModal = ({ sop, onClose, onUpdate, onDelete }: SOPDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedSop, setEditedSop] = useState<Partial<KnowledgeArticle>>({});

  useEffect(() => {
    if (sop) {
      setEditedSop(sop);
      setIsEditing(false);
    }
  }, [sop]);

  if (!sop) return null;

  const handleSave = async () => {
    if (!sop) return;
    try {
      setIsSaving(true);
      await axios.put(`http://localhost:3000/ingest/${sop._id}`, {
        title: editedSop.title,
        summary: editedSop.summary,
        category: editedSop.category,
        status: editedSop.status,
        structuredSteps: editedSop.structuredSteps,
      });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update SOP', error);
      alert('Failed to update SOP. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sop) return;
    if (!confirm('Are you sure you want to delete this SOP? This action cannot be undone.')) return;
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:3000/ingest/${sop._id}`);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete SOP', error);
      alert('Failed to delete SOP. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...(editedSop.structuredSteps || [])];
    newSteps[index] = value;
    setEditedSop({ ...editedSop, structuredSteps: newSteps });
  };

  const addStep = () => {
    setEditedSop({ ...editedSop, structuredSteps: [...(editedSop.structuredSteps || []), ''] });
  };

  const removeStep = (index: number) => {
    const newSteps = [...(editedSop.structuredSteps || [])];
    newSteps.splice(index, 1);
    setEditedSop({ ...editedSop, structuredSteps: newSteps });
  };

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
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-blue-600" title="Edit SOP">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={handleDelete} disabled={isDeleting} className="p-2 hover:bg-red-100 rounded-full transition-colors text-gray-500 hover:text-red-600" title="Delete SOP">
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-dhl-red text-white rounded-lg hover:bg-red-700 transition-colors">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </button>
                </>
              )}
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto p-4 md:p-8 flex-grow custom-scrollbar">
            <div className="mb-8">
              {isEditing ? (
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <input 
                      type="text"
                      value={editedSop.category || ''}
                      onChange={e => setEditedSop({...editedSop, category: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-dhl-yellow focus:ring-1 focus:ring-dhl-yellow"
                      placeholder="e.g. Operations"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                    <select 
                      value={editedSop.status || 'Draft'}
                      onChange={e => setEditedSop({...editedSop, status: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-dhl-yellow focus:ring-1 focus:ring-dhl-yellow"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </div>
                </div>
              ) : (
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
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={editedSop.title || ''}
                  onChange={e => setEditedSop({ ...editedSop, title: e.target.value })}
                  className="w-full text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight border-b-2 border-dashed border-gray-300 focus:border-dhl-yellow focus:outline-none bg-transparent pb-2"
                  placeholder="SOP Title"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{sop.title}</h1>
              )}

              {isEditing ? (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Summary</label>
                  <textarea
                    value={editedSop.summary || ''}
                    onChange={e => setEditedSop({ ...editedSop, summary: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dhl-yellow focus:border-dhl-yellow outline-none"
                    rows={3}
                    placeholder="Brief summary of this SOP"
                  />
                </div>
              ) : (
                sop.summary && <p className="text-lg text-gray-600 mb-6 leading-relaxed">{sop.summary}</p>
              )}
              
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
                {(isEditing ? editedSop.structuredSteps : sop.structuredSteps)?.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-dhl-yellow/50 transition-colors group bg-white">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:bg-dhl-yellow group-hover:text-black group-hover:border-dhl-yellow transition-all">
                      {idx + 1}
                    </div>
                    <div className="flex-grow pt-1">
                      {isEditing ? (
                        <textarea
                          value={step}
                          onChange={(e) => updateStep(idx, e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-dhl-yellow focus:ring-1 focus:ring-dhl-yellow"
                          rows={2}
                        />
                      ) : (
                        <p className="text-gray-700 font-medium leading-relaxed">{step}</p>
                      )}
                    </div>
                    {isEditing && (
                      <button onClick={() => removeStep(idx)} className="self-start p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Minus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button onClick={addStep} className="flex items-center gap-2 text-sm font-semibold text-dhl-red hover:text-red-700 mt-4 px-2 py-1">
                    <Plus className="w-4 h-4" /> Add Step
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
