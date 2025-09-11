import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Container, Button } from 'react-bootstrap';
import { CheckCircle, User, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

const AllDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  
  if (!formData) {
    return (
      <Container className="py-5 text-center">
        <h2>No data available</h2>
        <p>Please go back and fill the form first.</p>
        <Button variant="primary" onClick={() => navigate('/basic-details')}>
          Go Back to Form
        </Button>
      </Container>
    );
  }
  return (
    <Container className="py-5">
      <Card className="shadow-lg mb-5">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4">
            <CheckCircle className="text-success me-2" size={28} />
            <h2 className="mb-0" style={{ fontFamily: 'Poppins' }}>Personal Information</h2>
          </div>
          
          <Row className="mb-4">
            <Col md={6}>
              <div className="d-flex align-items-start mb-3">
                <User className="text-primary me-3 mt-1" size={20} />
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Full Name</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.full_name || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 mt-1" style={{ width: 20, height: 20 }}>
                  <span className="small fw-bold">{formData.age || '-'}</span>
                </div>
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Age</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.age ? `${formData.age} years` : 'Not provided'}</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 mt-1" style={{ width: 20, height: 20 }}>
                  <span className="small">{formData.gender?.charAt(0) || '-'}</span>
                </div>
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Gender</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.gender || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center me-3 mt-1" style={{ width: 20, height: 20 }}>
                  <span className="small text-white">{formData.blood_group?.charAt(0) || '-'}</span>
                </div>
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Blood Group</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.blood_group || 'Not specified'}</p>
                </div>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="d-flex align-items-start mb-3">
                <MapPin className="text-danger me-3 mt-1" size={20} />
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Address</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.address || 'Not provided'}</p>
                  {formData.pin_code && (
                    <p className="mb-0" style={{ fontFamily: 'Poppins' }}>Pin: {formData.pin_code}</p>
                  )}
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <Phone className="text-success me-3 mt-1" size={20} />
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Contact</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.mobile_number || 'Not provided'}</p>
                  {formData.alternate_mobile && (
                    <p className="mb-0" style={{ fontFamily: 'Poppins' }}>Alt: {formData.alternate_mobile}</p>
                  )}
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <Mail className="text-info me-3 mt-1" size={20} />
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>Email</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>{formData.email || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <CreditCard className="text-warning me-3 mt-1" size={20} />
                <div>
                  <h5 className="text-muted" style={{ fontFamily: 'Poppins' }}>ID Details</h5>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>
                    Aadhaar: {formData.aadhaar_number ? 'XXXX XXXX ' + formData.aadhaar_number.slice(-4) : 'Not provided'}
                  </p>
                  <p className="mb-0" style={{ fontFamily: 'Poppins' }}>
                    PAN: {formData.pan_number || 'Not provided'}
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="shadow-lg">
        <Card.Body className="p-4">
          <h2 className="mb-4" style={{ fontFamily: 'Poppins' }}>Membership Card</h2>
          
          <Row className="align-items-center">
            <Col md={6} className="text-center mb-4 mb-md-0">
              <div className="bg-light p-4 rounded-lg">
                <h3 className="mb-3" style={{ fontFamily: 'Poppins' }}>Digital Card</h3>
                <div className="bg-white p-3 rounded shadow-sm d-inline-block">
                  <img 
                    src="/img1.png" 
                    alt="Digital Membership Card" 
                    className="img-fluid"
                    style={{ maxWidth: '100%', height: 'auto' }}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/300x200?text=Digital+Card";
                    }}
                  />
                </div>
                <p className="mt-3 text-muted" style={{ fontFamily: 'Poppins' }}>
                  Your digital membership card is ready to use
                </p>
              </div>
            </Col>
            
            <Col md={6} className="text-center">
              <div className="bg-light p-4 rounded-lg">
                <h3 className="mb-3" style={{ fontFamily: 'Poppins' }}>Physical Card</h3>
                <div className="bg-white p-3 rounded shadow-sm d-inline-block">
                  <img 
                    src="/img2.png" 
                    alt="Physical Membership Card" 
                    className="img-fluid"
                    style={{ maxWidth: '100%', height: 'auto' }}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/300x200?text=Physical+Card";
                    }}
                  />
                </div>
                <p className="mt-3 text-muted" style={{ fontFamily: 'Poppins' }}>
                  Your physical card will be delivered to your address
                </p>
              </div>
            </Col>
          </Row>
          
          <div className="mt-4 text-center">
            <Button 
              variant="primary" 
              size="lg" 
              className="px-5 py-3"
              style={{ fontFamily: 'Poppins' }}
            >
              Download Membership Card
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AllDetails;