import React,{useEffect} from 'react'

//style.css imported
import './landingpage.css'

//react-router-dom
import { PiStudent } from "react-icons/pi";

//imported in header components
import Header from '../Header/Header';

//Aos animations
import Aos from "aos"
import 'aos/dist/aos.css'

const Landingpage = () => {
  
  //aos fatch 
  useEffect(()=>{
     Aos.init();
  },[])

  return (
    <>
      <div className="landing-page" id='home'>
        <Header/>
        <section className="hero-section" >
          <div className="container-landing-text">
            <div className='text-learn' data-aos="fade-down" data-aos-duration="3000">
              <PiStudent size='2.5rem' />
              <p>Learn more</p>
            </div>
            <p className='text-grow'  data-aos="zoom-in-up"  data-aos-duration="1000">Grow your skills,</p>
            <p className='text-build'  data-aos="zoom-in-up"  data-aos-duration="2000">Build your future</p>
            <p className='text-course-development'  data-aos="zoom-in-up"  data-aos-duration="3000">Streamlining course development and delivery</p>
            <div data-aos="fade-up"
            data-aos-duration="3000">
              <button type="button" className="button-unlock" >Unlock Your Potential</button>
            </div>
             
          </div>
        </section>
      </div>  
    </>
  )
}

export default Landingpage