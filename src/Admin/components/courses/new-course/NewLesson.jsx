import React, { useEffect, useState } from "react";
import Trash from "../../Assets/Images/trash.png";
import Edit from "../../Assets/Images/edit.png";
import Test from "../../Assets/Images/exam.png";
import AddTest from "./AddTest";
import { uploadVedio } from "../../../api/baseApi";
import { findFileType } from "../../../hooks/newCourseFunctions";

const NewLesson = ({ addLesson, cancel, editData }) => {
  const [openTest, setOpenTest] = useState({ open: false, data: null });

  const [currentLesson, setCurrentLesson] = useState({
    title: null,
    chapter: [],
    testId: "",
    updateIndex: null,
    description: "test-description",
  });
  const [currentSublesson, setCurrentSublesson] = useState({
    title: "",
    duration: "",
    link: "#",
    updateIndex: null,
    type: null,
  });

  const [sublessonFile, setSublessonFile] = useState(null);

  const handleAddFile = (file) => {
    const filetype = findFileType(file);
    console.log("filetype");
    setSublessonFile(file);
    setCurrentSublesson({ ...currentSublesson, type: filetype });
  };

  const handleSubLessonsInput = (type, value) => {
    setCurrentSublesson({ ...currentSublesson, [type]: value });
  };

  const getVideoURL = async () => {
    try {
      const vedioFormData = new FormData();
      vedioFormData.append("video", sublessonFile);
      const { data } = await uploadVedio(vedioFormData);
      console.log(data);
      // setCurrentSublesson({...currentSublesson,url:data?.videoUrl})
      return data?.videoUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const addSublessons = async () => {
    const newLessons = [...currentLesson.chapter];
    if (currentSublesson.title && currentSublesson.duration && sublessonFile) {
      let videoLink = await getVideoURL();
      if (
        currentSublesson.updateIndex === null ||
        currentSublesson.updateIndex === undefined
      ) {
        newLessons.push({ ...currentSublesson, link: videoLink });
        setCurrentLesson({ ...currentLesson, chapter: newLessons });
        setCurrentSublesson({
          title: "",
          duration: "",
          link: "#",
          updateIndex: null,
          type: null,
        });
      } else {
        newLessons[currentSublesson.updateIndex] = {
          ...currentSublesson,
          link: videoLink,
        };
        setCurrentLesson({ ...currentLesson, chapter: newLessons });
        setCurrentSublesson({
          title: "",
          duration: "",
          link: "#",
          updateIndex: null,
          type: null,
        });
      }
    } else if (
      currentSublesson.link !== "#" &&
      currentSublesson.title &&
      currentSublesson.duration
    ) {
      newLessons[currentSublesson.updateIndex] = currentSublesson;
      setCurrentLesson({ ...currentLesson, chapter: newLessons });
      setCurrentSublesson({
        title: "",
        duration: "",
        link: "#",
        updateIndex: null,
        type: null,
      });
    }
  };

  const validateAndUpdateLesson = () => {
    if (currentLesson.title && currentLesson.chapter.length > 0) {
      addLesson(currentLesson);
    }
  };

  const setEditSublesson = (chapter, index) => {
    setCurrentSublesson({ ...chapter, updateIndex: index });
  };

  const handleRemoveSublesson = (index) => {
    const newsubLessons = [...currentLesson.chapter];
    newsubLessons.splice(index, 1);
    setCurrentLesson({ ...currentLesson, chapter: newsubLessons });
  };

  console.log(currentSublesson);

  useEffect(() => {
    if (editData) setCurrentLesson(editData);
  }, [editData]);

  return (
    <div className="lesson-popup-cnt">
      <div className="lesson-new-cnt">
        {openTest.open && (
          <AddTest
            testId={currentLesson?.testId}
            addTest={(data) => {
              setCurrentLesson({ ...currentLesson, testId: data });
            }}
            closeTest={() => setOpenTest({ open: false })}
          />
        )}
        <div className="form-right-header">
          <h3 className="course-new-title form-right-heading">
            Create New Lesson
          </h3>
          <div className="top-btn-cnt">
            <div
              className="add-new-lesson-btn cancel-btn"
              onClick={() => cancel()}
            >
              Cancel
            </div>
            <div
              className="add-new-lesson-btn"
              onClick={() => validateAndUpdateLesson()}
            >
              Add to Course
            </div>
          </div>
        </div>
        <div className="new-lesson-top">
          <div className="lesson-name-cnt">
            <p>Lesson Title</p>
            <input
              type="text"
              name=""
              id=""
              value={currentLesson.title}
              className="lesson-title-input"
              onChange={(e) =>
                setCurrentLesson({
                  ...currentLesson,
                  title: e.target.value,
                })
              }
            />
            <div
              className="lesson-test-overview-cnt"
              onClick={() =>
                setOpenTest({ open: true, data: currentLesson.testId })
              }
            >
              <img src={Test} alt="test" className="test" />
              <p>
                {!currentLesson?.testId?.length > 3
                  ? "No Tests has been created for this lesson"
                  : `Test click to update`}
              </p>
              <div className="lesson-test-overview-btn"></div>
            </div>
          </div>
          <div className="lesson-content-input-cnt">
            <div className="sublesson-name-cnt">
              <p>Sub lesson Title</p>
              <input
                type="text"
                name=""
                id=""
                value={currentSublesson.title}
                className="sublesson-title-input"
                onChange={(e) => handleSubLessonsInput("title", e.target.value)}
              />
            </div>
            <div className="sublesson-content-cover">
              <div className="input-cnt">
                <p>Duration</p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="sublesson-duration-input sublesson-title-input "
                  value={currentSublesson.duration}
                  onChange={(e) =>
                    handleSubLessonsInput("duration", e.target.value)
                  }
                />
              </div>
              <div className="input-cnt add-sublesson-btn">
                <div className="sublesson-title-input center-media">
                  <p>upload video</p>
                  <input
                    type="file"
                    name="video-upload"
                    accept="video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    style={{ position: "absolute" }}
                    id=""
                    className="file-title-input"
                    onChange={(e) => handleAddFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div
                className="add-new-lesson-btn add-sublesson-btn"
                onClick={() => addSublessons()}
              >
                Add
              </div>
            </div>
          </div>
        </div>
        <div className="content-list">
          {currentLesson?.chapter?.map((sublesson, index) => (
            <div
              className="lesson-content-input-cnt sublesson"
              key={index}
              style={{
                background:
                  currentSublesson.updateIndex === index ? "#eaeaea" : null,
              }}
            >
              <div className="sublesson-name-cnt">
                <p className="sublesson-title-txt">Sub lesson Title</p>
                <input
                  type="text"
                  name=""
                  id=""
                  value={sublesson?.title}
                  className="sublesson-title-input sublesson-card-input"
                />
              </div>
              <div className="sublesson-content-cover">
                <div className="input-cnt sublesson-title-txt">
                  <p>Duration</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={sublesson?.duration}
                    className="sublesson-duration-input sublesson-title-input sublesson-card-input"
                  />
                </div>
                <div className="input-cnt add-sublesson-btn">
                  <div
                    className="sublesson-title-input center-media sublesson-card-input"
                    onClick={() => window.open(sublesson?.link)}
                  >
                    <p className="sublesson-title-txt">play video</p>
                  </div>
                </div>
                <div
                  className="add-new-lesson-btn add-sublesson-btn edit-sublesson-btn"
                  //   onClick={() => setPopupOpen(false)}
                >
                  <div className="delete-btn">
                    <img
                      src={Trash}
                      alt="delete"
                      className="action-btn-img"
                      onClick={() => handleRemoveSublesson(index)}
                    />
                  </div>
                  <div className="delete-btn">
                    <img
                      src={Edit}
                      alt="edit"
                      className="action-btn-img"
                      onClick={() => setEditSublesson(sublesson, index)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewLesson;
