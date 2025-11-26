import { Heart, Home, SearchIcon, User, LogOut, ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Hook d'authentification simulé (à créer dans un fichier séparé)
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const mockLogin = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let userData;
        if (email.includes('admin')) {
          userData = { 
            id: 1, 
            name: 'Admin User', 
            email: email, 
            role: 'admin',
            points: 5000
          };
        } else if (email.includes('seller')) {
          userData = { 
            id: 2, 
            name: 'Seller User', 
            email: email, 
            role: 'seller',
            points: 1000
          };
        } else {
          userData = { 
            id: 3, 
            name: 'Buyer User', 
            email: email, 
            role: 'buyer',
            points: 500
          };
        }
        login(userData);
        resolve(userData);
      }, 1000);
    });
  };

  return { user, login, logout, mockLogin, isLoading };
};

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Liens de navigation de base
  const baseNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#' },
    { label: 'Products', href: '/products' },
  ];

  // Liens selon le statut de connexion
  const getNavLinks = () => {
    if (user) {
      const userLinks = [
        ...baseNavLinks,
        { label: 'My Profile', href: '/profile' },
      ];

      if (user.role === 'seller') {
        userLinks.push({ label: 'Seller Dashboard', href: '/seller' });
      }
      if (user.role === 'admin') {
        userLinks.push({ label: 'Admin', href: '/admin' });
      }

      return userLinks;
    }
    return [
      ...baseNavLinks,
      { label: 'Sign Up', href: '/signup' },
      { label: 'Login', href: '/login' },
    ];
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const navigateTo = (path) => {
    window.location.href = path;
    setMobileMenuOpen(false);
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Black banner at the top */}
      <div className="bg-black text-white text-center py-2 text-sm">
        Special offer: Get 20% off today!
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div 
              className="flex-shrink-0 font-bold text-lg text-black cursor-pointer" 
              onClick={() => navigateTo('/')}
            >
              Logo
            </div>

            {/* Center navigation links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-black text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side - Search and icons */}
            <div className="flex items-center gap-4">
              {/* Search input - Desktop */}
              <form onSubmit={handleSearch} className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-100 text-black placeholder-gray-500 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all w-48 lg:w-64"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                >
                  <SearchIcon className="w-4 h-4" />
                </button>
              </form>

              {/* Shopping cart */}
              <button
                aria-label="Shopping Cart"
                className="text-black hover:opacity-70 transition-opacity relative"
                onClick={() => navigateTo(user ? '/cart' : '/login')}
              >
                <ShoppingBag className="w-5 h-5" />
                {user && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    0
                  </span>
                )}
              </button>

              {/* Heart icon - Favorites */}
              <button
                aria-label="Favorites"
                className="text-black hover:opacity-70 transition-opacity hidden sm:block"
                onClick={() => navigateTo(user ? '/favorites' : '/login')}
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* User menu or Login */}
              {user ? (
                <div className="relative">
                  <button
                    aria-label="User menu"
                    className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden lg:block text-sm">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Signed in as <br />
                        <strong>{user.email}</strong>
                        {user.points && (
                          <div className="text-xs text-green-600 mt-1">
                            {user.points} points
                          </div>
                        )}
                      </div>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </a>
                      {user.role === 'seller' && (
                        <a
                          href="/seller"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Seller Dashboard
                        </a>
                      )}
                      {user.role === 'admin' && (
                        <a
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </a>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  aria-label="Login"
                  className="text-black hover:opacity-70 transition-opacity flex items-center gap-2"
                  onClick={() => navigateTo('/login')}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block text-sm">Login</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden text-black p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="mt-4 sm:hidden">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 text-black placeholder-gray-500 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all w-full"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <SearchIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-2">
            <div className="px-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block py-2 text-black text-sm font-medium hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Mobile-only user actions */}
              {user && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-2 py-1 text-xs text-gray-500">
                      Logged in as: {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full py-2 text-sm text-red-600 hover:bg-gray-50 rounded px-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for dropdown and mobile menu */}
      {(showUserMenu || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-10" 
          onClick={() => {
            setShowUserMenu(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
}