import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import petService from '../../../services/petService';
import missingPetService from '../../../services/missingPetService';
import { toast } from 'react-hot-toast';

const ReportMissingPetModal = ({ show, onHide, user, onSuccess }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        petId: '',
        petName: '',
        species: '',
        breed: '',
        description: '',
        lastSeenLocation: '',
        latitude: '',
        longitude: '',
        imageUrl: '',
        status: 'MISSING'
    });

    useEffect(() => {
        if (show && user?.id) {
            fetchUserPets();
            // Try to get current location for the report
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    }));
                });
            }
        }
    }, [show, user?.id]);

    const fetchUserPets = async () => {
        setLoading(true);
        try {
            const data = await petService.getPetsByUserId(user.id);
            setPets(data || []);
        } catch (error) {
            console.error("Error fetching user pets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePetSelect = (e) => {
        const selectedId = e.target.value;
        if (selectedId) {
            const selectedPet = pets.find(p => p.id === parseInt(selectedId));
            if (selectedPet) {
                setFormData({
                    ...formData,
                    petId: selectedId,
                    petName: selectedPet.name,
                    species: selectedPet.type,
                    breed: selectedPet.breed,
                    imageUrl: selectedPet.imageUrl
                });
            }
        } else {
            setFormData({
                ...formData,
                petId: '',
                petName: '',
                species: '',
                breed: '',
                imageUrl: ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                petId: formData.petId ? parseInt(formData.petId) : null,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };
            await missingPetService.createMissingPetReport(user.id, payload);
            toast.success("Report submitted successfully! Nearby users notified.");
            onSuccess();
            onHide();
        } catch (error) {
            toast.error(error.response.data.message || "Failed to submit report. Please check the fields.");
            console.error(error.response.data.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-800">Report Missing or Found Pet</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body className="p-4">
                    <Alert variant="info" className="rounded-3 small border-0">
                        Reporting a <b>MISSING</b> pet will instantly alert all PetConnect users within 5km of the last seen location.
                    </Alert>

                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Type of Report</Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="MISSING">Missing (I lost a pet)</option>
                                    <option value="FOUND">Found (I found a pet)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Select Registered Pet (Optional)</Form.Label>
                                <Form.Select value={formData.petId} onChange={handlePetSelect} disabled={loading}>
                                    <option value="">-- Manual Entry --</option>
                                    {pets.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Pet Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="petName" 
                                    value={formData.petName} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Buddy" 
                                    required 
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Species</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="species" 
                                    value={formData.species} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Dog, Cat" 
                                    required 
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Breed</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="breed" 
                                    value={formData.breed} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Golden Retriever"
                                    required 
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Last Seen Location / Area</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="lastSeenLocation" 
                                    value={formData.lastSeenLocation} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Central Park, North Gate" 
                                    required 
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Latitude</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    step="any" 
                                    name="latitude" 
                                    value={formData.latitude} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Longitude</Form.Label>
                                <Form.Control 
                                    type="number" 
                                    step="any" 
                                    name="longitude" 
                                    value={formData.longitude} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Description / Distinguishing Marks</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3} 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Wearing a red collar, white spot on left ear..."
                                    required 
                                />
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-700">Image URL</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="imageUrl" 
                                    value={formData.imageUrl} 
                                    onChange={handleChange} 
                                    placeholder="Link to pet photo" 
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="link" className="text-decoration-none text-slate-500 fw-700" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button type="submit" className="btn-primary-pet px-4 py-2" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Post Report'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ReportMissingPetModal;
