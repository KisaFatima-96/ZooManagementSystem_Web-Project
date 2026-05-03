import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, User } from 'lucide-react';
import api from '../services/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', contact: '', salary: '' });

  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff');
      setStaff(res.data);
    } catch (err) {
      console.error("Error fetching staff", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = { 
        ...formData, 
        salary: formData.salary ? parseInt(formData.salary) : 0 
      };
      if (editingId) {
        await api.put(`/staff/${editingId}`, dataToSave);
      } else {
        await api.post('/staff', dataToSave);
      }
      fetchStaff();
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', role: '', contact: '', salary: '' });
    } catch (err) {
      console.error("Error saving staff", err);
      alert('Failed to save staff: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (person) => {
    setEditingId(person._id);
    setFormData({ name: person.name, role: person.role, contact: person.contact, salary: person.salary });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/staff/${id}`);
        fetchStaff();
      } catch (err) {
        console.error("Error deleting staff", err);
      }
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterRole === '' || s.role === filterRole)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-800">Staff Management</h2>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', role: '', contact: '', salary: '' }); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search staff by name..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-white font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400 ml-2" />
          <select 
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-primary/10 bg-white font-bold"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Keeper">Keeper</option>
            <option value="Vet">Vet</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Staff Details</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Role</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Contact</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Salary</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStaff.map((person) => (
              <tr key={person._id} className="hover:bg-primary/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {person.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-800">{person.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold border border-blue-100">
                    {person.role}
                  </span>
                </td>
                <td className="px-8 py-6 text-gray-500 font-medium">{person.contact}</td>
                <td className="px-8 py-6 text-gray-800 font-black">${person.salary}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(person)} className="p-2 hover:bg-white rounded-lg text-blue-500 transition-colors shadow-sm"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(person._id)} className="p-2 hover:bg-white rounded-lg text-red-500 transition-colors shadow-sm"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStaff.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-gray-400 font-bold">No staff records found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <User className="text-primary" /> {editingId ? 'Edit Staff Member' : 'New Staff Member'}
            </h3>
            <form onSubmit={handleAddStaff} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 ml-4 uppercase">Full Name</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 ml-4 uppercase">Role</label>
                <select required className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="">Select Role</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Keeper">Keeper</option>
                  <option value="Vet">Vet</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 ml-4 uppercase">Contact</label>
                  <input required type="text" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 ml-4 uppercase">Salary</label>
                  <input required type="number" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600">Discard</button>
                <button type="submit" className="btn-primary py-4 px-10 text-lg font-black shadow-xl shadow-primary/20">
                  {editingId ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
