import React, { useState } from "react";
import ReactDOM from "react-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Records from "./pages/Records";
import Billing from "./pages/Billing";
import BedStatus from "./pages/BedStatus";
import Notifications from "./pages/Notifications";
import Chatbot from "./pages/Chatbot";

function App() {
  const [page, setPage] = useState('login');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  const handleLogin = (userRole) => {
    setRole(userRole);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole('');
    setPage('login');
  };

  const renderPage = () => {
    if (!role) {
      if (page === 'login') {
        return <Login onLogin={handleLogin} />;
      } else if (page === 'signup') {
        return <Signup onSignup={handleLogin} />;
      }
    } else {
      switch(page) {
        case 'dashboard': return <Dashboard />;
        case 'appointments': return <Appointments />;
        case 'records': return <Records />;
        case 'billing': return <Billing />;
        case 'bed-status': return <BedStatus />;
        case 'notifications': return <Notifications />;
        case 'chatbot': return <Chatbot />;
        default: return <Dashboard />;
      }
    }
  };

  return (
    <div>
      <nav style={styles.nav}>
        {!role && <>
          <button onClick={() => setPage('login')} style={styles.navButton}>Login</button>
          <button onClick={() => setPage('signup')} style={styles.navButton}>Sign Up</button>
        </>}
        {role && <>
          <button onClick={() => setPage('dashboard')} style={styles.navButton}>Dashboard</button>
          <button onClick={() => setPage('appointments')} style={styles.navButton}>Appointments</button>
          <button onClick={() => setPage('records')} style={styles.navButton}>Records</button>
          <button onClick={() => setPage('billing')} style={styles.navButton}>Billing</button>
          <button onClick={() => setPage('bed-status')} style={styles.navButton}>Bed Status</button>
          <button onClick={() => setPage('notifications')} style={styles.navButton}>Notifications</button>
          <button onClick={() => setPage('chatbot')} style={styles.navButton}>Chatbot</button>
          <button onClick={handleLogout} style={styles.navButton}>Logout</button>
        </>}
      </nav>
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    padding: 10,
    backgroundColor: '#222',
    color: 'white',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  navButton: {
    color: 'white',
    background: 'none',
    border: 'none',
    margin: '0 10px',
    padding: 10,
    cursor: 'pointer',
    fontSize: 16,
  }
};

ReactDOM.render(<App />, document.getElementById("root"));
