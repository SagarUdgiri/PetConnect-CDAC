import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Form, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../auth/AuthContext';
import missingPetService, { contactReporter, getContacts, deleteReport } from '../../../services/missingPetService';
import ReportMissingPetModal from '../components/ReportMissingPetModal';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBullhorn, FaEnvelope, FaPhone, FaUser, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LostFoundPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Contact Modal State
    const [contactModalShow, setContactModalShow] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [sendingContact, setSendingContact] = useState(false);

    // View Contacts State
    const [viewContactsShow, setViewContactsShow] = useState(false);
    const [myReportContacts, setMyReportContacts] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);

    // Delete Confirmation State
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [reportToDelete, setReportToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchReports = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            // Fetch everything - our updated service handles the radius/own logic
            const data = await missingPetService.getNearbyMissingPets(50.0);
            let results = data || [];

            if (searchQuery) {
                // If deep linking to a specific report
                results = results.filter(r => r.id.toString() === searchQuery);
            }

            setReports(results);
        } catch (error) {
            console.error("Error fetching missing pet reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [user?.id]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleContactClick = (report) => {
        setSelectedReport(report);
        setContactMessage(`I saw your missing pet ${report.petName}...`);
        setContactModalShow(true);
    };

    const handleSendContact = async () => {
        if (!contactMessage.trim()) return;
        setSendingContact(true);
        try {
            await contactReporter(selectedReport.id, contactMessage);
            toast.success('Message sent to the owner!');
            setContactModalShow(false);
            setContactMessage('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message');
        } finally {
            setSendingContact(false);
        }
    };

    const handleViewContactsClick = async (report) => {
        setSelectedReport(report);
        setViewContactsShow(true);
        setLoadingContacts(true);
        try {
            const contacts = await getContacts(report.id);
            setMyReportContacts(contacts);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load contacts');
        } finally {
            setLoadingContacts(false);
        }
    };

    const handleDeleteClick = (report) => {
        setReportToDelete(report);
        setDeleteModalShow(true);
    };

    const handleConfirmDelete = async () => {
        if (!reportToDelete) return;
        setDeleting(true);
        try {
            await deleteReport(reportToDelete.id);
            toast.success('Report deleted successfully!');
            setDeleteModalShow(false);
            setReportToDelete(null);
            fetchReports(); // Refresh the list
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete report');
        } finally {
            setDeleting(false);
        }
    };

    const renderReportCard = (report) => (
        <Col key={report.id} lg={4} md={6}>
            <Card className={`card-premium h-100 border-0 shadow-sm hover-lift overflow-hidden ${report.reporterId === user?.id ? 'border-primary border-top border-4' : ''}`}>
                <div style={{ height: '220px', position: 'relative' }}>
                    <img 
                        src={report.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800'} 
                        className="w-100 h-100 object-fit-cover"
                        alt={report.petName}
                    />
                    <Badge 
                        bg={report.status === 'MISSING' ? 'danger' : 'success'} 
                        className="position-absolute p-2 px-3 fw-800"
                        style={{ top: '15px', right: '15px', borderRadius: '10px' }}
                    >
                        {report.status}
                    </Badge>
                    {report.reporterId === user?.id && (
                        <Badge 
                            bg="primary" 
                            className="position-absolute p-2 px-3 fw-800 shadow-sm"
                            style={{ top: '15px', left: '15px', borderRadius: '10px' }}
                        >
                            YOUR REPORT
                        </Badge>
                    )}
                </div>
                <Card.Body className="p-4 d-flex flex-column h-100">
                    {/* Header */}
                    <div className="mb-3">
                        <h4 className="fw-800 mb-1 text-truncate">
                        {report.petName}
                        </h4>
                        <div className="small text-slate-400 fw-700 text-uppercase">
                        {report.species} • {report.breed || 'Unknown Breed'}
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        className="text-slate-600 mb-4 lh-base flex-grow-1"
                        style={{ fontSize: '0.95rem' }}
                    >
                        {report.description || 'No description provided.'}
                    </p>

                    {/* Meta info */}
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center gap-2 text-slate-500 small fw-600">
                        <FaMapMarkerAlt className="text-danger flex-shrink-0" />
                        <span className="text-truncate">
                            {report.lastSeenLocation} ({report.distance} km away)
                        </span>
                        </div>

                        <div className="d-flex align-items-center gap-2 text-slate-500 small fw-600">
                        <FaCalendarAlt className="text-indigo-500 flex-shrink-0" />
                        <span>
                            Reported on {formatDate(report.createdAt)}
                        </span>
                        </div>
                    </div>

                    <hr className="bg-slate-200 mb-4" />

                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <div className="bg-slate-100 rounded-circle d-flex align-items-center justify-content-center fw-800 text-indigo-600 small" style={{ width: '32px', height: '32px' }}>
                                {report.reporterName?.substring(0, 1) || 'U'}
                            </div>
                            <div className="small text-dark fw-700">{report.reporterName}</div>
                        </div>
                        {report.reporterId === user?.id ? (
                            <div className="d-flex gap-2">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="fw-800 px-3 rounded-pill border-2 d-flex align-items-center gap-2 position-relative"
                                    onClick={() => handleViewContactsClick(report)}
                                >
                                    <FaUser /> View Requests
                                    {report.contactCount > 0 && (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {report.contactCount}
                                        </span>
                                    )}
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    size="sm" 
                                    className="fw-800 px-3 rounded-pill border-2 d-flex align-items-center gap-2"
                                    onClick={() => handleDeleteClick(report)}
                                    title="Delete Report"
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="fw-800 px-3 rounded-pill border-2"
                                onClick={() => handleContactClick(report)}
                            >
                                Contact
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    const myReports = reports.filter(r => r.reporterId === user?.id);
    const otherReports = reports.filter(r => r.reporterId !== user?.id);

    return (
        <Container className="py-5">
            <header className="mb-5 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="display-5 fw-800 mb-2">Lost & Found 🐾</h1>
                    <p className="text-slate-500 fs-5">Helping pets find their way back home.</p>
                </div>
                <Button 
                    className="btn-primary-pet px-4 py-3 shadow-lg d-flex align-items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <FaBullhorn /> Report Missing/Found
                </Button>
            </header>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="grow" variant="primary" />
                    <p className="mt-3 text-slate-400 fw-600">Scanning for reports in your area...</p>
                </div>
            ) : reports.length === 0 ? (
                <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-slate-50">
                    <div className="display-1 mb-4">🏠</div>
                    <h3 className="fw-800 text-slate-800">No Missing Pets Nearby</h3>
                    <p className="text-slate-500 col-md-6 mx-auto">
                        Great news! There are currently no missing or found pets reported in your area (50km).
                        Keep an eye out anyway!
                    </p>
                </Card>
            ) : (
                <>
                    {myReports.length > 0 && (
                        <section className="mb-5">
                            <h3 className="fw-800 mb-4 d-flex align-items-center gap-2">
                                <span className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary"><FaUser size={20}/></span>
                                Your Active Reports
                            </h3>
                            <Row className="g-4">
                                {myReports.map(renderReportCard)}
                            </Row>
                        </section>
                    )}

                    {otherReports.length > 0 ? (
                        <section>
                            <h3 className="fw-800 mb-4 d-flex align-items-center gap-2">
                                <span className="bg-danger bg-opacity-10 p-2 rounded-3 text-danger"><FaMapMarkerAlt size={20}/></span>
                                Nearby Missing Pets
                            </h3>
                            <Row className="g-4">
                                {otherReports.map(renderReportCard)}
                            </Row>
                        </section>
                    ) : myReports.length > 0 && (
                        <Alert variant="info" className="rounded-4 border-0 p-4">
                           <div className="d-flex align-items-center gap-3">
                               <div className="fs-2">🌟</div>
                               <div>
                                   <h5 className="fw-800 mb-1">You're making a difference!</h5>
                                   <p className="mb-0 fw-600 opacity-75">No other missing pets are reported nearby right now. We'll keep sharing your report with anyone who joins!</p>
                               </div>
                           </div>
                        </Alert>
                    )}
                </>
            )}

            <ReportMissingPetModal 
                show={showModal} 
                onHide={() => setShowModal(false)} 
                user={user}
                onSuccess={fetchReports}
            />

            {/* Contact Modal (For Finders) */}
            <Modal show={contactModalShow} onHide={() => setContactModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-800">Contact Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted small">
                        Send a message to <strong>{selectedReport?.reporterName}</strong> about <strong>{selectedReport?.petName}</strong>. 
                        Your contact details (phone/email) will be shared with them.
                    </p>
                    <Form.Group>
                        <Form.Label className="fw-700 small text-uppercase text-slate-500">Message</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={4} 
                            placeholder="I saw your pet near..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => setContactModalShow(false)}>Cancel</Button>
                    <Button 
                        variant="primary" 
                        disabled={!contactMessage.trim() || sendingContact}
                        onClick={handleSendContact}
                    >
                        {sendingContact ? <Spinner size="sm" animation="border" /> : <><FaEnvelope className="me-2"/> Send Message</>}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Contacts Modal (For Reporters) */}
            <Modal show={viewContactsShow} onHide={() => setViewContactsShow(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-800">People Who Contacted You</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {loadingContacts ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                        </div>
                    ) : myReportContacts.length === 0 ? (
                        <div className="text-center py-5">
                            <h5 className="text-muted">No contacts yet</h5>
                            <p className="text-small text-muted">When people contact you, they will appear here.</p>
                        </div>
                    ) : (
                        <ListGroup variant="flush">
                            {myReportContacts.map(contact => (
                                <ListGroup.Item key={contact.id} className="p-4">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="bg-light rounded-circle p-2">
                                            <FaUser size={20} className="text-secondary" />
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="fw-700 mb-1">{contact.contactUserName}</h6>
                                                <small className="text-muted">{new Date(contact.createdAt).toLocaleDateString()}</small>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-3 mb-3 border">
                                                <p className="mb-0 text-dark">{contact.message}</p>
                                            </div>
                                            <div className="d-flex gap-4">
                                                {contact.contactPhone && (
                                                    <div className="d-flex align-items-center gap-2 text-primary">
                                                        <FaPhone /> <strong>{contact.contactPhone}</strong>
                                                    </div>
                                                )}
                                                {contact.contactEmail && (
                                                    <div className="d-flex align-items-center gap-2 text-primary">
                                                        <FaEnvelope /> <a href={`mailto:${contact.contactEmail}`}>{contact.contactEmail}</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-800 d-flex align-items-center gap-2">
                        <FaTrash className="text-danger" /> Delete Report
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 py-4">
                    <p className="mb-3">
                        Are you sure you want to delete the report for <strong>{reportToDelete?.petName}</strong>?
                    </p>
                    <Alert variant="warning" className="mb-0 border-0 rounded-3">
                        <div className="d-flex align-items-start gap-2">
                            <div className="fs-5">⚠️</div>
                            <div className="small">
                                This action cannot be undone. All contact information and messages related to this report will be permanently deleted.
                            </div>
                        </div>
                    </Alert>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setDeleteModalShow(false)} disabled={deleting}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                        className="d-flex align-items-center gap-2"
                    >
                        {deleting ? (
                            <>
                                <Spinner size="sm" animation="border" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <FaTrash /> Delete Report
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                .hover-lift {
                    transition: all 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                }
                .fw-800 { font-weight: 800; }
                .fw-700 { font-weight: 700; }
                .fw-600 { font-weight: 600; }
                .text-slate-400 { color: #94a3b8; }
                .text-slate-500 { color: #64748b; }
                .text-slate-600 { color: #475569; }
                .bg-slate-50 { background-color: #f8fafc; }
                .uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
            `}</style>
        </Container>
    );
};

export default LostFoundPage;
