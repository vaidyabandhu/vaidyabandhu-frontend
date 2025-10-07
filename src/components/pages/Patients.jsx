import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const navigate = useNavigate();
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch patient data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch('https://admin.vaidyabandhu.com/api/appointment/patient_list/', {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Log the response for debugging
        
        // Handle the specific API response structure with "slots" array
        if (data && Array.isArray(data.slots)) {
          setPatientsData(data.slots);
        } else if (Array.isArray(data)) {
          setPatientsData(data);
        } else if (data && Array.isArray(data.results)) {
          setPatientsData(data.results);
        } else if (data && Array.isArray(data.data)) {
          setPatientsData(data.data);
        } else if (data && typeof data === 'object') {
          // Handle single patient object
          setPatientsData([data]);
        } else {
          console.warn('Unexpected API response format:', data);
          setPatientsData([]); // Default to empty array if format is unexpected
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle view details button click
  const handleViewDetails = (patientId) => {
    console.log("View Details clicked for patient:", patientId);
    navigate(`/patient-details/${patientId}`);
  };

  // Style objects
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const thStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333'
  };

  const tdStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd'
  };

  const trStyle = {
    backgroundColor: '#fff',
    transition: 'background-color 0.2s'
  };

  const trHoverStyle = {
    backgroundColor: '#f9f9f9'
  };

  const buttonStyle = {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  };

  const buttonHoverStyle = {
    backgroundColor: '#0b7dda'
  };

  const getStatusStyle = (isActive) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      display: 'inline-block'
    };
    
    if (isActive) {
      return {
        ...baseStyle,
        backgroundColor: '#e6f7e6',
        color: '#2e7d32'
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#ffebee',
        color: '#c62828'
      };
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <h2>Patient List</h2>
        <div>Loading patient data...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={containerStyle}>
        <h2>Patient List</h2>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  // Ensure patientsData is always an array before rendering
  const patientArray = Array.isArray(patientsData) ? patientsData : [];

  return (
    <div style={containerStyle}>
      <h2>Patient List</h2>
      {patientArray.length === 0 ? (
        <div>No patients found</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Membership ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Mobile No.</th>
              <th style={thStyle}>Email ID</th>
              <th style={thStyle}>Gender</th>
              <th style={thStyle}>Membership Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientArray.map((patient) => (
              <tr 
                key={patient.id || patient.membership_id || Math.random()} 
                style={trStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = trHoverStyle.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = trStyle.backgroundColor}
              >
                <td style={tdStyle}>{patient.membership_id || patient.id || 'N/A'}</td>
                <td style={tdStyle}>{patient.full_name || patient.name || 'N/A'}</td>
                <td style={tdStyle}>{patient.mobile || patient.phone || 'N/A'}</td>
                <td style={tdStyle}>{patient.email || 'N/A'}</td>
                <td style={tdStyle}>{patient.gender || 'N/A'}</td>
                <td style={tdStyle}>
                  <span style={getStatusStyle(patient.is_active)}>
                    {patient.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button 
                    style={buttonStyle}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => handleViewDetails(patient.id || patient.membership_id || '')}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Patients;