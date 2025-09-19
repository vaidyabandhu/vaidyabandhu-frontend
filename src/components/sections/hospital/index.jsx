import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/usefetch";
import style from "../../../assets/css/hospital.module.css";
import hospitalImage from "../../../assets/img/hospital-dummay.jpeg";

const HospitalsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pageNo, setPageNo] = useState(1);
  const itemPerpage = 6;

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch hospitals
  const { data, loading, error } = useFetch({
    method: "GET",
    request: "/hospital/",
    params: {
      search: debouncedSearchTerm.trim() ?? "",
      page_count: itemPerpage,
      page: pageNo,
    },
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageNo(1);
  };

  const handleCardClick = (hospitalId) => {
    navigate(`/doctor-list?id=${hospitalId}`);
  };

  const ServiceBadge = ({ icon: Icon, label, available }) => (
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

      {/* Hospital List Section */}
      <Container className="py-4">
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        )}
        {error && (
          <Alert variant="danger" className="text-center">
            Failed to load hospitals. Please try again later.
          </Alert>
        )}

        {!loading && !error && data?.data && (
          <Row>
            {data.data.map((hospital, index) => (
              <Col lg={4} md={6} className="mb-4" key={hospital.id}>
                <Card
                  className={`${style.hospitalCard} h-100`}
                  onClick={() => handleCardClick(hospital.id)}
                >
                  {/* Card Header with Image */}
                  <div
                    className={style.cardHeaderCustom}
                    style={{
                      backgroundImage: `url(${
                        hospital?.cover_image || hospitalImage
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>

                  <Card.Body className="p-3">
                    {/* Hospital Info */}
                    <div className={style.headerContent}>
                      <h5 className="mb-1 fw-bold">{hospital.name}</h5>
                      {hospital.address && (
                        <div className="d-flex align-items-center mb-2">
                          <MapPin size={16} className="me-2" />
                          <small>{hospital.address}</small>
                        </div>
                      )}
                    </div>

                    {/* Contact Buttons */}
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
                          {/* <span>Email Us</span> */}
                        </button>
                      )}
                    </div>

                    {/* Verification Badge */}
                    {hospital.allow_refund_on_cancellation && (
                      <div className="border-top pt-3 mb-3">
                        <div className="d-flex align-items-center">
                          <CheckCircle
                            size={14}
                            className="text-success me-1"
                          />
                          <small className="text-success fw-medium">
                            Verified
                          </small>
                        </div>
                      </div>
                    )}

                    <Button className="w-100" size="sm">
                      View Doctors
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        {!loading && !error && data?.pagination_data && (
          (() => {
            const totalCount = data.pagination_data.total_count || 0;
            const totalPages = Math.ceil(totalCount / itemPerpage);
            return (
              totalPages > 1 && (
                <div style={{ textAlign: "center", margin: "60px 0" }}>
                  <button
                    disabled={pageNo === 1}
                    onClick={() => setPageNo((p) => p - 1)}
                  >
                    Prev
                  </button>
                  <span style={{ margin: "0 12px" }}>
                    Page {pageNo} of {totalPages}
                  </span>
                  <button
                    disabled={pageNo === totalPages}
                    onClick={() => setPageNo((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              )
            );
          })()
        )}
      </Container>
    </div>
  );
};

export default HospitalsPage;