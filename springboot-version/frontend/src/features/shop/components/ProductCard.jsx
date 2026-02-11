import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthContext';
import CartService from '../../../services/CartService';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
        toast.error('Please login to add items to cart');
        return;
    }
    
    try {
        await CartService.addToCart(product.id, 1);
        toast.success(`${product.name} added to cart!`);
        // We might want to trigger a navbar refresh here, but for now toast is enough
    } catch (error) {
        toast.error('Failed to add to cart: ' + (error.response?.data?.message || error.message));
    }
  };
  return (
    <Card className="h-100 border-0 shadow-sm hover-shadow-lg transition-smooth product-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
      <div className="position-relative overflow-hidden d-flex align-items-center justify-content-center bg-light" style={{ height: '220px', padding: '15px' }}>
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Pet+Product'} 
          className="transition-smooth product-img" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          alt={product.name}
        />
        <div className="product-overlay d-flex align-items-center justify-content-center gap-2">
            <Button variant="light" className="rounded-circle p-2 shadow-sm" title="Quick View">
                <FaEye className="text-primary-pet" />
            </Button>
            <Button variant="light" className="rounded-circle p-2 shadow-sm" title="Add to Cart">
                <FaShoppingCart className="text-primary-pet" />
            </Button>
        </div>
        {product.quantity < 5 && product.quantity > 0 && (
            <Badge bg="warning" className="position-absolute top-0 end-0 m-3 rounded-pill fw-600">
                Low Stock
            </Badge>
        )}
        {!product.available && (
             <Badge bg="danger" className="position-absolute top-0 end-0 m-3 rounded-pill fw-600">
                Out of Stock
             </Badge>
        )}
      </div>
      
      <Card.Body className="p-4 d-flex flex-column">
        <div className="mb-2">
            <span className="text-slate-400 small fw-700 text-uppercase tracking-wider">
                {product.categoryName || 'Uncategorized'}
            </span>
        </div>
        
        <Card.Title className="fw-800 text-slate-800 mb-2 fs-5" style={{ height: '3rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </Card.Title>
        
        <div className="mt-auto pt-3 d-flex align-items-center justify-content-between gap-2">
          <div className="flex-shrink-0">
              <span className="text-primary-pet fw-800 fs-5">₹{product.price}</span>
          </div>
          <Button 
            variant="primary-pet" 
            className="rounded-pill px-3 py-2 fw-700 shadow-sm d-flex align-items-center gap-1" 
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            <FaShoppingCart size={14} /> Add to Cart
          </Button>
        </div>
      </Card.Body>
      
      <style>{`
        .product-card {
            background: #fff;
        }
        .transition-smooth {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-shadow-lg:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .product-img {
            transition: transform 0.5s ease;
        }
        .product-card:hover .product-img {
            transform: scale(1.1);
        }
        .product-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.15);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .product-card:hover .product-overlay {
            opacity: 1;
        }
        .text-primary-pet {
            color: var(--brand-primary);
        }
        .bg-primary-pet {
            background-color: var(--brand-primary);
        }
        .btn-primary-pet {
            background: var(--brand-primary);
            border: none;
            color: white;
        }
        .btn-primary-pet:hover {
            background: #4338ca;
            color: white;
            transform: scale(1.05);
        }
      `}</style>
    </Card>
  );
};

export default ProductCard;
