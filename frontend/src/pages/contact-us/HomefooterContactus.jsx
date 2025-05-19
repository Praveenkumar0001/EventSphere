import NavSidebar from '@/components/ui/HomeNavbarandSidebar';
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';

const ContactSection = () => {
    return (
        <div className="bg-[#10172b] text-white py-10 px-5">

            <div>
              <NavSidebar />
            </div>
            <div className="max-w-6xl mx-auto flex justify-between">
                {/* Contact Us Section */}
                <div className="w-1/3">
                    <h2 className="text-2xl font-bold mb-4">CONTACT US</h2>
                   
                    <div className="flex items-center mb-2">
                        <FaEnvelope className="mr-2 text-red-500 text-xl" />
                        <p className="text-lg">22je0245@iitism.ac.in</p>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaPhone className="mr-2 text-green-500 text-xl" />
                        <p className="text-lg">9307863472</p>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaMapMarkerAlt className="mr-2 text-blue-500 text-xl" />
                        <p className="text-lg">Aquamarine hostel IIT(ISM) Dhanbad</p>
                    </div>
                    <div className="flex space-x-4 mt-8">
                        <FaInstagram className="text-pink-500 text-3xl" />
                        <FaFacebook className="text-blue-600 text-3xl" />
                        <FaTwitter className="text-blue-400 text-3xl" />
                    </div>
                </div>

                {/* Leave a Message Section */}
                <div className="w-1/3">
                    <h2 className="text-2xl font-bold mb-4">LEAVE A MESSAGE</h2>
                    <input type="text" placeholder="Name" className="w-2/3 mb-4 p-2 bg-white text-black" />
                    <input type="email" placeholder="Email" className="w-2/3 mb-4 p-2 bg-white text-black" />
                    <input type="text" placeholder="Phone Number" className="w-2/3 mb-4 p-2 bg-white text-black" />
                    <button className="bg-pink-500 text-white py-2 px-4 rounded mt-2 w-2/3">SEND</button>
                </div>

                {/* Website and Message Section */}
                <div className="w-1/3 text-right">
                    <h2 className="text-2xl font-bold mb-4">XXXXXXXX.COM</h2>
                    <textarea placeholder="Message" className="w-5/6 p-2 bg-white text-black h-30 "></textarea>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;