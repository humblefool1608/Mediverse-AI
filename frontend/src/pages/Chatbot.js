import React, { useState } from 'react';

export default function Chatbot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const token = localStorage.getItem('token');

  const askQuestion = async e => {
    e.preventDefault();
    setAnswer('Loading...');
    try {
      const res = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if(res.ok){
        setAnswer(data.answer);
      } else {
        setAnswer('Error in chatbot response');
      }
    } catch {
      setAnswer('Network error');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Chatbot Assistance</h2>
      <form onSubmit={askQuestion} style={styles.form}>
        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask a question..." style={styles.input} required />
        <button type="submit" style={styles.button}>Ask</button>
      </form>
      {answer && <p><strong>Answer:</strong> {answer}</p>}
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
  form: {
    display: 'flex',
    marginBottom: 10
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    borderRadius: 4,
    border: '1px solid #ccc'
  },
  button: {
    padding: 10,
    backgroundColor: '#17a2b8',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }
};
