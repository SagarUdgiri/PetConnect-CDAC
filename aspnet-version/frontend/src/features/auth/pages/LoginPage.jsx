import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import logo from '../../../assets/logo.png';
import '../auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, verifyOtp } = useAuth();
  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [errorHeader, setErrorHeader] = useState('');

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const otpSchema = Yup.object().shape({
    otp: Yup.string().length(6, 'Must be 6 digits').required('OTP is required'),
  });

  const handleLoginSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await login(values.email, values.password);
      if (response.otpSent) {
        setUserEmail(values.email);
        setShowOtp(true);
        setErrorHeader('');
      }
    } catch (error) {
      setErrorHeader(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const user = await verifyOtp(userEmail, values.otp);
      if (user.role?.toUpperCase() === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorHeader(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'white'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '1100px',
        height: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'white'
      }}>
        <Row className="g-0">
          {/* Happy Person with Dog - Playful Bond */}
          <Col lg={6} className="d-none d-lg-block" style={{
            backgroundImage: 'url("/husky-sunglasses.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat',
            minHeight: '550px'
          }}>
          </Col>

          {/* Form Side */}
          <Col lg={6} className="d-flex align-items-center justify-content-center p-5">
            <div style={{ maxWidth: '420px', width: '100%', padding: '20px 0' }}>
              <div className="mb-4 text-center">
                <img 
                  src={logo} 
                  alt="PetConnect" 
                  height="160" 
                  className="mb-2 mx-auto d-none d-lg-block" 
                  style={{ transform: 'scale(1.3)', transformOrigin: 'center center' }}
                />
                <h1 className="fw-800 mb-3" style={{ fontSize: '2.3rem', color: 'var(--p-slate-900)' }}>
                  {showOtp ? 'Verify OTP' : 'Welcome Back'}
                </h1>
                <p className="text-muted fw-500" style={{ fontSize: '1rem' }}>
                  {showOtp 
                    ? `We've sent a 6-digit code to ${userEmail}` 
                    : 'Login to your PetConnect account'}
                </p>
              </div>

              {errorHeader && <Alert variant="danger" className="py-2 small fw-600">{errorHeader}</Alert>}

              {!showOtp ? (
                <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={loginSchema}
                  onSubmit={handleLoginSubmit}
                >
                  {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3 text-start">
                        <Form.Label className="fw-600 mb-1 small d-block">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="name@example.com"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={touched.email && !!errors.email}
                          style={{ padding: '12px 16px' }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <Form.Label className="fw-600 mb-0 small">Password</Form.Label>
                          {/*<Link to="#" className="small fw-600 text-decoration-none" style={{ color: 'var(--brand-primary)' }}>Forgot Password?</Link>*/}
                        </div>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Your password"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={touched.password && !!errors.password}
                          style={{ padding: '12px 16px' }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>

                      <Button 
                        type="submit" 
                        className="w-100 btn-primary-pet mb-3" 
                        style={{ padding: '13px' }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Send OTP'}
                      </Button>

                      <div className="text-center">
                        <span className="text-muted fw-500 small">Don't have an account? </span>
                        <Link to="/register" className="fw-700 text-decoration-none small" style={{ color: 'var(--brand-primary)' }}>Sign Up</Link>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <Formik
                  key="otp-form"
                  initialValues={{ otp: '' }}
                  validationSchema={otpSchema}
                  onSubmit={handleOtpSubmit}
                >
                  {({ handleSubmit, handleChange, values, touched, errors, isSubmitting }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-4">
                        
                        <Form.Control
                          type="text"
                          name="otp"
                          placeholder="Enter 6-Digit Code"
                          maxLength={6}
                          value={values.otp}
                          onChange={handleChange}
                          isInvalid={touched.otp && !!errors.otp}
                          className="otp-input"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          style={{ 
                            padding: '12px 16px', 
                            fontSize: '1.2rem', 
                            textAlign: 'center', 
                            letterSpacing: '4px',
                            fontWeight: '600',
                            borderRadius: '12px',
                            border: '2px solid var(--p-slate-200)',
                            backgroundColor: 'var(--p-slate-50)'
                          }}
                        />
                        <Form.Control.Feedback type="invalid">{errors.otp}</Form.Control.Feedback>
                      </Form.Group>

                      <Button 
                        type="submit" 
                        className="w-100 btn-primary-pet mb-3" 
                        style={{ padding: '13px' }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Verifying...' : 'Verify & Login'}
                      </Button>

                      <div className="text-center">
                        <button 
                          type="button"
                          onClick={() => setShowOtp(false)}
                          className="btn btn-link fw-700 text-decoration-none small" 
                          style={{ color: 'var(--brand-primary)' }}
                        >
                          Back to Login
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
