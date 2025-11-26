import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  Share2, 
  Check, 
  Truck, 
  Shield, 
  Package,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { productAPI } from '../../services/api';
import './ProductDetails.css';
import { useCart } from '../../contexts/CartContext'; 

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart(); // Récupération de la fonction addToCart
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Chargement du produit ID:', id);
      
      const productData = await productAPI.getById(id);
      console.log('Produit chargé:', productData);
      
      if (!productData) {
        throw new Error('Produit non trouvé');
      }
      
      setProduct(productData);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setError(error.message || 'Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // CORRECTION : Utilisation de la fonction addToCart du contexte
    addToCart(product, quantity);
    alert(`✅ Ajouté au panier : ${quantity} x ${product.name}`);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // CORRECTION : Ajouter au panier avant de passer à la commande
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  // Gestion des images avec fallback
  const getProductImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.photo) {
      return [product.photo];
    }
    return ['/images/product-placeholder.jpg'];
  };

  const images = getProductImages();

  if (loading) {
    return (
      <div className="product-details">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <div className="not-found-content">
          <Package size={64} className="not-found-icon" />
          <h2>Produit non trouvé</h2>
          <p>{error || "Le produit demandé n'existe pas ou a été supprimé."}</p>
          <div className="not-found-actions">
            <button onClick={() => navigate(-1)} className="btn-secondary">
              <ArrowLeft size={18} />
              Retour
            </button>
            <Link to="/products" className="btn-primary">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stockStatus = product.stock === 0 
    ? { status: 'out', text: 'Rupture de stock', class: 'out-of-stock' }
    : product.stock < 10 
    ? { status: 'low', text: 'Stock faible', class: 'low-stock' }
    : { status: 'in', text: 'En stock', class: 'in-stock' };

  return (
    <div className="product-details">
      {/* Navigation */}
      <nav className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Accueil</Link>
        <ArrowRight size={14} className="breadcrumb-separator" />
        <Link to="/products" className="breadcrumb-link">Produits</Link>
        <ArrowRight size={14} className="breadcrumb-separator" />
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-details-container">
        {/* Gallery Section */}
        <div className="product-gallery">
          <div className="gallery-main">
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="main-image"
              onError={(e) => {
                e.target.src = '/images/product-placeholder.jpg';
              }}
            />
            {product.stock === 0 && (
              <div className="out-of-stock-overlay">
                <span>Rupture de stock</span>
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img 
                    src={img} 
                    alt={`Vue ${idx + 1} de ${product.name}`}
                    onError={(e) => {
                      e.target.src = '/images/product-placeholder.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="product-info">
          <div className="product-header">
            {product.category && (
              <span className="category-badge">{product.category}</span>
            )}
            {product.rating >= 4.5 && (
              <span className="featured-badge">⭐ Produit populaire</span>
            )}
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18}
                  fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                  className={i < (product.rating || 0) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-value">{product.rating || '0.0'}/5</span>
            <span className="reviews-count">(128 avis)</span>
          </div>

          <div className="product-price-section">
            <span className="current-price">{product.price?.toFixed(2) || '0.00'} €</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{product.originalPrice} €</span>
            )}
            {product.discount && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </div>

          <div className={`stock-status ${stockStatus.class}`}>
            <Check size={18} />
            <span className="status-text">{stockStatus.text}</span>
            {product.stock > 0 && (
              <span className="stock-quantity">• {product.stock} unités disponibles</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label className="quantity-label">Quantité :</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">{quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="quantity-total">
              Total: <span>{((product.price || 0) * quantity).toFixed(2)} €</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button 
              className="btn-primary btn-buy"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} />
              Acheter maintenant
            </button>
            
            <button 
              className="btn-secondary"
              onClick={handleAddToCart} // CORRECTION : Utilise la fonction mise à jour
              disabled={product.stock === 0}
            >
              Ajouter au panier
            </button>

            <div className="action-buttons-secondary">
              <button 
                className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
                onClick={() => {
                  if (!currentUser) {
                    navigate('/login');
                    return;
                  }
                  setIsInWishlist(!isInWishlist);
                }}
                title="Ajouter aux favoris"
              >
                <Heart 
                  size={20} 
                  fill={isInWishlist ? "currentColor" : "none"}
                />
              </button>
              
              <button 
                className="btn-share"
                onClick={handleShare}
                title="Partager ce produit"
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature-item">
              <Truck size={24} className="feature-icon" />
              <div className="feature-content">
                <strong>Livraison gratuite</strong>
                <span>Expédié sous 24h</span>
              </div>
            </div>
            
            <div className="feature-item">
              <Shield size={24} className="feature-icon" />
              <div className="feature-content">
                <strong>Garantie 2 ans</strong>
                <span>Retours acceptés sous 30 jours</span>
              </div>
            </div>
            
            <div className="feature-item">
              <Package size={24} className="feature-icon" />
              <div className="feature-content">
                <strong>Emballage sécurisé</strong>
                <span>Protection optimale</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className="seller-info">
              <h4>Vendu par :</h4>
              <div className="seller-details">
                <div className="seller-avatar">
                  {product.seller.name?.charAt(0).toUpperCase()}
                </div>
                <div className="seller-text">
                  <strong>{product.seller.name}</strong>
                  <span>Vendeur certifié</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="product-tabs-section">
        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Spécifications
            </button>
            <button 
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Avis clients
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Description détaillée</h3>
                <p>{product.description}</p>
                <div className="description-features">
                  <h4>Caractéristiques principales :</h4>
                  <ul>
                    <li>✅ Matériaux de haute qualité</li>
                    <li>✅ Design ergonomique et moderne</li>
                    <li>✅ Fabrication durable et écologique</li>
                    <li>✅ Entretien facile</li>
                    <li>✅ Compatible avec accessoires standards</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-panel">
                <h3>Spécifications techniques</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Catégorie</span>
                    <span className="spec-value">{product.category || 'Non spécifié'}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Stock disponible</span>
                    <span className="spec-value">{product.stock} unités</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Condition</span>
                    <span className="spec-value">Neuf</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Garantie</span>
                    <span className="spec-value">24 mois</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Avis clients</h3>
                <div className="reviews-summary">
                  <div className="overall-rating">
                    <div className="rating-score">{product.rating || '0.0'}</div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <div className="rating-count">128 avis</div>
                  </div>
                </div>
                <div className="no-reviews">
                  <p>Soyez le premier à donner votre avis sur ce produit !</p>
                  <button className="btn-secondary">Écrire un avis</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;