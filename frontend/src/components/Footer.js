import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-8 mt-10'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Section 1: All In One Cart Info */}
          <div>
            <h3 className='text-xl font-bold mb-4'>All In One Cart</h3>
            <p className='text-sm text-gray-400'>
              Your one-stop shop for all your needs. We offer a wide range of products
              from electronics to fashion, ensuring quality and customer satisfaction.
            </p>
          </div>

          {/* Section 2: About Us */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>About Us</h3>
            <ul>
              <li className='mb-2'>
                <Link to='/about' className='text-gray-400 hover:text-white transition-colors duration-200'>Our Story</Link>
              </li>
              <li className='mb-2'>
                <Link to='/careers' className='text-gray-400 hover:text-white transition-colors duration-200'>Careers</Link>
              </li>
              <li className='mb-2'>
                <Link to='/contact' className='text-gray-400 hover:text-white transition-colors duration-200'>Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Customer Service */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Customer Service</h3>
            <ul>
              <li className='mb-2'>
                <Link to='/faq' className='text-gray-400 hover:text-white transition-colors duration-200'>FAQ</Link>
              </li>
              <li className='mb-2'>
                <Link to='/shipping' className='text-gray-400 hover:text-white transition-colors duration-200'>Shipping & Delivery</Link>
              </li>
              <li className='mb-2'>
                <Link to='/returns' className='text-gray-400 hover:text-white transition-colors duration-200'>Returns & Refunds</Link>
              </li>
              <li className='mb-2'>
                <Link to='/track-order' className='text-gray-400 hover:text-white transition-colors duration-200'>Track My Order</Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Policies & Connect */}
          <div>
            <h3 className='text-lg font-semibold mb-4'>Policies</h3>
            <ul>
              <li className='mb-2'>
                <Link to='/privacy-policy' className='text-gray-400 hover:text-white transition-colors duration-200'>Privacy Policy</Link>
              </li>
              <li className='mb-2'>
                <Link to='/terms-of-service' className='text-gray-400 hover:text-white transition-colors duration-200'>Terms of Service</Link>
              </li>
            </ul>
            <h3 className='text-lg font-semibold mt-6 mb-4'>Connect With Us</h3>
            <div className='flex space-x-4'>
              {/* Facebook Icon */}
              <a href='https://www.facebook.com/as.if.721742' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Twitter Icon */}
              <a href='#' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658 4.195 4.195 0 001.828-2.318 8.36 8.36 0 01-2.65.992 4.193 4.193 0 00-7.155 3.81 11.886 11.886 0 01-8.62-4.376 4.192 4.192 0 001.298 5.594 4.187 4.187 0 01-1.89-.523v.052a4.194 4.194 0 003.36 4.113 4.202 4.202 0 01-1.89.072 4.194 4.194 0 003.924 2.915 8.414 8.414 0 01-5.197 1.795 11.868 11.868 0 006.47 1.895c7.76 0 12.01-6.426 12.01-12.01 0-.182-.004-.363-.012-.543a8.528 8.528 0 002.093-2.175z" />
                </svg>
              </a>
              {/* Instagram Icon */}
              <a href='https://www.instagram.com/sajidrahmanrifan_/' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 5.503c3.344 0 3.746.013 5.06.073 1.314.06 2.01.275 2.56.495.66.268 1.13.62 1.6.98.47.36 1.05.88 1.42 1.42.37.54.71 1.2.98 1.6.22.55.435 1.246.495 2.56.06 1.314.073 1.716.073 5.06s-.013 3.746-.073 5.06c-.06 1.314-.275 2.01-.495 2.56-.268.66-.62 1.13-.98 1.6-.36.47-.88 1.05-1.42 1.42-.54.37-1.2.71-1.6.98-.55.22-1.246.435-2.56.495-1.314.06-1.716.073-5.06.073s-3.746-.013-5.06-.073c-1.314-.06-2.01-.275-2.56-.495-.66-.268-1.13-.62-1.6-.98-.47-.36-1.05-.88-1.42-1.42-.37-.54-.71-1.2-.98-1.6-.22-.55-.435-1.246-.495-2.56-.06-1.314-.073-1.716-.073-5.06s.013-3.746.073-5.06c.06-1.314.275-2.01.495-2.56.268-.66.62-1.13.98-1.6.36-.47.88-1.05 1.42-1.42.54-.37 1.2-.71 1.6-.98.55-.22 1.246-.435 2.56-.495C8.254 5.516 8.656 5.503 12 5.503zM12 7.72c-2.36 0-4.28 1.92-4.28 4.28s1.92 4.28 4.28 4.28 4.28-1.92 4.28-4.28-1.92-4.28-4.28-4.28zm0 7.04c-1.52 0-2.76-1.24-2.76-2.76s1.24-2.76 2.76-2.76 2.76 1.24 2.76 2.76-1.24 2.76-2.76 2.76zm6.82-7.92c-.52 0-.94-.42-.94-.94s.42-.94.94-.94.94.42.94.94-.42.94-.94.94z" clipRule="evenodd" />
                </svg>
              </a>
              {/* LinkedIn Icon */}
              <a href='https://www.linkedin.com/in/md-ziaur-rahman-green212/' className='text-gray-400 hover:text-white transition-colors duration-200'>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm'>
          <p>&copy; {new Date().getFullYear()} All In One Cart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
