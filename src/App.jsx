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
  Map as MapIcon,
  Heart,
  Pencil,
} from 'lucide-react';
import { FaGoogle, FaFacebook, FaApple, FaWhatsapp } from 'react-icons/fa6';

// INITIAL SEED ARTISANS WITH SOUTH AFRICAN COUNTRY CODE NUMBERS FOR WHATSAPP LINKING
const initialArtisans = [
  { id: 1, name: 'Thabo Molefe', role: 'Plumber', rating: 4.8, reviews: 24, distance: 1.2, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150', bio: 'Specialist in residential plumbing, leak detection, and emergency repairs with over 5 years of active service in the Mmabatho area.', rate: 'R250/hr', specialties: ['Leak Detection', 'Geyser Repair', 'Blocked Drains'], phone: '27812345678', position: { lat: -25.8560, lng: 25.6403 } },
  { id: 2, name: 'John Doe', role: 'Electrician', rating: 4.9, reviews: 42, distance: 3.2, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Certified commercial and domestic electrician. Expert in DB board upgrades, household wiring, and certificate of compliance (CoC) issuing.', rate: 'R300/hr', specialties: ['DB Boards', 'House Wiring', 'CoC Certificates'], phone: '27729876543', position: { lat: -25.8420, lng: 25.6610 } },
  { id: 3, name: 'Jane Smith', role: 'Painter', rating: 4.7, reviews: 18, distance: 8.5, isVerified: false, status: 'Busy', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Professional interior and exterior structural coatings designer. Dedicated to clean preparation pipelines and premium finishing textures.', rate: 'R220/hr', specialties: ['Interior Painting', 'Wall Texturing', 'Waterproofing'], phone: '27619876543', position: { lat: -25.8710, lng: 25.6290 } },
  { id: 4, name: 'Sipho Ndlovu', role: 'Plumber', rating: 4.6, reviews: 15, distance: 4.5, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150', bio: 'Handles new installations, pipe fitting, and full bathroom remodel plumbing for homes and small offices around Mahikeng.', rate: 'R240/hr', specialties: ['Pipe Fitting', 'Bathroom Remodels', 'Leak Detection'], phone: '27823456781', position: { lat: -25.8480, lng: 25.6350 } },
  { id: 5, name: 'Naledi Mokoena', role: 'Plumber', rating: 4.3, reviews: 9, distance: 12.0, isVerified: false, status: 'Busy', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Independent plumber covering blocked drains and geyser replacements, with flexible weekend callouts.', rate: 'R210/hr', specialties: ['Blocked Drains', 'Geyser Repair'], phone: '27834567892', position: { lat: -25.8650, lng: 25.6520 } },
  { id: 6, name: 'Karabo Mahlangu', role: 'Electrician', rating: 4.5, reviews: 20, distance: 6.1, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Focuses on fault finding and generator installations for both residential backup power and small commercial sites.', rate: 'R280/hr', specialties: ['Fault Finding', 'Generator Installs'], phone: '27845678903', position: { lat: -25.8390, lng: 25.6470 } },
  { id: 7, name: 'Precious Dlamini', role: 'Electrician', rating: 4.9, reviews: 33, distance: 2.0, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150', bio: 'CoC-certified electrician specializing in DB board upgrades and full house rewiring for older properties.', rate: 'R320/hr', specialties: ['DB Boards', 'House Wiring', 'CoC Certificates'], phone: '27856789014', position: { lat: -25.8530, lng: 25.6380 } },
  { id: 8, name: 'Nomsa Khumalo', role: 'Cleaning', rating: 4.8, reviews: 27, distance: 1.8, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Runs a small deep-cleaning team covering homes and offices, with same-week availability most weeks.', rate: 'R180/hr', specialties: ['Deep Cleaning', 'Office Cleaning'], phone: '27867890125', position: { lat: -25.8575, lng: 25.6415 } },
  { id: 9, name: 'Grace Mokwena', role: 'Cleaning', rating: 4.4, reviews: 11, distance: 9.4, isVerified: false, status: 'Busy', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Specialist in post-construction and move-in/move-out cleaning for new builds and renovations.', rate: 'R160/hr', specialties: ['Post-Construction', 'Window Cleaning'], phone: '27878901236', position: { lat: -25.8620, lng: 25.6280 } },
  { id: 10, name: 'Ayanda Zulu', role: 'Cleaning', rating: 4.6, reviews: 19, distance: 3.3, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150', bio: 'Offers scheduled weekly and bi-weekly cleaning packages, plus one-off carpet and upholstery washes.', rate: 'R190/hr', specialties: ['Carpet Wash', 'Deep Cleaning'], phone: '27889012347', position: { lat: -25.8500, lng: 25.6440 } },
  { id: 11, name: 'Tumelo Baloyi', role: 'Handyman', rating: 4.7, reviews: 22, distance: 5.0, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'General handyman for furniture assembly, drywall patchwork, and small home repairs — quick turnaround.', rate: 'R230/hr', specialties: ['Furniture Assembly', 'Drywall Repair'], phone: '27890123458', position: { lat: -25.8455, lng: 25.6520 } },
  { id: 12, name: 'Kagiso Ramaphosa', role: 'Handyman', rating: 4.2, reviews: 6, distance: 14.7, isVerified: false, status: 'Busy', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Handles tiling, door hanging, and bracket mounting jobs across the wider Mmabatho area.', rate: 'R200/hr', specialties: ['Tiling', 'Door Hanging', 'Bracket Mounting'], phone: '27801234569', position: { lat: -25.8700, lng: 25.6600 } },
  { id: 13, name: 'Refilwe Sithole', role: 'Mechanic', rating: 4.8, reviews: 31, distance: 2.9, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150', bio: 'Mobile mechanic offering brake service and diagnostics call-outs, no need to tow your car to a shop.', rate: 'R260/hr', specialties: ['Brake Service', 'Diagnostics'], phone: '27812345601', position: { lat: -25.8545, lng: 25.6360 } },
  { id: 14, name: 'Bongani Mthembu', role: 'Mechanic', rating: 4.5, reviews: 17, distance: 7.6, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Engine tuning and suspension repair specialist with a background in fleet maintenance.', rate: 'R240/hr', specialties: ['Engine Tuning', 'Suspension Repair'], phone: '27823456712', position: { lat: -25.8375, lng: 25.6250 } },
  { id: 15, name: 'Lindiwe Nkosi', role: 'Mechanic', rating: 4.1, reviews: 8, distance: 18.2, isVerified: false, status: 'Busy', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Budget-friendly oil changes and general diagnostics, mostly serving the outer Mahikeng suburbs.', rate: 'R210/hr', specialties: ['Oil Change', 'Diagnostics'], phone: '27834567823', position: { lat: -25.8800, lng: 25.6700 } },
  { id: 16, name: 'Pieter van Wyk', role: 'Painter', rating: 4.6, reviews: 14, distance: 6.8, isVerified: true, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Exterior and spray-finish specialist, often working on larger residential repaint projects.', rate: 'R230/hr', specialties: ['Exterior Painting', 'Spray Finishing'], phone: '27845678934', position: { lat: -25.8320, lng: 25.6550 } }
];

const categories = ['Plumber', 'Electrician', 'Cleaning', 'Handyman', 'Mechanic', 'Painter'];
const filterCategories = ['All', ...categories];

const specialtyPresets = {
  Plumber: ['Leak Detection', 'Geyser Repair', 'Blocked Drains', 'Pipe Fitting', 'Bathroom Remodels'],
  Electrician: ['DB Boards', 'House Wiring', 'CoC Certificates', 'Generator Installs', 'Fault Finding'],
  Cleaning: ['Deep Cleaning', 'Carpet Wash', 'Office Cleaning', 'Post-Construction', 'Window Cleaning'],
  Handyman: ['Furniture Assembly', 'Door Hanging', 'Drywall Repair', 'Tiling', 'Bracket Mounting'],
  Mechanic: ['Brake Service', 'Engine Tuning', 'Oil Change', 'Diagnostics', 'Suspension Repair'],
  Painter: ['Interior Painting', 'Exterior Painting', 'Wall Texturing', 'Waterproofing', 'Spray Finishing']
};

// Safe localStorage reader — falls back gracefully if storage is unavailable (private browsing, etc.)
const loadFromStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  // Navigation states
  const [viewMode, setViewMode] = useState('splash');
  const [exploreSubView, setExploreSubView] = useState('explore'); // 'explore' or 'nearby'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Mock User Database — seeded on first run, then persisted to localStorage
  const defaultUsers = [
    { phoneNumber: '812345678', password: 'Password123', fullName: 'Bongani Nduna', location: 'Mahikeng, North West', role: 'client' },
    { phoneNumber: '729876543', password: 'AdminSecure!', fullName: 'Lerato Sekho', location: 'Mmabatho, North West', role: 'artisan' }
  ];
  const [users, setUsers] = useState(() => loadFromStorage('bereka_users', defaultUsers));
  const [artisans, setArtisans] = useState(() => loadFromStorage('bereka_artisans', initialArtisans));

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
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage('bereka_current_user', null));
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [bookingModalArtisan, setBookingModalArtisan] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNote, setBookingNote] = useState('');

  const [favorites, setFavorites] = useState(() => loadFromStorage('bereka_favorites', []));
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const defaultBookings = [
    { id: 101, artisan: initialArtisans[0], date: 'Today, 14:00', status: 'Confirmed', clientPhone: '812345678', clientName: 'Bongani Nduna', reviewed: false }
  ];
  const [activeBookings, setActiveBookings] = useState(() => loadFromStorage('bereka_bookings', defaultBookings));

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

  // Splash Screen Timer — skip straight into the app if a session was already saved
  useEffect(() => {
    if (viewMode === 'splash') {
      const timer = setTimeout(() => {
        setViewMode(currentUser ? 'main' : 'login');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [viewMode, currentUser]);

  // Persistence: keep mock "backend" state alive across reloads
  useEffect(() => {
    localStorage.setItem('bereka_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bereka_artisans', JSON.stringify(artisans));
  }, [artisans]);

  useEffect(() => {
    localStorage.setItem('bereka_bookings', JSON.stringify(activeBookings));
  }, [activeBookings]);

  useEffect(() => {
    localStorage.setItem('bereka_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bereka_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bereka_current_user');
    }
  }, [currentUser]);

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

    if (cleanPhoneInput.length !== 9) {
      showNotification('Invalid Number: Enter a valid 9-digit South African mobile number.', 'error');
      return;
    }

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
    if (cleanPhoneInput.length !== 9) {
      showNotification('Invalid Number: Enter a valid 9-digit South African mobile number.', 'error');
      return;
    }

    if (password.length < 6) {
      showNotification('Weak Password: Use at least 6 characters.', 'error');
      return;
    }

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

  const toggleFavorite = (artisanId) => {
    setFavorites(prev => prev.includes(artisanId) ? prev.filter(id => id !== artisanId) : [...prev, artisanId]);
  };

  const cancelBooking = (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    setActiveBookings(activeBookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    showNotification('Booking cancelled.', 'info');
  };

  const completeJob = (bookingId) => {
    setActiveBookings(activeBookings.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
    showNotification('Job marked as completed.', 'success');
  };

  const submitReview = () => {
    if (!reviewModalBooking) return;
    const artisanId = reviewModalBooking.artisan.id;
    setArtisans(artisans.map(a => {
      if (a.id !== artisanId) return a;
      const newReviews = a.reviews + 1;
      const newRating = Number((((a.rating * a.reviews) + reviewRating) / newReviews).toFixed(1));
      return { ...a, rating: newRating, reviews: newReviews };
    }));
    setActiveBookings(activeBookings.map(b => b.id === reviewModalBooking.id ? { ...b, reviewed: true, myRating: reviewRating } : b));
    showNotification('Thanks for your review!', 'success');
    setReviewModalBooking(null);
    setReviewRating(5);
  };

  const startEditingProfile = () => {
    setEditName(currentUser?.fullName || '');
    setEditLocation(currentUser?.location || '');
    setIsEditingProfile(true);
  };

  const saveProfileEdits = () => {
    if (!editName.trim()) {
      showNotification('Name cannot be empty.', 'error');
      return;
    }
    const updatedUser = { ...currentUser, fullName: editName.trim(), location: editLocation.trim() || currentUser.location };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.phoneNumber === currentUser.phoneNumber ? { ...u, fullName: updatedUser.fullName, location: updatedUser.location } : u));
    setIsEditingProfile(false);
    showNotification('Profile updated.', 'success');
  };

  // MULTI-LAYER FILTER CHAIN INTERCEPTOR (Trade -> Distance Boundary -> Verification Tag)
  const filteredArtisans = artisans.filter(art => {
    if (selectedCategory !== 'All' && art.role !== selectedCategory) return false;
    if (art.distance > maxDistance) return false;
    if (onlyShowVerified && !art.isVerified) return false;
    if (searchQuery.trim() && !art.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) return false;
    return true;
  });

  // Used by the Nearby (proximity board) view — sorted closest-first, grouped into distance bands
  const sortedByDistance = [...filteredArtisans].sort((a, b) => a.distance - b.distance);
  const proximityBands = [
    { label: 'Nearby', min: 0, max: 5 },
    { label: 'Moderate Distance', min: 5, max: 15 },
    { label: 'Further Out', min: 15, max: Infinity }
  ];

  // Used by the Saved tab
  const savedArtisans = artisans.filter(a => favorites.includes(a.id));

  // Used by the artisan-side "My Jobs" dashboard — bookings made against this artisan's own storefront
  const myJobs = activeBookings.filter(b => b.artisan?.phone === `27${currentUser?.phoneNumber}`);

  const renderAppContent = () => {
    switch(viewMode) {
      case 'main':
        return (
          <>
            <header className="liquid-glass px-6 py-4 flex justify-between items-center border-b sticky top-0 z-20 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Logo className="w-8 h-8 rounded-lg animate-fluid-fade" />
                <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">Bereka</h1>
              </div>
              <div className="flex items-center gap-4">
                {/* Desktop View Switcher Controls integrated fluidly inside the top row */}
                <div className="border p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 dark:border-slate-700/60 hidden sm:flex items-center">
                  <button onClick={() => setExploreSubView('explore')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${exploreSubView === 'explore' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500'}`}><Home className="w-3.5 h-3.5" /> List</button>
                  <button onClick={() => setExploreSubView('nearby')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${exploreSubView === 'nearby' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500'}`}><MapIcon className="w-3.5 h-3.5" /> Nearby</button>
                  <button onClick={() => setExploreSubView('saved')} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${exploreSubView === 'saved' ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500'}`}><Heart className="w-3.5 h-3.5" /> Saved</button>
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

            {exploreSubView === 'nearby' ? (
              /* PROXIMITY BOARD — distance-sorted, banded by range, no external map dependency */
              <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24 md:pb-6 bg-slate-50/50 dark:bg-slate-950 animate-fluid-fade">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Proximity Board{selectedCategory !== 'All' ? ` · ${selectedCategory}` : ''}</h2>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{filteredArtisans.length} found</span>
                </div>

                {filteredArtisans.length === 0 ? (
                  <div className="p-8 text-center border rounded-2xl text-xs font-medium bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500">
                    No {selectedCategory === 'All' ? '' : `${selectedCategory} `}profiles match current filter matrix radius boundaries.
                  </div>
                ) : (
                  proximityBands.map((band) => {
                    const bandArtisans = sortedByDistance.filter(a => a.distance > band.min && a.distance <= band.max);
                    if (bandArtisans.length === 0) return null;
                    return (
                      <div key={band.label} className="space-y-2.5">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {band.label}
                          <span className="text-slate-300 dark:text-slate-700 font-normal normal-case tracking-normal">({bandArtisans.length})</span>
                        </h3>
                        <div className="space-y-2.5">
                          {bandArtisans.map((artisan) => (
                            <div
                              key={artisan.id}
                              onClick={() => { setSelectedArtisan(artisan); setViewMode('artisan-detail'); }}
                              className="smooth-liquid-card group cursor-pointer flex items-center gap-4 p-4 rounded-2xl border bg-white border-slate-200/60 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800/60 dark:hover:border-slate-700 shadow-sm"
                            >
                              <img src={artisan.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 transition-transform duration-500 group-hover:scale-105" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{artisan.name}</h4>
                                  {artisan.isVerified && (
                                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded flex-shrink-0">Pro</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <div className="flex-1 max-w-[140px] h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                      style={{ width: `${Math.min(100, (artisan.distance / maxDistance) * 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400 font-mono flex-shrink-0">{artisan.distance} km</span>
                                </div>
                              </div>
                              <div className="hidden sm:flex items-center gap-1 text-xs text-amber-500 font-medium flex-shrink-0">
                                <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                                <span className="text-slate-700 dark:text-slate-300">{artisan.rating}</span>
                              </div>
                              <span className="hidden md:block text-emerald-600 dark:text-emerald-500 font-bold text-xs flex-shrink-0">{artisan.rate}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(artisan.id); }}
                                title={favorites.includes(artisan.id) ? 'Remove from saved' : 'Save artisan'}
                                aria-label={favorites.includes(artisan.id) ? 'Remove from saved' : 'Save artisan'}
                                className="smooth-liquid-element p-2.5 rounded-xl border flex items-center justify-center bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 flex-shrink-0"
                              >
                                <Heart className={`w-4 h-4 ${favorites.includes(artisan.id) ? 'fill-rose-500 stroke-rose-500' : 'stroke-slate-400'}`} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); redirectToWhatsApp(artisan); }}
                                title="Chat on WhatsApp"
                                className="smooth-liquid-element p-2.5 rounded-xl border flex items-center justify-center bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400 dark:hover:bg-emerald-900/30 hover:scale-105 active:scale-95 flex-shrink-0"
                              >
                                <FaWhatsapp className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </main>
            ) : exploreSubView === 'saved' ? (
              /* SAVED / FAVORITES BOARD */
              <main className="flex-1 overflow-y-auto px-6 py-6 space-y-3 pb-24 md:pb-6 bg-slate-50/50 dark:bg-slate-950 animate-fluid-fade">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Saved Professionals</h2>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{savedArtisans.length} saved</span>
                </div>

                {savedArtisans.length === 0 ? (
                  <div className="p-8 text-center border rounded-2xl text-xs font-medium bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500">
                    Nothing saved yet. Tap the heart icon on any profile to bookmark it here.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {savedArtisans.map((artisan) => (
                      <div
                        key={artisan.id}
                        onClick={() => { setSelectedArtisan(artisan); setViewMode('artisan-detail'); }}
                        className="smooth-liquid-card group cursor-pointer flex items-center gap-4 p-4 rounded-2xl border bg-white border-slate-200/60 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800/60 dark:hover:border-slate-700 shadow-sm"
                      >
                        <img src={artisan.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 transition-transform duration-500 group-hover:scale-105" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{artisan.name}</h4>
                            {artisan.isVerified && (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded flex-shrink-0">Pro</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">{artisan.role} • {artisan.distance} km away</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-xs text-amber-500 font-medium flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                          <span className="text-slate-700 dark:text-slate-300">{artisan.rating}</span>
                        </div>
                        <span className="hidden md:block text-emerald-600 dark:text-emerald-500 font-bold text-xs flex-shrink-0">{artisan.rate}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(artisan.id); }}
                          title="Remove from saved"
                          aria-label="Remove from saved"
                          className="smooth-liquid-element p-2.5 rounded-xl border flex items-center justify-center bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 flex-shrink-0"
                        >
                          <Heart className="w-4 h-4 fill-rose-500 stroke-rose-500" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); redirectToWhatsApp(artisan); }}
                          title="Chat on WhatsApp"
                          className="smooth-liquid-element p-2.5 rounded-xl border flex items-center justify-center bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400 dark:hover:bg-emerald-900/30 hover:scale-105 active:scale-95 flex-shrink-0"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </main>
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={selectedCategory === 'All' ? 'Search all trades...' : `Search within ${selectedCategory} class options...`} 
                      className="smooth-liquid-element w-full pl-10 pr-10 py-3 border rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 border-slate-200 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:bg-slate-900"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* DYNAMIC CATEGORY FILTER CONTAINER */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Industry Classification Scope</h3>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {filterCategories.map((cat) => {
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
                      No verified {selectedCategory === 'All' ? '' : `${selectedCategory} `}profiles match current filter matrix radius boundaries.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {filteredArtisans.map((artisan, index) => (
                        <div 
                          key={artisan.id} 
                          onClick={() => { setSelectedArtisan(artisan); setViewMode('artisan-detail'); }}
                          style={{ animationDelay: `${index * 60}ms` }}
                          className="smooth-liquid-card p-5 rounded-2xl border shadow-sm flex flex-col justify-between cursor-pointer group relative bg-white border-slate-200/50 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800/60 dark:hover:border-slate-700"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(artisan.id); }}
                            title={favorites.includes(artisan.id) ? 'Remove from saved' : 'Save artisan'}
                            aria-label={favorites.includes(artisan.id) ? 'Remove from saved' : 'Save artisan'}
                            className="smooth-liquid-element absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-sm hover:scale-110 active:scale-95 z-10"
                          >
                            <Heart className={`w-4 h-4 ${favorites.includes(artisan.id) ? 'fill-rose-500 stroke-rose-500' : 'stroke-slate-400'}`} />
                          </button>
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
                              onClick={() => setBookingModalArtisan(artisan)} 
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
                
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => toggleFavorite(selectedArtisan.id)}
                    title={favorites.includes(selectedArtisan.id) ? 'Remove from saved' : 'Save artisan'}
                    aria-label={favorites.includes(selectedArtisan.id) ? 'Remove from saved' : 'Save artisan'}
                    className="smooth-liquid-element p-3.5 rounded-xl shadow-sm border flex items-center justify-center bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 hover:scale-105 active:scale-95"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedArtisan.id) ? 'fill-rose-500 stroke-rose-500' : ''}`} />
                  </button>
                  <button 
                    onClick={() => redirectToWhatsApp(selectedArtisan)} 
                    className="smooth-liquid-element p-3.5 rounded-xl shadow-sm border flex items-center justify-center bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400 dark:hover:bg-emerald-900/30 hover:scale-105 active:scale-95"
                    title="Open WhatsApp Workspace"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setBookingModalArtisan(selectedArtisan)}
                    className="smooth-liquid-element px-5 py-3.5 rounded-xl shadow-sm border bg-emerald-600 border-emerald-600 text-white text-xs font-bold tracking-wide hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 hover:scale-105 active:scale-95"
                  >
                    Contract Setup
                  </button>
                </div>
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

      case 'bookings': {
        const myBookings = activeBookings.filter(b => b.clientPhone === currentUser?.phoneNumber);
        return (
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 animate-fluid-fade">
            <header className="liquid-glass px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Bookings</h2>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950 pb-24 md:pb-6">
              {myBookings.length === 0 ? (
                <div className="p-8 text-center border rounded-2xl text-xs font-medium bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500 animate-fluid-fade">
                  No active bookings yet. Explore the directory to book a trade professional.
                </div>
              ) : myBookings.map((b) => (
                <div key={b.id} className="smooth-liquid-card p-5 rounded-2xl border shadow-sm bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={b.artisan.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{b.artisan.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{b.artisan.role} • {b.date}</p>
                        {b.note && <p className="text-[11px] text-slate-400 italic mt-0.5 truncate">"{b.note}"</p>}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide flex-shrink-0 ${
                      b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : b.status === 'Completed' ? 'bg-slate-500/10 text-slate-500 dark:text-slate-400' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      <Clock className="w-3 h-3" /> {b.status}
                    </span>
                  </div>
                  {b.status === 'Confirmed' && (
                    <button onClick={() => cancelBooking(b.id)} className="smooth-liquid-element w-full py-2.5 border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/30 rounded-xl text-xs font-bold">
                      Cancel Booking
                    </button>
                  )}
                  {b.status === 'Completed' && !b.reviewed && (
                    <button onClick={() => { setReviewModalBooking(b); setReviewRating(5); }} className="smooth-liquid-element w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-white stroke-white" /> Rate this Job
                    </button>
                  )}
                  {b.status === 'Completed' && b.reviewed && (
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> You rated this job {b.myRating}★
                    </div>
                  )}
                </div>
              ))}
            </main>
          </div>
        );
      }

      case 'jobs': {
        return (
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 animate-fluid-fade">
            <header className="liquid-glass px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Jobs</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Incoming bookings for your storefront</p>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950 pb-24 md:pb-6">
              {myJobs.length === 0 ? (
                <div className="p-8 text-center border rounded-2xl text-xs font-medium bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-500 animate-fluid-fade">
                  No job requests yet. Clients who book your storefront will show up here.
                </div>
              ) : myJobs.map((b) => (
                <div key={b.id} className="smooth-liquid-card p-5 rounded-2xl border shadow-sm bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{b.clientName || 'Client'}</h4>
                      <p className="text-xs text-slate-400 font-medium">{b.date}</p>
                      {b.note && <p className="text-[11px] text-slate-400 italic mt-1">"{b.note}"</p>}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide flex-shrink-0 ${
                      b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : b.status === 'Completed' ? 'bg-slate-500/10 text-slate-500 dark:text-slate-400' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      <Clock className="w-3 h-3" /> {b.status}
                    </span>
                  </div>
                  {b.status === 'Confirmed' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => completeJob(b.id)} className="smooth-liquid-element flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">Mark Completed</button>
                      <button onClick={() => cancelBooking(b.id)} className="smooth-liquid-element flex-1 py-2.5 border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/30 rounded-xl text-xs font-bold">Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </main>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-0 md:p-8 antialiased relative overflow-hidden bg-slate-50 transition-colors duration-500 dark:bg-slate-950">

      {/* Ambient liquid blobs — decorative depth behind the app card, same palette, no new colors */}
      <div className="hidden md:block absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-emerald-300/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      
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
                <button onClick={() => { setIsProfileDrawerOpen(false); setIsEditingProfile(false); }} className="smooth-liquid-element p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105 active:scale-95">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 space-y-3">
                {isEditingProfile ? (
                  <>
                    <div className="flex items-center gap-4">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="" className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-2 min-w-0">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Full name"
                          className="smooth-liquid-element w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                        />
                        <input
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="Location"
                          className="smooth-liquid-element w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveProfileEdits} className="smooth-liquid-element flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold">Save</button>
                      <button onClick={() => setIsEditingProfile(false)} className="smooth-liquid-element flex-1 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold">Cancel</button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="" className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentUser?.fullName || 'Guest Identity'}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">{currentUser?.location || 'Mahikeng, NW'}</p>
                    </div>
                    <button onClick={startEditingProfile} aria-label="Edit profile" title="Edit profile" className="smooth-liquid-element p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex-shrink-0">
                      <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
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
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    setIsProfileDrawerOpen(false);
                    setIsEditingProfile(false);
                    setCurrentUser(null);
                    setViewMode('login');
                  }
                }}
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

      {/* BOOKING CONFIRMATION MODAL */}
      {bookingModalArtisan && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fluid-fade">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Book {bookingModalArtisan.name}</h3>
              <button
                onClick={() => { setBookingModalArtisan(null); setBookingDate(''); setBookingNote(''); }}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close booking dialog"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="booking-date" className="text-[10px] font-bold text-slate-400 uppercase">Preferred Date & Time</label>
              <input
                id="booking-date"
                type="datetime-local"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="smooth-liquid-element w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="booking-note" className="text-[10px] font-bold text-slate-400 uppercase">Job Notes (optional)</label>
              <textarea
                id="booking-note"
                rows="3"
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
                placeholder="Briefly describe the job..."
                className="smooth-liquid-element w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm resize-none focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                if (!bookingDate) {
                  showNotification('Missing Date: Choose a preferred date and time.', 'error');
                  return;
                }
                const formattedDate = new Date(bookingDate).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
                const newBooking = { id: Date.now(), artisan: bookingModalArtisan, date: formattedDate, note: bookingNote.trim(), status: 'Confirmed', clientPhone: currentUser?.phoneNumber, clientName: currentUser?.fullName, reviewed: false };
                setActiveBookings([newBooking, ...activeBookings]);
                setBookingModalArtisan(null);
                setBookingDate('');
                setBookingNote('');
                setViewMode('bookings');
                showNotification(`Booking confirmed with ${bookingModalArtisan.name}!`, 'success');
              }}
              className="smooth-liquid-element w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white font-semibold text-xs uppercase rounded-xl shadow-lg hover:scale-[1.01]"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* REVIEW / RATING MODAL — shown after client marks a completed booking to rate */}
      {reviewModalBooking && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fluid-fade">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Rate {reviewModalBooking.artisan.name}</h3>
              <button
                onClick={() => setReviewModalBooking(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close review dialog"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setReviewRating(n)}
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  className="smooth-liquid-element hover:scale-110 active:scale-95"
                >
                  <Star className={`w-8 h-8 ${n <= reviewRating ? 'fill-amber-500 stroke-amber-500' : 'stroke-slate-300 dark:stroke-slate-700'}`} />
                </button>
              ))}
            </div>
            <button
              onClick={submitReview}
              className="smooth-liquid-element w-full py-3 bg-slate-900 dark:bg-emerald-600 text-white font-semibold text-xs uppercase rounded-xl shadow-lg hover:scale-[1.01]"
            >
              Submit Review
            </button>
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

      <div className="w-full max-w-7xl 2xl:max-w-[1600px] h-screen md:h-[88vh] md:max-h-[920px] md:min-h-[640px] rounded-none md:rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row relative z-10 border transition-all duration-500 bg-white/95 backdrop-blur-xl border-slate-200 dark:bg-slate-950/95 dark:border-slate-800">
        
        {viewMode !== 'splash' && viewMode !== 'login' && viewMode !== 'artisan-setup' && (
          <aside className="hidden md:flex flex-col justify-between w-64 xl:w-72 bg-slate-900 text-slate-400 p-6 border-r border-slate-800">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-white px-2">
                <Logo className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-screen" />
                <span className="text-xl font-bold tracking-tight">Bereka</span>
              </div>
              <nav className="space-y-1">
                <button onClick={() => setViewMode('main')} className={`smooth-liquid-element w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${viewMode === 'main' || viewMode === 'artisan-detail' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><Home className="w-4 h-4" /> Explore Hub</button>
                <button onClick={() => setViewMode(currentUser?.role === 'artisan' ? 'jobs' : 'bookings')} className={`smooth-liquid-element w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${(viewMode === 'bookings' || viewMode === 'jobs') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><Calendar className="w-4 h-4" /> {currentUser?.role === 'artisan' ? 'My Jobs' : 'Bookings'}</button>
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
                    <label htmlFor="login-phone" className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 text-xs font-bold border-r border-slate-200 dark:border-slate-700 pr-3 my-2.5">+27</span>
                      <input id="login-phone" type="tel" required placeholder="81 234 5678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="smooth-liquid-element w-full pl-20 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="login-password" className="text-[10px] font-bold text-slate-400 uppercase">Password</label>
                    <div className="relative">
                      <input id="login-password" type={showPassword ? "text" : "password"} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="smooth-liquid-element w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 pr-4 text-slate-400 hover:text-slate-600 transition-colors duration-300">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
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

              {/* DESKTOP BRANDING PANEL — fills the second lg:flex-row column so the login screen doesn't feel like empty space on wide monitors */}
              <div className="hidden lg:flex flex-1 relative bg-slate-950 items-center justify-center overflow-hidden px-12">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-sm space-y-8">
                  <Logo className="w-16 h-16 mix-blend-screen" />
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold tracking-tight leading-tight text-white">Find trusted trade professionals, fast.</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Bereka connects you with verified plumbers, electricians, cleaners and more — all in one place.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">Verified, rated professionals near you</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaWhatsapp className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">Message artisans directly on WhatsApp</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">Book, track, and rate every job</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewMode !== 'splash' && viewMode !== 'login' && viewMode !== 'artisan-setup' && renderAppContent()}

          {viewMode !== 'splash' && viewMode !== 'login' && viewMode !== 'artisan-setup' && (
            <nav className="liquid-glass absolute bottom-0 inset-x-0 border-t px-6 py-3 flex justify-between items-center text-slate-400 z-30 md:hidden border-slate-100 dark:border-slate-800">
              <button onClick={() => { setViewMode('main'); setExploreSubView('explore'); }} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${viewMode === 'main' && exploreSubView === 'explore' ? 'text-emerald-600' : ''}`}><Home className="w-5 h-5" /><span>List</span></button>
              <button onClick={() => { setViewMode('main'); setExploreSubView('nearby'); }} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${viewMode === 'main' && exploreSubView === 'nearby' ? 'text-emerald-600' : ''}`}><MapIcon className="w-5 h-5" /><span>Nearby</span></button>
              <button onClick={() => { setViewMode('main'); setExploreSubView('saved'); }} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${viewMode === 'main' && exploreSubView === 'saved' ? 'text-emerald-600' : ''}`}><Heart className="w-5 h-5" /><span>Saved</span></button>
              <button onClick={() => setViewMode(currentUser?.role === 'artisan' ? 'jobs' : 'bookings')} className={`flex flex-col items-center gap-1 text-[10px] smooth-liquid-element ${(viewMode === 'bookings' || viewMode === 'jobs') ? 'text-emerald-600' : ''}`}><Calendar className="w-5 h-5" /><span>{currentUser?.role === 'artisan' ? 'Jobs' : 'Bookings'}</span></button>
              <button onClick={() => setIsProfileDrawerOpen(true)} className="flex flex-col items-center gap-1 text-[10px] smooth-liquid-element"><Settings className="w-5 h-5" /><span>Settings</span></button>
            </nav>
          )}

        </div>
      </div>
    </div>
  );
}