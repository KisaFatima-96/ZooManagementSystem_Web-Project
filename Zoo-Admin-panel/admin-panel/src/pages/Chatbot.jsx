import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, MessageCircle, Info } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Zoo AI Assistant. How can I help you manage the park today?", sender: 'bot', time: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user', time: 'Just now' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
        let botText = "I've analyzed your query. ";
        if (input.toLowerCase().includes('animal')) {
            botText += "We currently have 45 animals across 12 species. The lions are due for a health check tomorrow.";
        } else if (input.toLowerCase().includes('feed')) {
            botText += "Feeding schedules are up to date. Staff member Maham Munir completed the morning session at 09:00 AM.";
        } else if (input.toLowerCase().includes('payment') || input.toLowerCase().includes('expense')) {
            botText += "Total expenses for this month are $3,200, which is 5% lower than last month.";
        } else {
            botText += "I can help with animal records, feeding schedules, or enclosure status. What would you like to know?";
        }
        
        setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot', time: 'Just now' }]);
        setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <Bot size={36} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-gray-800">Zoo AI Assistant</h2>
                <div className="flex items-center gap-2 text-green-500 text-sm font-bold mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online & Ready to Help
                </div>
            </div>
        </div>
        <div className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-sm">
            <Sparkles className="text-accent" size={18} />
            <span className="font-bold text-gray-400">Powered by Advanced Zoo Logic</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                    <div className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'}`}>
                            {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div className={`p-6 rounded-[2rem] text-lg font-medium shadow-sm ${
                            msg.sender === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                            {msg.text}
                            <div className={`text-[10px] mt-2 font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-white/50' : 'text-gray-300'}`}>
                                {msg.time}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 text-primary flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div className="bg-gray-50 p-6 rounded-[2rem] rounded-tl-none border border-gray-100 flex gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100">
            <form onSubmit={handleSend} className="relative group">
                <input 
                    type="text" 
                    placeholder="Ask about animals, staff, or expenses..." 
                    className="w-full bg-white px-10 py-6 rounded-[2rem] shadow-xl outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg font-bold pr-32 border-2 border-transparent focus:border-primary/20"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button 
                    type="submit"
                    className="absolute right-3 top-3 bottom-3 bg-primary text-white px-8 rounded-2xl font-black text-lg hover:bg-green-800 transition-all flex items-center gap-2 group-hover:scale-105"
                >
                    <Send size={20} />
                    <span className="hidden sm:inline">Send</span>
                </button>
            </form>
            <div className="mt-4 flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
                {['Lion status?', 'Monthly expenses?', 'Feeding logs?'].map(chip => (
                    <button key={chip} onClick={() => setInput(chip)} className="whitespace-nowrap px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-400 border border-gray-100 hover:border-primary hover:text-primary transition-all">
                        {chip}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
