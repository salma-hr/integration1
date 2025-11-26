import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, Loader } from 'lucide-react';
import { productAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Products.css';

function Products() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productAPI.getAll();
      setProducts(productsData);
    } catch (error) {
      setError(error.message);
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: "out", text: "Rupture" };
    if (stock < 10) return { status: "low", text: "Stock faible" };
    return { status: "in", text: "En stock" };
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <Loader className="loading-spinner" size={48} />
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={loadProducts} className="btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <h1>Nos Produits</h1>
        
        {/* Filtres et recherche */}
        <div className="products-filters">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-select-wrapper">
            <Filter size={16} />
            <select 
              className="filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "Toutes catégories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compteur de résultats */}
        <div className="results-count">
          {filteredProducts.length} produit(s) trouvé(s)
        </div>

        {/* Grille de produits */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            
            return (
              <div className={`product-card ${product.featured ? 'featured' : ''}`} key={product._id}>
                {product.category && (
                  <span className="category-badge">{product.category}</span>
                )}
                
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">
                      <Package size={24} />
                    </div>
                  )}
                </div>
                
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                
                <div className="product-price">{product.price} €</div>
                
                <div className="product-meta">
                  <span className={`stock-status stock-${stockStatus.status}`}>
                    {stockStatus.text}
                  </span>
                  
                  <div className="rating">
                    <Star fill="currentColor" />
                    <span>{product.rating || 'N/A'}</span>
                  </div>
                </div>

                <div className="product-actions">
                  <Link to={`/products/${product._id}`} className="btn-details">
                    Voir détails
                  </Link>
                  {product.stock > 0 && currentUser?.role === 'buyer' && (
                    <button className="btn-buy">
                      Acheter
                    </button>
                  )}
                  {currentUser?.role === 'seller' && product.sellerId === currentUser.id && (
                    <Link to="/dashboard" className="btn-edit">
                      Gérer
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Aucun résultat */}
        {filteredProducts.length === 0 && (
          <div className="no-results">
            <Search size={48} />
            <h3>Aucun produit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;