import {useState,useEffect} from 'react'
import { Link } from 'react-router'

const NavBar = () => {

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide
        setShow(false);
      } else {
        // scrolling up → show
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`navbar duration-500 ease-in-out ${show ? "translate-y-0" : "-translate-y-[100px]"}`}>
      <Link to="/">
        <p className='text-xl font-bold text-gradient'>ResumeAI</p>
      </Link>
      <Link to="/upload" className='primary-button w-fit'>
        Upload Resume
      </Link>
    </nav>
  )
}

export default NavBar
