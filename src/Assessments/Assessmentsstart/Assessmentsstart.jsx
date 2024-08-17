
import React, { useState, useEffect } from 'react';
import './assessmentsstart.css';
import logoela from '../asset/brand-footer.png';
import { FaCheckCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Assessmentsstart = () => {
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(23 * 60 + 46); // 23 minutes and 46 seconds
  const [selectedUser, setSelectedUser] = useState('Deivasigamani');
  const [selectedUserDropdown, setSelectedUserDropdown] = useState(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://csuite-production.up.railway.app/api/question/');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].sections) {
          setQuestionData(data);
        } else {
          throw new Error('Invalid data structure');
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookmark = () => {
    setBookmarkedQuestions((prev) =>
      prev.includes(currentQuestionIndex)
        ? prev.filter((index) => index !== currentQuestionIndex)
        : [...prev, currentQuestionIndex]
    );
  };


  const handleNavigation = (direction) => {
    if (!questionData) return;

    const currentSection = questionData[0].sections[currentSectionIndex];
    const currentSectionQuestions = currentSection.questions.slice(0, 20);

    if (direction === 'next' && currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'previous' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [`${currentSectionIndex}-${currentQuestionIndex}`]: event.target.value,
    });
  };
  

  const handleSelectChangeone = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleSelectChange = (event) => {
    const selectedSectionIndex = parseInt(event.target.value) - 1;
    setSelectedUserDropdown(event.target.value);
    setCurrentSectionIndex(selectedSectionIndex);
    setCurrentQuestionIndex(0);
  };

  const calculateScore = (selectedOptions) => {
    console.log("Selected Options:", selectedOptions);
  
    if (!Array.isArray(questionData) || !questionData[0] || !questionData[0].sections) {
      console.error("Question data structure is not as expected:", questionData);
      return 0;
    }
  
    let score = 0;
    const sections = questionData[0].sections; // Access sections within the first element of the array
  
    Object.entries(selectedOptions).forEach(([key, value]) => {
      const [sectionIndex, questionIndex] = key.split('-').map(Number);
      console.log(`Checking Section: ${sectionIndex}, Question: ${questionIndex}`);
  
      const correctAnswer = sections[sectionIndex].questions[questionIndex].answer;
      console.log(`Selected Answer: ${value}, Correct Answer: ${correctAnswer}`);
  
      if (value === correctAnswer) {
        score += 1; // Assuming each correct answer is worth 1 point
      }
    });
  
    console.log("Final Score:", score);
    return score;
  };
  
  

  const handleFinishClick = async () => {
    const score = calculateScore(selectedOptions);
    console.log("Calculated Score:", score);
  
    try {
      const response = await fetch('http://localhost:8000/api/submit-assessment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'USER_ID_HERE',
          userName: selectedUser,
          answeredQuestions: selectedOptions,
          score: score,
        }),
      });
      if (response.ok) {
        // Handle successful response
      } else {
        // Handle error response
        throw new Error('Failed to store assessment data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setTimeout(() => {
      navigate("/finish-assessment");
    }, 2000);
  };
  

 

  const handleNextSection = () => {
    if (currentSectionIndex < questionData[0].sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return (
      <div className="time-row">
        <div className="time-item">
          <p className='para-one'>{hours.toString().padStart(2, '0')}</p>
          <p className='para-two'>Hours</p>
        </div>
        <div className="time-item">
          <p className='para-one'>{minutes.toString().padStart(2, '0')}</p>
          <p className='para-two'>Minutes</p>
        </div>
        <div className="time-item">
          <p className='para-one'>{remainingSeconds.toString().padStart(2, '0')}</p>
          <p className='para-two'>Seconds</p>
        </div>
      </div>
    ); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const sections = questionData[0].sections;
  const currentSection = sections[currentSectionIndex];
  const currentSectionQuestions = currentSection.questions.slice(0, 20);
  const currentQuestion = currentSectionQuestions[currentQuestionIndex];

  const totalQuestions = currentSectionQuestions.length;
  const answeredCount = Object.keys(selectedOptions).length;
  const bookmarkedCount = bookmarkedQuestions.length;
  const notAnsweredCount = totalQuestions - answeredCount;

  const isCurrentSectionCompleted = currentSectionQuestions.every((_, index) =>
    selectedOptions.hasOwnProperty(`${currentSectionIndex}-${index}`)
  );

  return (
    <div className='assessment-head'>
      <div className='assessment-inside'>
        <div className='nav-content'>
          <div className='brand-logo'>
            <img src={logoela} alt="C-Suite Academy" height='40px' />
          </div>
          <select value={selectedUser} onChange={handleSelectChangeone}>
            <option value="Deivasigamani">Deivasigamani</option>
            <option value="OtherUser1">Profile</option>
            <option value="OtherUser2">Log Out</option>
          </select>
          <button className='button-finish' onClick={handleFinishClick}>Finish</button>
          
        </div>

        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-8 col-sm-12'>
              <main className="quiz-main">
                <div className='first-content'>
                  <p className='count-question'>
                    {(currentQuestionIndex + 1).toString().padStart(2, '0')}
                    <span>/</span>
                    {currentSectionQuestions.length}
                  </p>
                  <select className='change-selection' value={selectedUserDropdown} onChange={handleSelectChange}>
                    {sections.map((section, index) => (
                      <option key={index} value={index + 1}>{`Section - ${index + 1}`}</option>
                    ))}
                  </select>
                </div>

                <p className='question-style'>{currentQuestion.question}</p>

                <form>
                  {currentQuestion.options.map((option, index) => (
                    <div className="button-style-icons" key={index}>
                      <label>
                        <input
                          type="radio"
                          value={option}
                          checked={selectedOptions[`${currentSectionIndex}-${currentQuestionIndex}`] === option}
                          onChange={handleOptionChange}
                        />
                        <FaCheckCircle className="icon-style" size='1.8rem' />
                        {` ${String.fromCharCode(65 + index)}. ${option}`}
                      </label>
                    </div>
                  ))}
                </form>

                <div className="navigation-button">
                  <button className='button-previous' onClick={() => handleNavigation('previous')} disabled={currentQuestionIndex === 0}>
                    Previous
                  </button>
                  <button className='button-next' onClick={() => handleNavigation('next')} disabled={currentQuestionIndex === currentSectionQuestions.length - 1}>
                    Next
                  </button>
                  <button className='button-bookmark' onClick={handleBookmark}>Bookmark</button>
                </div>

                {isCurrentSectionCompleted && currentSectionIndex < sections.length - 1 && (
                  <div className="next-section-button">
                    <button className='button-next-section' onClick={handleNextSection}>Next Section</button>
                  </div>
                )}
              </main>
            </div>
            <div className='col-md-4 col-sm-12'>
              <div className='right-side-component'>
                <div className="timer">
                  {formatTime(timeLeft)}
                </div>
                <div className="questions">
                  <p>Questions</p>
                </div>
                <select className='change-selection-two' value={selectedUserDropdown} onChange={handleSelectChange}>
                  {sections.map((section, index) => (
                    <option key={index} value={index + 1}>{`Section ${index + 1}`}</option>
                  ))}
                </select>
                <div id='Test-marks-container'>
                  <div className="question-numbers">
                    {currentSectionQuestions.map((question, quesIndex) => (
                      <button
                        key={quesIndex}
                        className={`question-number ${
                          quesIndex === currentQuestionIndex ? 'active' : ''} 
                          ${selectedOptions[`${currentSectionIndex}-${quesIndex}`] ? 'answered' : ''} 
                          ${!selectedOptions[`${currentSectionIndex}-${quesIndex}`] && bookmarkedQuestions.includes(quesIndex) ? 'bookmarked' : ''}`}
                        onClick={() => setCurrentQuestionIndex(quesIndex)}
                      >
                        {`${(quesIndex + 1).toString().padStart(2, '0')}`} <FontAwesomeIcon icon={faCheckCircle} size='1rem' className='icon-check pl-4' />
                      </button>
                    ))}
                  </div>
                </div>

                <div className='test-checkup-field'>
                  <div id='answered-txt'>Answered<span>{answeredCount}/{totalQuestions}</span></div>
                  <div id='not-answered-txt'>Not Answered<span>{notAnsweredCount}/{totalQuestions}</span></div>
                  <div id='bookmarked-txt'>Bookmarked <span>{bookmarkedCount}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessmentsstart;

