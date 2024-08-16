import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import NavSlider from './NavSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons' 
import Aos from "aos"
import 'aos/dist/aos.css'

import logo from './Asset/brand-1.png'

function Header() {

  useEffect(()=>{
    Aos.init();
  },[])
   
  return (
    <header>
          <nav class="navbar navbar-expand-lg navbar-light  sticky-top" style={{height:"100px", margin:"0"}}>
            <a data-aos="fade-right" class="navbar-brand ml-5 text-light" href="#"><img src={logo} alt="" height={"40px"} /></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ml-auto">
                <li className="nav-item active ml-4">
                  <Link className="nav-link text-light">Our Features <FontAwesomeIcon className='angledown' icon={faAngleDown} /></Link>
                   <NavSlider  />
                </li>
                <li className="nav-item active ml-4">
                <Link className="nav-link text-light ">Why C-Suite?</Link>
                </li>
                <li className="nav-item active ml-4">
                <Link className="nav-link text-light">Courses</Link>
                </li>
                <li className="nav-item active ml-4">
                <Link className="nav-link text-light">Customers</Link>
                </li>
                <li className="nav-item active ml-4">
                <Link className="nav-link text-light">Career</Link>
                </li>
                {/* <li className="nav-item active ml-4">
                <Link className="nav-link text-light">Resources</Link>
                </li> */}
              </ul>

              <ul class="navbar-nav ml-auto mr-3 " data-aos="fade-left">
                <li className="nav-item active ml-4">
                  <Link to={'./authentication'}><button type="button" className="btn button-logoin text-light mb-2 mb-md-2 mb-lg-0  ">Log In</button></Link>
                </li>
                <li className="nav-item active ml-md-3 ml-4">
                  <Link to={'./authentication'}><button type="button" className="btn btn-light ">Get Started</button></Link>
                </li>
              </ul>  
            </div>
          </nav>
          <hr className='tag-size'/>
        </header>
  )
}

export default Header