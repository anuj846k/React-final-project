import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Question from './components/Question';
import Results from './components/Result';
import UserForm from './components/UserForm';
import { UserProvider } from './components/UserContext';
import axios from 'axios';

const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  {
    question: "What's your favorite hobby?",
    options: ["Reading 📚", "Sports 🏀", "Music 🎵", "Traveling ✈️"],
  },
  {
    question: "What's your favorite season?",
    options: ["Spring 🌸", "Summer ☀️", "Autumn 🍂", "Winter ❄️"],
  },
  {
    question: "What's your favorite animal?",
    options: ["Dog 🐶", "Cat 🐱", "Bird 🐦", "Fish 🐠"],
  },
];

const keywords = {
  Fire: "fire",
  Water: "water",
  Earth: "earth",
  Air: "air",
  Knowledge: "knowledge",
  Energy: "energy",
  Harmony: "harmony",
  Adventure: "adventure",
  Rebirth: "rebirth",
  Warmth: "warmth",
  Change: "change",
  Serenity: "serenity",
  Loyalty: "loyalty",
  Independence: "independence",
  Freedom: "freedom",
  Tranquility: "tranquility",
};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  "Reading 📚": "Knowledge",
  "Sports 🏀": "Energy",
  "Music 🎵": "Harmony",
  "Traveling ✈️": "Adventure",
  "Spring 🌸": "Rebirth",
  "Summer ☀️": "Warmth",
  "Autumn 🍂": "Change",
  "Winter ❄️": "Serenity",
  "Dog 🐶": "Loyalty",
  "Cat 🐱": "Independence",
  "Bird 🐦": "Freedom",
  "Fish 🐠": "Tranquility",
};

const App = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState('');
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState(null);

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleUserFormSubmit = (name) => {
    setUserName(name);
  };
  function determineElement(answers) {
    const counts = {};
    answers.forEach(function(answer) {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce(function(a, b) {
      return counts[a] > counts[b] ? a : b
    });
  }

  const fetchArtwork = async (keyword) => {
    try {
      const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`);
      const objectID = response.data.objectIDs[1];
      const artworkResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
      console.log(artworkResponse.data)
      setArtwork(artworkResponse.data); 
      console.log('Artwork:', artworkResponse.data);  
    } catch (error) {
      console.error('Error fetching artwork:', error);
    }
  };

  
  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex, answers]);

  const resetState = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setUserName('');
    setElement('');
    setArtwork(null);
  };

  return (
    <UserProvider value={{ name: userName, setName: setUserName }}>
      <Router>
        <Header resetState={resetState}/>
        <Routes>
          <Route path="/" element={<UserForm onSubmit={handleUserFormSubmit} />} />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question question={questions[currentQuestionIndex].question} options={questions[currentQuestionIndex].options} onAnswer={handleAnswer} />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;