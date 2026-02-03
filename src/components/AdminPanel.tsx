import React, { useState } from 'react';

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Processing...');
    
    // Simulation of upload logic or actual implementation if needed later
    // For now, we just show it works
    setTimeout(() => {
        setLoading(false);
        setStatus('تم التحديث بنجاح! (محاكاة)');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white text-black p-8 rounded-2xl max-w-lg w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Center</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Hotel</label>
            <select className="w-full p-2 border rounded">
              <option>Fairmont Makkah</option>
              <option>Dar Al Wafideen</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Upload Images</label>
            <input type="file" multiple className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price Override</label>
            <input type="number" placeholder="2500" className="w-full p-2 border rounded" />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? 'Uploading...' : 'Update Hotel Data'}
            </button>
          </div>
          
          {status && <p className="text-center text-green-600 font-bold mt-2">{status}</p>}
        </form>
      </div>
    </div>
  );
}
