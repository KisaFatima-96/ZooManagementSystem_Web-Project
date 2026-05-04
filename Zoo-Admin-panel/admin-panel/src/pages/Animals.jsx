import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, PawPrint } from 'lucide-react';
import api from '../services/api';

const AnimalManagement = () => {
  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', species: '', age: '', assignedTo: '' });
  const [staffList, setStaffList] = useState([]);

  const fetchAnimals = async () => {
    try {
      const res = await api.get('/animals');
      setAnimals(res.data);
    } catch (err) {
      console.error("Error fetching animals", err);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff');
      setStaffList(res.data);
    } catch (err) {
      console.error("Error fetching staff", err);
    }
  };

  useEffect(() => {
    fetchAnimals();
    fetchStaff();
  }, []);

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/animals/${editingId}`, formData);
      } else {
        await api.post('/animals', formData);
      }
      fetchAnimals();
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', species: '', age: '', assignedTo: '' });
    } catch (err) {
      console.error("Error saving animal", err);
    }
  };

  const handleEdit = (animal) => {
    setEditingId(animal._id);
    setFormData({ name: animal.name, species: animal.species, age: animal.age, assignedTo: animal.assignedTo || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await api.delete(`/animals/${id}`);
        fetchAnimals();
      } catch (err) {
        console.error("Error deleting animal", err);
      }
    }
  };

  const filteredAnimals = animals.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterSpecies === '' || a.species === filterSpecies)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-800">Animal Management</h2>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', species: '', age: '', assignedTo: '' }); setIsModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add New Animal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-white font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400 ml-2" />
          <select 
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-primary/10 bg-white font-bold"
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
          >
            <option value="">All Species</option>
            <option value="Lion">Lion</option>
            <option value="Giraffe">Giraffe</option>
            <option value="Hippo">Hippo</option>
            <option value="Elephant">Elephant</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Name</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Species</th>
              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider">Age</th>

              <th className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAnimals.map((animal) => (
              <tr key={animal._id} className="hover:bg-primary/5 transition-colors group">
                <td className="px-8 py-6 font-bold text-gray-800">{animal.name}</td>
                <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-green-50 text-primary rounded-lg font-bold border border-green-100">{animal.species}</span>
                </td>
                <td className="px-8 py-6 text-gray-600 font-bold">{animal.age} Years</td>

                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(animal)} className="p-2 hover:bg-white rounded-lg text-blue-500 transition-colors shadow-sm"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(animal._id)} className="p-2 hover:bg-white rounded-lg text-red-500 transition-colors shadow-sm"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAnimals.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-8 py-10 text-center text-gray-400 font-bold">No animals found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <PawPrint className="text-primary" /> {editingId ? 'Edit Animal' : 'New Animal'}
            </h3>
            <form onSubmit={handleAddAnimal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 ml-4 uppercase">Name</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.name} onChange={e => {
                  const val = e.target.value;
                  if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                    setFormData({...formData, name: val});
                  }
                }} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 ml-4 uppercase">Species</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.species} onChange={e => {
                  const val = e.target.value;
                  if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                    setFormData({...formData, species: val});
                  }
                }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 ml-4 uppercase">Age</label>
                  <input required type="number" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 ml-4 uppercase">Assigned Caretaker</label>
                  <select className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold text-gray-600" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})}>
                    <option value="">-- No Assignment --</option>
                    {staffList.map(staff => (
                      <option key={staff._id} value={staff._id}>{staff.name} ({staff.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-400 font-bold">Cancel</button>
                <button type="submit" className="btn-primary px-8 py-3 text-lg font-black shadow-xl shadow-primary/20">
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalManagement;
