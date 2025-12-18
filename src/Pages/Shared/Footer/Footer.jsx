import React from "react";
import { Link } from "react-router";
import { FaFacebook, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import Logo from "../Logo/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#112a56] to-[#081C40]">
      <div className="py-8 w-11/12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold:text-primary">
                <Logo></Logo>
              </span>
            </div>
            <ul className="space-y-2 mt-4">
              {/*  */}
              <li>
                <Link
                  to={"/dashboard/profile"}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to={"/dashboard"}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Learning Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Guides
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Discussion Forums
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Study Groups
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  Events & Workshops
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white/80 hover:text-blue-500 transition-colors`}
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white/80 hover:text-blue-700 transition-colors`}
              >
                <FaXTwitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white/80 hover:text-pink-700 transition-colors`}
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white/80 hover:text-sky-700 transition-colors`}
              >
                <FaGithub size={24} />
              </a>
            </div>

            <a
              href="mailto:support@city.com"
              className={`flex items-center text-white/80 hover:text-primary mt-4 transition-colors`}
            >
              <IoIosMail size={18} className="mr-2" />
              <span>support@city.com</span>
            </a>
          </div>
        </div>
        <div className="border-t border-[#173A75] mt-5 pt-2.5 text-center">
          <p className="text-sm text-white/80">
            © {currentYear} Fix City All Rights Reserved.
            <span className="ml-2.5">
              <Link
                to="/"
                className={`hover:text-primary mr-2.5 transition-colors`}
              >
                Privacy Policy
              </Link>
              <Link to="/" className={`hover:text-primary transition-colors`}>
                Terms of Service
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
