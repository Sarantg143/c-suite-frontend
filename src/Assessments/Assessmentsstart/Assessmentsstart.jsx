import React, { useState, useEffect } from 'react';
import './assessmentsstart.css';
import logoela from '../asset/brand-footer.png';
import { FaCheckCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Assessmentsstart = () => {
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [score, setScore] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [selectedUserDropdown, setSelectedUserDropdown] = useState(1);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
  const [finalScore, setFinalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    axios.get('https://csuite-production.up.railway.app/api/question')
      .then(response => {
        setQuestionData(response.data);
        setTotalQuestions(response.data.sections.reduce((total, section) => total + section.questions.length, 0));
      })
      .catch(error => {
        console.error("There was an error fetching the question data!", error);
      });
  }, []);

  useEffect(() => {
    const storedTimeLeft = localStorage.getItem("TimeLeft");
    if (storedTimeLeft) setTimeLeft(storedTimeLeft);
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      localStorage.setItem("elacomplete", "true");
      testComplete();
    }
  }, [timeLeft]);

  const handleBookmark = () => {
    setBookmarkedQuestions({
      ...bookmarkedQuestions,
      [`${currentSectionIndex}-${currentQuestionIndex}`]: bookmarkedQuestions[`${currentSectionIndex}-${currentQuestionIndex}`] === "true" ? 'false' : 'true',
    });
  };

  const handleNavigation = (direction) => {
    const currentSection = questionData.sections[currentSectionIndex];
    const currentSectionQuestions = currentSection.questions.slice(0, 20);

    if (direction === 'next' && currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'previous' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleOptionChange = (event) => {
    const currentQuestion = questionData.sections[currentSectionIndex].questions[currentQuestionIndex];
    setSelectedOptions({
      ...selectedOptions,
      [`${currentSectionIndex}-${currentQuestionIndex}`]: event.target.value,
    });
    setScore({
      ...score,
      [`${currentSectionIndex}-${currentQuestionIndex}`]: currentQuestion.answer === event.target.value ? 1 : 0,
    });
  };

  const handleSelectChange = (event) => {
    const selectedSectionIndex = parseInt(event.target.value) - 1;
    setSelectedUserDropdown(event.target.value);
    setCurrentSectionIndex(selectedSectionIndex);
    setCurrentQuestionIndex(0);
  };

  const handleNextSection = () => {
    if (currentSectionIndex < questionData.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const timerColor = seconds <= 30 ? { color: 'red' } : {};
    return (
      <div className="time-row">
        <div className="time-item">
          <p style={timerColor} className='para-one'>{hours.toString().padStart(2, '0')}</p>
          <p className='para-two'>Hours</p>
        </div>
        <div className="time-item">
          <p style={timerColor} className='para-one'>{minutes.toString().padStart(2, '0')}</p>
          <p className='para-two'>Minutes</p>
        </div>
        <div className="time-item">
          <p style={timerColor} className='para-one'>{remainingSeconds.toString().padStart(2, '0')}</p>
          <p className='para-two'>Seconds</p>
        </div>
      </div>
    );
  };

  const formatTimeValue = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes ${remainingSeconds.toString().padStart(2, '0')} seconds`;
    } else if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')} minutes ${remainingSeconds.toString().padStart(2, '0')} seconds`;
    } else {
      return `${remainingSeconds.toString().padStart(2, '0')} seconds`;
    }
  };

  const finishtest = () => {
    const notAnsweredCount = totalQuestions - Object.keys(selectedOptions).length;
    if (notAnsweredCount > 0) {
      confirmAlert({
        title: `You have ${notAnsweredCount} unanswered questions`,
        message: 'Do you wish to continue?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              localStorage.setItem("elacomplete", "true");
              testComplete();
            }
          },
          {
            label: 'No',
            onClick: () => console.log('Click No')
          }
        ]
      });
    } else {
      confirmAlert({
        title: `You have ${formatTimeValue(timeLeft)} time left`,
        message: 'Make sure that your answers are correct. Do you wish to continue?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => testComplete()
          },
          {
            label: 'No',
            onClick: () => console.log('Click No')
          }
        ]
      });
    }
  };

  const testComplete = () => {
    let sum = 0;
    for (let i = 0; i < Object.values(score).length; i++) {
      sum += Object.values(score)[i];
    }
    setFinalScore(sum);
    localStorage.setItem("finalScore", sum);
    navigate("/finish-assessment");
  };

  if (!questionData) {
    return <div>Loading...</div>;
  }

  const sections = questionData.sections;
  const currentSection = sections[currentSectionIndex];
  const currentSectionQuestions = currentSection.questions.slice(0, 20);
  const currentQuestion = currentSectionQuestions[currentQuestionIndex];

  const answeredCount = Object.keys(selectedOptions).length;
  const bookmarkedCount = Object.keys(bookmarkedQuestions).length;
  const notAnsweredCount = totalQuestions - answeredCount;

  const isCurrentSectionCompleted = currentSectionQuestions.every((_, index) =>
    selectedOptions.hasOwnProperty(`${currentSectionIndex}-${index}`)
  );

  const logout = () => {
    confirmAlert({
      title: 'You are about to Logout',
      message: 'This will lead to loss of test progress, Do you wish to continue?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            localStorage.removeItem("isloggedin");
            localStorage.removeItem("linkedin");
            localStorage.removeItem("elacomplete");
            localStorage.removeItem("userid");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
            navigate("../");
          }
        },
        {
          label: 'No',
          onClick: () => console.log('Click No')
        }
      ]
    });
  };

  return (
    <div className='assessment-head'>
      <div className='assessment-inside'>
        <div className='nav-content'>
          <div className='brand-logo'>
            <img src={logoela} alt="C-Suite Academy" height='40px' />
          </div>
          <>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                {localStorage.getItem("name")}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
          <button className='button-finish' onClick={(e) => {
            e.preventDefault();
            finishtest();
          }}>Finish Test</button>
        </div>
        <div className='row-two'>
          <div className='row-two-inside'>
            <div className='first-inside'>
              <div className="time-container">
                <div className="time-content">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
            <div className='second-inside'>
              <div className="dropdown-content">
                <select className='dropdown-one' value={selectedUserDropdown} onChange={handleSelectChange}>
                  {sections.map((section, index) => (
                    <option key={index} value={index + 1}>
                      Section {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className='options'>
                <div className='inside-options'>
                  <div className='answered'>
                    <p className='para-one'>{answeredCount}</p>
                    <p className='para-two'>Answered</p>
                  </div>
                  <div className='not-answered'>
                    <p className='para-one'>{notAnsweredCount}</p>
                    <p className='para-two'>Not Answered</p>
                  </div>
                  <div className='bookmarked'>
                    <p className='para-one'>{bookmarkedCount}</p>
                    <p className='para-two'>Bookmarked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row-three">
            <div className="question-header">
              <h4>Question {currentQuestionIndex + 1}</h4>
              <button onClick={handleBookmark}>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: bookmarkedQuestions[`${currentSectionIndex}-${currentQuestionIndex}`] === "true" ? "blue" : "grey" }}
                />
              </button>
            </div>
            <div className="question-content">
              <p className='question-text'>{currentQuestion.question}</p>
              <div className="options-list">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className='input-options'>
                    <label className='container'>
                      <input
                        type="radio"
                        name={`option-${currentQuestionIndex}`}
                        value={option}
                        checked={selectedOptions[`${currentSectionIndex}-${currentQuestionIndex}`] === option}
                        onChange={handleOptionChange}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className='row-buttons'>
              <button className='previous-button' onClick={() => handleNavigation('previous')}>
                Previous
              </button>
              {isCurrentSectionCompleted ? (
                <button className='next-button' onClick={handleNextSection}>
                  Next Section
                </button>
              ) : (
                <button className='next-button' onClick={() => handleNavigation('next')}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessmentsstart;

