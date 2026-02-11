import { useState } from 'react';
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../AuthContext';
import logo from '../../../assets/logo.png';
import '../auth.css';

const RegisterPage = () => {
  const [loadingLoc, setLoadingLoc] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

const schema = Yup.object().shape({
  full_name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z ]+$/,
      'Full Name must contain only English letters'
    )
    .min(6, 'Minimum 6 characters required')
    .required('Full Name is required'),

  username: Yup.string()
    .min(3, 'Username too short')
    .required('Username is required'),

  email: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address'
    )
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character')
    .required('Password is required'),

  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});


  const handleGeoLocation = (setFieldValue) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFieldValue('latitude', pos.coords.latitude.toFixed(8));
        setFieldValue('longitude', pos.coords.longitude.toFixed(8));
        setLoadingLoc(false);
      },
      () => {
        toast.error('Location access denied');
        setLoadingLoc(false);
      }
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 20px',
      background: 'white'
    }}>
      <div style={{
        width: '92%',
        maxWidth: '1300px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'white'
      }}>
        <Row className="g-0">
          {/* Form Side - LEFT */}
          <Col lg={7} className="d-flex align-items-center justify-content-center p-4 p-md-5">
            <div style={{ maxWidth: '550px', width: '100%' }}>
              <div className="mb-4 text-center">
                <img 
                  src={logo} 
                  alt="PetConnect" 
                  height="160" 
                  className="mb-2 mx-auto d-none d-lg-block" 
                  style={{ transform: 'scale(1.3)', transformOrigin: 'center center' }}
                />
                <h1 className="fw-800 mb-2" style={{ fontSize: '2.5rem', color: 'var(--p-slate-900)' }}>Create Account</h1>
                <p className="text-muted fw-500 mb-4">Join our community of pet lovers today.</p>
              </div>

              <Formik
                initialValues={{
                  full_name: '', username: '', email: '', phone: '',
                  password: '', confirm_password: '', latitude: '', longitude: '',
                  imageUrl: '', bio: ''
                }}
                validationSchema={schema}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  try {
                    await register(values);
                    toast.success('Account Created Successfully! Please login.');
                    navigate('/login');
                  } catch (error) {
                    console.log("from form "+error.message);
                    setStatus({ error: error.message || 'Registration failed' });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ handleSubmit, handleChange, values, touched, errors, setFieldValue, status, isSubmitting }) => (
                  <Form noValidate onSubmit={handleSubmit} className="text-start">
                    {status?.error && <Alert variant="danger" className="py-2 small fw-600 mb-3">{status.error}</Alert>}
                    {/* Row 1: Full Name + Username */}
                    <Row className="mb-2">
                      <Col md={6} className="mb-2">
                        <Form.Label className="fw-600 mb-1 small d-block">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="full_name"
                          placeholder="John Doe"
                          value={values.full_name}
                          onChange={handleChange}
                          isInvalid={touched.full_name && !!errors.full_name}
                          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                          {errors.full_name}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-2">
                        <Form.Label className="fw-600 mb-1 small d-block">Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="username"
                          value={values.username}
                          onChange={handleChange}
                          isInvalid={touched.username && !!errors.username}
                          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                          {errors.username}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>

                    {/* Row 2: Email + Phone */}
                    <Row className="mb-2">
                      <Col md={6} className="mb-2">
                        <Form.Label className="fw-600 mb-1 small d-block">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="mail@example.com"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={touched.email && !!errors.email}
                          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                          {errors.email}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-2">
                        <Form.Label className="fw-600 mb-1 small d-block">Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          placeholder="10 digits"
                          value={values.phone}
                          onChange={handleChange}
                          isInvalid={touched.phone && !!errors.phone}
                          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>

                    {/* Row 3: Password + Confirm Password */}
                    <Row className="mb-2">
                      <Col md={6} className="mb-2">
                        <Form.Label className="fw-600 mb-1 small d-block">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Min 6 characters"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={touched.password && !!errors.password}
                          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                          {errors.password}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-2">
                        <Form.Label className="fw-600 mb-1 small d-block">Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirm_password"
                          value={values.confirm_password}
                          onChange={handleChange}
                          isInvalid={touched.confirm_password && !!errors.confirm_password}
                          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                        />
                        <Form.Control.Feedback type="invalid" style={{ fontSize: '0.8rem' }}>
                          {errors.confirm_password}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>

                    {/* Location Section - Compact */}
                    <div className="p-3 rounded-3 mb-3" style={{ 
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: '2px dashed var(--p-slate-300)'
                    }}>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <h6 className="fw-700 mb-2" style={{ fontSize: '0.85rem', color: 'var(--p-slate-700)' }}>
                            Location (Optional)
                          </h6>
                          <Row className="g-2">
                            <Col xs={6}>
                              <Form.Control 
                                readOnly 
                                value={values.latitude || ''} 
                                placeholder="Latitude" 
                                size="sm"
                                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                              />
                            </Col>
                            <Col xs={6}>
                              <Form.Control 
                                readOnly 
                                value={values.longitude || ''} 
                                placeholder="Longitude" 
                                size="sm"
                                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col md={4}>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="w-100 fw-600"
                            onClick={() => handleGeoLocation(setFieldValue)}
                            disabled={loadingLoc}
                            style={{ fontSize: '0.8rem', padding: '8px' }}
                          >
                            {loadingLoc ? <Spinner animation="border" size="sm" /> : 'Auto-detect'}
                          </Button>
                        </Col>
                      </Row>
                    </div>

                    {/* Bio Section */}
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-600 mb-1 small d-block">Short Bio (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="bio"
                        placeholder="Tell us a bit about yourself and your pets..."
                        value={values.bio}
                        onChange={handleChange}
                        style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                      />
                    </Form.Group>

                    {/* Profile Picture Upload */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-700 mb-2 small d-block" style={{ color: 'var(--p-slate-700)' }}>
                        Profile Picture (Optional)
                      </Form.Label>
                      <div className="d-flex align-items-center gap-3">
                        <Button 
                          variant={values.imageUrl ? "outline-danger" : "outline-primary"} 
                          onClick={() => {
                            if (values.imageUrl) {
                              setFieldValue('imageUrl', '');
                            } else {
                              document.getElementById('register-image-input').click();
                            }
                          }}
                          className="d-flex align-items-center gap-2 px-3 py-2 fw-600"
                          style={{ borderRadius: '12px', fontSize: '0.85rem' }}
                          disabled={isSubmitting}
                        >
                          {values.imageUrl ? '✕ Remove Photo' : '+ Upload Profile Photo'}
                        </Button>
                        <input 
                          type="file" 
                          id="register-image-input" 
                          className="d-none" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('upload_preset', 'ml_default');
                              
                              const response = await fetch('https://api.cloudinary.com/v1_1/dim4t9fyx/image/upload', {
                                method: 'POST',
                                body: formData
                              });
                              
                              const data = await response.json();
                              if (data.secure_url) {
                                setFieldValue('imageUrl', data.secure_url);
                                toast.success('Profile photo uploaded!');
                              } else {
                                throw new Error(data.error?.message || 'Upload failed');
                              }
                            } catch (error) {
                              console.error("Upload error:", error);
                              toast.error('Upload failed: ' + error.message);
                            }
                          }} 
                        />
                        {values.imageUrl && (
                          <div className="rounded-circle overflow-hidden border border-primary shadow-sm" style={{ width: '45px', height: '45px' }}>
                            <img src={values.imageUrl} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="Profile" />
                          </div>
                        )}
                        <Form.Control type="hidden" name="imageUrl" value={values.imageUrl} />
                      </div>
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="w-100 btn-primary-pet mb-2" 
                      disabled={isSubmitting}
                      style={{ padding: '12px', fontSize: '1rem' }}
                    >
                      {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Create Account'}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted fw-500 small">Already have an account? </span>
                      <Link 
                        to="/login" 
                        className="fw-700 text-decoration-none small" 
                        style={{ color: 'var(--brand-primary)' }}
                      >
                        Login
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Col>

          {/* Realistic Pet Image - RIGHT */}
          <Col lg={5} className="d-none d-lg-block" style={{
            backgroundImage: 'url("/golden-retriever-headphones.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            minHeight: '650px'
          }}>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RegisterPage;
