import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBarsStaggered, FaXmark} from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { SiGitbook } from 'react-icons/si';
import { UserContext } from '../authencation/UserContext';
import { CartContext } from '../shop/CartContext';
import CategoryNav from '../home/CategoryNav';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const { cartItems } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate(); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { link: 'Trang chủ', path: '/' },
    { link: 'Giới thiệu', path: '/about' },
    { link: 'Tin tức', path: '/news' },
  ];

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = () => {
    const trimmedQuery = searchQuery.trim();
    const queryParam = trimmedQuery === '' ? 'undefined' : encodeURIComponent(trimmedQuery);
    navigate(`/search?q=${queryParam}`);
  };
  
  return (
    <header className="w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-300">
      <nav className={`py-4 lg:px-24 px-4 ${isSticky ? 'sticky top-0 left-0 right-0 bg-blue-300' : ''}`}>
        <div className="flex justify-between items-center text-base gap-8">
          <Link to="/" className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <SiGitbook className="inline-block" /> HS Bookstore
          </Link>

          <ul className="md:flex space-x-12 hidden">
            {navItems.map(({ link, path }) => (
              <Link key={path} to={path} className="block text-base text-black uppercase cursor-pointer hover:text-blue-700">
                {link}
              </Link>
            ))}
          </ul>

          <div className="space-x-12 hidden lg:flex items-center">
            <CategoryNav onCategorySelect={setSelectedCategory} />

            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="border border-gray-300 rounded-md px-4 py-2 w-64 focus:outline-none"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
              />
              <FaSearch className="text-gray-400 hover:text-blue-700 cursor-pointer" size={30} onClick={handleSearchSubmit} />
            </div>

            <button><FaBarsStaggered className="w-5 hover:text-blue-700" /></button>
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-black focus:outline-none">
              {isMenuOpen ? <FaXmark className="h-5 w-5 text-black" /> : <FaBarsStaggered className="h-5 w-5 text-black" />}
            </button>
          </div>

          <Link to="/cart" className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">{cartItems.length}</div>
            )}
          </Link>
          <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 relative top-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
              </svg>
            </div>
            {!!user && (
              <div>
                {user.name}
              </div>
            )}
          </Link>
        </div>

        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none"
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
            />

            <ul className="mt-4">
              {navItems.map(({ link, path }) => (
                <li key={path}>
                  <Link to={path} className="block text-base text-black uppercase cursor-pointer hover:text-blue-700">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
