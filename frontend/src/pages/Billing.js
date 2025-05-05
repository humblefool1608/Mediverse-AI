import React, { useEffect, useState } from 'react';

export default function Billing() {
  const [billingItems, setBillingItems] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBilling = async () => {
      if(!token) return;
      const res = await fetch('http://localhost:5000/billing', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if(res.ok){
        setBillingItems(data);
      }
    };
    fetchBilling();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2>Billing</h2>
      {billingItems.length === 0 ? (
        <p>No billing information</p>
      ) : (
        billingItems.map(b => (
          <div key={b.id} style={styles.bill}>
            <p><strong>Appointment ID:</strong> {b.appointment_id}</p>
            <p><strong>Amount:</strong> ${b.amount.toFixed(2)}</p>
            <p><strong>Discount Applied:</strong> {b.discount_applied ? 'Yes' : 'No'}</p>
            <p><strong>Insurance Scheme:</strong> {b.insurance_scheme || 'N/A'}</p>
            <p><strong>Paid:</strong> {b.paid ? 'Yes' : 'No'}</p>
            {b.qr_code_url && (
              <img src={b.qr_code_url} alt="QR Code" style={{width:100, height:100}} />
            )}
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
  bill: {
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    background: '#f9f9f9'
  }
};

