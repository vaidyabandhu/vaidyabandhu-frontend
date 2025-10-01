import React from 'react';
import { useNavigate } from 'react-router-dom';

const Patients = () => {
  const navigate = useNavigate();

  // Sample patient data
  const patientsData = [
    {
      id: 'MB001',
      name: 'patient1',
      mobile: '9876543210',
      email: 'abc@example.com',
      gender: 'Male',
      status: 'Active'
    },
    {
      id: 'MB002',
      name: 'patient2',
      mobile: '8765432109',
      email: 'def@example.com',
      gender: 'Female',
      status: 'Inactive'
    },
    {
      id: 'MB003',
      name: 'patient3',
      mobile: '7654321098',
      email: 'xyz@example.com',
      gender: 'Male',
      status: 'Active'
    }
  ];

  // Handle view details button click
  const handleViewDetails = () => {
    console.log("View Details clicked");
    navigate(`/patient-details`);
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

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      display: 'inline-block'
    };
    
    if (status.toLowerCase() === 'active') {
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

  return (
    <div style={containerStyle}>
      <h2>Patient List</h2>
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
          {patientsData.map((patient) => (
            <tr 
              key={patient.id} 
              style={trStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = trHoverStyle.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = trStyle.backgroundColor}
            >
              <td style={tdStyle}>{patient.id}</td>
              <td style={tdStyle}>{patient.name}</td>
              <td style={tdStyle}>{patient.mobile}</td>
              <td style={tdStyle}>{patient.email}</td>
              <td style={tdStyle}>{patient.gender}</td>
              <td style={tdStyle}>
                <span style={getStatusStyle(patient.status)}>
                  {patient.status}
                </span>
              </td>
              <td style={tdStyle}>
                <button 
                  style={buttonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
                  onClick={handleViewDetails}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;