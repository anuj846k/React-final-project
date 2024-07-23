import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

export default function Header({resetState}) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    resetState();
    navigate('/');
  };

  return (
    <header>
      <h1>Which Element Are You?</h1>
      <nav>
        <Link to="/" onClick={handleHomeClick}>Home</Link>
        <Link to="/quiz">Start Quiz</Link>
      </nav>
    </header>
  );
}