import React from 'react';

const PatientsDetails = () => {
  // Sample membership data with only required fields
  const membershipData = {
    membershipId: 'PT-2023-001',
    name: 'patient1',
    mobileNo: '1234568790',
    emailId: 'abc@example.com',
    gender: 'Male',
    membershipStatus: 'Active'
  };

  // Sample appointment history data
  const appointmentHistory = [
    {
      id: 'APT-001',
      time: '2023-11-15 10:30 AM',
      doctorName: 'Dr. one',
      hospitalName: 'City General Hospital',
      status: 'Completed'
    },
    {
      id: 'APT-002',
      time: '2023-12-01 2:15 PM',
      doctorName: 'Dr. two',
      hospitalName: 'Metro Medical Center',
      status: 'Confirmed'
    },
    {
      id: 'APT-003',
      time: '2023-12-20 9:00 AM',
      doctorName: 'Dr. three',
      hospitalName: 'City General Hospital',
      status: 'Pending'
    },
    {
      id: 'APT-004',
      time: '2023-10-05 3:45 PM',
      doctorName: 'Dr. four',
      hospitalName: 'Westside Clinic',
      status: 'Rejected'
    }
  ];

  // Function to get status style
  const getStatusStyle = (status) => {
    switch(status) {
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

  // Main container style
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
    borderCollapse: 'collapse'
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

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Patient Details</h1>
      
      {/* Membership Information Section */}
      <div>
        <h2 style={sectionTitleStyle}>Membership Information</h2>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={patientIdStyle}>Membership ID: {membershipData.membershipId}</div>
            <div style={{...membershipTypeStyle, ...activeStyle}}>
              {membershipData.membershipStatus}
            </div>
          </div>
          
          <div style={detailsStyle}>
            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Name</label>
                <div style={valueStyle}>{membershipData.name}</div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Mobile No.</label>
                <div style={valueStyle}>{membershipData.mobileNo}</div>
              </div>
            </div>
            
            <div style={rowStyle}>
              <div style={groupStyle}>
                <label style={labelStyle}>Email ID</label>
                <div style={valueStyle}>{membershipData.emailId}</div>
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Gender</label>
                <div style={valueStyle}>{membershipData.gender}</div>
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
              {appointmentHistory.map((appointment) => (
                <tr key={appointment.id}>
                  <td style={tdStyle}>{appointment.time}</td>
                  <td style={tdStyle}>{appointment.doctorName}</td>
                  <td style={tdStyle}>{appointment.hospitalName}</td>
                  <td style={tdStyle}>
                    <span style={{...statusBadgeStyle, ...getStatusStyle(appointment.status)}}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsDetails;