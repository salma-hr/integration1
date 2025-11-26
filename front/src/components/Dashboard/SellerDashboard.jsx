import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './SellerDashboard.css';

function SellerDashboard() {
  const { 
    currentUser, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    refreshProducts,
    loading,
    error 
  } = useAuth();
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: ''
  });

  // Filtrer les produits du vendeur connecté
  const sellerProducts = products.filter(product => 
    product.sellerId === currentUser?.id || product.seller?._id === currentUser?.id
  );

  // Statistiques
  const stats = {
    totalProducts: sellerProducts.length,
    lowStock: sellerProducts.filter(p => p.stock < 10 && p.stock > 0).length,
    outOfStock: sellerProducts.filter(p => p.stock === 0).length,
    totalValue: sellerProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: formData.image || undefined
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await addProduct(productData);
      }

      handleCloseForm();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || ''
    });
    setShowProductForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: ''
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'out', text: 'Rupture', class: 'out-of-stock' };
    if (stock < 10) return { status: 'low', text: 'Stock faible', class: 'low-stock' };
    return { status: 'in', text: 'En stock', class: 'in-stock' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de Bord Vendeur</h1>
          <p>Gérez vos produits et suivez vos ventes</p>
        </div>
        <button 
          className="btn-secondary"
          onClick={refreshProducts}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package />
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Produits totaux</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">
            <TrendingUp />
          </div>
          <div className="stat-info">
            <h3>{stats.lowStock}</h3>
            <p>Stock faible</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon danger">
            <Package />
          </div>
          <div className="stat-info">
            <h3>{stats.outOfStock}</h3>
            <p>En rupture</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">
            <DollarSign />
          </div>
          <div className="stat-info">
            <h3>{stats.totalValue.toFixed(2)} €</h3>
            <p>Valeur stock</p>
          </div>
        </div>
      </div>

      {/* En-tête produits */}
      <div className="products-header">
        <h2>Mes Produits</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowProductForm(true)}
          disabled={loading}
        >
          <Plus size={16} />
          Ajouter un produit
        </button>
      </div>

      {/* Liste des produits */}
      <div className="products-table-container">
        {sellerProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>Aucun produit</h3>
            <p>Commencez par ajouter votre premier produit</p>
            <button 
              className="btn-primary"
              onClick={() => setShowProductForm(true)}
            >
              <Plus size={16} />
              Ajouter un produit
            </button>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellerProducts.map(product => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product._id}>
                    <td>
                      <div className="product-info">
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <Package size={20} />
                          )}
                        </div>
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-description">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{product.category}</span>
                    </td>
                    <td className="price">{product.price} €</td>
                    <td className="stock">{product.stock}</td>
                    <td>
                      <span className={`status-badge ${stockStatus.class}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/products/${product._id}`}
                          className="btn-icon"
                          title="Voir"
                        >
                          <Eye size={16} />
                        </Link>
                        <button 
                          className="btn-icon"
                          onClick={() => handleEdit(product)}
                          title="Modifier"
                          disabled={loading}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon danger"
                          onClick={() => handleDelete(product._id)}
                          title="Supprimer"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Formulaire Produit */}
      {showProductForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
              <button className="close-btn" onClick={handleCloseForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Nom du produit *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  disabled={formLoading}
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                  disabled={formLoading}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                    disabled={formLoading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  disabled={formLoading}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="Électronique">Électronique</option>
                  <option value="Mode">Mode</option>
                  <option value="Maison">Maison</option>
                  <option value="Sport">Sport</option>
                  <option value="Beauté">Beauté</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Image URL (optionnel)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  disabled={formLoading}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCloseForm}
                  disabled={formLoading}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <div className="spinner"></div>
                      {editingProduct ? 'Modification...' : 'Ajout...'}
                    </>
                  ) : (
                    editingProduct ? 'Modifier le produit' : 'Ajouter le produit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;