import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import log_image from '../../assets/login_image.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const result = await login(email, password);
    if (result.success) {
      navigate('/'); // redirection après login
    } else {
      alert(result.error);
    }
  } catch (err) {
    console.error(err);
    alert('Une erreur est survenue.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block">
            <img
              src={log_image}
              alt="Login illustration"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a href="#" className="text-black hover:underline font-medium text-sm">
                  Forgot password?
                </a>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#DB4444] text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Don't have an account?{' '}
              <a href="/signup" className="text-black font-medium hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
