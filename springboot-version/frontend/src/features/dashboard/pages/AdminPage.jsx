import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Badge, Tabs, Tab, Modal, Form } from 'react-bootstrap';
import { useAuth } from '../../auth/AuthContext';
import userService from '../../../services/userService';
import ShopService from '../../../services/ShopService';
import { FaUsers, FaDog, FaLayerGroup, FaTrash, FaSyncAlt, FaShieldAlt, FaPlus, FaEdit, FaStore, FaList } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPets: 0, totalPosts: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Cloudinary Config
  const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; 
  const CLOUDINARY_CLOUD_NAME = 'dim4t9fyx';

  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: '',
    categoryId: '' 
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const INBUILT_CATEGORIES = ['Toy', 'Food', 'Dress', 'Medicine'];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      
      
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const BASE_URL = 'http://localhost:8080';
      
      let fetchedOrders = [];

      // Fetch each resource independently
      try {
        const uData = await userService.getAllUsers();
        setUsers(uData);
      } catch (e) { console.error('Users fetch error', e); }

      try {
        const pData = await ShopService.getAllProducts();
        setProducts(Array.isArray(pData) ? pData : []);
      } catch (e) { 
        console.error('Products fetch error', e); 
        setProducts([]);
      }

      try {
        const cData = await ShopService.getAllCategories();
        setCategories(Array.isArray(cData) ? cData : []);
      } catch (e) { 
        console.error('Categories fetch error', e); 
        setCategories([]);
      }

      try {
        const ordersRes = await axios.get(`${BASE_URL}/api/admin-users/all-orders`, { headers });
        fetchedOrders = ordersRes.data || [];
        setOrders(fetchedOrders);
      } catch (e) { console.error('Orders fetch error', e); }

      try {
        const statsRes = await axios.get(`${BASE_URL}/api/admin-users/stats`, { headers });
        const revenue = fetchedOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        setStats({ ...statsRes.data, totalRevenue: revenue });
      } catch (e) { console.error('Stats fetch error', e); }
    } catch (err) {
      console.error('General fetch error', err);
      // Don't set error if at least some data loaded, or set it non-blocking
      // setError('Some data failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = (userId) => {
    toast((t) => (
      <div className="d-flex flex-column gap-2" style={{ minWidth: '250px' }}>
        <div className="d-flex align-items-center gap-2 text-dark font-weight-bold">
           <div className="rounded-circle bg-danger bg-opacity-10 p-2 text-danger">
             <i className="bi bi-trash-fill"></i>
           </div>
           <span className="fw-700">Delete this user?</span>
        </div>
        <div className="text-secondary small fw-500 ms-1 mb-1">
          This action restricts access permanently.
        </div>
        <div className="d-flex gap-2 justify-content-end mt-1">
          <Button 
            size="sm" 
            variant="light" 
            onClick={() => toast.dismiss(t.id)}
            className="border-0 bg-slate-100 text-slate-600 fw-600 rounded-pill px-3"
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => {
               toast.dismiss(t.id);
               confirmDeleteUser(userId);
            }}
            className="rounded-pill px-3 fw-600 shadow-sm"
          >
            Delete User
          </Button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center', style: { borderRadius: '16px', background: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } });
  };

  const confirmDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
      // Refresh stats
      fetchData();
    } catch (err) {
      toast.error('Failed to delete user.');
    }
  };

  // Product CRUD
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId || (categories[0]?.name || '')
      });
      setImagePreview(product.imageUrl);
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        price: '',
        quantity: '',
        imageUrl: '',
        category: categories[0]?.name || ''
      });
      setImagePreview(null);
    }
    setShowProductModal(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
        setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (response.ok && data.secure_url) {
            setProductForm(prev => ({ ...prev, imageUrl: data.secure_url }));
            toast.success('Image uploaded successfully');
        } else {
            console.error('Cloudinary error:', data);
            toast.error(`Upload failed: ${data.error?.message || 'Unknown error'}`);
        }
    } catch (err) {
        console.error('Network/Upload error:', err);
        toast.error('Image upload failed due to network error.');
    } finally {
        setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (uploadingImage) {
        toast.error('Please wait for image upload to complete');
        return;
    }
    if (!productForm.imageUrl) {
        toast.error('Please upload an image first');
        return;
    }
    try {
      // Convert string values to numbers for backend
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        quantity: parseInt(productForm.quantity, 10),
        categoryId: Number(productForm.categoryId)
      };
      
      if (editingProduct) {
        await ShopService.updateProduct(editingProduct.id, productData);
        toast.success('Product updated successfully');
      } else {
        await ShopService.createProduct(productData);
        toast.success('Product created successfully');
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      console.error('Product save error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save product';
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ShopService.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setAddingCategory(true);
    try {
      const savedCat = await ShopService.createCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
      toast.success('Category added successfully');
      setShowAddCategoryModal(false);
      
      // Fetch fresh data and select the new category
      await fetchData();
      setProductForm(prev => ({ ...prev, category: savedCat.name }));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure? Products in this category will remain, but the category itself will be removed from the list.')) {
      try {
        await ShopService.deleteCategory(catId);
        toast.success('Category removed');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="grow" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <h4 className="mt-4 fw-800 text-slate-800 animate-pulse">Initializing Management Center</h4>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
      <Container style={{ maxWidth: '1300px' }}>
        {/* Header Section */}
        <div className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-4">
          <div className="animate-slideIn">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 shadow-sm" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
              <FaShieldAlt className="text-primary" size={14} />
              <span className="small fw-800 text-slate-600 uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>Security Protocol Alpha</span>
            </div>
            <h1 className="display-5 fw-900 text-slate-900 mb-2">Management Center</h1>
            <p className="text-slate-500 fs-5 fw-500 mb-0">Overseeing the PetConnect ecosystem.</p>
          </div>

          <Button 
            variant="white" 
            className="d-flex align-items-center gap-2 px-4 py-3 rounded-4 fw-800 text-slate-700 shadow-sm border-0 bg-white hover-lift transition-all"
            onClick={fetchData}
          >
            <FaSyncAlt />
            Refresh Data
          </Button>
        </div>

        {error && <Alert variant="danger" className="border-0 shadow-sm rounded-4 mb-4">{error}</Alert>}

        {/* Stats Grid */}
        <Row className="g-4 mb-5 text-center">
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-5 p-4 bg-white hover-lift transition-all">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                    <FaUsers size={30} className="text-primary" />
                </div>
                <h6 className="text-slate-500 uppercase tracking-wide small mb-1 fw-700">Total Users</h6>
                <div className="h3 fw-900 text-slate-900">{stats.totalUsers}</div>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-5 p-4 bg-white hover-lift transition-all">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                    <FaDog size={30} className="text-warning" />
                </div>
                <h6 className="text-slate-500 uppercase tracking-wide small mb-1 fw-700">Active Pets</h6>
                <div className="h3 fw-900 text-slate-900">{stats.totalPets}</div>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-5 p-4 bg-white hover-lift transition-all">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                    <FaStore size={30} className="text-success" />
                </div>
                <h6 className="text-slate-500 uppercase tracking-wide small mb-1 fw-700">Shop Items</h6>
                <div className="h3 fw-900 text-slate-900">{products.length}</div>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-5 p-4 bg-white hover-lift transition-all">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                    <span className="h4 fw-900 text-info m-0">₹</span>
                </div>
                <h6 className="text-slate-500 uppercase tracking-wide small mb-1 fw-700">Gross Revenue</h6>
                <div className="h3 fw-900 text-slate-900">₹{stats.totalRevenue?.toLocaleString()}</div>
            </Card>
          </Col>
        </Row>

        <Card className="border-0 shadow-sm rounded-5 bg-white overflow-hidden animate-fadeIn">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="admin-tabs border-bottom px-4"
          >
            <Tab eventKey="users" title={<span><FaUsers className="me-2" /> User Management</span>}>
              <div className="table-responsive">
                <Table borderless hover className="mb-0">
                  <thead className="bg-slate-50 border-bottom">
                    <tr>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">User</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Email</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Access Level</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small text-end">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr key={u.id} className="transition-all hover-bg-slate-50">
                        <td className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-900 shadow-sm" style={{ width: 45, height: 45, fontSize: '1rem' }}>
                                    {(u.fullName || u.username).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="fw-800 text-slate-900">{u.fullName || u.username}</div>
                                    <div className="small text-slate-400 fw-600">@{u.username}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 align-middle fw-600 text-slate-600">{u.email}</td>
                        <td className="p-4 align-middle">
                            <Badge 
                                bg={u.role === 'ADMIN' ? 'danger' : 'primary'} 
                                className={`px-3 py-2 rounded-pill fw-800 bg-opacity-10 text-${u.role === 'ADMIN' ? 'danger' : 'primary'}`}
                                style={{ fontSize: '0.75rem', background: u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)' }}
                            >
                                {u.role}
                            </Badge>
                        </td>
                        <td className="p-4 align-middle text-end">
                            <Button 
                                variant="link" 
                                className={`p-2 rounded-3 text-decoration-none transition-all ${u.role === 'ADMIN' ? 'text-slate-200 pointer-events-none' : 'text-danger hover-bg-danger-subtle'}`}
                                disabled={u.role === 'ADMIN'}
                                onClick={() => handleDeleteUser(u.id)}
                            >
                                <FaTrash size={18} />
                            </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>
            
            <Tab eventKey="products" title={<span><FaStore className="me-2" /> Shop Inventory</span>}>
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-slate-50">
                  <div>
                      <h5 className="m-0 fw-900 text-slate-900">PetShop Products</h5>
                      <p className="text-slate-500 small mb-0 fw-500">Manage your digital storefront catalog</p>
                  </div>
                  <Button variant="primary-pet" className="rounded-pill d-flex align-items-center gap-2 px-4 py-2 shadow-sm fw-800" onClick={() => handleOpenProductModal()}>
                      <FaPlus /> Add New Item
                  </Button>
              </div>
              <div className="table-responsive">
                <Table borderless hover className="mb-0">
                  <thead className="bg-slate-50 border-bottom">
                    <tr>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Product Details</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Category</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Price Point</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small text-end">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="transition-all hover-bg-slate-50">
                        <td className="p-4">
                            <div className="d-flex align-items-center gap-3">
                                <img src={p.imageUrl || 'https://via.placeholder.com/60'} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 12, border: '1px solid #e2e8f0' }} />
                                <div>
                                    <div className="fw-800 text-slate-900">{p.name}</div>
                                    <div className="small fw-700 text-primary-pet">
                                        Stock Level: <span className={p.quantity < 10 ? 'text-danger' : ''}>{p.quantity} Units</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 align-middle">
                            <Badge bg="slate-100" className="rounded-pill text-slate-600 fw-800 px-3 py-2" style={{ background: '#f1f5f9' }}>
                                {p.category}
                            </Badge>
                        </td>
                        <td className="p-4 align-middle fw-900 text-primary-pet fs-5">₹{p.price}</td>
                        <td className="p-4 align-middle text-end">
                            <Button variant="link" className="text-primary hover-bg-primary-subtle p-2 rounded-3 me-2" onClick={() => handleOpenProductModal(p)}>
                                <FaEdit size={18} />
                            </Button>
                            <Button variant="link" className="text-danger hover-bg-danger-subtle p-2 rounded-3" onClick={() => handleDeleteProduct(p.id)}>
                                <FaTrash size={18} />
                            </Button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-5 text-slate-400 fw-600">No products available in the inventory.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
            <Tab eventKey="sales" title={<span><FaList className="me-2" /> Sales Dashboard</span>}>
              <div className="p-4 border-bottom bg-slate-50">
                  <h5 className="m-0 fw-900 text-slate-900">Order History & Sales</h5>
                  <p className="text-slate-500 small mb-0 fw-500">Real-time tracking of platform transactions</p>
              </div>
              <div className="table-responsive">
                <Table borderless hover className="mb-0">
                  <thead className="bg-slate-50 border-bottom">
                    <tr>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Customer</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Order Details</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small">Financials</th>
                      <th className="p-4 fw-800 text-slate-500 uppercase tracking-wider small text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="transition-all hover-bg-slate-50">
                        <td className="p-4">
                            <div className="fw-800 text-slate-900">{o.username}</div>
                            <div className="small text-slate-400 fw-600">{o.userEmail}</div>
                        </td>
                        <td className="p-4 align-middle">
                            <div className="small fw-700 text-slate-600">ID: #{o.orderId}</div>
                            <div className="small fw-500 text-slate-400">
                                {o.items?.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                            </div>
                        </td>
                        <td className="p-4 align-middle">
                            <div className="fw-900 text-primary-pet">₹{o.totalPrice}</div>
                            <div className="small text-slate-400 fw-500">{new Date(o.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4 align-middle text-end">
                            <Badge bg={o.orderStatus === 'PAID' ? 'success' : 'warning'} className="rounded-pill px-3 py-2 fw-800">
                                {o.orderStatus}
                            </Badge>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan="4" className="text-center py-5 text-slate-400 fw-600">No transactions recorded yet.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card>
      </Container>

      {/* Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} centered size="lg" className="admin-modal">
          <Modal.Header closeButton className="border-0 px-4 pt-4">
              <Modal.Title className="fw-900 text-slate-900">
                  {editingProduct ? 'Edit Product Parameters' : 'Register New Inventory Item'}
              </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveProduct}>
              <Modal.Body className="p-4">
                    <Row className="g-4">
                      <Col md={6}>
                          <Form.Group>
                              <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase tracking-wide">Product Identifier</Form.Label>
                              <Form.Control 
                                type="text" 
                                required
                                className="rounded-4 py-2 border-slate-200 shadow-none"
                                value={productForm.name}
                                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                placeholder="e.g. Premium Dog Kibble"
                              />
                          </Form.Group>
                      </Col>
                      <Col md={6}>
                          <Form.Group>
                              <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase tracking-wide">Category Classification</Form.Label>
                              <div className="d-flex gap-2">
                                <Form.Select 
                                  className="rounded-4 py-2 border-slate-200 shadow-none fw-600"
                                  value={productForm.categoryId}
                                  onChange={(e) =>
                                    setProductForm({ ...productForm, categoryId: Number(e.target.value) })
                                  }
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                      <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </option>
                                    ))}
                                </Form.Select>
                                <Button 
                                  variant="primary-pet" 
                                  className="rounded-4 px-3"
                                  onClick={() => setShowAddCategoryModal(true)}
                                  title="Add New Category"
                                >
                                    <FaPlus />
                                </Button>
                              </div>
                          </Form.Group>
                          
                      </Col>
                      <Col md={12}>
                          <Form.Group>
                              <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase tracking-wide">Detailed Specifications</Form.Label>
                              <Form.Control 
                                as="textarea" 
                                rows={3}
                                required
                                className="rounded-4 border-slate-200 shadow-none"
                                value={productForm.description}
                                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                placeholder="Describe the product's key features and benefits..."
                              />
                          </Form.Group>
                      </Col>
                      <Col md={6}>
                          <Form.Group>
                              <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase tracking-wide">Price Attribution (INR)</Form.Label>
                              <Form.Control 
                                type="number" 
                                required
                                className="rounded-4 py-2 border-slate-200 shadow-none"
                                value={productForm.price}
                                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                placeholder="0.00"
                              />
                          </Form.Group>
                      </Col>
                      <Col md={6}>
                          <Form.Group>
                              <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase tracking-wide">Initial Inventory Count</Form.Label>
                              <Form.Control 
                                type="number" 
                                required
                                className="rounded-4 py-2 border-slate-200 shadow-none"
                                value={productForm.quantity}
                                onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                                placeholder="0"
                              />
                          </Form.Group>
                      </Col>
                      <Col md={12}>
                          <Form.Group>
                              <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase tracking-wide">Product Visual (Image Upload)</Form.Label>
                              <div className="d-flex align-items-center gap-4">
                                  <div 
                                    className="rounded-4 border-2 border-dashed border-slate-200 d-flex align-items-center justify-content-center overflow-hidden bg-slate-50 cursor-pointer hover-bg-slate-100 transition-all" 
                                    style={{ width: '120px', height: '120px' }}
                                    onClick={() => document.getElementById('productImage').click()}
                                  >
                                      {imagePreview ? (
                                          <img src={imagePreview} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                      ) : (
                                          <div className="text-center text-slate-400">
                                              <FaPlus size={24} className="mb-2" />
                                              <div className="small fw-700">Select File</div>
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-grow-1">
                                      <Form.Control 
                                        id="productImage"
                                        type="file" 
                                        accept="image/*"
                                        className="d-none"
                                        onChange={handleImageChange}
                                      />
                                      {uploadingImage ? (
                                          <div className="text-primary fw-800 small d-flex align-items-center gap-2">
                                              <Spinner animation="border" size="sm" /> Syncing with Cloudinary...
                                          </div>
                                      ) : productForm.imageUrl ? (
                                          <div className="text-success fw-800 small d-flex align-items-center gap-2">
                                              <Badge bg="success" className="rounded-pill">READY</Badge> Image synced successfully
                                          </div>
                                      ) : (
                                          <p className="text-slate-400 small mb-0 fw-500">Supported formats: JPG, PNG, WEBP. Max size 5MB.</p>
                                      )}
                                      <Button 
                                        variant="link" 
                                        className="p-0 mt-1 text-slate-400 small fw-700 text-decoration-none hover-text-primary"
                                        onClick={() => document.getElementById('productImage').click()}
                                      >
                                          Replace Image
                                      </Button>
                                  </div>
                              </div>
                          </Form.Group>
                      </Col>
                  </Row>
              </Modal.Body>
              <Modal.Footer className="border-0 p-4 pt-0">
                  <Button variant="light" className="rounded-pill px-4 fw-800 text-slate-500" onClick={() => setShowProductModal(false)}>Discard</Button>
                  <Button variant="primary-pet" type="submit" className="rounded-pill px-5 py-2 shadow-sm fw-800 hvr-grow">
                      {editingProduct ? 'Commit Changes' : 'Publish Product'}
                  </Button>
              </Modal.Footer>
          </Form>
      </Modal>
      
      {/* Add Category Modal */}
      <Modal show={showAddCategoryModal} onHide={() => setShowAddCategoryModal(false)} centered className="admin-modal">
          <Modal.Header closeButton className="border-0 px-4 pt-4">
              <Modal.Title className="fw-900 text-slate-900">Add New Category</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateCategory}>
              <Modal.Body className="p-4">
                  <Form.Group>
                      <Form.Label className="fw-800 text-slate-700 small mb-2 uppercase">Category Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        required
                        autoFocus
                        className="rounded-4 py-2 border-slate-200 shadow-none px-3"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Grooming, Toys, etc."
                      />
                  </Form.Group>
              </Modal.Body>
              <Modal.Footer className="border-0 p-4 pt-0">
                  <Button variant="light" className="rounded-pill px-4 fw-800 text-slate-500" onClick={() => setShowAddCategoryModal(false)}>Cancel</Button>
                  <Button variant="primary-pet" type="submit" disabled={addingCategory} className="rounded-pill px-4 py-2 fw-800 shadow-sm">
                      {addingCategory ? <Spinner animation="border" size="sm" /> : 'Create Category'}
                  </Button>
              </Modal.Footer>
          </Form>
      </Modal>

      <style>{`
        .admin-tabs .nav-link {
          padding: 1.5rem 2rem;
          color: #64748b;
          font-weight: 800;
          border: none;
          background: transparent !important;
          border-bottom: 4px solid transparent;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }
        .admin-tabs .nav-link:hover {
          color: var(--brand-primary);
          background: rgba(79, 70, 229, 0.05) !important;
        }
        .admin-tabs .nav-link.active {
          color: var(--brand-primary);
          border-bottom-color: var(--brand-primary);
        }
        .text-primary-pet { color: var(--brand-primary); }
        .btn-primary-pet {
          background: var(--brand-primary);
          color: white;
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-primary-pet:hover {
          background: #4338ca;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(79, 70, 229, 0.25);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
        }
        .hover-bg-slate-50:hover { background-color: #f8fafc; }
        .hover-bg-danger-subtle:hover { background-color: #fef2f2; }
        .hover-bg-primary-subtle:hover { background-color: #eef2ff; }
        .animate-slideIn { animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .user-audit-table th { border: none !important; }
        .admin-modal .modal-content {
          border: none;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
