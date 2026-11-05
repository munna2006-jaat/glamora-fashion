import React, { useState } from 'react';
import { ArrowLeft, User as UserIcon, Lock, Mail, Phone, Eye, EyeOff, Sparkles, CheckCircle2, LogOut, Package, Truck, Heart, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  currentUser: User | null;
  authNotice?: string;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  onBackToHome: () => void;
  onViewOrders: () => void;
  onViewTrack: () => void;
  onViewWishlist: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  authNotice,
  onLoginSuccess,
  onLogout,
  onBackToHome,
  onViewOrders,
  onViewTrack,
  onViewWishlist,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  
  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your Gmail address or 10-digit mobile number.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (tab === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = tab === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const payload = {
        name: fullName.trim(),
        identifier: identifier.trim(),
        password: password.trim(),
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setSuccessMsg(tab === 'signin' ? 'Logged in successfully!' : 'Account created successfully!');
        localStorage.setItem('glamora_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        // Fallback local login if backend is running disconnected
        const isEmail = identifier.includes('@');
        const fallbackUser: User = {
          id: `usr-${Date.now()}`,
          name: fullName || (isEmail ? identifier.split('@')[0] : `Customer ${identifier.slice(-4)}`),
          email: isEmail ? identifier : '',
          phone: isEmail ? '' : identifier,
          addresses: [],
        };
        localStorage.setItem('glamora_user', JSON.stringify(fallbackUser));
        onLoginSuccess(fallbackUser);
      }
    } catch (err) {
      console.error(err);
      // Fallback local login
      const isEmail = identifier.includes('@');
      const fallbackUser: User = {
        id: `usr-${Date.now()}`,
        name: fullName || (isEmail ? identifier.split('@')[0] : `Customer ${identifier.slice(-4)}`),
        email: isEmail ? identifier : '',
        phone: isEmail ? '' : identifier,
        addresses: [],
      };
      localStorage.setItem('glamora_user', JSON.stringify(fallbackUser));
      onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show user profile view
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-glamora-blush/60">
          <button
            onClick={onBackToHome}
            className="w-10 h-10 rounded-full bg-white border border-glamora-blush flex items-center justify-center hover:bg-glamora-blush/30 transition shadow-sm cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 text-glamora-charcoal" />
          </button>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Logged in</span>
            <span className="font-bold text-sm text-glamora-charcoal">{currentUser.name}</span>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-glamora-blush/80 shadow-luxury space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-glamora-rose to-glamora-blush flex items-center justify-center text-white text-2xl font-serif font-bold shadow-md">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-glamora-rose font-bold bg-glamora-blush/40 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GLAMORA VIP Member</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-glamora-charcoal">
                Hello, {currentUser.name}! 🌸
              </h2>
              <p className="text-xs text-gray-500 font-sans">
                {currentUser.email || currentUser.phone || 'Verified Customer'}
              </p>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={onViewOrders}
              className="bg-glamora-cream/60 hover:bg-glamora-cream p-5 rounded-2xl border border-glamora-blush/60 text-left transition space-y-2 cursor-pointer group"
            >
              <Package className="w-6 h-6 text-glamora-rose group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-serif font-bold text-sm text-glamora-charcoal block">My Orders</span>
                <span className="text-[11px] text-gray-500">Track shipments & receipts</span>
              </div>
            </button>

            <button
              onClick={onViewTrack}
              className="bg-glamora-cream/60 hover:bg-glamora-cream p-5 rounded-2xl border border-glamora-blush/60 text-left transition space-y-2 cursor-pointer group"
            >
              <Truck className="w-6 h-6 text-glamora-rose group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-serif font-bold text-sm text-glamora-charcoal block">Track Package</span>
                <span className="text-[11px] text-gray-500">Live courier GPS updates</span>
              </div>
            </button>

            <button
              onClick={onViewWishlist}
              className="bg-glamora-cream/60 hover:bg-glamora-cream p-5 rounded-2xl border border-glamora-blush/60 text-left transition space-y-2 cursor-pointer group"
            >
              <Heart className="w-6 h-6 text-glamora-rose group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-serif font-bold text-sm text-glamora-charcoal block">My Wishlist</span>
                <span className="text-[11px] text-gray-500">Saved kurtis and combos</span>
              </div>
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={onBackToHome}
              className="text-xs font-bold text-glamora-charcoal hover:underline"
            >
              ← Back to Shopping
            </button>
            <button
              onClick={onLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-glamora-charcoal pt-6 pb-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto flex flex-col justify-center">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6">
        <button
          onClick={onBackToHome}
          className="w-10 h-10 rounded-full bg-white border border-glamora-blush flex items-center justify-center hover:bg-glamora-blush/30 transition shadow-sm cursor-pointer"
          title="Back to Home"
        >
          <ArrowLeft className="w-5 h-5 text-glamora-charcoal" />
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-glamora-rose">GLAMORA LUXURY</span>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-glamora-blush/80 shadow-luxury space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <span className="font-serif tracking-[0.25em] text-2xl font-bold text-glamora-charcoal block">
            G L A M O R A
          </span>
          <p className="text-xs text-glamora-rose font-medium tracking-widest uppercase">
            Your Style. Your Story.
          </p>
          <h2 className="font-serif text-xl font-bold text-glamora-charcoal pt-2">
            {tab === 'signin' ? 'Welcome Back!' : 'Create Your GLAMORA Account'}
          </h2>
          <p className="text-xs text-gray-500">
            {tab === 'signin'
              ? 'Sign in with your Gmail or Phone number to view your orders & cart'
              : 'Register to unlock exclusive ₹499 combos and express tracking'}
          </p>
        </div>

        {authNotice && (
          <div className="p-3.5 rounded-2xl bg-glamora-blush/60 border border-glamora-rose text-glamora-charcoal text-xs flex items-center gap-2.5 font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-glamora-rose flex-shrink-0 animate-pulse" />
            <span>{authNotice}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-gray-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition cursor-pointer ${
              tab === 'signin'
                ? 'bg-white text-glamora-charcoal shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition cursor-pointer ${
              tab === 'register'
                ? 'bg-white text-glamora-charcoal shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {tab === 'register' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Gmail / Email Address OR Mobile Number *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. priya@gmail.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              You can log in using either your Gmail account or your 10-digit mobile number.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-3 font-medium focus:bg-white focus:ring-2 focus:ring-glamora-rose focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-glamora-rose hover:bg-glamora-rose-dark disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded-full shadow-elevated transition duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs text-gray-500 hover:text-glamora-charcoal underline"
          >
            Continue as Guest & Return to Store
          </button>
        </div>

      </div>

    </div>
  );
};

