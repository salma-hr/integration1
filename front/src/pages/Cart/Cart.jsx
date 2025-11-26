import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const total = getCartTotal();

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!currentUser) {
    return (
      <div className="cart-container">
        <div className="login-required">
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour voir votre panier</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <ShoppingBag size={64} className="empty-cart-icon" />
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits à votre panier pour les voir apparaître ici</p>
          <button 
            className="btn-primary"
            onClick={handleContinueShopping}
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Mon Panier</h1>
        <p>{cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.photo || '/images/product-placeholder.jpg'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/images/product-placeholder.jpg';
                  }}
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-category">{item.category}</p>
                <p className="item-price-unit">{item.price.toFixed(2)} €</p>
              </div>

              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="item-total">
                <span className="total-price">{(item.price * item.quantity).toFixed(2)} €</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item._id)}
                  title="Supprimer du panier"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Récapitulatif</h3>
          
          <div className="summary-details">
            <div className="summary-line">
              <span>Sous-total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles):</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="summary-line">
              <span>Livraison:</span>
              <span>Gratuite</span>
            </div>
            <div className="summary-line">
              <span>TVA:</span>
              <span>{(total * 0.2).toFixed(2)} €</span>
            </div>
            <div className="summary-line total">
              <span>Total TTC:</span>
              <span>{(total * 1.2).toFixed(2)} €</span>
            </div>
          </div>

          <button 
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Procéder au paiement
            <ArrowRight size={18} />
          </button>

          <button 
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Continuer mes achats
          </button>

          <button 
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
}