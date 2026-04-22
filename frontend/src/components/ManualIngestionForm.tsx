import type { FormEvent } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Upload, File, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ManualIngestionFormProps {
  onSuccess: () => void;
}

export const ManualIngestionForm = ({ onSuccess }: ManualIngestionFormProps) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text && !file) return;

    setLoading(true);
    setStatus('idle');
    const formData = new FormData();
    if (text) formData.append('text', text);
    if (file) formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setText('');
      setFile(null);
      setTimeout(() => {
        setStatus('idle');
        onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrMsg(err.response?.data?.message || 'Failed to ingest input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold flex items-center text-gray-900">
          <Upload className="w-5 h-5 text-dhl-red mr-2" />
          Test Ingestion Pipeline
        </h2>
        <p className="text-sm text-gray-500 mt-1">Simulate UiPath uploading unstructured data.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Raw Text</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-dhl-yellow focus:border-dhl-yellow outline-none transition-colors"
            placeholder="Paste raw email thread or WhatsApp chat here..."
          />
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">File Upload</label>
           <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-dhl-yellow transition-colors bg-gray-50/50">
             <input 
               type="file" 
               onChange={e => setFile(e.target.files?.[0] || null)}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <div className="flex flex-col items-center justify-center pointer-events-none text-center">
                {file ? (
                  <>
                    <File className="w-8 h-8 text-dhl-red mb-2" />
                    <span className="font-medium text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="font-medium text-gray-600">Click or drag file here</span>
                    <span className="text-xs text-gray-400 mt-1">Allows image or text-based files</span>
                  </>
                )}
             </div>
           </div>
        </div>

        <button
          type="submit"
          disabled={loading || (!text && !file)}
          className="w-full bg-[#D40511] hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing with Gemini...</>
          ) : (
            'Generate SOP'
          )}
        </button>

        <AnimatePresence>
          {status === 'success' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center text-green-800 text-sm font-medium mt-4">
              <CheckCircle2 className="w-5 h-5 mr-2" /> Successfully generated SOP.
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-800 text-sm font-medium mt-4">
              <AlertCircle className="w-5 h-5 mr-2" /> {errMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
