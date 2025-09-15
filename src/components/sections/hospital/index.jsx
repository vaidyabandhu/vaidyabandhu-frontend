import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Alert,
  Button,
  Badge,
} from "react-bootstrap";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Home,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/usefetch";
import style from "../../../assets/css/hospital.module.css";
import hospitalImage from "../../../assets/img/hospital-dummay.jpeg";
const HospitalsPage = () => {
  const navigate = useNavigate(); // Navigation for detail page
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pageNo, setPageNo] = useState(1);
  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust delay (500ms) as needed
    return () => clearTimeout(timeoutId); // Cleanup on each keystroke
  }, [searchTerm]);
  const { data, loading, error } = useFetch({
    method: "GET",
    request: "/hospital/",
    params: {
      search: debouncedSearchTerm.trim() ?? "",
      page_count: 5,
      page: pageNo,
    },
  });
  // Handle page change
  const handlePageChange = (newPageNo) => {
    setPageNo(newPageNo);
  };
  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageNo(1); // Reset to the first page on search term change
  };
  // Handle card click to navigate to hospital details
  const handleCardClick = (hospitalId) => {
    navigate(`/doctor-list?id=${hospitalId}`); // Navigate to detail page
  };
  const ServiceBadge = ({
    icon: Icon,
    label,
    available,
    variant = "secondary",
  }) => (
    <Badge
      bg={available ? "success" : "secondary"}
      className="service-badge d-flex align-items-center gap-1 px-2 py-1"
    >
      <Icon size={12} />
      <span className="badge-text">{label}</span>
      {available ? <CheckCircle size={10} /> : <XCircle size={10} />}
    </Badge>
  );
  return (
    <div className={`${style.hospitalPage} container-bg`}>
      {/* Header Section */}
      <div className={style.pageHeader}>
        <Container className="py-4">
          <div className="text-center mb-4">
            <p className="text-muted">
              Discover quality healthcare facilities near you.
            </p>
          </div>
          {/* Search Bar */}
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <div className={`position-relative ${style.searchWrap}`}>
                <Search className={style.searchIcon} size={20} />
                <Form.Control
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search hospitals by name..."
                  className={style.searchInput}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="py-4">
        {/* ...loading/error unchanged... */}
        {!loading && !error && data?.data && (
          <Row>
            {data.data.map((hospital, index) => (
              <React.Fragment key={hospital.id}>
                <Col lg={4} md={6} className="mb-4">
                  <Card
                    className={`${style.hospitalCard} h-100`}
                    onClick={() => handleCardClick(hospital.id)}
                  >
                    {/* Hospital Header */}
                    <div
                      className={style.cardHeaderCustom}
                      style={{
                        backgroundImage: `url(${
                          hospital?.cover_image ||
                          hospitalImage ||
                          DUMMY_HOSPITAL_ANIM
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                    <Card.Body className="p-3">
                      {/* Contact Actions */}
                      <div className={style.headerContent}>
                        <h5 className="mb-1 fw-bold">{hospital.name}</h5>
                        {hospital.address && (
                          <div className="d-flex align-items-center mb-2">
                            <MapPin size={16} className="me-2" />
                            <small>{hospital.address}</small>
                          </div>
                        )}
                      </div>
                      <div className={`${style.contactActions} mb-3`}>
                        {hospital?.mobile && (
                          <button
                            className={`${style.contactBtn} ${style.callBtn}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${hospital.mobile}`;
                            }}
                          >
                            <Phone size={14} />
                            <span>Call Now</span>
                          </button>
                        )}
                        {hospital?.email && (
                          <button
                            className={`${style.contactBtn} ${style.emailBtn}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${hospital.email}`;
                            }}
                          >
                            <Mail size={14} />
                            <span>Email Us</span>
                          </button>
                        )}
                      </div>
                      {/* 6th card */}
                      <div className="border-top pt-3 mb-3">
                        <Row className="g-0">
                          <Col>
                            {/* <div className="d-flex align-items-center">
                              <Clock size={14} className="text-muted me-1" />
                              <small className="text-muted">
                                Slot: {hospital.slot_blocking_duration || 0} min
                              </small>
                            </div> */}
                          </Col>
                          {hospital.allow_refund_on_cancellation && (
                            <Col xs="auto">
                              <div 
                                className="d-flex align-items-center" 
                                style={{ paddingRight: '130px' }}
                              >
                                <CheckCircle
                                  size={14}
                                  className="text-success me-1"
                                />
                                <small className="text-success fw-medium">
                                  Verified
                                </small>
                              </div>
                            </Col>
                          )}
                        </Row>
                      </div>
                      <Button className="w-100" size="sm">
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                
                {/* Add an additional card beside the 5th card */}
                {index === 4 && (
                  <Col lg={4} md={6} className="mb-4">
                    <Card className={`${style.hospitalCard} h-100`}>
                      {/* Hospital Header */}
                      <div
                        className={style.cardHeaderCustom}
                        style={{
                          backgroundImage: `url(${DUMMY_HOSPITAL_ANIM})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <Card.Body className="p-3">
                        {/* Contact Actions */}
                        {/* <div className={style.headerContent}>
                          <h5 className="mb-1 fw-bold">6th card hospital name</h5>
                          
                        </div> */}
                        <div className={`${style.contactActions} mb-3`}>
                          <button
                            className={`${style.contactBtn} ${style.callBtn}`}
                          >
                            <Phone size={14} />
                            <span>Call Now</span>
                          </button>
                          <button
                            className={`${style.contactBtn} ${style.emailBtn}`}
                          >
                            <Mail size={14} />
                            <span>Email Us</span>
                          </button>
                        </div>
                        {/* Additional Info */}
                        <div className="border-top pt-3 mb-3"
                        style={{ paddingLeft: '120px' }  }
                        >
                          <Row className="g-0">
                            <Col>
                              <div className="d-flex align-items-center">
                                <CheckCircle
                                  size={14}
                                  className="text-success me-1"
                                />
                                <small className="text-success fw-medium">
                                  Verified
                                </small>
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <Button className="w-100" size="sm">
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </React.Fragment>
            ))}
          </Row>
        )}
        {/* ...rest unchanged... */}
      </Container>
    </div>
  );
};
export default HospitalsPage;
const DUMMY_HOSPITAL_ANIM = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='300' viewBox='0 0 800 300'>
  <defs>
    <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#74c0fc'/>
      <stop offset='100%' stop-color='#a5d8ff'/>
    </linearGradient>
    <linearGradient id='ground' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#e6f4f1'/>
      <stop offset='100%' stop-color='#d0ebe7'/>
    </linearGradient>
    <linearGradient id='building' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='#ffffff'/>
      <stop offset='100%' stop-color='#edf2f7'/>
    </linearGradient>
    <style>
      @keyframes cloudMove { from { transform: translateX(-120px); } to { transform: translateX(920px); } }
      @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
      .cloud { animation: cloudMove 18s linear infinite; opacity: .9; }
      .cloud.slow { animation-duration: 28s; opacity: .75; }
      .cross { transform-origin: 400px 120px; animation: pulse 2.2s ease-in-out infinite; }
    </style>
  </defs>
  <!-- Sky -->
  <rect width='800' height='220' fill='url(#sky)'/>
  <!-- Ground -->
  <rect y='220' width='800' height='80' fill='url(#ground)'/>
  <!-- Clouds -->
  <g class='cloud' transform='translate(-120,30)'>
    <ellipse cx='50' cy='20' rx='40' ry='20' fill='white'/>
    <ellipse cx='85' cy='25' rx='35' ry='18' fill='white'/>
    <ellipse cx='20' cy='28' rx='28' ry='14' fill='white'/>
  </g>
  <g class='cloud slow' transform='translate(-200,70)'>
    <ellipse cx='60' cy='18' rx='42' ry='18' fill='white'/>
    <ellipse cx='95' cy='24' rx='34' ry='16' fill='white'/>
    <ellipse cx='28' cy='26' rx='26' ry='12' fill='white'/>
  </g>
  <!-- Hospital building -->
  <g transform='translate(240,80)'>
    <!-- Main block -->
    <rect x='0' y='0' width='320' height='140' rx='8' fill='url(#building)' stroke='#dbe4ef'/>
    <!-- Entrance -->
    <rect x='140' y='90' width='40' height='50' rx='3' fill='#c7d2fe' stroke='#b4c0ea'/>
    <!-- Left wing -->
    <rect x='-40' y='20' width='40' height='100' rx='6' fill='url(#building)' stroke='#dbe4ef'/>
    <!-- Right wing -->
    <rect x='320' y='20' width='40' height='100' rx='6' fill='url(#building)' stroke='#dbe4ef'/>
    <!-- Windows grid (blink animation per row) -->
    <g>
      <!-- row 1 -->
      <rect x='24' y='24' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.5;1' dur='3s' begin='0s' repeatCount='indefinite'/>
      </rect>
      <rect x='64' y='24' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.5;1' dur='3s' begin='.2s' repeatCount='indefinite'/>
      </rect>
      <rect x='104' y='24' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.5;1' dur='3s' begin='.4s' repeatCount='indefinite'/>
      </rect>
      <rect x='184' y='24' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.5;1' dur='3s' begin='.6s' repeatCount='indefinite'/>
      </rect>
      <rect x='224' y='24' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.5;1' dur='3s' begin='.8s' repeatCount='indefinite'/>
      </rect>
      <rect x='264' y='24' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.5;1' dur='3s' begin='1s' repeatCount='indefinite'/>
      </rect>
      <!-- row 2 -->
      <rect x='24' y='50' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.6;1' dur='3.2s' begin='.3s' repeatCount='indefinite'/>
      </rect>
      <rect x='64' y='50' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.6;1' dur='3.2s' begin='.5s' repeatCount='indefinite'/>
      </rect>
      <rect x='104' y='50' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.6;1' dur='3.2s' begin='.7s' repeatCount='indefinite'/>
      </rect>
      <rect x='184' y='50' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.6;1' dur='3.2s' begin='.9s' repeatCount='indefinite'/>
      </rect>
      <rect x='224' y='50' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.6;1' dur='3.2s' begin='1.1s' repeatCount='indefinite'/>
      </rect>
      <rect x='264' y='50' width='28' height='18' rx='2' fill='#a5d8ff'>
        <animate attributeName='opacity' values='1;0.6;1' dur='3.2s' begin='1.3s' repeatCount='indefinite'/>
      </rect>
    </g>
    <!-- Red medical cross -->
    <g class='cross'>
      <rect x='184' y='-16' width='32' height='58' rx='4' fill='#f03e3e'/>
      <rect x='171' y='-3' width='58' height='32' rx='4' fill='#f03e3e'/>
      <circle cx='200' cy='13' r='3' fill='rgba(255,255,255,.9)'/>
    </g>
  </g>
</svg>
`)}`;