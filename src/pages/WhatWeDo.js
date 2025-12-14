import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Heart, Target, ArrowRight, Building, GraduationCap } from 'lucide-react';
import { useZeffy } from '../contexts/ZeffyContext';

const WhatWeDo = () => {
  const { openModal } = useZeffy();
  const programs = [
    {
      icon: <Building className="h-8 w-8" />,
      title: "Expanding Educational Access",
      description: "Building classrooms and high schools near communities so young people can continue their education without traveling long distances.",
      details: [
        "Focus on building local high schools",
        "Reducing travel barriers for students",
        "Especially supporting girls' education",
        "Targeting 5,000–7,000 students in 5–10 years"
      ]
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Nurturing Learning Environments",
      description: "Creating community-supported, spiritually grounded, and emotionally safe learning environments.",
      details: [
        "Community-supported education",
        "Spiritually grounded learning",
        "Emotionally safe environments",
        "Recognition of talents and values"
      ]
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Holistic Development Initiatives",
      description: "Providing comprehensive support services beyond education to empower entire families and communities.",
      details: [
        "Basic healthcare support",
        "Socioeconomic development",
        "Microcredit and financial literacy",
        "Parental and adult education",
        "Environmental awareness"
      ]
    }
  ];

  const initiatives = [
    {
      title: "Universal Primary Education",
      description: "Ensuring marginalized children have access to quality primary education."
    },
    {
      title: "Adult Literacy Programs",
      description: "Providing literacy and learning opportunities for adult women and community members."
    },
    {
      title: "Financial Education",
      description: "Offering microcredit access and financial literacy training for families."
    },
    {
      title: "Apprenticeship Opportunities",
      description: "Creating skill development and apprenticeship programs for boys and girls."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h1>
            <p className="text-xl text-primary-100">
              Building the future, classroom by classroom, to create lasting change in South Sudan.
            </p>
          </div>
        </div>
      </section>

      {/* Main Programs */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Programs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We take a comprehensive approach to community development, focusing on education while addressing the broader needs of families and communities.
            </p>
          </div>

          <div className="space-y-12">
            {programs.map((program, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="text-primary-600 mb-6">
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h3>
                  <p className="text-lg text-gray-700 mb-6">{program.description}</p>
                  <ul className="space-y-3">
                    {program.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
                      {program.icon}
                    </div>
                    <h4 className="text-xl font-bold text-primary-900 mb-4">{program.title}</h4>
                    <p className="text-primary-800">{program.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Access Focus */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Expanding Educational Access</h2>
              <p className="text-lg text-gray-700 mb-6">
                Many children in rural South Sudan end their education at Grade 6 due to a lack of local resources. Our primary focus is to build classrooms and high schools near these communities so that young people — especially girls — can continue their education without having to travel long distances or cross borders.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We are building the future, literally — classroom by classroom — so that over <strong>5,000–7,000 students</strong> will have access to education in the next 5–10 years.
              </p>
              <div className="bg-primary-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Our Goal</h3>
                <p>To ensure every child in our service areas has access to quality education within their community.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The Challenge</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Limited Access</h4>
                    <p className="text-gray-600">Many children end education at Grade 6</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Distance Barriers</h4>
                    <p className="text-gray-600">Long travel distances to existing schools</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gender Disparity</h4>
                    <p className="text-gray-600">Girls face additional barriers to education</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Resource Scarcity</h4>
                    <p className="text-gray-600">Lack of local educational infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Holistic Development */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Holistic Development Initiatives</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beyond education, our programs provide vital services that ensure families and entire communities are empowered alongside their children.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {initiatives.map((initiative, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{initiative.title}</h3>
                <p className="text-gray-600">{initiative.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Approach */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Community Approach</h3>
              <p className="text-gray-700 mb-6">
                We believe learning must be community-supported, spiritually grounded, and emotionally safe. Our schools provide students with an environment where they can grow intellectually and personally, and where their talents and values are recognized.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-secondary-600" />
                  <span className="text-gray-700">Community-supported learning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-secondary-600" />
                  <span className="text-gray-700">Spiritually grounded education</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-secondary-600" />
                  <span className="text-gray-700">Emotionally safe environments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-secondary-600" />
                  <span className="text-gray-700">Recognition of individual talents</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Comprehensive Support for Families</h2>
              <p className="text-lg text-gray-700 mb-6">
                We promote universal primary education for marginalized children, literacy and learning for adult women, self-reliance and volunteerism as core development values, financial education and microcredit access for families, and apprenticeship opportunities for boys and girls.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We take a holistic approach, addressing the educational and socio-economic needs of entire families.
              </p>
              <Link to="/impact" className="btn-primary">
                See Our Impact
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Support Our Work</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your support helps us build classrooms, train teachers, and provide comprehensive education and development programs to communities in South Sudan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openModal} className="btn-secondary text-lg px-8 py-4">
              Make a Donation
            </button>
            <Link to="/contact" className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4">
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;
