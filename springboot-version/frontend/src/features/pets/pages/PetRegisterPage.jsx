import React, { useState } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PetForm from '../components/PetForm';
import petService from '../../../services/petService';
import '../../auth/auth.css';

const PetRegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (values) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await petService.registerPet(values);
      toast.success('Pet Profile Created Successfully!');
      navigate('/my-pets');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to register pet. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      background: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        background: 'white',
        borderRadius: '30px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <Row className="g-0">
          {/* Visual Side - LEFT */}
          <Col lg={5} className="d-none d-lg-block" style={{
            backgroundColor: '#ffb703',
            backgroundImage: 'url("https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '600px'
          }}>
          </Col>

          {/* Form Side - RIGHT */}
          <Col lg={7} className="p-4 p-md-5">
            <div className="mb-4">
              <h2 className="fw-800 mb-1" style={{ color: 'var(--p-slate-900)' }}>Pet Profile</h2>
              <p className="text-muted fw-500 small">Let's get to know your companion</p>
            </div>

            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

            <PetForm 
              onSubmit={handleRegister} 
              submitLabel="Complete Registration" 
              isLoading={isSubmitting}
            />
            

          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PetRegisterPage;
