import React from 'react';
import { Heart, Users, Share2, Mail, DollarSign, ArrowRight, Gift, HandHeart } from 'lucide-react';

const GetInvolved = () => {
  const waysToHelp = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Become a Member",
      description: "Support our mission by joining our community of advocates. Membership means standing with the children of Budi County and Lotukei sub-county in their right to learn, grow, and thrive.",
      action: "Join Our Community"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Make a Donation",
      description: "Your support can sponsor a classroom, support a teacher, provide supplies for students, or help build a new school. Every gift — large or small — makes a difference.",
      action: "Donate Now"
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Spread the Word",
      description: "Speak up for the children of South Sudan by sharing our mission with friends, family, religious or civic groups, and local representatives.",
      action: "Share Our Mission"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Volunteer",
      description: "We welcome volunteers with teaching, development, or administrative skills, as well as donated goods and services and assistance in organizing community events.",
      action: "Volunteer With Us"
    }
  ];

  const donationOptions = [
    {
      title: "Sponsor a Classroom",
      amount: "$5,000",
      description: "Help build a new classroom to provide education for 30-40 students."
    },
    {
      title: "Support a Teacher",
      amount: "$100/month",
      description: "Provide ongoing support for a dedicated teacher serving the community."
    },
    {
      title: "Student Supplies",
      amount: "$50",
      description: "Provide essential school supplies for multiple students."
    },
    {
      title: "General Support",
      amount: "Any Amount",
      description: "Your donation will be used where it's needed most."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h1>
            <p className="text-xl text-primary-100">
              Join our mission to empower children and communities through education in South Sudan.
            </p>
          </div>
        </div>
      </section>

      {/* Ways to Help */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How You Can Help</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              There are many ways to support our mission and make a lasting difference in the lives of children and communities in South Sudan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {waysToHelp.map((way, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-6">
                  {way.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{way.title}</h3>
                <p className="text-gray-600 mb-6">{way.description}</p>
                <button className="btn-primary">
                  {way.action}
                  <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Make a Donation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your support can transform lives. Choose how you'd like to make an impact, or contact us to discuss custom donation options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationOptions.map((option, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <div className="text-2xl font-bold text-primary-600 mb-3">{option.amount}</div>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <a 
                  href="mailto:donate@beetiharisociety.org" 
                  className="btn-primary text-sm"
                >
                  Donate Now
                </a>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-primary-600 text-white p-8 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Donation Inquiries</h3>
              <p className="mb-6">
                For donation-related inquiries, please contact us at:
              </p>
              <a 
                href="mailto:donate@beetiharisociety.org" 
                className="text-xl font-semibold hover:text-primary-200 transition-colors"
              >
                donate@beetiharisociety.org
              </a>
              <p className="mt-4 text-primary-100">
                Donations can be monthly, annual, or one-time pledges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Support Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Support Us</h2>
              <p className="text-lg text-gray-700 mb-6">
                Supporting the Beeti Hari Society for Education & Economic Development means investing in grassroots, community-led education that understands the unique challenges faced by rural families and students.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Programs developed by and for the communities we serve</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Comprehensive support for entire families</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Cultural sensitivity and respect for local values</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Long-term sustainable impact</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6">Our Commitment</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <HandHeart className="h-5 w-5 text-secondary-600" />
                  <span className="text-secondary-800">Universal primary education for marginalized children</span>
                </div>
                <div className="flex items-center space-x-3">
                  <HandHeart className="h-5 w-5 text-secondary-600" />
                  <span className="text-secondary-800">Literacy and learning for adult women</span>
                </div>
                <div className="flex items-center space-x-3">
                  <HandHeart className="h-5 w-5 text-secondary-600" />
                  <span className="text-secondary-800">Self-reliance and volunteerism as core values</span>
                </div>
                <div className="flex items-center space-x-3">
                  <HandHeart className="h-5 w-5 text-secondary-600" />
                  <span className="text-secondary-800">Financial education and microcredit access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <HandHeart className="h-5 w-5 text-secondary-600" />
                  <span className="text-secondary-800">Apprenticeship opportunities for boys and girls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spread the Word */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Spread the Word</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Help us raise awareness about the importance of education and the work we're doing in South Sudan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share with Friends & Family</h3>
              <p className="text-gray-600 mb-4">
                Tell your personal network about our mission and the impact education can have on communities.
              </p>
              <button className="btn-outline">Share Our Story</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Religious & Civic Groups</h3>
              <p className="text-gray-600 mb-4">
                Present our work to your church, mosque, temple, or community organization.
              </p>
              <button className="btn-outline">Request Materials</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Representatives</h3>
              <p className="text-gray-600 mb-4">
                Advocate for international education support with your local officials.
              </p>
              <button className="btn-outline">Get Advocacy Kit</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Involved?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you want to make a donation, volunteer your time, or simply learn more about our work, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contact@beetiharisociety.org" 
              className="btn-secondary text-lg px-8 py-4"
            >
              <Mail className="mr-2 h-5 w-5 inline" />
              Contact Us
            </a>
            <a 
              href="mailto:donate@beetiharisociety.org" 
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4"
            >
              <DollarSign className="mr-2 h-5 w-5 inline" />
              Make a Donation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
