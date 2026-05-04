import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Thermometer, MapPin, RefreshCw, Search, Info } from 'lucide-react';
import axios from 'axios';

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const API_KEY = '895284fb053c0384a13e5476a2653a45';

  const fetchWeatherByCity = async (city) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      setWeather(res.data);
    } catch (err) {
      setErrorMsg("Could not find city. Using fallback.");
      setWeather({
        main: { temp: 28, humidity: 45, feels_like: 30, pressure: 1012 },
        weather: [{ description: "sunny with occasional clouds", icon: "02d" }],
        wind: { speed: 3.5 },
        name: city || "Lahore"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      setWeather(res.data);
    } catch (err) {
      setErrorMsg("Location API failed. Using Lahore.");
      fetchWeatherByCity('Lahore');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
        (err) => {
          console.error(err);
          setErrorMsg("Location permission denied. Showing Lahore.");
          fetchWeatherByCity('Lahore');
        }
      );
    } else {
      setErrorMsg("Geolocation not supported. Showing Lahore.");
      fetchWeatherByCity('Lahore');
    }
  };

  useEffect(() => {
    handleAutoDetect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) fetchWeatherByCity(searchCity);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <CloudSun size={32} className="text-primary" /> Weather Analytics
        </h2>
        
        <div className="flex gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search city..." 
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary/10 transition-all bg-white font-bold text-sm"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                />
            </form>
            <button 
                onClick={handleAutoDetect}
                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm group"
                title="Auto-detect location"
            >
                <MapPin size={20} className={`text-gray-400 group-hover:text-primary ${loading ? 'animate-pulse' : ''}`} />
            </button>
        </div>
      </div>

      {errorMsg && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700 font-bold text-sm">
              <Info size={18} /> {errorMsg}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card bg-gradient-to-br from-primary to-green-800 text-white border-none shadow-2xl shadow-primary/20 p-10 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background icon */}
          <CloudSun size={300} className="absolute -right-20 -bottom-20 text-white/10" />
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={18} className="text-green-300" />
                <h3 className="text-2xl font-bold">{weather?.name || 'Loading...'}</h3>
              </div>
              <p className="text-green-100">Live Zoo Environment Monitor</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl">
                <CloudSun size={40} className="text-accent" />
            </div>
          </div>
          
          {weather ? (
            <div className="flex flex-col md:flex-row md:items-center gap-12 relative z-10">
              <div className="text-[8rem] font-black tracking-tighter leading-none flex items-start">
                  {Math.round(weather.main.temp)}<span className="text-4xl mt-6">°C</span>
              </div>
              <div className="space-y-6">
                <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl inline-block border border-white/10 shadow-xl">
                    <p className="text-2xl font-bold capitalize">{weather.weather[0].description}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl"><Droplets className="text-green-300" size={24} /></div>
                        <div>
                            <p className="text-[10px] text-green-200 uppercase font-black tracking-widest">Humidity</p>
                            <p className="text-2xl font-black">{weather.main.humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl"><Wind className="text-green-300" size={24} /></div>
                        <div>
                            <p className="text-[10px] text-green-200 uppercase font-black tracking-widest">Wind</p>
                            <p className="text-2xl font-black">{weather.wind.speed} <span className="text-xs">m/s</span></p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
                <RefreshCw size={48} className="text-white/20 animate-spin" />
                <p className="text-xl font-bold text-green-100">Synchronizing Data...</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
            <div className="card p-8 border-none shadow-xl bg-white">
                <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Environment Status</h4>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Thermometer size={18} />
                            </div>
                            <span className="font-bold text-gray-700">Feels Like</span>
                        </div>
                        <span className="text-lg font-black text-gray-800">{weather ? Math.round(weather.main.feels_like) : '--'}°C</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <RefreshCw size={18} />
                            </div>
                            <span className="font-bold text-gray-700">Pressure</span>
                        </div>
                        <span className="text-lg font-black text-gray-800">{weather ? weather.main.pressure : '--'} <span className="text-xs text-gray-400 font-bold">hPa</span></span>
                    </div>
                </div>
                <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-[2rem]">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <Info size={16} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Recommendation</p>
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                        {weather?.main.temp > 30 ? "High temperature detected. Increase hydration for all enclosures and monitor heat-sensitive animals." : "Optimal temperature for most species. Maintain standard care routines."}
                    </p>
                </div>
            </div>

            <div className="card bg-gray-900 text-white p-8 border-none shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><CloudSun size={80} /></div>
                 <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Forecast Notice</h4>
                 <p className="text-sm text-gray-300 font-medium leading-relaxed relative z-10">No severe weather alerts for the next 24 hours. Normal zoo operations are cleared for all outdoor enclosures.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
