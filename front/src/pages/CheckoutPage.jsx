import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { currentUser } = useAuth();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const total = getCartTotal();
  const tva = total * 0.2;
  const totalTTC = total + tva;

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      alert('Veuillez vous connecter pour passer commande');
      navigate('/login');
      return;
    }

    // Vérifier que tous les champs sont remplis
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      alert('Veuillez remplir tous les champs d\'information de livraison');
      return;
    }

    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    try {
      // Créer la commande
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'pending',
        total: total,
        items: cartItems,
        shipping: shippingInfo,
        payment: paymentInfo,
        userId: currentUser._id
      };

      // Sauvegarder la commande dans localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      
      alert('Commande passée avec succès!');
      navigate('/order-confirmation', { state: { order } });
      
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      alert('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  // Vérifications pour le bouton de commande
  const isFormValid = () => {
    const shippingFields = ['fullName', 'address', 'city', 'postalCode', 'country', 'phone'];
    const paymentFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    
    return shippingFields.every(field => shippingInfo[field]) &&
           paymentFields.every(field => paymentInfo[field]) &&
           cartItems.length > 0;
  };

  if (!currentUser) {
    return (
      <div className="checkout-container">
        <div className="login-required">
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour finaliser votre commande</p>
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
      <div className="checkout-container">
        <div className="empty-cart">
          <h2>Panier vide</h2>
          <p>Votre panier est vide. Ajoutez des produits avant de passer commande.</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/products')}
          >
            Voir les produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Finaliser la commande</h1>
        <p>Remplissez vos informations pour compléter votre achat</p>
      </div>

      <div className="checkout-content">
        {/* Colonne gauche - Formulaire */}
        <div className="checkout-form">
          {/* Section Livraison */}
          <section className="form-section">
            <div className="section-header">
              <Truck size={24} />
              <h2>Informations de livraison</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom complet *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Jean Dupont"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Adresse *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Rue de la Paix"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ville *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Paris"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Code postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="75001"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Pays *</label>
                <input
                  type="text"
                  name="country"
                  placeholder="France"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+33 1 23 45 67 89"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </section>

          {/* Section Paiement */}
          <section className="form-section">
            <div className="section-header">
              <CreditCard size={24} />
              <h2>Informations de paiement</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Nom sur la carte *</label>
                <input
                  type="text"
                  name="cardName"
                  placeholder="JEAN DUPONT"
                  value={paymentInfo.cardName}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Numéro de carte *</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={handlePaymentChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date d'expiration *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Colonne droite - Récapitulatif */}
        <div className="order-summary">
          <div className="summary-header">
            <h2>Récapitulatif</h2>
          </div>

          <div className="order-items">
            {cartItems.map(item => (
              <div key={item._id} className="order-item">
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
                  <h4>{item.name}</h4>
                  <p>Quantité: {item.quantity}</p>
                  <span className="item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-line">
              <span>Sous-total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles)</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="total-line">
              <span>Livraison</span>
              <span className="free">Gratuite</span>
            </div>
            <div className="total-line">
              <span>TVA (20%)</span>
              <span>{tva.toFixed(2)} €</span>
            </div>
            <div className="total-line grand-total">
              <span>Total TTC</span>
              <span>{totalTTC.toFixed(2)} €</span>
            </div>
          </div>

          <div className="security-info">
            <div className="security-item">
              <ShieldCheck size={20} />
              <span>Paiement 100% sécurisé</span>
            </div>
            <div className="security-item">
              <Truck size={20} />
              <span>Livraison sous 2-3 jours</span>
            </div>
          </div>

          <button 
            className={`place-order-btn ${!isFormValid() ? 'disabled' : ''}`}
            onClick={handlePlaceOrder}
            disabled={!isFormValid()}
          >
            <CreditCard size={20} />
            Payer {totalTTC.toFixed(2)} €
            <ArrowRight size={18} />
          </button>

          <div className="guarantee">
            <p>✅ Garantie satisfait ou remboursé sous 30 jours</p>
          </div>
        </div>
      </div>
    </div>
  );
}