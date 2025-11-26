import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Check, Truck, Shield, ArrowRight } from 'lucide-react';
import { products } from '../../data/products';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Produit non trouvé</h2>
        <Link to="/products" className="btn-primary">
          <ArrowLeft size={16} />
          Retour aux produits
        </Link>
      </div>
    );
  }

  const images = [
    product.image || '/images/product-placeholder-1.jpg',
    '/images/product-placeholder-2.jpg',
    '/images/product-placeholder-3.jpg'
  ];

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    alert(`Ajouté au panier : ${quantity} x ${product.name}`);
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { product, quantity } });
  };

  const stockStatus = product.stock === 0 
    ? { status: 'out', text: 'Rupture de stock', class: 'out-of-stock' }
    : product.stock < 10 
    ? { status: 'low', text: 'Stock faible', class: 'low-stock' }
    : { status: 'in', text: 'En stock', class: 'in-stock' };

  return (
    <div className="product-details">
      {/* Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link>
        <ArrowRight size={16} />
        <Link to="/products">Produits</Link>
        <ArrowRight size={16} />
        <span>{product.name}</span>
      </nav>

      <div className="product-details-container">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="gallery-main">
            <img 
              src={images[selectedImage]} 
              alt={product.name}
              className="main-image"
            />
          </div>
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`Vue ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-header">
            <span className="category-badge">{product.category}</span>
            {product.featured && <span className="featured-badge">⭐ Produit vedette</span>}
          </div>

          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className={i < product.rating ? 'filled' : ''}
                />
              ))}
            </div>
            <span className="rating-value">{product.rating}/5</span>
            <span className="reviews">(128 avis)</span>
          </div>

          <div className="product-price">
            <span className="current-price">{product.price} €</span>
            {product.originalPrice && (
              <span className="original-price">{product.originalPrice} €</span>
            )}
            {product.discount && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
          </div>

          <p className="product-description">
            {product.fullDescription || product.description}
          </p>

          {/* Stock Status */}
          <div className={`stock-status ${stockStatus.class}`}>
            <Check size={16} />
            <span>{stockStatus.text}</span>
            {product.stock > 0 && (
              <span className="stock-quantity">{product.stock} unités disponibles</span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label>Quantité :</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
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
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Ajouter au panier
            </button>

            <button 
              className={`btn-wishlist ${isInWishlist ? 'active' : ''}`}
              onClick={() => setIsInWishlist(!isInWishlist)}
            >
              <Heart fill={isInWishlist ? "currentColor" : "none"} />
            </button>

            <button className="btn-share">
              <Share2 size={16} />
            </button>
          </div>

          {/* Features */}
          <div className="product-features">
            <div className="feature">
              <Truck size={20} />
              <div>
                <strong>Livraison gratuite</strong>
                <span>Délai de 2-3 jours</span>
              </div>
            </div>
            <div className="feature">
              <Shield size={20} />
              <div>
                <strong>Garantie 2 ans</strong>
                <span>Retours sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="product-tabs">
        <div className="tabs-container">
          <div className="tabs">
            <button className="tab active">Description</button>
            <button className="tab">Spécifications</button>
            <button className="tab">Avis (128)</button>
            <button className="tab">Livraison</button>
          </div>

          <div className="tab-content">
            <h3>Description détaillée</h3>
            <p>
              Découvrez le {product.name}, un produit exceptionnel conçu pour répondre 
              à tous vos besoins. Avec ses fonctionnalités avancées et son design élégant, 
              il s'adapte parfaitement à votre style de vie moderne.
            </p>
            
            <h4>Caractéristiques principales :</h4>
            <ul>
              <li>Matériaux de haute qualité pour une durabilité optimale</li>
              <li>Design ergonomique pour un confort d'utilisation</li>
              <li>Technologie innovante pour des performances supérieures</li>
              <li>Entretien facile et économique</li>
              <li>Compatible avec la plupart des accessoires standards</li>
            </ul>

            <h4>Avantages :</h4>
            <ul>
              <li>✅ Gain de temps considérable</li>
              <li>✅ Économies à long terme</li>
              <li>✅ Respectueux de l'environnement</li>
              <li>✅ Support client 24/7</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="section-header">
            <h2>Produits similaires</h2>
            <Link to="/products" className="see-all">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="related-grid">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="related-card">
                <div className="related-image">
                  {/* Placeholder image */}
                </div>
                <div className="related-info">
                  <h4>{relatedProduct.name}</h4>
                  <div className="related-price">{relatedProduct.price} €</div>
                  <Link 
                    to={`/products/${relatedProduct.id}`} 
                    className="btn-link"
                  >
                    Voir le produit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;