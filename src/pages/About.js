import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Target, ArrowRight } from 'lucide-react';

const About = () => {
  const boardMembers = [
    { name: 'Alex Atiol', role: 'Chairman' },
    { name: 'Charles Lokonyen', role: 'Treasurer' },
    { name: 'Angelo Gola', role: 'Director (South Sudan)' },
    { name: 'Lino Lokonobei', role: 'Director (USA)' },
    { name: 'Amedeo Awai Martin', role: 'Director' },
    { name: 'Albert Lonyia', role: 'Director' },
    { name: 'Joseph Nachungura', role: 'Director' },
    { name: 'Paul Atanya', role: 'Director / Project Officer' },
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Purpose',
      description: 'We are driven by a clear sense of purpose to serve and empower communities through education.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Service',
      description: 'We believe in selfless service to others, putting the needs of children and communities first.'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Empowerment',
      description: 'We work to empower individuals and communities to become self-reliant and sustainable.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-primary-100">
              Building access to quality education, life skills, and essential community support services in rural South Sudan.
            </p>
          </div>
        </div>
      </section>

      {/* Organization Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Organization</h2>
              <p className="text-lg text-gray-700 mb-6">
                Beti-Hari Society for Education & Economic Development is a grassroots nonprofit organization dedicated to building access to quality education, life skills, and essential community support services in rural South Sudan.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Founded on values of purpose, service, and empowerment, we are working to uplift entire communities by starting where it matters most — in the classroom.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our belief is simple yet powerful: when children are given access to nurturing, high-quality education, they can overcome poverty, realize their potential, and lead others toward a future of hope and prosperity.
              </p>
              <Link to="/mission" className="btn-primary">
                Learn About Our Mission
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">Our Commitment</h3>
              <p className="text-primary-800 mb-6">
                We are committed to grassroots development that promotes dignity, self-reliance, and long-term sustainability.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-primary-800">Community-driven development</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-primary-800">Cultural sensitivity and respect</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-primary-800">Sustainable impact</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-primary-800">Transparency and accountability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape our approach to community development and education.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The People We Serve */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">The Didinga of South Sudan</h3>
              <p className="text-secondary-800 mb-6">
                We work primarily in partnership with the <strong>Didinga people</strong>, an ethnic group of 160,000–200,000 living in the Didinga Hills and surrounding lowlands of southeastern South Sudan.
              </p>
              <div className="space-y-3 text-secondary-800">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Pastoralists and farmers</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Culturally rich and deeply connected to the land</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Highly valuing cattle — not as food, but as dowry and wealth</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Limited in access to basic services and education</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">The People We Serve</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our commitment is to honor their values while working with them to build a future filled with opportunity through education and development.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We understand the unique challenges faced by rural families and students, and we develop our programs by and for the communities we serve.
              </p>
              <Link to="/what-we-do" className="btn-primary">
                Learn About Our Programs
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The organization is governed by a committed Board of Directors representing both South Sudan and the diaspora, bringing together deep cultural knowledge, field experience, and a shared passion for justice, education, and development.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Support our mission by joining our community of advocates. Stand with the children of Budi County and Lotukei sub-county in their right to learn, grow, and thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-secondary text-lg px-8 py-4">
              Get Involved
            </Link>
            <Link to="/contact" className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
