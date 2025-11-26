import React, { useState } from "react";
import { products } from "../../data/products";
import { Link } from "react-router-dom";
import { Search, Star } from 'lucide-react';
import "./Products.css";

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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

        {/* Grille de produits */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            
            return (
              <div className={`product-card ${product.featured ? 'featured' : ''}`} key={product.id}>
                {product.category && (
                  <span className="category-badge">{product.category}</span>
                )}
                
                <div className="product-image">
                  {/* Placeholder pour l'image */}
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
                    <span>{product.rating}</span>
                  </div>
                </div>

                <div className="product-actions">
                  <Link to={`/products/${product.id}`} className="btn-details">
                    Voir détails
                  </Link>
                  {product.stock > 0 && (
                    <button className="btn-buy">
                      Acheter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination (optionnelle) */}
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            Aucun produit trouvé pour votre recherche.
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;