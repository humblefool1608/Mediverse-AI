import React, { useEffect, useState } from 'react';

export default function Records() {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecords = async () => {
      if(!token) return;
      const res = await fetch('http://localhost:5000/records', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if(res.ok){
        setRecords(data);
      }
    };
    fetchRecords();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2>Medical Records</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        records.map(r => (
          <div key={r.id} style={styles.record}>
            <p><strong>Diagnosis:</strong> {r.diagnosis}</p>
            <p><strong>Prescriptions:</strong> {r.prescriptions}</p>
            <p><strong>Lab Results:</strong> {r.lab_results}</p>
            <p><em>Created at: {new Date(r.created_at).toLocaleString()}</em></p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '30px auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif'
  },
  record: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    background: '#f9f9f9'
  }
};

