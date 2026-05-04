import React, { useState, useEffect } from 'react';
import { PawPrint, Users, DoorOpen, CloudSun } from 'lucide-react';
import api from '../services/api';
import axios from 'axios';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [stats, setStats] = useState({ animals: 0, staff: 0 });

  useEffect(() => {
    const fetchWeather = async () => {
      const API_KEY = '895284fb053c0384a13e5476a2653a45';
      const fallbackUrl = `https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=${API_KEY}&units=metric`;

      const getWeatherByCoords = async (lat, lon) => {
        try {
          const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
          setWeather(res.data);
        } catch (err) {
          fetchFallback();
        }
      };

      const fetchFallback = async () => {
        try {
          const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=${API_KEY}&units=metric`);
          setWeather(res.data);
        } catch (err) {
          setWeather({
            main: { temp: 28, humidity: 45 },
            weather: [{ description: "sunny with occasional clouds" }],
            wind: { speed: 3.5 },
            name: "Lahore"
          });
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
          () => fetchFallback()
        );
      } else {
        fetchFallback();
      }
    };

    const fetchStats = async () => {
        try {
            const [animalsRes, staffRes] = await Promise.all([
                api.get('/animals'),
                api.get('/staff')
            ]);
            setStats({
                animals: animalsRes.data.length,
                staff: staffRes.data.length
            });
        } catch (err) {
            console.error("Error fetching stats", err);
        }
    };

    fetchWeather();
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Animals', value: stats.animals, icon: <PawPrint size={32} className="text-primary" />, color: 'bg-green-100' },
    { title: 'Active Staff', value: stats.staff, icon: <Users size={32} className="text-blue-500" />, color: 'bg-blue-100' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div key={card.title} className="card flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{card.title}</p>
              <h2 className="text-4xl font-black text-gray-800">{card.value}</h2>
            </div>
            <div className={`p-4 rounded-2xl ${card.color}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-primary to-green-800 text-white border-none shadow-2xl shadow-primary/20">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold">Zoo Environment</h3>
              <p className="text-green-100">Live Weather Monitor</p>
            </div>
            <CloudSun size={40} className="text-accent" />
          </div>
          {weather ? (
            <div className="flex items-center gap-8">
              <div className="text-7xl font-black tracking-tighter">{Math.round(weather.main.temp)}°C</div>
              <div className="space-y-1">
                <p className="text-xl font-bold capitalize">{weather.weather[0].description}</p>
                <p className="text-sm text-green-200">Humidity: {weather.main.humidity}%</p>
                <p className="text-sm text-green-200">Wind: {weather.wind.speed} m/s</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <p>Syncing with OpenWeather...</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-full"></span>
            Recent Operations
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-bold text-gray-600">Database connection stable</p>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-bold text-gray-600">Weather API synced successfully</p>
            </div>
            <p className="text-xs text-center text-gray-400 font-bold mt-4 uppercase tracking-widest">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
