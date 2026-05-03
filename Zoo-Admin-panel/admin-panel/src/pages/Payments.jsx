import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Filter, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', type: 'Expense', category: '' });

  useEffect(() => {
    setPayments([
      { _id: '1', description: 'Animal Feed Purchase', amount: 1200, type: 'Expense', category: 'Food', date: '2024-04-25' },
      { _id: '2', description: 'Ticket Sales', amount: 4500, type: 'Income', category: 'Sales', date: '2024-04-24' },
      { _id: '3', description: 'Medical Supplies', amount: 800, type: 'Expense', category: 'Medical', date: '2024-04-23' },
    ]);
  }, []);

  const totalIncome = payments.filter(p => p.type === 'Income').reduce((sum, p) => sum + p.amount, 0);
  const totalExpense = payments.filter(p => p.type === 'Expense').reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(p => filterType === 'All' || p.type === filterType);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-800">Financial Records</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Record Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl"><TrendingUp size={24} /></div>
            <p className="font-bold text-gray-400">Total Income</p>
          </div>
          <h3 className="text-4xl font-black text-gray-800">${totalIncome}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl"><TrendingDown size={24} /></div>
            <p className="font-bold text-gray-400">Total Expenses</p>
          </div>
          <h3 className="text-4xl font-black text-gray-800">${totalExpense}</h3>
        </div>
        <div className="bg-primary p-8 rounded-[2rem] shadow-xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 text-white rounded-2xl"><DollarSign size={24} /></div>
            <p className="font-bold text-green-100">Net Balance</p>
          </div>
          <h3 className="text-4xl font-black">${totalIncome - totalExpense}</h3>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex gap-4">
          {['All', 'Income', 'Expense'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${filterType === type ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-bold">
          <Filter size={20} /> Filter By Date
        </div>
      </div>

      <div className="space-y-4">
        {filteredPayments.map(p => (
          <div key={p._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${p.type === 'Income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-black text-gray-800">{p.description}</h4>
                <p className="text-sm text-gray-400 font-medium">{p.date} • {p.category}</p>
              </div>
            </div>
            <div className={`text-2xl font-black ${p.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
              {p.type === 'Income' ? '+' : '-'}${p.amount}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <CreditCard className="text-primary" /> New Transaction
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); setPayments([...payments, {...formData, _id: Date.now().toString(), date: new Date().toISOString().split('T')[0]}]); setIsModalOpen(false); }} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 ml-4 uppercase">Description</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 ml-4 uppercase">Amount ($)</label>
                  <input required type="number" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 ml-4 uppercase">Type</label>
                  <select className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 ml-4 uppercase">Category</label>
                <input required type="text" className="w-full border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-colors font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="flex justify-end gap-4 mt-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600">Discard</button>
                <button type="submit" className="btn-primary py-4 px-10 text-lg font-black">Record Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
