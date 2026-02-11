import React, { useState } from 'react';
import { Container, Button, Modal, Nav, Tab } from 'react-bootstrap';
import { FaPlus, FaPaw, FaRobot } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import PetList from '../components/PetList';
import PetForm from '../components/PetForm';
import PetAIFeatures from '../components/PetAIFeatures';
import petService from '../../../services/petService';

const MyPetsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'list';

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTabSelect = (k) => {
    navigate(`/my-pets?tab=${k}`);
  };

  const handleEditClick = (pet) => {
    setSelectedPet(pet);
    setShowEditModal(true);
  };

  const handleUpdatePet = async (values) => {
    try {
      setIsSubmitting(true);
      await petService.updatePet(selectedPet.id, values);
      setShowEditModal(false);
      setRefreshKey(prev => prev + 1); // Refresh list
      toast.success('Pet updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to update pet details.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-800 mb-1" style={{ color: 'var(--p-slate-900)' }}>My Companions</h1>
            <p className="text-muted fw-500">Manage your pets and access AI features</p>
          </div>
          <Button 
            className="btn-primary-pet d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => navigate('/pets/register')}
            style={{ borderRadius: '15px' }}
          >
            <FaPlus /> Add New Pet
          </Button>
        </div>

        <Nav variant="pills" className="mb-4 bg-light p-2 rounded-pill d-inline-flex">
          <Nav.Item>
            <Nav.Link eventKey="list" className="rounded-pill px-4 fw-bold">
              <FaPaw className="me-2" />
              My Pets
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="ai" className="rounded-pill px-4 fw-bold">
              <FaRobot className="me-2" />
              AI Features
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="list">
             <PetList key={refreshKey} onEditPet={handleEditClick} />
          </Tab.Pane>
          <Tab.Pane eventKey="ai">
            <PetAIFeatures />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Edit Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
        contentClassName="border-0 shadow"
        style={{ borderRadius: '25px' }}
      >
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-800">Edit Pet Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedPet && (
            <PetForm 
              initialValues={selectedPet} 
              onSubmit={handleUpdatePet} 
              submitLabel="Update Profile"
              isLoading={isSubmitting}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MyPetsPage;
