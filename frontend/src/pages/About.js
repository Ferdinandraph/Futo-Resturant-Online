import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">About Us</h2>
          <p className="text-lg text-gray-500 mt-4">
            Discover our story, passion, and the journey behind our restaurant.
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
              Established in 2025, we embarked on a mission to provide delicious and high-quality meals to our community. Over the years, we have built a loyal customer base and continue to innovate with our offerings. Our commitment to quality, service, and atmosphere is at the core of everything we do.
            </p>
            <p className="text-lg text-gray-600">
              We pride ourselves on using only the finest locally sourced ingredients and delivering a memorable dining experience. Join us today and be a part of our family.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
