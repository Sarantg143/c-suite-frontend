import React, { useEffect, useState } from "react";
import Nolesson from "../../Assets/Images/no-lesson-illustration.svg";
import Trash from "../../Assets/Images/trash.png";
// import Edit from "../../Assets/Images/edit.png";
import EditImg from "../../Assets/Images/edit.png";
import { useNavigate } from "react-router-dom";
import NewLesson from "./NewLesson";
import { addnewCourse } from "../../../api/baseApi";
import { convertToCourseFormData } from "../../../hooks/newCourseFunctions";

const NewCourse = () => {
  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });
  const [currentOverview, setCurrentOverview] = useState({
    heading: "",
    content: "",
    updateIndex: null,
  });

  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: null,
    thumbnail: null,
    overviewPoints: [],
    lessons: [],
  });

  useEffect(() => {
    if (popupOpen) window.scrollTo(0, 0);
  }, [popupOpen]);

  const handledirectInput = (type, value) => {
    setCourseData({ ...courseData, [type]: value });
  };

  const handleOverviewInput = (type, value) => {
    setCurrentOverview({ ...currentOverview, [type]: value });
  };

  const addNewOverview = () => {
    if (currentOverview.title && currentOverview.description) {
      const newOverview = courseData.overviewPoints;
      if (currentOverview.updateIndex === null) {
        newOverview.push({
          ...currentOverview,
          updateIndex: newOverview.length > 0 ? newOverview?.length : 0,
        });
        setCourseData({ ...courseData, overviewPoints: newOverview });
      } else {
        newOverview[currentOverview?.updateIndex] = currentOverview;
        setCourseData({ ...courseData, overviewPoints: newOverview });
      }
      setCurrentOverview({
        heading: "",
        content: "",
        updateIndex: null,
      });
    }
  };

  const addLessontoCourse = (lesson) => {
    console.log(lesson)
    const newLessons = [...courseData.lessons];
    if (lesson.updateIndex === null) {
      newLessons.push({
        ...lesson,
        updateIndex: newLessons?.length > 0 ? newLessons?.length : 0,
      });
      setCourseData({ ...courseData, lessons: newLessons });
    } else {
      newLessons[lesson.updateIndex] = lesson;
      setCourseData({ ...courseData, lessons: newLessons });
    }
    setPopupOpen({ open: false });
  };

  const uploadCourse = async () => {
    if (
      courseData.title &&
      courseData.description &&
      courseData.lessons.length > 0 &&
      courseData.price
    ) {
      try {
        const courseFormData = convertToCourseFormData(courseData)
        const { data } = await addnewCourse(courseFormData);
        console.log(data);
        navigate('/')
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveOverview = (index) => {
    const newOverviews = [...courseData.overviews];
    newOverviews.splice(index, 1);
    setCourseData({ ...courseData, overviews: newOverviews });
  };

  const setEditValues = (overview,index)=>{
    overview.updateIndex = index
    setCurrentOverview(overview)
  }

  console.log(courseData)

  return (
    <div
      className="course-list-cnt new-course"
      style={{
        // height: popupOpen.open ? "100vh" : "auto",
        overflow: popupOpen.open ? "hidden" : "scroll",
      }}
    >
      <div className="top-header-cnt">
        <div>
          <h3 className="course-new-title">Create New Course</h3>
          <p className="course-new-discription">
            Create new course and lets publish
          </p>
        </div>
        <div className="top-btn-cnt">
          <div className=" course-delete-btn " onClick={() => navigate("/")}>
            Cancel
          </div>
          <div className="add-new-lesson-btn" onClick={() => uploadCourse()}>
            Save Course
          </div>
        </div>
      </div>
      <div className="input-split-cover">
        <form className="left-form">
          <div className="course-name-cnt">
            <p>Enter course Name</p>
            <input
              type="text"
              name=""
              id=""
              value={courseData?.title}
              className="name-input"
              onChange={(e) => handledirectInput("title", e.target.value)}
            />
          </div>

          <div className="course-description-cnt">
            <p>Describe course</p>
            <textarea
              type="text"
              name=""
              id=""
              value={courseData?.description}
              className="description-input"
              onChange={(e) => handledirectInput("description", e.target.value)}
            />
          </div>
          <div className="flex-input">
            <div className="course-name-cnt">
              <p>Enter course price</p>
              <input
                type="number"
                name=""
                id=""
                value={courseData.price !== null ? courseData.price : ""}
                className="name-input price-input"
                placeholder="₹"
                onChange={(e) => handledirectInput("price", e.target.value)}
              />
            </div>
            <div className="course-name-cnt">
              <p>Upload course thumbnail</p>
              <input
                type="file"
                accept="png,svg"
                onChange={(e)=>setCourseData({...courseData,thumbnail:e.target.files[0]})}
                className="styled-input"
              />
            </div>
          </div>
          <div className="course-description-cnt">
            <p>OverviewPoints</p>
            <div className="overview-input-cnt">
              <input
                type="text"
                name=""
                id=""
                className="name-input"
                value={currentOverview.heading}
                placeholder="Heading"
                onChange={(e) => handleOverviewInput("heading", e.target.value)}
              />
              <textarea
                type="text"
                name=""
                id=""
                className=" overview-input name-input"
                placeholder="Description"
                value={currentOverview.content}
                onChange={(e) =>
                  handleOverviewInput("content", e.target.value)
                }
              />
              <div
                className="overview-add-btn"
                onClick={() => addNewOverview()}
              >
                <p>Add</p>
              </div>
            </div>
            {courseData?.overviews?.map((overview, index) => (
              <div className="overviewPoint-cnt" key={index}>
                <div className="overview-head-cnt">
                  <p className="overviewPoint-heading">{overview?.title}</p>
                  <div className="action-btn-cnt-overview">
                    <img
                      src={Trash}
                      alt="delete"
                      className="action-img-overview"
                      onClick={() => handleRemoveOverview(index)}
                    />
                    <img
                      src={EditImg}
                      alt="edit"
                      className="action-img-overview"
                      onClick={() => setEditValues(overview,index)}
                      // onClick={() => openEdit()}
                    />
                  </div>
                </div>
                <p className="overviewPoint-content">{overview?.content}</p>
              </div>
            ))}
          </div>
        </form>
        <form className="form-right">
          <div className="form-right-header">
            <h3 className="course-new-title form-right-heading">
              List The Lessons
            </h3>
            <div
              className="add-new-lesson-btn"
              onClick={() => setPopupOpen({ open: true, data: null })}
            >
              Add new lesson
            </div>
          </div>

          <div className="lesson-list-cnt">
            {courseData.lessons?.length > 0 ? (
              courseData?.lessons?.map((lesson, index) => (
                <div
                  className="lesson"
                  onClick={() => setPopupOpen({ open: true, data: lesson })}
                >
                  <h1 className="lesson-number">{index + 1}</h1>
                  <div className="lesson-title-cnt">
                    <h3 className="lesson-title">{lesson?.title}</h3>
                  </div>
                  <ul className="lesson-subtitle-cnt">
                    {lesson?.chapter?.map((sublesson) => (
                      <li>
                        <p className="lesson-subtitle">{sublesson?.title}</p>
                        <p className="lesson-duration-txt">
                          duration : {sublesson?.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="no-lesson-cnt">
                <img
                  src={Nolesson}
                  alt="no-lesson"
                  className="empty-lesson-img"
                />
              </div>
            )}
            {/*  */}
          </div>
        </form>
      </div>
      {popupOpen.open && (
        <NewLesson
          addLesson={(lesson) => addLessontoCourse(lesson)}
          editData={popupOpen?.data}
          cancel={() => setPopupOpen({ open: false, data: null })}
        />
      )}
    </div>
  );
};

export default NewCourse;
