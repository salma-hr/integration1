import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Users, Shield, Star, CheckCircle } from 'lucide-react';
import "./Home.css";

const Home = () => {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            🎉 Special offer: Get 20% off today!
          </div>
          <h1 className="hero-title">
            Welcome to Our 
            <span className="gradient-text"> Marketplace</span>
          </h1>
          <p className="hero-subtitle">
            A complete platform where buyers, sellers and admins interact with 
            products, orders, points & transactions in one seamless experience.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">
              Get Started
              <ArrowRight className="btn-icon" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">5K+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat">
              <div className="stat-number">99%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section className="roles-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Role</h2>
            <p className="section-subtitle">
              Join our marketplace and start your journey today
            </p>
          </div>
          
          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon">
                <ShoppingBag className="icon" />
              </div>
              <h3>Buyer</h3>
              <p>Discover amazing products, place orders and earn reward points for every purchase you make.</p>
              <ul className="role-features">
                <li><CheckCircle className="feature-icon" /> Earn points on purchases</li>
                <li><CheckCircle className="feature-icon" /> Exclusive deals</li>
                <li><CheckCircle className="feature-icon" /> Fast delivery</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-icon">
                <Users className="icon" />
              </div>
              <h3>Seller</h3>
              <p>Manage your products, track sales performance and handle inventory with powerful tools.</p>
              <ul className="role-features">
                <li><CheckCircle className="feature-icon" /> Easy inventory management</li>
                <li><CheckCircle className="feature-icon" /> Sales analytics</li>
                <li><CheckCircle className="feature-icon" /> Secure payments</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-icon">
                <Shield className="icon" />
              </div>
              <h3>Admin</h3>
              <p>Monitor platform activity, manage users, and ensure smooth operations across the marketplace.</p>
              <ul className="role-features">
                <li><CheckCircle className="feature-icon" /> User management</li>
                <li><CheckCircle className="feature-icon" /> Transaction oversight</li>
                <li><CheckCircle className="feature-icon" /> Platform analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Platform Features</h2>
            <p className="section-subtitle">
              Everything you need for a successful marketplace experience
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <Star className="feature-card-icon" />
              <h4>User Management</h4>
              <p>Secure login & signup system with role-based access control</p>
            </div>
            
            <div className="feature-card">
              <ShoppingBag className="feature-card-icon" />
              <h4>Product Management</h4>
              <p>Complete products & inventory management system</p>
            </div>
            
            <div className="feature-card">
              <CheckCircle className="feature-card-icon" />
              <h4>Order System</h4>
              <p>Streamlined orders with points rewards and tracking</p>
            </div>
            
            <div className="feature-card">
              <Shield className="feature-card-icon" />
              <h4>Secure Transactions</h4>
              <p>Protected payment system with encryption</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-subtitle">
              Join thousands of users already enjoying our marketplace platform
            </p>
            <Link to="/signup" className="btn-primary btn-large">
              Create Your Account
              <ArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;