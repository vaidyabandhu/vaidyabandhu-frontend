import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PatientsDetails = () => {
  const { id } = useParams(); // Get patient ID from URL
  const [patientData, setPatientData] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patient data and appointment history
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch patient list to get the specific patient's membership information
        const listResponse = await fetch('https://admin.vaidyabandhu.com/api/appointment/patient_list/', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!listResponse.ok) {
          throw new Error(`HTTP error! Status: ${listResponse.status}`);
        }

        const listData = await listResponse.json();

        // Extract the array of patients from the response
        let patientsArray = [];
        if (listData && Array.isArray(listData.slots)) {
          patientsArray = listData.slots;
        } else if (Array.isArray(listData)) {
          patientsArray = listData;
        } else if (listData && Array.isArray(listData.results)) {
          patientsArray = listData.results;
        } else if (listData && Array.isArray(listData.data)) {
          patientsArray = listData.data;
        }

        // Find the patient with the matching ID
        const patient = patientsArray.find(p =>
          (p.id && p.id.toString() === id) ||
          (p.membership_id && p.membership_id.toString() === id)
        );

        if (!patient) {
          throw new Error('Patient not found');
        }

        setPatientData(patient);

        const appointmentsResponse = await fetch(`https://admin.vaidyabandhu.com/api/appointment/appointment_history/?user=${id}`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!appointmentsResponse.ok) {
          throw new Error(`HTTP error! Status: ${appointmentsResponse.status}`);
        }

        const appointments = await appointmentsResponse.json();
        console.log("Appointments for frontdesk", appointments)
        setAppointmentHistory(appointments?.slots);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patient details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  // Function to get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'Confirmed':
        return { backgroundColor: '#cce5ff', color: '#004085' };
      case 'Pending':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      case 'Rejected':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return {};
    }
  };

  // Style objects
  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    color: '#333'
  };

  const titleStyle = {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '30px',
    paddingBottom: '10px',
    borderBottom: '2px solid #3498db'
  };

  const sectionTitleStyle = {
    fontSize: '22px',
    color: '#2c3e50',
    marginBottom: '20px'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '30px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee'
  };

  const patientIdStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#7f8c8d'
  };

  const membershipTypeStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  };

  const activeStyle = {
    backgroundColor: '#28a745',
    color: '#fff'
  };

  const detailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const rowStyle = {
    display: 'flex',
    gap: '20px'
  };

  const groupStyle = {
    flex: '1'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    color: '#7f8c8d',
    marginBottom: '5px'
  };

  const valueStyle = {
    fontSize: '16px',
    color: '#2c3e50'
  };

  const tableContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '0px'
  };

  const thStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    fontWeight: '600',
    textAlign: 'left',
    padding: '15px'
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #eee'
  };

  const statusBadgeStyle = {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500'
  };

  // Render loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Patient Details</h1>
        <div>Loading patient data...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>Patient Details</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  // Render patient data
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Patient Details</h1>

      {/* Membership Information Section */}
      <div>
        <h2 style={sectionTitleStyle}>Membership Information</h2>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={patientIdStyle}>Membership ID: {patientData?.membership_id || 'N/A'}</div>
            <div style={{ ...membershipTypeStyle, ...(patientData?.is_active ? activeStyle : {}) }}>
              {patientData?.is_active ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div style={detailsStyle}>
            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Name</label>
                <div style={valueStyle}>{patientData?.full_name || 'N/A'}</div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Mobile No.</label>
                <div style={valueStyle}>{patientData?.mobile || 'N/A'}</div>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Email ID</label>
                <div style={valueStyle}>{patientData?.email || 'N/A'}</div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Gender</label>
                <div style={valueStyle}>{patientData?.gender || 'N/A'}</div>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Age</label>
                <div style={valueStyle}>{patientData?.age || 'N/A'}</div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Blood Group</label>
                <div style={valueStyle}>{patientData?.blood_group || 'N/A'}</div>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Address</label>
                <div style={valueStyle}>{patientData?.address || 'N/A'}</div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Pin Code</label>
                <div style={valueStyle}>{patientData?.pin_code || 'N/A'}</div>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Membership Start Date</label>
                <div style={valueStyle}>
                  {patientData?.start_date ? new Date(patientData.start_date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Membership End Date</label>
                <div style={valueStyle}>
                  {patientData?.end_date ? new Date(patientData.end_date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment History Section */}
      <div>
        <h2 style={sectionTitleStyle}>Appointment History</h2>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Doctor's Name</th>
                <th style={thStyle}>Hospital Name</th>
                <th style={thStyle}>Appointment Status</th>
              </tr>
            </thead>
            <tbody>
              {appointmentHistory.length > 0 ? (
                appointmentHistory.map((appointment) => (
                  <tr key={appointment.id}>
                    <td style={tdStyle}>
                      {appointment.time ? (
                        (() => {
                          const [startStr, endStr] = appointment.time.split(" - ");
                          const startDate = new Date(startStr);
                          const endDate = new Date(endStr);
                          const startTime = startDate.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true, // Enables 12-hour format with AM/PM
                          });
                          const endTime = endDate.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          });
                          return `${startTime} - ${endTime}`;
                        })()
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td style={tdStyle}>{appointment.doctor_name || 'N/A'}</td>
                    <td style={tdStyle}>{appointment.hospital_name || 'N/A'}</td>
                    <td style={tdStyle}>
                      <span style={{ ...statusBadgeStyle, ...getStatusStyle(appointment.status) }}>
                        {appointment.status || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    No appointment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsDetails;