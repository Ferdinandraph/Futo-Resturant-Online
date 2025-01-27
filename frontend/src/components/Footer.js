import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          {/* About Section */}
          <div className="w-full md:w-1/3 mb-8">
            <h3 className="text-lg font-bold mb-4">About FF-Tech</h3>
            <p>
              We provide the best food delivery service in town, ensuring fresh, healthy, and delicious meals are at your doorstep!
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div className="w-full md:w-1/3 mb-8">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">About Us</li>
              <li className="hover:underline cursor-pointer">Contact</li>
              <li className="hover:underline cursor-pointer">Restaurants</li>
            </ul>
          </div>
          
          {/* Get in Touch Section */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
            <p>Email: info@FF-Tech.com</p>
            <p>Phone: +1 234 567 890</p>
          </div>
        </div>
        
        {/* Footer Copyright Section */}
        <div className="text-center mt-8">
          <p>© 2025 FF-Tech. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
