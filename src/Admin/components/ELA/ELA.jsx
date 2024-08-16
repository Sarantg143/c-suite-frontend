import React, { useEffect, useState } from "react";
import { getEla } from "../../api/baseApi";
import {
  addNewQuestion,
  addSection,
  deleteSingleQuestion,
  deleteSingleSection,
  editQuestions,
  editSectionDetails,
} from "../../hooks/ElaFunctions";

const ELA = () => {
  const initialState = {
    question: "",
    answer: null,
    options: [],
    questionNumber: null,
    updateIndex: null,
  };

  const defaultSection = {
    section: 1,
    duration: {
      hours: 0,
      minutes: 0,
    },
    difficulty: null,
    tags: [],
    description: "",
    questions: [],
  };

  const [currentTest, setCurrentTest] = useState([
    defaultSection,
    { ...defaultSection, section: 2 },
    { ...defaultSection, section: 3 },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [dropDown, setDropDown] = useState(false);
  const [difficultyDropDown, setDifficultyDropDown] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [TestId, setTestId] = useState(null);

  const handleChoiceSelect = (index) => {
    setDropDown(false);
    setCurrentQuestion({
      ...currentQuestion,
      answer: currentQuestion?.options[index],
    });
  };

  const handleChoiceInput = (index, value) => {
    const newChoices = [...currentQuestion.options];
    newChoices[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newChoices });
  };

  const handleNext = async () => {
    const updateIndex = currentQuestion?.updateIndex;
    const updatestart = { ...currentTest };
    if (updateIndex === null) {
      console.log("executing");
      const updatedQuestions = await addNewQuestion(
        TestId,
        currentSection + 1,
        currentQuestion
      );
      console.log("added", updatedQuestions);
      setCurrentTest({ ...currentTest, [currentSection]: updatedQuestions });
      setCurrentQuestion(initialState);
    } else if (
      updateIndex + 1 ===
      currentTest[currentSection]?.questions?.length
    ) {
      updatestart[currentSection].questions[updateIndex] = currentQuestion;
      console.log("last", updatestart[currentSection].questions);
      const updatedQuestions = await editQuestions(
        TestId,
        currentSection + 1,
        updatestart[currentSection].questions
      );
      console.log("updated-last", updatedQuestions);
      setCurrentTest({ ...currentTest, [currentSection]: updatedQuestions });
      setCurrentQuestion(initialState);
    } else {
      updatestart[currentSection].questions[updateIndex] = currentQuestion;
      const updatedQuestions = await editQuestions(
        TestId,
        currentSection + 1,
        updatestart[currentSection].questions
      );
      console.log("updated-middle", updatedQuestions);
      setCurrentTest({ ...currentTest, [currentSection]: updatedQuestions });
      setCurrentQuestion({
        ...currentTest[currentSection].questions[updateIndex + 1],
        updateIndex: updateIndex + 1,
      });
    }
  };

  const checkquestionMatch = (index, section) => {
    if (currentQuestion?.updateIndex === index && currentSection === section)
      return "#8949ff";
    return "transparent";
  };

  const questionValidation = () => {
    if (
      currentQuestion?.question?.length > 5 &&
      currentQuestion?.answer &&
      currentQuestion?.options?.length === 4
    )
      return true;
    return false;
  };

  useEffect(() => {
    const fetchEla = async () => {
      const { data } = await getEla();
      setTestId(data[0]?._id);
      setCurrentTest(data[0]?.sections);
    };
    fetchEla();
  }, []);

  const changeDifficulty = (difficulty) => {
    let currentData = { ...currentTest };
    currentData[currentSection].difficulty = difficulty;
    setCurrentTest(currentData);
  };

  const changeDuration = (type, value) => {
    let currentData = { ...currentTest };
    currentData[currentSection].duration[type] = value;
    setCurrentTest(currentData);
  };

  const updateTags = (value) => {
    const tagsArray = value.split(",");
    let currentData = { ...currentTest };
    currentData[currentSection].tags = tagsArray;
    setCurrentTest(currentData);
  };

  const updateSectionDetails = async () => {
    if (!Array.isArray(currentTest[currentSection].tags))
      updateTags(currentTest[currentSection].tags);
    let sectionDetails = {
      duration: currentTest[currentSection].duration,
      difficulty: currentTest[currentSection].difficulty,
      tags: currentTest[currentSection].tags,
      description: currentTest[currentSection].description,
    };
    const data = await editSectionDetails(
      TestId,
      currentSection + 1,
      sectionDetails
    );
    setCurrentTest({ ...currentTest, [currentSection]: data });
  };

  const deleteQuestionByIndex = async () => {
    if (currentQuestion.updateIndex !== null) {
      const res = await deleteSingleQuestion(
        TestId,
        currentSection + 1,
        currentQuestion.updateIndex
      );
      setCurrentTest(res?.sections);
    }
  };

  const deleteSection = async () => {
    const res = await deleteSingleSection(TestId, currentSection + 1);
    setCurrentTest(res.sections);
    console.log(res.sections);
    if (res) setCurrentTest(res.sections);
  };

  const addNewSection = async () => {
    const res = await addSection(TestId, {
      ...defaultSection,
      section: currentTest.length + 1,
    });
    console.log(res.sections);
    setCurrentTest(res.sections);
  };

  console.log(currentQuestion);
  return (
    <div className="ela-test-page">
      <p className="ela-title">Create or Edit your ELA assessment</p>
      <div className="questions-block-cnt justify-section-cnt">
        <div
          className="section-cnt"
          onClick={() => setCurrentSection(0)}
          style={{ background: currentSection === 0 && "#FFA500" }}
        >
          <div className="section-indicator">
            <p>Section-1</p>
          </div>
          <div className="questions-block-cover">
            {currentTest[0]?.questions?.map((test, index) => (
              <div
                className="question-block"
                style={{ background: checkquestionMatch(index, 0) }}
                key={index}
                onClick={() =>
                  setCurrentQuestion({
                    ...test,
                    updateIndex:
                      test.updateIndex !== undefined ? test.updateIndex : index,
                  })
                }
              >
                <p
                  key={index}
                  className="question-number"
                  style={{
                    color:
                      checkquestionMatch(index, 0) === "transparent" &&
                      "#8949ff",
                  }}
                >
                  {index + 1}
                </p>
              </div>
            ))}
            <div
              className="question-block"
              style={{ background: checkquestionMatch(null, 0) }}
              onClick={() => setCurrentQuestion(initialState)}
            >
              <p
                className="question-number"
                a
                style={{
                  color:
                    checkquestionMatch(null, 0) === "transparent" && "#8949ff",
                }}
              >
                {currentTest[0]?.questions?.length + 1}
              </p>
            </div>
          </div>
        </div>
        {currentTest.length > 1 && (
          <div
            className="section-cnt"
            onClick={() => setCurrentSection(1)}
            style={{ background: currentSection === 1 && "#FFA500" }}
          >
            <div className="section-indicator">
              <p>Section-2</p>
            </div>
            <div className="questions-block-cover">
              {currentTest[1]?.questions?.map((test, index) => (
                <div
                  className="question-block"
                  style={{ background: checkquestionMatch(index, 1) }}
                  key={index}
                  onClick={() =>
                    setCurrentQuestion({
                      ...test,
                      updateIndex:
                        test.updateIndex !== undefined
                          ? test.updateIndex
                          : index,
                    })
                  }
                >
                  <p
                    key={index}
                    className="question-number"
                    style={{
                      color:
                        checkquestionMatch(index, 1) === "transparent" &&
                        "#8949ff",
                    }}
                  >
                    {index + 1}
                  </p>
                </div>
              ))}
              <div
                className="question-block"
                style={{ background: checkquestionMatch(null, 1) }}
                onClick={() => setCurrentQuestion(initialState)}
              >
                <p
                  className="question-number"
                  style={{
                    color:
                      checkquestionMatch(null, 1) === "transparent" &&
                      "#8949ff",
                  }}
                >
                  {currentTest[1]?.questions?.length + 1}
                </p>
              </div>
            </div>
          </div>
        )}
        {currentTest.length > 2 && (
          <div
            className="section-cnt"
            onClick={() => setCurrentSection(2)}
            style={{ background: currentSection === 2 && "#FFA500" }}
          >
            <div className="section-indicator">
              <p>Section-3</p>
            </div>
            <div className="questions-block-cover">
              {currentTest[2]?.questions?.map((test, index) => (
                <div
                  className="question-block"
                  style={{ background: checkquestionMatch(index, 2) }}
                  key={index}
                  onClick={() =>
                    setCurrentQuestion({
                      ...test,
                      updateIndex:
                        test.updateIndex !== undefined
                          ? test.updateIndex
                          : index,
                    })
                  }
                >
                  <p
                    key={index}
                    className="question-number"
                    style={{
                      color:
                        checkquestionMatch(index, 2) === "transparent" &&
                        "#8949ff",
                    }}
                  >
                    {index + 1}
                  </p>
                </div>
              ))}
              <div
                className="question-block"
                style={{ background: checkquestionMatch(null, 2) }}
                onClick={() => setCurrentQuestion(initialState)}
              >
                <p
                  className="question-number"
                  style={{
                    color:
                      checkquestionMatch(null, 2) === "transparent" &&
                      "#8949ff",
                  }}
                >
                  {currentTest[2]?.questions?.length + 1}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="ela-new-section-btn" onClick={() => addNewSection()}>
          <div className="new-section-btn-text">
            <p>Add Section</p>
          </div>
        </div>
      </div>
      <div className="ela-inputs-cnt">
        <div className="ela-question-input-cnt">
          <div>
            <p>Question</p>
            <textarea
              className="question-input ela-question-input"
              value={currentQuestion?.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
            />
          </div>
          <div className="ela-choice-input-cover">
            <div className="choice-header">
              <p>Choices</p>
              <div className="select-answer-cnt">
                <p>Select Answer</p>
                <div className="selected-choice-display">
                  <p onClick={() => setDropDown(true)}>
                    {currentQuestion?.answer
                      ? currentQuestion?.answer
                      : "Not selected"}
                  </p>
                  {dropDown && (
                    <div className="drop-down-cnt">
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(0)}
                      >
                        <p>Choice one</p>
                      </div>
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(1)}
                      >
                        <p>Choice two</p>
                      </div>
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(2)}
                      >
                        <p>Choice three</p>
                      </div>
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(3)}
                      >
                        <p>Choice four</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="choice-cnt ela-choice-cnt">
              <div className="choice ela-choice">
                <p>Choice one</p>
                <input
                  type="text"
                  placeholder="Enter choice one"
                  value={
                    currentQuestion?.options[0]
                      ? currentQuestion?.options[0]
                      : ""
                  }
                  onChange={(e) => handleChoiceInput(0, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice two</p>
                <input
                  type="text"
                  placeholder="Enter choice two"
                  value={
                    currentQuestion?.options[1]
                      ? currentQuestion?.options[1]
                      : ""
                  }
                  onChange={(e) => handleChoiceInput(1, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice three</p>
                <input
                  type="text"
                  placeholder="Enter choice three"
                  value={
                    currentQuestion?.options[2]
                      ? currentQuestion?.options[2]
                      : ""
                  }
                  onChange={(e) => handleChoiceInput(2, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice four</p>
                <input
                  type="text"
                  placeholder="Enter choice four"
                  value={
                    currentQuestion?.options[3]
                      ? currentQuestion?.options[3]
                      : ""
                  }
                  onChange={(e) => handleChoiceInput(3, e.target.value)}
                />
              </div>
            </div>
          </div>
          <div
            className=" course-delete-btn save-next-mobile "
            onClick={() => handleNext()}
            style={{
              background: !questionValidation() && "gray",
              pointerEvents: !questionValidation() && "none",
            }}
          >
            Save and Next
          </div>
        </div>
        <div className="ela-question-info-cnt">
          <div className="ela-description-cnt">
            <p>Set Duration</p>
            <div className="ela-timer-input-cnt">
              <div className="ela-timer-cover">
                <input
                  type="text"
                  value={currentTest[currentSection]?.duration?.hours}
                  className="ela-timer-input description-input "
                  onChange={(e) => changeDuration("hours", e.target.value)}
                />
                <p>Hours</p>
              </div>
              <div className="ela-timer-cover">
                <input
                  type="text"
                  value={currentTest[currentSection]?.duration?.minutes}
                  onChange={(e) => changeDuration("minutes", e.target.value)}
                  className="ela-timer-input description-input "
                />
                <p>Minutes</p>
              </div>
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Describe the test</p>
            <textarea
              type="text"
              value={currentTest[currentSection]?.description}
              onChange={(e) =>
                setCurrentTest({
                  ...currentTest,
                  [currentSection]: {
                    ...currentTest[currentSection],
                    description: e.target.value,
                  },
                })
              }
              className="ela-description description-input "
            />
          </div>
          <div className="ela-description-cnt">
            <p>Select Test Difficulty</p>
            <div
              className="ela-dropdown-box"
              onClick={() => setDifficultyDropDown(!difficultyDropDown)}
            >
              <p>
                {currentTest[currentSection]?.difficulty
                  ? currentTest[currentSection]?.difficulty
                  : "Choose"}
              </p>
              {difficultyDropDown && (
                <div className="ela-dropdown-cnt">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => changeDifficulty("Easy")}
                  >
                    <p style={{ color: "green" }}>Easy</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => changeDifficulty("Medium")}
                  >
                    <p style={{ color: "orange" }}>Medium</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => changeDifficulty("Hard")}
                  >
                    <p style={{ color: "red" }}>Hard</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Tags (separated by coma ',')</p>
            <input
              type="text"
              value={
                Array.isArray(currentTest[currentSection]?.tags)
                  ? currentTest[currentSection]?.tags.join(", ")
                  : currentTest[currentSection]?.tags || ""
              }
              onChange={(e) =>
                setCurrentTest({
                  ...currentTest,
                  [currentSection]: {
                    ...currentTest[currentSection],
                    tags: e.target.value,
                  },
                })
              }
              className="ela-tags description-input "
            />
          </div>
          <div
            className="ela-update-btn"
            onClick={() => updateSectionDetails()}
          >
            <p> Save Section Details</p>
          </div>
        </div>
      </div>
      <div className="action-btns-cnt ela-actions-btn-cnt">
        <div
          className=" course-delete-btn cancel-test-btn"
          onClick={() => deleteQuestionByIndex()}
        >
          Delete question
        </div>
        <div
          className=" course-delete-btn cancel-test-btn"
          onClick={() => deleteSection()}
        >
          Delete Entire Section
        </div>
        <div
          className=" course-delete-btn save-next"
          onClick={() => handleNext()}
          style={{
            background: !questionValidation() && "gray",
            pointerEvents: !questionValidation() && "none",
          }}
        >
          Save and Next
        </div>
      </div>
    </div>
  );
};

export default ELA;
