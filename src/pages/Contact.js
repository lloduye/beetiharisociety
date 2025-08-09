import React, { useState } from 'react';
import { Mail, MapPin, Send, Globe } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    const mailtoLink = `mailto:contact@beetiharisociety.org?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "General Inquiries",
      email: "contact@beetiharisociety.org",
      description: "For general questions about our work, programs, or organization."
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Donations & Fundraising",
      email: "donate@beetiharisociety.org",
      description: "For donation-related inquiries, sponsorship opportunities, or fundraising partnerships."
    }
  ];

  const serviceAreas = [
    "Budi County",
    "Lotukei sub-county",
    "Didinga Hills region",
    "Southeastern South Sudan"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-primary-100">
              We welcome your interest, support, and collaboration. Get in touch with us today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you'd like to learn more about our work, partner with us on a project, make a donation, volunteer your time, or organize a fundraiser, we'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      {info.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                    <a 
                      href={`mailto:${info.email}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold text-lg block mb-2"
                    >
                      {info.email}
                    </a>
                    <p className="text-gray-600">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                >
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Service Areas */}
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Globe className="h-8 w-8 text-secondary-600" />
                  <h3 className="text-2xl font-bold text-secondary-900">Service Areas</h3>
                </div>
                <p className="text-secondary-800 mb-4">
                  We primarily serve the Didinga people in southeastern South Sudan:
                </p>
                <ul className="space-y-2">
                  {serviceAreas.map((area, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-secondary-600 rounded-full"></div>
                      <span className="text-secondary-800">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Contact */}
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">General Inquiries</p>
                      <a 
                        href="mailto:contact@beetiharisociety.org"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        contact@beetiharisociety.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Donations</p>
                      <a 
                        href="mailto:donate@beetiharisociety.org"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        donate@beetiharisociety.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Serving</p>
                      <p className="text-gray-900 font-medium">Budi County & Lotukei sub-county</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-primary-50 rounded-lg p-6">
                <h4 className="text-lg font-bold text-primary-900 mb-2">Response Time</h4>
                <p className="text-primary-800">
                  We typically respond to inquiries within 24-48 hours. For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join us in our mission to provide quality education and empower communities in South Sudan. Every connection, every donation, and every volunteer hour makes a lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:donate@beetiharisociety.org" 
              className="btn-secondary text-lg px-8 py-4"
            >
              Make a Donation
            </a>
            <a 
              href="mailto:contact@beetiharisociety.org" 
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
