import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ data }) => {
  const navigate = useNavigate();
  const resloveImagePath = (relativePath) => {
    return require(`../Assets/Images/imagenotxt.png`);
  };
  return (
    <div
      className="course-card"
      onClick={() => navigate("Course/edit", { state: data })}
    >
      <img
        src={resloveImagePath(data?.image)}
        alt={data?.image}
        className="course-img"
      />
      <h4 className="course-card-title">{data?.title}</h4>
      <p className="course-card-description">{data?.description?.slice(0,110)}..</p>
      <div className="course-edit-btn">
        <p>Edit Course</p>
      </div>
    </div>
  );
};

export default CourseCard;
