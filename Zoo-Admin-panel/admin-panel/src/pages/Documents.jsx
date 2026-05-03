import React, { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Download, Eye, HardDrive } from 'lucide-react';
import api from '../services/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching docs", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
        alert("Please select a file first");
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
      setFile(null);
      alert("File uploaded successfully to local storage!");
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this document?")) {
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments();
        } catch (err) {
            console.error("Delete error", err);
        }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-800">Document Vault</h2>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <HardDrive className="text-primary" size={20} />
            <div className="text-sm">
                <p className="font-black text-gray-800">Local Storage Active</p>
                <p className="text-xs text-gray-400 font-bold uppercase">No Account Required</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 sticky top-8">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Upload className="text-primary" size={20} /> Upload New File
                </h3>
                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="relative border-4 border-dashed border-gray-100 rounded-[2rem] p-8 text-center hover:border-primary/20 transition-colors cursor-pointer group">
                        <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />
                        <Upload size={48} className={`mx-auto mb-4 transition-colors ${file ? 'text-primary' : 'text-gray-200 group-hover:text-primary'}`} />
                        <p className="font-bold text-gray-600 truncate">
                            {file ? file.name : "Click or drag file to upload"}
                        </p>
                        <p className="text-xs text-gray-300 mt-2 uppercase tracking-widest font-black">Max size: 10MB</p>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isUploading || !file}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${isUploading || !file ? 'bg-gray-100 text-gray-400' : 'btn-primary shadow-xl shadow-primary/20'}`}
                    >
                        {isUploading ? 'Uploading...' : 'Start Upload'}
                    </button>
                </form>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center px-8">
                <p className="font-black text-gray-400 text-sm uppercase">Stored Documents ({documents.length})</p>
            </div>

            {documents.length === 0 && (
                <div className="bg-gray-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
                    <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">No documents uploaded yet.</p>
                </div>
            )}

            {documents.map(doc => (
                <div key={doc._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <FileText size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-800 text-lg">{doc.title}</h4>
                            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 mt-1">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] uppercase">File</span>
                                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a 
                            href={`http://localhost:5000${doc.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 hover:bg-blue-50 text-blue-500 rounded-xl transition-colors"
                        >
                            <Eye size={20} />
                        </a>
                        <button onClick={() => handleDelete(doc._id)} className="p-3 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
