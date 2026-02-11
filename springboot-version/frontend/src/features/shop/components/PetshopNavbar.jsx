import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthContext';
import logo from '../../../assets/logo.png';

const PetshopNavbar = ({ cartCount = 0, onCartClick }) => {
  const { user } = useAuth();
  return (
    <Navbar expand="lg" className="bg-white border-bottom sticky-top py-2 shop-navbar" style={{ zIndex: 1050 }}>
      <Container>
        <Navbar.Brand as={Link} to="/petshop" className="d-flex align-items-center me-lg-5">
          <img 
            src={logo} 
            alt="PetShop" 
            height="100" 
            className="d-inline-block align-top"
            style={{ 
              objectFit: 'contain',
              transform: 'scale(1.2)',
              transformOrigin: 'left center'
            }} 
          />
          <span className="ms-3 fw-900 fs-4">
            <span style={{ color: '#2563eb' }}>Pet</span>{' '}
            <span style={{ color: '#f97316' }}>Shop</span>
          </span>
        </Navbar.Brand>

        <div className="ms-auto d-flex align-items-center gap-3">
          <Button 
              variant="link" 
              className="p-2 text-slate-500 hover-text-primary position-relative shadow-none border-0"
              onClick={onCartClick}
          >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                      {cartCount}
                  </span>
              )}
          </Button>
          
          <Button 
            as={Link} 
            to="/dashboard" 
            variant="outline-primary"
            className="d-flex align-items-center gap-2 rounded-pill px-4 fw-600"
            style={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
          >
            <FaArrowLeft size={14} />
            Back to Dashboard
          </Button>
        </div>
      </Container>
      
      <style>{`
        .shop-navbar .nav-link {
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
          margin: 0 5px;
        }
        .shop-navbar .nav-link:hover {
          color: var(--brand-primary) !important;
          border-bottom-color: var(--brand-primary);
        }
        .text-primary-pet {
            color: var(--brand-primary);
        }
        .shop-navbar .nav-link-active {
            color: var(--brand-primary) !important;
            border-bottom-color: var(--brand-primary);
        }
      `}</style>
    </Navbar>
  );
};

export default PetshopNavbar;
