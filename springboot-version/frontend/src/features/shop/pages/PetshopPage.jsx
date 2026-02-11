import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import PetshopNavbar from '../components/PetshopNavbar';
import ProductCard from '../components/ProductCard';
import CartModal from '../components/CartModal';
import ShopService from '../../../services/ShopService';
import CartService from '../../../services/CartService';
import { useAuth } from '../../auth/AuthContext';
import { FaFilter, FaRedo } from 'react-icons/fa';

const PetshopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [priceRange, setPriceRange] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchData();
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    if (!user) return;
    try {
      const data = await CartService.getCart();
      const count = data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products independently
      try {
        const productsData = await ShopService.getAllProducts();
        setProducts(productsData);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }

      // Fetch categories independently
      try {
        const categoriesData = await ShopService.getAllCategories();
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    // Case-insensitive category matching
    const matchesCategory =
  selectedCategoryId === null ||
  product.categoryId === selectedCategoryId;
    
    // Price filtering - handle potentially missing price and ensure numeric comparison
    const productPrice = Number(product.price) || 0;
    const matchesPrice = priceRange === 10000 ? true : productPrice <= priceRange;
    
    // Search matching - handle potentially missing name
    const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const resetFilters = () => {
    setSelectedCategoryId(null);
    setPriceRange(10000);
    setSearchQuery('');
  };

  return (
    <div className="petshop-container bg-light min-vh-100 pb-5">
      <PetshopNavbar 
        cartCount={cartCount} 
        onCartClick={() => setShowCart(true)} 
      />
      
      <div
  className="shop-hero py-5 mb-5 position-relative overflow-hidden"
  style={{
    background:
      'linear-gradient(135deg, #f97316, #fb7185, #ec4899)',
    color: 'white',
  }}
>
  {/* soft gradient overlay */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 60%)',
    }}
  />

  <Container className="position-relative">
    <Row className="align-items-center">
      <Col lg={7}>
        <span
          className="px-3 py-1 mb-3 d-inline-block rounded-pill fw-600"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
          }}
        >
          🐾 Trusted Pet Essentials
        </span>

        <h1 className="fw-900 display-4 mb-3" style={{color: 'antiquewhite'}}>
          Premium Care for <br></br>
          <span style={{ color: '#bbf7d0' }}> Your Pets</span>
        </h1>

        
      </Col>
    </Row>
  </Container>

  {/* bottom wave */}
  <svg
    viewBox="0 0 1440 70"
    preserveAspectRatio="none"
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '80px',
    }}
  >
    <path
      fill="#f8fafc"
      d="M0,40 C120,70 240,70 360,60 480,50 600,20 720,20 840,20 960,50 1080,60 1200,70 1320,60 1440,40 L1440,90 L0,90 Z"
    />
  </svg>
</div>


      <Container>
        <Row>
          {/* Sidebar Filters */}
          <Col lg={3} className="mb-4" id="product-filters">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border border-slate-100">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="fw-800 m-0 d-flex align-items-center gap-2">
                        <FaFilter size={14} className="text-primary-pet" />
                        Filters
                    </h5>
                    <Button variant="link" className="text-slate-400 p-0 fs-7 text-decoration-none hover-text-primary" onClick={resetFilters}>
                        <FaRedo size={12} className="me-1" /> Reset
                    </Button>
                </div>

                <label className="fw-700 mb-2">Categories</label>
              <Button
                variant={selectedCategoryId === null ? 'primary-pet' : 'light'}
                className="w-100 mb-2"
                onClick={() => setSelectedCategoryId(null)}
              >
                All Products
              </Button>

              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategoryId === cat.id ? 'primary-pet' : 'light'}
                  className="w-100 mb-2 text-start"
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}

                <div className="mb-4">
                    <label className="fw-700 text-slate-700 mb-2 d-block">Price Range (Max)</label>
                    <div className="px-1">
                        <Form.Range 
                            min={0} 
                            max={10000} 
                            step={100}
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="shop-range"
                        />
                        <div className="d-flex justify-content-between text-slate-400 small fw-600 mt-2">
                            <span>₹0</span>
                            <span className="text-primary-pet fw-800">₹{priceRange === 10000 ? 'All' : `₹${priceRange}`}</span>
                            <span>₹10000+</span>
                        </div>
                    </div>
                </div>

                <div className="mb-0">
                    <label className="fw-700 text-slate-700 mb-2 d-block">Search</label>
                    <Form.Control 
                        type="text" 
                        placeholder="Search products..." 
                        className="rounded-pill border-slate-200 shadow-none px-3 py-2 fw-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
          </Col>

          {/* Product Grid */}
          <Col lg={9}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <Row>
                {filteredProducts.map(product => (
                  <Col key={product.id} md={6} xl={4} className="mb-4">
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="bg-white p-5 rounded-4 text-center shadow-sm border border-slate-100">
                <div className="mb-3">
                    <span className="display-4">🔍</span>
                </div>
                <h4 className="fw-800 text-slate-800">No products found</h4>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
                <Button variant="primary-pet" className="rounded-pill px-4 mt-2" onClick={resetFilters}>Clear All Filters</Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <CartModal 
        show={showCart} 
        onHide={() => setShowCart(false)} 
        onOrderSuccess={() => {
            fetchCartCount();
            fetchData(); // Refresh stock in grid
        }}
      />
      
      <style>{`
        .petshop-container {
            font-family: 'Inter', sans-serif;
        }
        .text-primary-pet {
            color: var(--brand-primary);
        }
        .btn-primary-pet {
            background: var(--brand-primary);
            color: white;
            border: none;
        }
        .btn-primary-pet:hover {
            background: #4338ca;
            color: white;
        }
        .shop-range::-webkit-slider-thumb {
            background: var(--brand-primary);
        }
        .shop-hero {
            border-bottom-left-radius: 40px;
            border-bottom-right-radius: 40px;
        }
        .fs-7 {
            font-size: 0.85rem;
        }
        .hover-text-primary:hover {
            color: var(--brand-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default PetshopPage;
