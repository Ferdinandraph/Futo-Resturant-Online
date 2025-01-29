import React, { useState } from "react";
import MessageModal from '../components/MessageModal'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // You can add your API call here to submit the contact form data
    // For now, we will simulate a successful form submission
    setTimeout(() => {
      alert("Message sent successfully!");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="bg-gray-50 py-16">
    {/**message modal */}
    {message && (
        <MessageModal message={message} onClose={() => setMessage("")} />
      )}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Contact Us</h2>
          <p className="text-lg text-gray-500 mt-4">
            We'd love to hear from you! Fill out the form below, and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Form Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 mt-2 border border-gray-300 rounded-lg"
                  rows="5"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className={`${
                  isSubmitting ? "bg-gray-400" : "bg-blue-600"
                } text-white px-8 py-3 rounded-lg w-full transition duration-300 hover:bg-blue-700`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Right Location Info */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">
              Visit Us
            </h3>
            <p className="text-lg text-gray-600 mb-4">
              You can reach out to us
            </p>
            <div className="flex items-center mb-6">
              <i className="fas fa-map-marker-alt text-blue-500 text-3xl mr-4"></i>
              <span className="text-lg text-gray-700">
                Futo eziobodo
              </span>
            </div>

            <div className="flex items-center">
              <i className="fas fa-phone-alt text-blue-500 text-3xl mr-4"></i>
              <span className="text-lg text-gray-700">09079406341</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
