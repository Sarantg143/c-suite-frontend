import React, { useState , useEffect} from "react";
import "./managements.css";
import {
  MdOutlineAssessment,
  MdOutlineUnsubscribe,
  MdDashboard,
} from "react-icons/md";
import { LiaUniversitySolid } from "react-icons/lia";


//Aos animations
import Aos from "aos"
import 'aos/dist/aos.css'

const contentData = {
  Assessment: {
    title: "Officials",
    content: [
      {
        title: "Chief Executive Officer (CEO)",
        text: "Oversees the overall operations and strategic direction of the company, responsible for driving growth and ensuring organizational success."
      },
      {
        title: "Chief Technology Officer (CTO)",
        text: "Leads the technology vision and development initiatives, driving innovation and ensuring technical excellence aligns with business goals."
      },
      {
        title: "Chief Financial Officer (CFO)",
        text: "Manages the financial aspects of the company, including budgeting and financial reporting to optimize financial performance and support strategic decision making."
      }
    ],
    imageClass: "card-image"
  },
  Subscribe: {
    title: "Subscribe",
    content: [
      {
        title: "Community Engagement",
        text: "Emphasize the sense of community subscribers can experience, including opportunities for discussions, collaboration, and networking."
      },
      {
        title: "Support and Assistance",
        text: "Assure subscribers of dedicated support and assistance, including access to customer service, FAQs, and troubleshooting guides."
      },
      {
        title: "Flexible Subscription Plans",
        text: "Outline the different subscription plans available, including their features, duration, and pricing options.Highlight the benefits of subscribing, such as gaining access to exclusive courses, resources, and features."
      }
    ],
    imageClass: "card-image-subscribe"
  },
  Dashboard: {
    title: "Dashboard",
    content: [
      {
        title: "Comprehensive Insights",
        text: "Explain how the dashboard provides users with comprehensive insights into their learning progress, including course completion rates, quiz scores, and participation levels."
      },
      {
        title: "Real-Time Analytics",
        text: "Highlight the feature of real-time analytics, enabling users to track their performance instantly and make data-driven decisions to improve their learning outcomes."
      },
      {
        title: "Resource Management",
        text: "Outline how the dashboard facilitates resource management, enabling users to organize and access course materials, assignments, and supplementary resources efficiently."
      }
    ],
    imageClass: "card-image-dashboard"
  },
  Learning: {
    title: "Learning",
    content: [
      {
        title: "Interactive Courses",
        text: "Engage in interactive courses designed to cater to various learning styles. Access video lectures, quizzes, assignments, and interactive simulations to reinforce your understanding of key concepts."
      },
      {
        title: "Expert Instructors",
        text: "Learn from industry experts and experienced educators who provide valuable insights and guidance throughout your learning journey. Benefit from their expertise and practical knowledge."
      },
      {
        title: "Self-Paced Learning",
        text: "Enjoy the flexibility of self-paced learning, allowing you to study at your own convenience and progress through the courses at a pace that suits your schedule and learning preferences."
      }
    ],
    imageClass: "card-image-learning"
  }
};

const Management = () => {
  const [selectedContent, setSelectedContent] = useState("Assessment");

  const handleButtonClick = (content) => {
    setSelectedContent(content);
  };

  const renderContent = () => {
    const content = contentData[selectedContent];
    if (!content) return null;
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div data-aos="fade-right" className="changes-head">
              <h1 className="content-title">{content.title}</h1>
              <div className="total-content">
                <div className="container-para">
                  {content.content.map((item, index) => (
                    <div key={index}>
                      <strong className="item-title" >{item.title}</strong>
                      <p className="pt-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div data-aos="fade-left" className="image-sytle">
              <div className={content.imageClass}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //aos fatch 
  useEffect(()=>{
    Aos.init();
  },[])

  return (
    <>
      <div className="container-fluid" id="what">
        <div className="container-lms-head">
          <div className="heading-lms" data-aos="fade-up">
            <div  >What is LMS ?</div>
            <div>
              Streamline educational course administration and
              <br /> delivery to enhance learning experience
            </div>
            <div>
              LMS: Empowering educators to streamline course management,
              tracking, and delivery for an enhanced
              <br />
              <p id="para3">
                learning experience all from one centralized platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-read">
        <div className="buttons-all">
          <button data-aos="fade-right" className="txt-access" onClick={() => handleButtonClick("Assessment")}>
            <MdOutlineAssessment style={{marginTop:"0px"}} className="text-primary-color mr-2" size="1.5rem" />
            <span>Assessment</span>
          </button>
          <button data-aos="fade-right" className="txt-access" onClick={() => handleButtonClick("Subscribe")}>
            <MdOutlineUnsubscribe style={{marginTop:"0px"}} className="text-primary-color mr-2" size="1.5rem" />
            <span>Subscribe</span>
          </button>
          <button data-aos="fade-left" className="txt-access" onClick={() => handleButtonClick("Dashboard")}>
            <MdDashboard style={{marginTop:"0px"}} className="text-primary-color mr-2" size="1.5rem" />
            <span>Dashboard</span>
          </button>
          <button data-aos="fade-left" className="txt-access" onClick={() => handleButtonClick("Learning")}>
            <LiaUniversitySolid style={{marginTop:"0px"}} className="text-primary-color mr-2" size="1.5rem" />
            <span>Learning</span>
          </button>
        </div>
      </div>
      {/* Render the selected content */}
      {renderContent()}
    </>
  );
};

export default Management;
