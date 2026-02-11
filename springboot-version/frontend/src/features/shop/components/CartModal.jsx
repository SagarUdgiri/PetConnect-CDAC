import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Image } from 'react-bootstrap';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import CartService from '../../../services/CartService';
import { useAuth } from '../../auth/AuthContext';
import { toast } from 'react-hot-toast';

const CartModal = ({ show, onHide, onOrderSuccess }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const data = await CartService.getCart();
      setCartItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchCart();
    }
  }, [show]);

  const handleRemove = async (cartItemId) => {
    try {
      await CartService.removeFromCart(cartItemId);
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await CartService.checkout('TRANS-' + Date.now());
      toast.success('Order placed successfully!');
      onHide();
      if (onOrderSuccess) onOrderSuccess();
    } catch (error) {
      toast.error('Checkout failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-800 fs-4 text-slate-800 d-flex align-items-center gap-2">
          <FaShoppingBag className="text-primary-pet" />
          Your Shopping Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-slate-400 fw-600">Your cart is empty</h5>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.cartItemId} className="py-3 px-0 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <Image 
                    src={item.imageUrl || 'https://via.placeholder.com/60px'} 
                    rounded 
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }} 
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-0 fw-700 text-slate-800">{item.productName}</h6>
                    <small className="text-slate-500">Qty: {item.quantity} x ₹{item.price}</small>
                  </div>
                  <div className="text-end me-3">
                    <span className="fw-800 text-primary-pet">₹{item.price * item.quantity}</span>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-danger p-0" 
                    onClick={() => handleRemove(item.cartItemId)}
                  >
                    <FaTrash size={16} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      {cartItems.length > 0 && (
        <Modal.Footer className="border-0 flex-column align-items-stretch px-4 pb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-700 text-slate-600">Total Amount</h5>
            <h4 className="mb-0 fw-800 text-primary-pet">₹{total}</h4>
          </div>
          <Button 
            variant="primary-pet" 
            className="rounded-pill py-3 fw-800 shadow-sm"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
