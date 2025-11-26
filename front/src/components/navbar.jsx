import { Heart, SearchIcon, User, LogOut, ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; 
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { getCartItemsCount } = useCart(); // Utilisation du contexte panier
  const navigate = useNavigate();

  const cartItemsCount = getCartItemsCount();

  const baseNavLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#' },
    { label: 'Products', href: '/products' },
  ];

  // Liens selon le statut de connexion
  const getNavLinks = () => {
    if (currentUser) {
      const userLinks = [
        ...baseNavLinks,
        { label: 'My Profile', href: '/profile' },
      ];

      if (currentUser.role === 'seller') {
        userLinks.push({ label: 'Seller Dashboard', href: '/seller' });
      }
      if (currentUser.role === 'admin') {
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
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate('/');
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
            <Link 
              to="/" 
              className="flex-shrink-0 font-bold text-lg text-black cursor-pointer"
            >
              Logo
            </Link>

            {/* Center navigation links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-black text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </Link>
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
                onClick={() => navigate(currentUser ? '/cart' : '/login')} // Changé vers '/cart'
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User menu or Login */}
              {currentUser ? (
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
                      {currentUser.name}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Signed in as <br />
                        <strong>{currentUser.email}</strong>
                        <div className="text-xs text-green-600 mt-1 capitalize">
                          {currentUser.role}
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      {currentUser.role === 'seller' && (
                        <Link
                          to="/seller"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <div className="border-t mt-1 pt-1">
                        <Link
                          to="/checkout"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Panier ({cartItemsCount})
                        </Link>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 mt-1"
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
                  onClick={() => navigate('/login')}
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
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-2 text-black text-sm font-medium hover:bg-gray-50 rounded px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile cart link */}
              <Link
                to={currentUser ? '/checkout' : '/login'}
                className="flex items-center gap-2 py-2 text-black text-sm font-medium hover:bg-gray-50 rounded px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag className="w-4 h-4" />
                Panier {cartItemsCount > 0 && `(${cartItemsCount})`}
              </Link>
              
              {/* Mobile-only user actions */}
              {currentUser && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <div className="px-2 py-1 text-xs text-gray-500">
                      Logged in as: {currentUser.email}
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

