import React,{useEffect} from 'react';

//style.css
import './Footer.css'

//fontawesome icons 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons' 
import { faFacebookF } from '@fortawesome/free-brands-svg-icons' 
import { faSquareInstagram } from '@fortawesome/free-brands-svg-icons' 
import { faXTwitter } from '@fortawesome/free-brands-svg-icons' 

//image upload
import footerlogo from '../Header/Asset/brand-footer.png'

//Aos animations
import Aos from "aos"
import 'aos/dist/aos.css'

function Footer() {

  //aos fatch 
  useEffect(()=>{
    Aos.init();
  },[])

  return (
    <div className='footer' id='footer'>
      <section data-aos="fade-up" className='section1'>
        <img src={footerlogo} alt="" width={"120px"}/>
        <p>Practical-based learning platform to enhance skills</p>
        <h6>Follow Us on</h6>
        <div className='sociallinks'>
        <FontAwesomeIcon icon={faLinkedin} />
        <FontAwesomeIcon icon={faFacebookF} />
        <FontAwesomeIcon icon={faSquareInstagram} />
        <FontAwesomeIcon icon={faXTwitter} />
        </div>
      </section>
      <section data-aos="fade-up" className='section2'>
        <h5 >About LMS</h5>
        <a>Pricing</a>
        <a>Features</a>
        <a>Integrations</a>
        <a>Events</a>
        <a>Reviews</a>
      </section>
      <section data-aos="fade-up" className='section3'>
      <h5 >Support</h5>
        <a>Contact Us</a>
        <a>Help Desk</a>
        <a>Customer Support</a>
        <a>Professional Services</a>
      </section>
      <section data-aos="fade-up" className='section4'>
        <h4 >Become an Instructor</h4>
        <p>We only work with the best companies around the globe</p>
        <form className='instructoremail'>
          <input className="emailinput" type="email" placeholder='Enter Your Email'/>
          <input className='registernow' type="submit" value="Register Now" />
        </form>
      </section>
    </div>
  )
}

export default Footer