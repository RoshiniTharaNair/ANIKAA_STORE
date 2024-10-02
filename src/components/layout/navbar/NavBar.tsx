import Link from 'next/link';
import Image from 'next/image';
import { FC, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import SearchComponent from '../search-component/SearchComponent';
import MeasurementTapeSale from '../measurement-tape-sale/MeasurementTapeSale';
import SpecialNavbar from '../special-navbar/SpecialNavbar';
import './NavBar.css';

const categories = [
  { name: 'Blouse', link: '/blouse' },
  { name: 'Gown', link: '/gown' },
  { name: 'Tops', link: '/tops' },
  { name: 'Skirts', link: '/skirts' },
  { name: 'Chudidhar Sets', link: '/chudidhar-sets' },
];

const NavBar: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    handleResize();  // Set initial value

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className={`nav-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <nav>
          <div className="nav-container">
            <div className="nav-left">
              {/* <Link href="/"> */}
                {/* <Image
                  src={scrolled ? "/logo25.png" : "/logo24.png"}
                  alt="Anikaa Logo"
                  width={scrolled ? 100 : isMobile ? 140 : 380}
                  height={scrolled ? 100 : isMobile ? 100 : 200}
                /> */}
                <Link href="/">
  <Image
    src={scrolled ? "/logo25.png" : "/logo24.png"}
    alt="Anikaa Logo"
    width={isMobile ? (scrolled ? 70 : 100) : scrolled ? 100 : 380}
    height={isMobile ? (scrolled ? 50 : 50) : scrolled ? 100 : 200}
  />
</Link>

              {/* </Link> */}
              {!isMobile && scrolled && <MeasurementTapeSale className="measurement-tape-sale" />}
            </div>
            <div className={`nav-right ${scrolled ? 'scrolled-right' : ''}`}>
              <Link href="/signup">
                <button className={`signup-button ${scrolled ? 'small' : ''}`}>SIGN IN</button>
              </Link>
              <button onClick={handleSearchToggle} className={`nav-icon-button ${scrolled ? 'small' : ''}`}>
  <FontAwesomeIcon 
    icon={faSearch} 
    className={`nav-icon ${scrolled ? 'small' : ''} ${isMobile && !scrolled ? 'mobile-small' : ''}`} 
  />
</button>
<Link href="/wishlist">
  <FontAwesomeIcon 
    icon={faHeart} 
    className={`nav-icon ${scrolled ? 'small' : ''} ${isMobile && !scrolled ? 'mobile-small' : ''}`} 
  />
</Link>
<Link href="/cart">
  <FontAwesomeIcon 
    icon={faShoppingCart} 
    className={`nav-icon ${scrolled ? 'small' : ''} ${isMobile && !scrolled ? 'mobile-small' : ''}`} 
  />
</Link>

            </div>
          </div>
          {menuOpen && (
            <div className="mobile-menu">
              <div className="categories">
                {categories.map((category) => (
                  <Link key={category.name} href={category.link}>
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {searchOpen && <SearchComponent onClose={handleSearchToggle} />}
        </nav>
      </div>
      {isMobile && scrolled && <SpecialNavbar />}
    </>
  );
};

export default NavBar;
