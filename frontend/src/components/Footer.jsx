import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mt-40 text-sm">
            <div>
                <img src={assets.logo} className="mb-5 w-32" />
                <p className="w-full md:w-2/3 text-gray-600">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book.
                </p>
            </div>
            <div>
                <p className="text-xl font-medium mb-5">COMPANY</p>
                <ul className="flex flex-col gap-1 text-gray-600">
                    <Link to="/">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/delivery">Delivery</Link>
                    <Link to="/policy">Privacy Policy</Link>
                </ul>
            </div>
            <div>
                <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                <ul className="flex flex-col gap-1 text-gray-600">
                    <li>+1-212-456-7890</li>
                    <li>contact@shopsphere.com</li>
                </ul>
            </div>
            <div className="col-span-full text-center">
                <hr />
                <p className="py-5 text-sm text-center">
                    &copy; Copyright 2024@ ShopSphere.com - All right Reserved.
                </p>
            </div>
        </div>
    );
};

export default Footer;
