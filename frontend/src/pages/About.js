import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">About Us</h2>
          <p className="text-lg text-gray-500 mt-4">
          Discover the story behind our platform, our passion for connecting restaurants and customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Image Section */}
          <div className="flex justify-center mb-6 md:mb-0">
            <img
              src="https://via.placeholder.com/500"
              alt="Restaurant"
              className="rounded-lg shadow-lg w-full max-w-md object-cover"
            />
          </div>

          {/* Right Content Section */}
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-3xl font-semibold text-gray-800">
              Our Journey
            </h3>
            <p className="text-lg text-gray-600">
            Founded in 2025, we set out to create a food ordering platform that connects restaurants and customers seamlessly. Our mission has always been to offer a convenient, efficient, and enjoyable way for people to order their favorite meals while providing restaurants with the tools to manage orders and grow their businesses.
            </p>
            <p className="text-lg text-gray-600">
            Over the years, we have continuously enhanced our platform, listening to both restaurants and customers to provide an experience that meets everyone’s needs. Our commitment to innovation, service, and user experience drives us to constantly improve and adapt.
            </p>
            <p className="text-lg text-gray-600">
            We understand that quality and convenience go hand-in-hand, which is why we’ve made it easier than ever for customers to explore a variety of dining options and for restaurants to offer a smooth ordering process. Join us today, and be a part of the future of food ordering, where convenience meets quality for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
