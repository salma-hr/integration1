import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import LoginPage from './pages/login.jsx';
import SignupPage from "./pages/signup.jsx";
import Home from "./pages/Home/Home.jsx";
import Products from "./pages/Products/products.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import { AuthProvider } from './AuthContext';
import CheckoutPage from "./pages/CheckoutPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;  
