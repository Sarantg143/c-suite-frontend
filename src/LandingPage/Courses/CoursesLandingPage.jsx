import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Courses.css";
import { useNavigate } from "react-router-dom";
import imgd from "../Assets/Images/imagenotxt2.png";
import LoadingPage from "../LoadingPage/LoadingPage";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
import { FaArrowDown, FaArrowRight } from "react-icons/fa6";
import Aos from "aos"
import 'aos/dist/aos.css'

const CoursesLandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [allLessons, setAllLessons] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  
  useEffect(()=>{
    Aos.init();
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        const response = await axios.get(`https://csuite-production.up.railway.app/api/courseDetail/`);
        const allCourses = response.data;

        // filtering purschased course
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            setCoursesData(allCourses);

        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setFetchError(true);
      }
    };
    fetchData();
  }, []);

  const resolveImagePath = (imagePath) => {
    if (
      imagePath &&
      (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    ) {
      return imagePath;
    } else if (imagePath && imagePath.startsWith("base64")) {
      return imgd;
    } else {
      try {
        return require(`../Assets/Images/${imagePath}`);
      } catch (error) {
        return imgd;
      }
    }
  };

  useEffect(() => {
    const getAllLessons = () => {
      let lessons = [];
      try {
        coursesData.forEach((course) => {
          course.lessons.forEach((lesson) => {
            if (!lessons.includes(lesson.title)) {
              lessons.push(lesson.title);
            }
          });
        });

        // Random
        for (let i = lessons.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lessons[i], lessons[j]] = [lessons[j], lessons[i]];
        }
      } catch (err) {
        console.log(err);
      }
      return lessons.slice(0, 10);
    };

    if (coursesData.length > 0) {
      const lessons = getAllLessons();
      setAllLessons(lessons);
    }
  }, [coursesData]);

  const filterCourses = (filters) => {
    try {
      if (filters.length === 0) {
        return coursesData;
      } else {
        return coursesData.filter((course) =>
          course.lessons.some((lesson) => filters.includes(lesson.title))
        );
      }
    } catch (err) {
      console.log(err);
      setFetchError(true);
      return [];
    }
  };

  const handleFilterClick = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    const truncated = words.slice(0, 15).join(" ");
    return truncated;
  };

//   if (isLoading) {
//     return (
//       <div>
//         <LoadingPage />
//       </div>
//     );
//   }

  if (fetchError) {
    return <ErrorDataFetchOverlay />;
  }

  return (
    <>
      <div className="main-content">
        <div className="cardContainer3">
          {/* <div className="filterChips">
            {allLessons.map((lesson, index) => (
              <div
                key={index}
                className={`filterChip ${
                  selectedFilters.includes(lesson) ? "active" : ""
                }`}
                onClick={() => handleFilterClick(lesson)}
              >
                {lesson}
              </div>
            ))}
            {selectedFilters.length > 0 && (
              <button className="clearFilters" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div> */}
          <div className='engage-head' style={{margin:"0px", padding:"0px"}}>
          <h2 style={{fontSize:"28px", paddingBottom:"3rem"}} data-aos="fade-up">Our Courses</h2>
          <div data-aos="fade-up" className="courseContainer3">
            {filterCourses(selectedFilters).map((course, index) => index < 4 && (
              <div className="courseCard3" key={course._id}>
                <div className="courseOverlay3">
                  <div className="courseImageBox3">
                    <img
                      src={course.image ? resolveImagePath(course.image) : imgd}
                      alt={course.title}
                      className="courseImage3"
                    />
                    <div className="courseImageTxt3">{course.title}</div>
                  </div>
                  <div className="courseDetails3">
                    <p>{truncateDescription(course.description)}...</p>
                    <button className="courseDetailBtn3">View Details</button>
                  </div>
                </div>
                <div className="courseLessonBox3">
                  <h5>Lessons</h5>
                  <ul>
                    {course.lessons.slice(0, 3).map((lesson, index) => (
                      <li key={index}>{lesson.title}</li>
                    ))}
                    {course.lessons.length > 3 && <li>...and more</li>}
                  </ul>
                  <button
                    onClick={() =>
                      navigate(`/authentication?courseid=${course._id}`)
                    }
                    className="lessonDetailBtn3"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        <div data-aos="fade-up" style={{padding:"5rem 0px 0px 0px"}}>
         <h4 onClick={() =>
                      {
                        console.log(localStorage.getItem('isloggedin'))
                    if(localStorage.getItem('isloggedin')=="true"){
                        navigate(`/home/Courses`)
                    }
                    else{
                        navigate(`/authentication`)
                    }
                }
                    } style={{fontSize:"25px"}}>More <FaArrowRight size='1.2rem'/></h4>
        </div>
     </div>
        </div>
      </div>
    </>
  );
};

export default CoursesLandingPage;
