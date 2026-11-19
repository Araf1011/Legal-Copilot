import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  Shield, 
  Scale, 
  Phone, 
  ExternalLink, 
  Search, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  LocateFixed,
  Radio,
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { BANGLADESH_STATIONS, BANGLADESH_PRESETS, calculateDistanceKm } from '../data/bangladeshStations';

// Custom Map Pin Icons using Leaflet divIcon
const createCustomIcon = (type, isNearest = false, isUser = false) => {
  if (isUser) {
    return L.divIcon({
      className: 'custom-leaflet-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute w-8 h-8 bg-emerald-500 rounded-full animate-ping opacity-60"></div>
          <div class="relative w-7 h-7 bg-[#006a4e] text-white border-2 border-white rounded-full shadow-lg flex items-center justify-center text-xs font-bold">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }

  const isPolice = type === 'police';
  const bgColor = isPolice ? 'bg-sky-600' : 'bg-emerald-800';
  const borderColor = isNearest ? 'border-amber-400 ring-4 ring-amber-300/40' : 'border-white';
  const iconEmoji = isPolice ? '🚓' : '⚖️';

  return L.divIcon({
    className: 'custom-leaflet-station-marker',
    html: `
      <div class="relative group cursor-pointer transition-transform hover:scale-110">
        ${isNearest ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full ring-2 ring-white animate-pulse"></div>' : ''}
        <div class="w-8 h-8 ${bgColor} text-white border-2 ${borderColor} rounded-full shadow-md flex items-center justify-center text-xs select-none">
          <span>${iconEmoji}</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export default function BangladeshLegalMap({ lang = 'bn', onLaunchWithPrompt }) {
  const isEn = lang === 'en';
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // User coordinates state
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'locating' | 'success' | 'error'
  const [locationError, setLocationError] = useState(null);
  const [activePreset, setActivePreset] = useState(null);

  // Filters & Search
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'police' | 'court'
  const [selectedDivision, setSelectedDivision] = useState('all'); // 'all' | 'dhaka' | 'chittagong' | ...
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);

  // Default center: Dhaka, Bangladesh
  const defaultCenter = [23.777176, 90.399452];
  const defaultZoom = 12;

  // ── Calculate Distances and Sort ──────────────────────────────────────────
  const stationsWithDistance = useMemo(() => {
    return BANGLADESH_STATIONS.map((station) => {
      let distance = null;
      if (userLocation) {
        distance = calculateDistanceKm(userLocation.lat, userLocation.lng, station.lat, station.lng);
      }
      return { ...station, distance };
    }).sort((a, b) => {
      if (a.distance != null && b.distance != null) {
        return a.distance - b.distance;
      }
      return 0;
    });
  }, [userLocation]);

  // Nearest Police Station and Court
  const nearestPolice = useMemo(() => {
    if (!userLocation) return null;
    return stationsWithDistance.find(s => s.category === 'police' && s.distance != null);
  }, [stationsWithDistance, userLocation]);

  const nearestCourt = useMemo(() => {
    if (!userLocation) return null;
    return stationsWithDistance.find(s => s.category === 'court' && s.distance != null);
  }, [stationsWithDistance, userLocation]);

  // Filtered stations for map & directory list
  const filteredStations = useMemo(() => {
    return stationsWithDistance.filter((st) => {
      const matchCategory = filterCategory === 'all' || st.category === filterCategory;
      const matchDivision = selectedDivision === 'all' || st.division === selectedDivision;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q || 
        st.nameEn.toLowerCase().includes(q) || 
        st.nameBn.includes(q) || 
        st.addressEn.toLowerCase().includes(q) || 
        st.addressBn.includes(q) ||
        st.district.toLowerCase().includes(q);
      return matchCategory && matchDivision && matchQuery;
    });
  }, [stationsWithDistance, filterCategory, selectedDivision, searchQuery]);

  // ── Initialize Leaflet Map ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Update Leaflet Markers whenever filtered stations or user location changes ──
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing station markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Clear existing user marker
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    // Add User Marker if location is available
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createCustomIcon(null, false, true),
        zIndexOffset: 1000
      }).addTo(map);

      const userPopup = `
        <div class="p-2 text-center font-sans">
          <div class="text-xs font-bold text-[#006a4e]">📍 ${isEn ? 'Your Current Location' : 'আপনার বর্তমান অবস্থান'}</div>
          <div class="text-[10px] text-slate-500 font-mono mt-0.5">${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</div>
          ${activePreset ? `<div class="text-[11px] font-semibold text-slate-700 mt-1">(${isEn ? activePreset.nameEn : activePreset.nameBn})</div>` : ''}
        </div>
      `;
      userMarker.bindPopup(userPopup);
      userMarkerRef.current = userMarker;
    }

    // Add Station Markers
    filteredStations.forEach((st) => {
      const isNearest = (nearestPolice?.id === st.id) || (nearestCourt?.id === st.id);
      const marker = L.marker([st.lat, st.lng], {
        icon: createCustomIcon(st.category, isNearest, false)
      }).addTo(map);

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}`;

      const popupContent = `
        <div class="p-3 text-slate-800 font-sans max-w-[260px] leading-tight">
          <div class="flex items-center justify-between gap-1 mb-1.5">
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${st.category === 'police' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'}">
              ${isEn ? st.typeEn : st.typeBn}
            </span>
            ${st.distance != null ? `<span class="text-[11px] font-mono font-bold text-[#006a4e]">⚡ ${st.distance} km</span>` : ''}
          </div>
          <h4 class="font-bold text-xs text-slate-900 mb-1 leading-snug">
            ${isEn ? st.nameEn : st.nameBn}
          </h4>
          <p class="text-[11px] text-slate-600 mb-2 leading-relaxed">
            ${isEn ? st.addressEn : st.addressBn}
          </p>
          <div class="text-[10px] text-slate-500 font-mono mb-2">
            📞 ${st.phone} ${st.dutyOfficer ? `<br>🚨 Duty: ${st.dutyOfficer}` : ''}
          </div>
          <a 
            href="${googleMapsUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="inline-flex items-center gap-1 w-full justify-center px-2.5 py-1.5 rounded-lg bg-[#006a4e] text-white text-[11px] font-semibold hover:bg-[#0d5c46] transition text-center"
          >
            🧭 ${isEn ? 'Get Directions on Google Maps' : 'গুগল ম্যাপে পথনির্দেশ'}
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        setSelectedStation(st);
      });

      markersRef.current.push(marker);
    });

  }, [filteredStations, userLocation, nearestPolice, nearestCourt, isEn, activePreset]);

  // ── Browser Geolocation Request ───────────────────────────────────────────
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError(isEn ? 'Geolocation is not supported by your browser.' : 'আপনার ব্রাউজার ভৌগোলিক অবস্থান নির্ণয় সমর্থন করে না।');
      return;
    }

    setLocationStatus('locating');
    setLocationError(null);
    setActivePreset(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(coords);
        setLocationStatus('success');

        // Center map on user location
        const map = mapInstanceRef.current;
        if (map) {
          map.flyTo([coords.lat, coords.lng], 14, { duration: 1.5 });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocationStatus('error');
        if (err.code === 1) {
          setLocationError(
            isEn 
              ? 'Location permission was denied. Please select a quick location from the presets below.' 
              : 'লোকেশন ব্যবহারের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে নিচের এলাকা তালিকা থেকে নির্বাচন করুন।'
          );
        } else {
          setLocationError(
            isEn 
              ? 'Could not acquire precise GPS signal. Please select a preset below.' 
              : 'জিপিএস সংকেত পাওয়া যায়নি। নিচের তালিকা থেকে একটি অঞ্চল বেছে নিন।'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // ── Preset Selection (Instant Location Jump) ──────────────────────────────
  const handleSelectPreset = (preset) => {
    setActivePreset(preset);
    const coords = { lat: preset.lat, lng: preset.lng };
    setUserLocation(coords);
    setLocationStatus('success');
    setLocationError(null);

    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([preset.lat, preset.lng], 13, { duration: 1.2 });
    }
  };

  // ── Focus on a Station ───────────────────────────────────────────────────
  const handleFocusStation = (st) => {
    setSelectedStation(st);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([st.lat, st.lng], 15, { duration: 1 });
      // Find matching marker and open popup
      const marker = markersRef.current.find(m => {
        const latLng = m.getLatLng();
        return Math.abs(latLng.lat - st.lat) < 0.0001 && Math.abs(latLng.lng - st.lng) < 0.0001;
      });
      if (marker) {
        marker.openPopup();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* ── LOCATION DETECTION BAR ────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-[#006a4e] to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-2.5 border border-white/15">
              <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>{isEn ? 'GPS Territorial & Judicial Proximity Engine' : 'জিপিএস ভিত্তিক নিকটস্থ আদালত ও থানা নির্দেশক'}</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {isEn ? 'Find Your Nearest Police Station & Court' : 'আপনার সবচেয়ে কাছের থানা ও আদালত খুঁজে নিন'}
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              {isEn 
                ? 'Allow location access or select your area. The system calculates real-time driving distance, jurisdiction coverage, and duty officer emergency contacts.'
                : 'আপনার ব্রাউজার লোকেশন অনুমোদন করুন অথবা এলাকা নির্বাচন করুন। সিস্টেম তাত্ক্ষণিকভাবে সরাসরি দূরত্ব, অধিক্ষেত্র এবং থানার ডিউটি অফিসারের নম্বর প্রদর্শন করবে।'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleDetectLocation}
              disabled={locationStatus === 'locating'}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#006a4e] font-bold text-sm shadow-md hover:bg-emerald-50 active:scale-95 transition disabled:opacity-60 cursor-pointer"
            >
              <LocateFixed className={`w-4 h-4 ${locationStatus === 'locating' ? 'animate-spin' : ''}`} />
              <span>
                {locationStatus === 'locating'
                  ? (isEn ? 'Detecting Location…' : 'অবস্থান নির্ণয় করা হচ্ছে…')
                  : (isEn ? '📍 Detect My Location' : '📍 আমার অবস্থান সনাক্ত করুন')}
              </span>
            </button>
          </div>
        </div>

        {/* Error / Fallback Notice */}
        {locationError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-300/40 text-amber-100 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <span>{locationError}</span>
            </div>
          </div>
        )}

        {/* Success Confirmation */}
        {userLocation && (
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>
                {isEn ? 'Active Location Coordinates:' : 'বর্তমান সক্রিয় ভৌগোলিক স্থানাঙ্ক:'}{' '}
                <strong className="text-white font-mono">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</strong>
                {activePreset && <span className="ml-2 font-semibold text-amber-300">({isEn ? activePreset.nameEn : activePreset.nameBn})</span>}
              </span>
            </div>
            <button
              onClick={() => { setUserLocation(null); setActivePreset(null); setLocationStatus('idle'); }}
              className="text-xs text-emerald-200 hover:text-white underline"
            >
              {isEn ? 'Reset Location' : 'অবস্থান মুছুন'}
            </button>
          </div>
        )}

        {/* Quick Area Jump Chips (Instant Preset Selector) */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mb-2">
            {isEn ? 'Or Quick Select Area Across Bangladesh:' : 'অথবা দ্রুত যেকোনো প্রধান অঞ্চল নির্বাচন করুন:'}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {BANGLADESH_PRESETS.map((p) => {
              const isSelected = activePreset?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-3 py-1 rounded-full text-xs transition border ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold shadow-xs' 
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  {isEn ? p.nameEn : p.nameBn}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── NEAREST HERO CARDS (PROXIMITY RADAR) ───────────────────────────── */}
      {userLocation && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
          
          {/* Nearest Police Station Card */}
          {nearestPolice ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-sky-300 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-sky-600 text-white rounded-bl-2xl text-xs font-bold font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>{nearestPolice.distance} km {isEn ? 'away' : 'দূরে'}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg border border-sky-200">
                  🚓
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-sky-700 tracking-wider">
                    {isEn ? 'Nearest Police Station' : 'নিকটস্থ থানা'}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    {isEn ? nearestPolice.nameEn : nearestPolice.nameBn}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 mb-4 bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{isEn ? nearestPolice.addressEn : nearestPolice.addressBn}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{nearestPolice.phone}</span>
                  {nearestPolice.dutyOfficer && (
                    <span className="text-[11px] text-sky-700 font-semibold">(ডিউটি: {nearestPolice.dutyOfficer})</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-sky-200/50">
                  <strong className="text-slate-700">{isEn ? 'Jurisdiction:' : 'এখতিয়ার:'}</strong> {isEn ? nearestPolice.jurisdictionEn : nearestPolice.jurisdictionBn}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
                <a
                  href={`tel:${nearestPolice.dutyOfficer || nearestPolice.phone || '999'}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Call Duty Officer' : 'কল করুন'}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestPolice.lat},${nearestPolice.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-semibold transition border border-slate-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isEn ? 'Google Maps Directions' : 'ম্যাপে পথনির্দেশ'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                {onLaunchWithPrompt && (
                  <button
                    onClick={() => onLaunchWithPrompt(
                      isEn
                        ? `I am at ${isEn ? nearestPolice.nameEn : nearestPolice.nameBn}. How do I file a General Diary (GD) or FIR here under Bangladesh law? What documents do I need?`
                        : `আমি ${nearestPolice.nameBn} এর আওতাধীন এলাকায় আছি। এখানে সাধারণ ডায়েরি (জিডি) বা এজাহার দায়েরের সঠিক আইনি নিয়ম কী? কী কী তথ্য লাগবে?`
                    )}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sky-800 hover:bg-sky-50 text-xs font-bold ml-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>{isEn ? 'Draft GD with AI' : 'জিডি ড্রাফট করুন'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Nearest Court Card */}
          {nearestCourt ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-emerald-300 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#006a4e] text-white rounded-bl-2xl text-xs font-bold font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>{nearestCourt.distance} km {isEn ? 'away' : 'দূরে'}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center font-bold text-lg border border-emerald-200">
                  🏛️
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-[#006a4e] tracking-wider">
                    {isEn ? 'Nearest Competent Court' : 'নিকটস্থ উপযুক্ত আদালত'}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    {isEn ? nearestCourt.nameEn : nearestCourt.nameBn}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 mb-4 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>{isEn ? nearestCourt.addressEn : nearestCourt.addressBn}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                  <span>{nearestCourt.phone}</span>
                  <span className="text-[11px] text-emerald-800 font-semibold">({isEn ? nearestCourt.typeEn : nearestCourt.typeBn})</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-emerald-200/50">
                  <strong className="text-slate-700">{isEn ? 'Competency:' : 'বিচারিক এখতিয়ার:'}</strong> {isEn ? nearestCourt.jurisdictionEn : nearestCourt.jurisdictionBn}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearestCourt.lat},${nearestCourt.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-semibold transition border border-slate-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>{isEn ? 'Google Maps Directions' : 'ম্যাপে পথনির্দেশ'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                {onLaunchWithPrompt && (
                  <button
                    onClick={() => onLaunchWithPrompt(
                      isEn
                        ? `What is the jurisdiction and court filing procedure at ${isEn ? nearestCourt.nameEn : nearestCourt.nameBn} for Cheque Dishonour or Criminal Revision?`
                        : `${nearestCourt.nameBn}-এ চেক ডিজঅনার বা সি.আর. মামলা দায়েরের সঠিক পদ্ধতি ও জামিন শুনানির বিধান কী?`
                    )}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[#006a4e] hover:bg-emerald-50 text-xs font-bold ml-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>{isEn ? 'Check Court Procedure' : 'আদালতের নিয়ম জানুন'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}

        </div>
      )}

      {/* ── MAP & DIRECTORY WORKSPACE ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-md overflow-hidden">
        
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-[#faf8f5] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs: All / Police / Courts */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                filterCategory === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEn ? 'All Locations' : 'সব স্থান'} ({BANGLADESH_STATIONS.length})
            </button>
            <button
              onClick={() => setFilterCategory('police')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 ${
                filterCategory === 'police' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🚓 {isEn ? 'Police Stations' : 'থানা সমূহ'}</span>
            </button>
            <button
              onClick={() => setFilterCategory('court')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 ${
                filterCategory === 'court' ? 'bg-[#006a4e] text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⚖️ {isEn ? 'Courts' : 'আদালত সমূহ'}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search station, court, or area (e.g. Dhanmondi, CMM, Sylhet)…' : 'থানা, আদালত বা এলাকা খুঁজুন (যেমন: ধানমন্ডি, CMM, চট্টগ্রাম)…'}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Division Selector */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0">
            {[
              { id: 'all', labelEn: 'All Divisions', labelBn: 'সকল বিভাগ' },
              { id: 'dhaka', labelEn: 'Dhaka', labelBn: 'ঢাকা' },
              { id: 'chittagong', labelEn: 'Chittagong', labelBn: 'চট্টগ্রাম' },
              { id: 'sylhet', labelEn: 'Sylhet', labelBn: 'সিলেট' },
              { id: 'rajshahi', labelEn: 'Rajshahi', labelBn: 'রাজশাহী' },
              { id: 'khulna', labelEn: 'Khulna', labelBn: 'খুলনা' }
            ].map(div => (
              <button
                key={div.id}
                onClick={() => setSelectedDivision(div.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition ${
                  selectedDivision === div.id 
                    ? 'bg-[#006a4e] text-white font-bold' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isEn ? div.labelEn : div.labelBn}
              </button>
            ))}
          </div>

        </div>

        {/* ── INTERACTIVE LEAFLET MAP CONTAINER ─────────────────────────── */}
        <div className="relative w-full h-[450px] sm:h-[500px] bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs flex items-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-semibold text-slate-800">
              {isEn ? 'Showing' : 'প্রদর্শিত:'} {filteredStations.length} {isEn ? 'Jurisdictions on Bangladesh Map' : 'টি বিচারিক ও থানা কেন্দ্র'}
            </span>
          </div>

          {/* Legend Bottom Right */}
          <div className="absolute bottom-3 right-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md border border-slate-200 text-[11px] font-medium text-slate-700 space-y-1 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 inline-block text-[9px] text-white text-center leading-3.5">🚓</span>
              <span>{isEn ? 'Police Station (থানা)' : 'থানা'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-800 inline-block text-[9px] text-white text-center leading-3.5">⚖️</span>
              <span>{isEn ? 'Court (আদালত)' : 'আদালত'}</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#006a4e] border-2 border-white inline-block"></span>
                <span className="font-bold text-[#006a4e]">{isEn ? 'You (আপনার অবস্থান)' : 'আপনার অবস্থান'}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── CARDS DIRECTORY GRID ──────────────────────────────────────── */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-editorial text-lg font-bold text-slate-900">
              {isEn ? 'Directory & Jurisdiction List' : 'অধিক্ষেত্র ও ঠিকানা নির্দেশিকা'}
            </h3>
            <span className="text-xs text-slate-500">
              {isEn ? 'Click any card to center and open on map' : 'ম্যাপে দেখতে যেকোনো কার্ডে ক্লিক করুন'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((loc) => {
              const isSelected = selectedStation?.id === loc.id;
              const isNearest = (nearestPolice?.id === loc.id) || (nearestCourt?.id === loc.id);

              return (
                <div
                  key={loc.id}
                  onClick={() => handleFocusStation(loc)}
                  className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-[#006a4e] ring-2 ring-[#006a4e]/20 shadow-md' 
                      : isNearest
                      ? 'border-amber-400 bg-amber-50/30 shadow-xs'
                      : 'border-slate-200 hover:border-[#006a4e]/50 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        loc.category === 'police' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isEn ? loc.typeEn : loc.typeBn}
                      </span>

                      {loc.distance != null ? (
                        <span className="text-xs font-mono font-bold text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ⚡ {loc.distance} km
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-600 font-semibold">
                          {loc.phone}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 mb-1.5 leading-snug">
                      {isEn ? loc.nameEn : loc.nameBn}
                    </h4>

                    <div className="text-xs text-slate-600 flex items-start gap-1.5 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{isEn ? loc.addressEn : loc.addressBn}</span>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                      <div>
                        <strong className="text-slate-800">{isEn ? 'Jurisdiction:' : 'এখতিয়ার:'}</strong>{' '}
                        <span>{isEn ? loc.jurisdictionEn : loc.jurisdictionBn}</span>
                      </div>
                      {loc.procedureBn && (
                        <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                          {isEn ? loc.procedureEn : loc.procedureBn}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#006a4e] font-bold hover:underline flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Directions' : 'পথনির্দেশ'}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </a>

                    {onLaunchWithPrompt && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLaunchWithPrompt(
                            isEn 
                              ? `Explain the filing procedures, bail jurisdiction, and territorial laws for ${loc.nameEn}.` 
                              : `আমাকে ${loc.nameBn} এর আইনি এখতিয়ার ও আবেদন প্রক্রিয়া সম্পর্কে বিস্তারিত জানান।`
                          );
                        }}
                        className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        <span>{isEn ? 'AI Guidance' : 'আইনি তথ্য'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

