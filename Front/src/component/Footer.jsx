import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-5">
      <div className=" flex justify-center fl">
        <ul className="flex flex-wrap justify-center md:justify-start">
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Agriculture">Agriculture</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Bussiness">Business</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Education">Education</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Entertainment">Entertainment</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Art">Art</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Investment">Investment</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Uncategorized">Uncategorized</Link>
          </li>
          <li className="mr-4 mb-2">
            <Link to="/posts/categories/Weather">Weather</Link>
          </li>
        </ul>
      </div>
        <div>
          <small className="flex  justify-center mt-2" style={{borderTop:"1px solid white"}}>All Rights Reserved &copy; 2024 -Design & Develop by Saroj Shrestha</small>
        </div>
    </footer>
  );
}

export default Footer;
