import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Calculer le total
  const total = cartItems.reduce((sum, item) => sum + (item.prix * item.quantity), 0);

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = () => {
    if (!user) {
      alert('Veuillez vous connecter pour passer commande');
      return;
    }

    if (user.points < total) {
      alert('Points insuffisants pour cette commande');
      return;
    }

    // Créer la commande
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'pending',
      totalPoints: total,
      items: cartItems,
      shipping: shippingInfo,
      userId: user.id
    };

    // Sauvegarder la commande
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Déduire les points (simulation)
    const updatedUser = {
      ...user,
      points: user.points - total
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Vider le panier
    localStorage.removeItem('cart');
    
    alert('Commande passée avec succès!');
    window.location.href = '/order-confirmation';
  };

  if (!user) {
    return (
      <div className="checkout-container">
        <div className="login-required">
          <h2>Connexion requise</h2>
          <p>Veuillez vous connecter pour finaliser votre commande</p>
          <button onClick={() => window.location.href = '/login'}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Validation de commande</h1>
      
      <div className="checkout-content">
        {/* Colonne gauche - Formulaire */}
        <div className="checkout-form">
          <section className="shipping-section">
            <h2>Informations de livraison</h2>
            <form>
              <input
                type="text"
                name="fullName"
                placeholder="Nom complet"
                value={shippingInfo.fullName}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Adresse"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
              />
              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="Ville"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Code postal"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="text"
                name="country"
                placeholder="Pays"
                value={shippingInfo.country}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Téléphone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
              />
            </form>
          </section>

          <section className="payment-section">
            <h2>Paiement avec points</h2>
            <div className="points-info">
              <p>Vos points disponibles: <strong>{user.points}</strong></p>
              <p>Total à payer: <strong>{total} points</strong></p>
              {user.points >= total ? (
                <div className="points-success">
                  ✅ Solde suffisant
                </div>
              ) : (
                <div className="points-error">
                  ❌ Solde insuffisant
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Colonne droite - Récapitulatif */}
        <div className="order-summary">
          <h2>Votre commande</h2>
          
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Quantité: {item.quantity}</p>
                </div>
                <div className="item-price">
                  {item.prix * item.quantity} points
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-line">
              <span>Sous-total:</span>
              <span>{total} points</span>
            </div>
            <div className="total-line">
              <span>Livraison:</span>
              <span>0 points</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>{total} points</span>
            </div>
          </div>

          <button 
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={user.points < total || cartItems.length === 0}
          >
            Confirmer la commande
          </button>
        </div>
      </div>
    </div>
  );
}