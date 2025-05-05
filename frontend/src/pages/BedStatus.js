import React, { useEffect, useState } from 'react';

export default function BedStatus() {
  const [beds, setBeds] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBeds = async () => {
      if(!token) return;
      const res = await fetch('http://localhost:5000/bed-status', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if(res.ok){
        setBeds(data);
      }
    };
    fetchBeds();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2>Real-time Bed Availability</h2>
      {beds.length === 0 ? (
        <p>No bed availability data</p>
      ) : (
        beds.map(b => (
          <div key={b.id} style={styles.bed}>
            <p><strong>Ward:</strong> {b.ward_name}</p>
            <p><strong>Total Beds:</strong> {b.total_beds}</p>
            <p><strong>Occupied Beds:</strong> {b.occupied_beds}</p>
            <p><em>Last Updated: {new Date(b.last_updated).toLocaleString()}</em></p>
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
  bed: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    background: '#f9f9f9'
  }
};
