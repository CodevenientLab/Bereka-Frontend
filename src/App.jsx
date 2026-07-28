import React, { useState, useEffect } from 'react';
import Logo from './components/Logo';
import { 
  Bell, 
  MapPin, 
  Search, 
  Star, 
  Calendar, 
  Home, 
  ArrowLeft, 
  CheckCircle,
  Clock,
  ChevronRight,
  LogOut,
  AlertCircle,
  Briefcase,
  UserCheck,
  Zap,
  Info,
  Sun,
  Moon,
  Settings,
  Sliders,
  ShieldAlert,
  X,
  Eye,
  EyeOff,
  Map as MapIcon, // Added to support your new Radar/Map toggles
  Target
} from 'lucide-react';
import { FaGoogle, FaFacebook, FaApple, FaWhatsapp } from 'react-icons/fa6';

// Import Google Maps Components seamlessly
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

// INITIAL SEED ARTISANS WITH SOUTH AFRICAN COUNTRY CODE NUMBERS FOR WHATSAPP LINKING
const initialArtisans = [
  { id: 1, name: 'Thabo Molefe', role: 'Plumber', rating: 4.8, reviews: 24, distance: 1.2, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150', bio: 'Specialist in residential plumbing, leak detection, and emergency repairs with over 5 years of active service in the Mmabatho area.', rate: 'R250/hr', specialties: ['Leak Detection', 'Geyser Repair', 'Blocked Drains'], phone: '27812345678', position: { lat: -25.8560, lng: 25.6403 } },
  { id: 2, name: 'John Doe', role: 'Electrician', rating: 4.9, reviews: 42, distance: 3.2, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Certified commercial and domestic electrician. Expert in DB board upgrades, household wiring, and certificate of compliance (CoC) issuing.', rate: 'R300/hr', specialties: ['DB Boards', 'House Wiring', 'CoC Certificates'], phone: '27729876543', position: { lat: -25.8420, lng: 25.6610 } },
  { id: 3, name: 'Jane Smith', role: 'Painter', rating: 4.7, reviews: 18, distance: 8.5, isVerified: false, status: 'Busy', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Professional interior and exterior structural coatings designer. Dedicated to clean preparation pipelines and premium finishing textures.', rate: 'R220/hr', specialties: ['Interior Painting', 'Wall Texturing', 'Waterproofing'], phone: '27619876543', position: { lat: -25.8710, lng: 25.6290 } }
];

const categories = ['Plumber', 'Electrician', 'Cleaning', 'Handyman', 'Mechanic'];

const specialtyPresets = {
  Plumber: ['Leak Detection', 'Geyser Repair', 'Blocked Drains', 'Pipe Fitting', 'Bathroom Remodels'],
  Electrician: ['DB Boards', 'House Wiring', 'CoC Certificates', 'Generator Installs', 'Fault Finding'],
  Cleaning: ['Deep Cleaning', 'Carpet Wash', 'Office Cleaning', 'Post-Construction', 'Window Cleaning'],
  Handyman: ['Furniture Assembly', 'Door Hanging', 'Drywall Repair', 'Tiling', 'Bracket Mounting'],
  Mechanic: ['Brake Service', 'Engine Tuning', 'Oil Change', 'Diagnostics', 'Suspension Repair']
};

const MAP_ID = "YOUR_GOOGLE_MAP_ID"; 
const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export default function App() {
  // Navigation states
  const [viewMode, setViewMode] = useState('splash');
  const [exploreSubView, setExploreSubView] = useState('explore'); // 'explore' or 'map'
  const [selectedCategory, setSelectedCategory] = useState('Plumber');
  
  // Customization Theme States - Initial balance between system defaults and manual user preferences
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  
  // Advanced Proximity & Safety Filtering Parameters
  const [maxDistance, setMaxDistance] = useState(15); 
  const [onlyShowVerified, setOnlyShowVerified] = useState(false);
  
  // App Notification Toast System State
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Mock User Database
  const [users, setUsers] = useState([
    { phoneNumber: '812345678', password: 'Password123', fullName: 'Bongani Nduna', location: 'Mahikeng, North West', role: 'client' },
    { phoneNumber: '729876543', password: 'AdminSecure!', fullName: 'Lerato Sekho', location: 'Mmabatho, North West', role: 'artisan' }
  ]);
  const [artisans, setArtisans] = useState(initialArtisans);

  // Form input states
  const [isRegistering, setIsRegistering] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userRole, setUserRole] = useState('client');
  const [artisanTrade, setArtisanTrade] = useState('Plumber');
  
  // Artisan Setup Form States
  const [hourlyRate, setHourlyRate] = useState('250');
  const [artisanBio, setArtisanBio] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [pendingArtisanAccount, setPendingArtisanAccount] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  
  const [activeBookings, setActiveBookings] = useState([
    { id: 101, artisan: initialArtisans[0], date: 'Today, 14:00', status: 'Confirmed' }
  ]);

  // Sync state mutations directly to HTML DOM context tree
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Live structural device theme event observer
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const hasManualPreference = localStorage.getItem('theme');
      if (!hasManualPreference) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Accessibility (a11y) Escape Key Drawer Dismiss Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isProfileDrawerOpen) {
        setIsProfileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileDrawerOpen]);

  // Show App Notification Pop-up
  const showNotification = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  // Auto-Dismiss Toast Hook
  useEffect(() => {
    if (toast.show) {
      const dismissTimer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'error' });
      }, 4000);
      return () => clearTimeout(dismissTimer);
    }
  }, [toast.show]);

  // Splash Screen Timer
  useEffect(() => {
    if (viewMode === 'splash') {
      const timer = setTimeout(() => setViewMode('login'), 2200);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === 'login') {
      setPhoneNumber('');
      setPassword('');
      if(fullName) setFullName('');
    }
  }, [isRegistering, viewMode]);

  useEffect(() => {
    setSelectedSpecialties([]);
  }, [artisanTrade]);

  const getCleanPhone = (val) => val.replace(/[\s-]/g, '').replace(/^0/, '');

  // WHATSAPP OUTBOUND ROUTING GATEWAY
  const redirectToWhatsApp = (artisan) => {
    const baseCleanNumber = artisan.phone || "27812345678"; 
    const greeting = `Hi ${artisan.name}, I found your profile on Bereka app and would like to chat about your ${artisan.role} services.`;
    const encodedMessage = encodeURIComponent(greeting);
    const nativeWhatsAppUrl = `https://wa.me/${baseCleanNumber}?text=${encodedMessage}`;
    
    window.open(nativeWhatsAppUrl, '_blank');
  };

  // VERIFY & SIGN IN VIA CHANNELS
  const handleSignIn = (e) => {
    e.preventDefault();
    const cleanPhoneInput = getCleanPhone(phoneNumber);
    const foundUser = users.find(user => user.phoneNumber === cleanPhoneInput);

    if (!foundUser) {
      showNotification('Access Denied: This mobile number does not match an active account. Please sign up first.', 'error');
      return;
    }

    if (foundUser.password !== password) {
      showNotification('Authentication Error: Invalid password security parameters. Try again.', 'error');
      return;
    }

    setCurrentUser(foundUser);
    setViewMode('main');
    showNotification(`Welcome back, ${foundUser.fullName}!`, 'success');
  };

  // MOCK THIRD PARTY SIGN IN INTERCEPTOR
  const handleThirdPartyAuth = (providerName) => {
    const simulatedSocialUser = {
      phoneNumber: 'social-auth-session',
      fullName: `Authorized ${providerName} User`,
      location: 'Mahikeng, North West',
      role: 'client'
    };
    setCurrentUser(simulatedSocialUser);
    setViewMode('main');
    showNotification(`Successfully authenticated via ${providerName} Account Secure Gateway.`, 'success');
  };

  // VERIFY ACCOUNT SIGN UP CRITERIA
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showNotification('Missing Fields: Full structural identity or workspace profile names are required.', 'error');
      return;
    }

    const cleanPhoneInput = getCleanPhone(phoneNumber);
    const userExists = users.some(user => user.phoneNumber === cleanPhoneInput);

    if (userExists) {
      showNotification('Account Conflict: This phone number is already attached to a live profile.', 'error');
      return;
    }

    const newAccountBlueprint = {
      phoneNumber: cleanPhoneInput,
      password,
      fullName: fullName.trim(),
      location: 'Mahikeng, North West',
      role: userRole
    };

    if (userRole === 'artisan') {
      setPendingArtisanAccount(newAccountBlueprint);
      setViewMode('artisan-setup'); 
    } else {
      setUsers([...users, newAccountBlueprint]);
      showNotification('Account registered successfully! Please log in below.', 'success');
      setIsRegistering(false);
    }
  };

  const handleCompleteArtisanProfile = (e) => {
    e.preventDefault();
    if (!artisanBio.trim() || artisanBio.length < 20) {
      showNotification('Profile Error: Artisan business bio summaries must exceed 20 characters.', 'error');
      return;
    }

    setUsers([...users, pendingArtisanAccount]);

    const fullArtisanMarketplaceCard = {
      id: Date.now(),
      name: pendingArtisanAccount.fullName,
      role: artisanTrade,
      rating: 5.0,
      reviews: 0,
      distance: 0.5,
      isVerified: false,
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      bio: artisanBio.trim(),
      rate: `R${hourlyRate}/hr`,
      specialties: selectedSpecialties,
      phone: `27${pendingArtisanAccount.phoneNumber}`,
      position: { lat: -25.8560, lng: 25.6403 }
    };

    setArtisans([fullArtisanMarketplaceCard, ...artisans]);
    showNotification('Storefront created successfully! Access your profile via authentication page.', 'success');
    setPendingArtisanAccount(null);
    setIsRegistering(false);
    setViewMode('login');
  };

  const toggleSpecialty = (spec) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  // MULTI-LAYER FILTER CHAIN INTERCEPTOR (Trade -> Distance Boundary -> Verification Tag)
  const filteredArtisans = artisans.filter(art => {
    if (art.role !== selectedCategory) return false;
    if (art.distance > maxDistance) return false;
    if (onlyShowVerified && !art.isVerified) return false;
    return true;
  });

  const renderAppContent = () => {
    switch(viewMode) {
      case 'main':
        return (
          <>
            <header className="px-6 py-4 flex justify-between items-center border-b sticky top-0 z-20 bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Logo className="w-8 h-8 rounded-lg animate-fluid-fade" />
                <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">Bereka</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Desktop View Switcher Controls integrated fluidly inside the top row */}
                <div className="border p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 dark:border-slate-700/60 hidden sm:flex items-center">
                  <button onClick={() => setExploreSubView('explore')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${exploreSubView === 'explore' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500'}`}><Home className="w-3.5 h-3.5" /> List</button>
                  <button onClick={() => setExploreSubView('map')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${exploreSubView === 'map' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500'}`}><MapIcon className="w-3.5 h-3.5" /> Radar</button>
                </div>

                <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Active Session: <span className="text-emerald-600 font-extrabold dark:text-emerald-500">{currentUser?.role}</span>
                </div>
                <button onClick={() => showNotification("No new system alerts found.", "info")} className="p-2 rounded-full transition-all duration-300 relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:scale-110 active:scale-95">
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <Bell className="w-5 h-5" />
                </button>
                
                <div 
                  onClick={() => setIsProfileDrawerOpen(true)} 
                  className="w-9 h-9 rounded-full overflow-hidden border cursor-pointer hover:opacity-80 shadow-sm border-slate-200/60 dark:border-slate-700 transition-all duration-300 hover:scale-105"
                >
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Avatar" className="object-cover w-full h-full" />
                </div>
              </div>
            </header>

            {exploreSubView === 'map' ? (
              /* DYNAMIC FULL HEIGHT INTERACTIVE MAP VIEW CONTROLLER */
              <div className="flex-1 w-full h-full relative bg-slate-100 dark:bg-slate-900 animate-fluid-fade">
                <APIProvider apiKey={API_KEY}>
                  <Map
                    defaultCenter={{ lat: -25.8560, lng: 25.6403 }}
                    defaultZoom={13}
                    mapId={MAP_ID}
                    disableDefaultUI={true}
                    className="w-full h-full"
                  >
                    {/* User Location Node */}
                    <AdvancedMarker position={{ lat: -25.8560, lng: 25.6403 }}>
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-6 h-6 bg-emerald-500/30 rounded-full animate-ping" />
                        <div className="w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-md" />
                      </div>
                    </AdvancedMarker>

                    {/* Render Artisan Pin Nodes dynamically inside vector grid layout */}
                    {filteredArtisans.map((artisan) => (
                      <AdvancedMarker
                        key={artisan.id}
                        position={artisan.position || { lat: -25.8560, lng: 25.6403 }}
                        onClick={() => { setSelectedArtisan(artisan); setViewMode('artisan-detail'); }}
                      >
                        <div className="smooth-liquid-element px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 font-bold text-[10px] text-slate-800 dark:text-white flex items-center gap-1 cursor-pointer hover:scale-110">
                          <Target className="w-3 h-3 text-emerald-500" />
                          <span>{artisan.name.split(' ')[0]}</span>
                        </div>
                      </AdvancedMarker>
                    ))}
                  </Map>
                </APIProvider>
              </div>
            ) : (
              /* MAIN EXPLORE COMPONENT FRAME DIRECTORY */
              <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24 md:pb-6 bg-slate-50/50 dark:bg-slate-950">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm bg-white border-slate-200/60 dark:bg-slate-900 dark:border-slate-800/60 animate-fluid-fade">
                  <div className="inline-flex items-center gap-1.5 border px-3.5 py-2 rounded-xl text-xs font-semibold self-start md:self-auto bg-slate-50 border-slate-200/60 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentUser?.location || 'Mahikeng, NW'}</span>
                  </div>

                  <div className="relative flex-1 max-w-md w-full shadow-sm rounded-xl">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      placeholder={`Search within ${selectedCategory} class options...`} 
                      className="smooth-liquid-element w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-900"
                    />
                  </div>
                </div>

                {/* DYNAMIC CATEGORY FILTER CONTAINER */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Industry Classification Scope</h3>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`smooth-liquid-element px-5 py-2.5 rounded-xl font-semibold text-xs whitespace-nowrap border hover:scale-105 active:scale-95 ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                              : 'bg-white text-slate-600 border-slate-200/70 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ADVANCED FILTER CONTROLS MATRICES BLOCK */}
                <div className="p-4 rounded-2xl border bg-white border-slate-200/70 dark:bg-slate-900 dark:border-slate-800/80 space-y-4 shadow-sm animate-fluid-fade">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Advanced Range Controls</h4>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{maxDistance} km radius</span>
                  </div>

                  <div className="space-y-1">
                    <input 
                      type="range" 
                      min="2" 
                      max="50" 
                      value={maxDistance} 
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold font-mono">
                      <span>2 km</span>
                      <span>25 km</span>
                      <span>50 km</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Verified Credentials Only</label>
                      <p className="text-[10px] text-slate-400 font-medium">Filter out unvetted or pending contractor listings</p>
                    </div>
                    <button 
                      onClick={() => setOnlyShowVerified(!onlyShowVerified)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-all duration-500 relative focus:outline-none ${onlyShowVerified ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute top-0.5 transition-all duration-500 cubic-bezier-liquid ${onlyShowVerified ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Available Trade Masters Nearby</h2>
                  
                  {filteredArtisans.length === 0 ? (
                    <div className="p-8 text-center border rounded-2xl text-xs font-medium bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500 animate-fluid-fade">
                      No verified {selectedCategory} profiles match current filter matrix radius boundaries.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredArtisans.map((artisan, index) => (
                        <div 
                          key={artisan.id} 
                          onClick={() => { setSelectedArtisan(artisan); setViewMode('artisan-detail'); }}
                          style={{ animationDelay: `${index * 60}ms` }}
                          className="smooth-liquid-card p-5 rounded-2xl border shadow-sm flex flex-col justify-between cursor-pointer group bg-white border-slate-200/50 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800/60 dark:hover:border-slate-700"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <img src={artisan.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 transition-transform duration-500 group-hover:scale-105" />
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-semibold text-base text-slate-900 dark:text-white">{artisan.name}</h4>
                                {artisan.isVerified && (
                                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded">Pro</span>
                                )}
                              </div>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{artisan.role} • {artisan.distance} km away</p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" /> 
                                  <span className="text-slate-700 dark:text-slate-300 ml-0.5">{artisan.rating}</span> 
                                </div>
                                <span className="text-slate-400/40">|</span>
                                <span className="text-slate-400 text-[11px] font-medium">({artisan.reviews} reviews)</span>
                                <span className="text-slate-400/40">|</span>
                                <span className="text-emerald-600 font-bold text-xs dark:text-emerald-500">{artisan.rate}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => redirectToWhatsApp(artisan)} 
                              className="smooth-liquid-element p-3 rounded-xl border flex items-center justify-center bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400 dark:hover:bg-emerald-900/30 hover:scale-105 active:scale-95"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp className="w-5 h-5" />
                            </button>
                            
                            <button 
                              onClick={() => {
                                const newBooking = { id: Date.now(), artisan, date: 'Pending Client Brief', status: 'Confirmed' };
                                setActiveBookings([newBooking, ...activeBookings]);
                                setViewMode('bookings');
                                showNotification(`Booking ticket opened for ${artisan.name}!`, 'success');
                              }} 
                              className="smooth-liquid-element flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-sm text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
                            >
                              Contract Setup
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </main>
            )}
          </>
        );

      case 'artisan-detail':
        return selectedArtisan ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950 animate-fluid-fade">
            <div className="relative h-64 bg-slate-900">
              <img src={selectedArtisan.image} alt="" className="w-full h-full object-cover opacity-75 animate-fluid-fade" />
              <button onClick={() => setViewMode('main')} className="smooth-liquid-element absolute top-5 left-5 p-2.5 backdrop-blur rounded-xl shadow text-xs font-bold flex items-center gap-1.5 bg-white/95 text-slate-800 dark:bg-slate-900/90 dark:text-white dark:border dark:border-slate-800 hover:scale-105">
                <ArrowLeft className="w-4 h-4" /> Return to Directory
              </button>
            </div>

            <div className="flex-1 max-w-3xl w-full mx-auto px-6 pt-6 space-y-6 overflow-y-auto pb-24 md:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md">Verified Pro Profile</span>
                  <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">{selectedArtisan.name}</h2>
                  <p className="text-sm text-slate-500 font-medium">{selectedArtisan.role} Specialist</p>
                </div>
                
                <button 
                  onClick={() => redirectToWhatsApp(selectedArtisan)} 
                  className="smooth-liquid-element p-3.5 rounded-xl shadow-sm border flex items-center justify-center self-start sm:self-auto bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 hover:scale-105 active:scale-95"
                  title="Open WhatsApp Workspace"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 border-y py-4 max-w-md border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <span className="block text-xs text-slate-400 font-medium">Reputation</span>
                  <span className="font-bold text-sm flex items-center justify-center gap-1 mt-0.5 text-slate-800 dark:text-slate-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" /> {selectedArtisan.rating}
                  </span>
                </div>
                <div className="text-center border-x border-slate-100 dark:border-slate-800">
                  <span className="block text-xs text-slate-400 font-medium">Completed Jobs</span>
                  <span className="font-bold text-sm block mt-0.5 text-slate-800 dark:text-slate-200">{selectedArtisan.reviews} Projects</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs text-slate-400 font-medium">Base Quote</span>
                  <span className="font-bold text-sm text-emerald-600 block mt-0.5">{selectedArtisan.rate}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Core Services Scope</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.specialties?.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl text-xs font-semibold border bg-slate-100 border-slate-200/40 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">✓ {s}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Public Background Statement</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selectedArtisan.bio}</p>
              </div>
            </div>
          </div>
        ) : null;

      case 'bookings':
        return (
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 animate-fluid-fade">
            <header className="px-6 py-4 border-b bg-white border-slate-100 dark:bg-slate-900 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Bookings</h2>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950">
              {activeBookings.map((b) => (
                <div key={b.id} className="smooth-liquid-card p-5 rounded-2xl border flex justify-between items-center shadow-sm bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src={b.artisan.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{b.artisan.name}</h4>
                      <p className="text-xs text-slate-400 font-medium">{b.artisan.role} • {b.date}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-500 rounded-md flex items-center gap-1 uppercase tracking-wide">
                    <Clock className="w-3 h-3" /> {b.status}
                  </span>
                </div>
              ))}
            </main>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-0 md:p-8 antialiased relative overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-slate-950">
      
      {/* ADVANCED SMOOTHING AND LIQUID TIMING CURVES STYLE SHEET */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Custom Liquid Easing Configurations */
        .smooth-liquid-element {
          transition: all 0.4s cubic-bezier(0.25, 1, 0.2, 1);
        }
        
        .smooth-liquid-element:focus-within, .smooth-liquid-element:focus {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -6px rgba(5, 150, 105, 0.12);
        }

        .smooth-liquid-card {
          opacity: 0;
          animation: fluidFade 0.5s cubic-bezier(0.25, 1, 0.2, 1) forwards;
          transition: all 0.5s cubic-bezier(0.25, 1, 0.2, 1);
        }

        .smooth-liquid-card:hover {
          transform: translateY(-3px) scale(1.008);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
        }

        @keyframes fluidFade {
          0% { transform: translateY(8px); opacity: 0; filter: blur(2px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }

        .animate-fluid-fade {
          animation: fluidFade 0.4s cubic-bezier(0.25, 1, 0.2, 1) forwards;
        }

        @keyframes drawerSlide {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }

        .animate-drawer-slide {
          animation: drawerSlide 0.45s cubic-bezier(0.25, 1, 0.2, 1) forwards;
        }

        @keyframes toastSlide {
          0% { transform: translateY(-12px); opacity: 0; filter: blur(3px); }
          100% { transform: translateY(0); opacity: 1; filter: blur(0); }
        }

        .animate-toast-slide {
          animation: toastSlide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .cubic-bezier-liquid {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* SIDEBAR DRAWER OVERLAY OVER COMPONENT DASHBOARD */}
      {isProfileDrawerOpen && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex justify-end animate-fluid-fade">
          <div className="w-full max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between transform border-l bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white animate-drawer-slide">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white">Account Matrix</h3>
                </div>
                <button onClick={() => setIsProfileDrawerOpen(false)} className="smooth-liquid-element p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105 active:scale-95">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="" className="w-12 h-12 object-cover rounded-xl" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{currentUser?.fullName || 'Guest Identity'}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{currentUser?.location || 'Mahikeng, NW'}</p>
                </div>
              </div>

              {/* LIVE LIGHT / DARK TOGGLE ACTION ITEM */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Preferences</span>
                <div 
                  onClick={() => setDarkMode(!darkMode)}
                  className="smooth-liquid-element p-3 rounded-xl border flex items-center justify-between cursor-pointer bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>{darkMode ? 'Dark Theme Active' : 'Light Theme Active'}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 relative ${darkMode ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm absolute top-0.5 transition-all duration-300 cubic-bezier-liquid ${darkMode ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
                </div>
              </div>

              {/* ADDITIONAL APP PANEL CONFIGURATIONS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Security & Infrastructure</span>
                <button onClick={() => showNotification("Biometric parameters synced.", "success")} className="smooth-liquid-element w-full p-3 rounded-xl border border-slate-200 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 hover:scale-[1.01]">
                  <span className="flex items-center gap-2"><Sliders className="w-4 h-4" /> Gateway Adjustments</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
                <button onClick={() => showNotification("Protected via End-to-End Escrow Layer v2.4", "info")} className="smooth-liquid-element w-full p-3 rounded-xl border border-slate-200 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 hover:scale-[1.01]">
                  <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Legal & Trust Policies</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => { setIsProfileDrawerOpen(false); setCurrentUser(null); setViewMode('login'); }}
                className="smooth-liquid-element w-full py-3 border border-rose-500/20 text-rose-500 bg-rose-500/5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-500/10 hover:scale-102"
              >
                <LogOut className="w-4 h-4" /> Log out of Session
              </button>
              <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Bereka Native Platform • build_v0.0.1-prod
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST POP-UP */}
      {toast.show && (
        <div className="absolute top-5 inset-x-5 md:left-auto md:right-5 md:w-96 z-50 animate-toast-slide">
          <div className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3 text-xs font-semibold backdrop-blur-md transition-all ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            toast.type === 'info' ? 'bg-slate-50 border-slate-200 text-slate-800' :
            'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" /> :
             toast.type === 'info' ? <Info className="w-5 h-5 text-slate-600 flex-shrink-0" /> :
             <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
            <div className="space-y-0.5">
              <p className="font-bold uppercase tracking-wider text-[9px] opacity-60">{toast.type} Alert</p>
              <p className="leading-relaxed">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl h-screen md:h-[840px] rounded-none md:rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row relative border transition-all duration-500 bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        
        {viewMode !== 'splash' && viewMode !== 'login' && viewMode !== 'artisan-setup' && (
          <aside className="hidden md:flex flex-col justify-between w-64 bg-slate-900 text-slate-400 p-6 border-r border-slate-800">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-white px-2">
                <Logo className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-screen" />
                <span className="text-xl font-bold tracking-tight">Bereka</span>
              </div>
              <nav className="space-y-1">
                <button onClick={() => setViewMode('main')} className={`smooth-liquid-element w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${viewMode === 'main' || viewMode === 'artisan-detail' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><Home className="w-4 h-4" /> Explore Hub</button>
                <button onClick={() => setViewMode('bookings')} className={`smooth-liquid-element w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${viewMode === 'bookings' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><Calendar className="w-4 h-4" /> Bookings</button>
              </nav>
            </div>
            <div className="pt-4 border-t border-slate-800">
              <button onClick={() => setIsProfileDrawerOpen(true)} className="smooth-liquid-element w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-slate-800 hover:text-white"><Settings className="w-4 h-4" /> Control Panel</button>
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {viewMode === 'splash' && (
            <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col justify-center items-center px-8 relative">
              <Logo className="w-50 h-50 animate-bounce mix-blend-multiply dark:mix-blend-screen" />
            </div>
          )}

          {viewMode === 'artisan-setup' && (
            <div className="flex-1 bg-slate-50 dark:bg-slate-900 flex flex-col h-full overflow-y-auto p-6 md:p-12 items-center justify-center animate-fluid-fade">
              <div className="max-w-2xl w-full bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-xl space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Professional Setup Profile</h2>
                <form onSubmit={handleCompleteArtisanProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Trade Class</label>
                      <input type="text" disabled value={artisanTrade} className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-xl text-sm font-semibold cursor-not-allowed" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Hourly Rate (ZAR)</label>
                      <input type="number" required value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="smooth-liquid-element w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Specialties</label>
                    <div className="flex flex-wrap gap-2">
                      {specialtyPresets[artisanTrade]?.map((spec) => (
                        <button type="button" key={spec} onClick={() => toggleSpecialty(spec)} className={`smooth-liquid-element px-3 py-2 rounded-xl text-xs font-semibold border hover:scale-105 ${selectedSpecialties.includes(spec) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 dark:border-slate-700'}`}>{spec}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Public Bio</label>
                    <textarea required rows="4" value={artisanBio} onChange={(e) => setArtisanBio(e.target.value)} className="smooth-liquid-element w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm resize-none focus:outline-none"></textarea>
                  </div>
                  <button type="submit" className="smooth-liquid-element w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white font-semibold text-xs uppercase rounded-xl shadow-lg hover:scale-[1.01]">Publish Storefront</button>
                </form>
              </div>
            </div>
          )}

          {viewMode === 'login' && (
            <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col lg:flex-row h-full overflow-y-auto animate-fluid-fade">
              <div className="flex-1 px-6 md:px-16 py-8 flex flex-col justify-between max-w-xl mx-auto w-full">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <Logo className="w-35 h-35 object-contain mix-blend-multiply dark:mix-blend-screen" />
                  <h2 className="text-2xl tracking-tight text-slate-900 dark:text-white mt-4">{isRegistering ? 'Create account' : 'Welcome!'}</h2>
                </div>
                
                <form onSubmit={isRegistering ? handleSignUp : handleSignIn} className="space-y-4 my-4">
                  {isRegistering && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Designation</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button type="button" onClick={() => setUserRole('client')} className={`smooth-liquid-element p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center hover:scale-102 ${userRole === 'client' ? 'border-slate-950 bg-slate-950 text-white dark:border-emerald-500 dark:bg-emerald-600' : 'border-slate-200 dark:border-slate-800 dark:text-slate-400'}`}><UserCheck className="w-4 h-4" /><span className="text-[10px] font-bold">Client</span></button>
                          <button type="button" onClick={() => setUserRole('artisan')} className={`smooth-liquid-element p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center hover:scale-102 ${userRole === 'artisan' ? 'border-slate-950 bg-slate-950 text-white dark:border-emerald-500 dark:bg-emerald-600' : 'border-slate-200 dark:border-slate-800 dark:text-slate-400'}`}><Briefcase className="w-4 h-4" /><span className="text-[10px] font-bold">Artisan</span></button>
                          <button type="button" onClick={() => setUserRole('casual')} className={`smooth-liquid-element p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center hover:scale-102 ${userRole === 'casual' ? 'border-slate-950 bg-slate-950 text-white dark:border-emerald-500 dark:bg-emerald-600' : 'border-slate-200 dark:border-slate-800 dark:text-slate-400'}`}><Zap className="w-4 h-4" /><span className="text-[10px] font-bold">Casual</span></button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                        <input type="text" placeholder="e.g. Thabo Molefe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="smooth-liquid-element w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" />
                      </div>
                      {userRole === 'artisan' && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Trade Category</label>
                          <select value={artisanTrade} onChange={(e) => setArtisanTrade(e.target.value)} className="smooth-liquid-element w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-xs font-bold border-r border-slate-200 dark:border-slate-700 pr-3 my-2.5">+27</span>
                      <input type="tel" required placeholder="81 234 5678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="smooth-liquid-element w-full pl-20 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="smooth-liquid-element w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-slate-600 transition-colors duration-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>

                  <button type="submit" className="smooth-liquid-element w-full py-3.5 bg-slate-900 dark:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-[1.01]">
                    {isRegistering ? 'Register Profile' : 'Sign In'}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase">or continue with</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-slate-800"></div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button type="button" onClick={() => handleThirdPartyAuth('Google')} className="smooth-liquid-element flex items-center justify-center gap-3 w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 hover:scale-[1.01]">
                      <FaGoogle className="text-red-500 text-sm" /> Continue with Google
                    </button>
                    <button type="button" onClick={() => handleThirdPartyAuth('Facebook')} className="smooth-liquid-element flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-[#1877F2] text-white rounded-xl text-[11px] font-bold shadow-sm hover:bg-[#166FE5] hover:scale-[1.01]">
                      <FaFacebook className="text-sm" /> Continue with Facebook
                    </button>
                    <button type="button" onClick={() => handleThirdPartyAuth('Apple')} className="smooth-liquid-element flex items-center justify-center gap-3 w-full px-4 py-2.5 bg-black text-white rounded-xl text-[11px] font-bold shadow-sm hover:bg-gray-900 hover:scale-[1.01]">
                      <FaApple className="text-sm" /> Continue with Apple
                    </button>
                  </div>
                </form>
                <div className="text-center"><button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs font-bold text-emerald-600 hover:underline smooth-liquid-element">{isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}</button></div>
              </div>
            </div>
          )}

          {viewMode !== 'splash' && viewMode !== 'login' && viewMode !== 'artisan-setup' && renderAppContent()}

          {viewMode !== 'splash' && viewMode !== 'login' && viewMode !== 'artisan-setup' && (
            <nav className="absolute bottom-0 inset-x-0 border-t px-6 py-3 flex justify-between items-center text-slate-400 z-30 md:hidden bg-white/95 backdrop-blur-md border-slate-100 dark:bg-slate-900/95 dark:border-slate-800">
              <button onClick={() => { setViewMode('main'); setExploreSubView('explore'); }} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${viewMode === 'main' && exploreSubView === 'explore' ? 'text-emerald-600' : ''}`}><Home className="w-5 h-5" /><span>List</span></button>
              <button onClick={() => { setViewMode('main'); setExploreSubView('map'); }} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${viewMode === 'main' && exploreSubView === 'map' ? 'text-emerald-600' : ''}`}><MapIcon className="w-5 h-5" /><span>Radar</span></button>
              <button onClick={() => setViewMode('bookings')} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${viewMode === 'bookings' ? 'text-emerald-600' : ''}`}><Calendar className="w-5 h-5" /><span>Bookings</span></button>
              <button onClick={() => setIsProfileDrawerOpen(true)} className="flex flex-col items-center gap-1 text-[10px] smooth-liquid-element"><Settings className="w-5 h-5" /><span>Settings</span></button>
            </nav>
          )}

        </div>
      </div>
    </div>
  );
}