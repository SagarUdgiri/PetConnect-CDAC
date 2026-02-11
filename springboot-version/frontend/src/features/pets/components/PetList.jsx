import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import PetCard from './PetCard';
import petService from '../../../services/petService';
import { useAuth } from '../../auth/AuthContext';
import toast from 'react-hot-toast';

const PetList = ({ onEditPet }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      // Fetch only user's pets for management
      const data = await petService.getPetsByUserId(user.id);
      setPets(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Could not load your pets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPets();
    }
  }, [user?.id]);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="d-flex flex-column gap-2" style={{ minWidth: '250px' }}>
        <div className="d-flex align-items-center gap-2 text-dark font-weight-bold">
           <div className="rounded-circle bg-danger bg-opacity-10 p-2 text-danger">
             <i className="bi bi-trash-fill"></i>
           </div>
           <span className="fw-700">Delete this pet?</span>
        </div>
        <div className="text-secondary small fw-500 ms-1 mb-1">
          This action cannot be undone.
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
              confirmDelete(id);
            }}
            className="rounded-pill px-3 fw-600 shadow-sm"
          >
            Delete
          </Button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center', style: { borderRadius: '16px', background: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } });
  };

  const confirmDelete = async (id) => {
    try {
      await petService.deletePet(id);
      setPets(pets.filter(p => p.id !== id));
      toast.success('Pet deleted successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete pet.';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading your companions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
        <div className="mt-2">
          <Button variant="outline-danger" onClick={fetchPets}>Try Again</Button>
        </div>
      </Alert>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center p-5 bg-white rounded-4 shadow-sm">
        <h4 className="fw-700 text-muted mb-3">No pets registered yet</h4>
        <p className="text-muted mb-4">Start your journey by adding your first pet!</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {pets.map(pet => (
        <Col key={pet.id} xs={12} sm={6} lg={4}>
          <PetCard 
            pet={pet} 
            onEdit={onEditPet} 
            onDelete={handleDelete} 
          />
        </Col>
      ))}
    </Row>
  );
};

export default PetList;
