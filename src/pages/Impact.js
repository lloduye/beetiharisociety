import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, Heart, Target, TrendingUp, Award } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';

const Impact = () => {
  const { openModal } = useDonation();
  const achievements = [
    {
      icon: <Building className="h-8 w-8" />,
      number: "5",
      label: "Classrooms built",
      description: "Using funds raised from bottle and can collection"
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "1,200+",
      label: "Students enrolled",
      description: "Across educational programs since 2010"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      number: "9",
      label: "Full-time teachers",
      description: "On South Sudanese government payroll"
    },
    {
      icon: <Target className="h-8 w-8" />,
      number: "11",
      label: "Volunteer teachers",
      description: "Ages 22–70 supporting Piobokoi Primary School"
    }
  ];

  const impactAreas = [
    {
      title: "Educational Infrastructure",
      description: "Building physical classrooms and learning spaces where none existed before.",
      impact: "5 classrooms constructed through grassroots fundraising efforts"
    },
    {
      title: "Student Enrollment",
      description: "Providing access to education for children who would otherwise be unable to attend school.",
      impact: "Over 1,200 students have been enrolled in our programs since 2010"
    },
    {
      title: "Teacher Development",
      description: "Supporting both paid and volunteer teachers to provide quality education.",
      impact: "20+ dedicated teachers serving communities, including 11 volunteers"
    },
    {
      title: "Community Advocacy",
      description: "Continuous advocacy for education access in remote areas.",
      impact: "Ongoing efforts to expand educational opportunities in rural South Sudan"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Impact</h1>
            <p className="text-xl text-primary-100">
              Since 2010, we've made substantial progress through community-driven action in South Sudan.
            </p>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Achievements</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Through grassroots fundraising and community support, we've achieved significant milestones in expanding educational access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {achievement.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {achievement.label}
                </h3>
                <p className="text-gray-600 text-sm">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Areas of Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our work touches multiple aspects of community development, creating lasting change in South Sudan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h3>
                    <p className="text-gray-600 mb-4">{area.description}</p>
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <p className="text-primary-800 font-medium">{area.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Stories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dedicated Teachers</h2>
              <p className="text-lg text-gray-700 mb-6">
                Our teachers are the backbone of our educational programs. We have <strong>9 full-time teachers</strong> engaged on the South Sudanese government payroll — often serving even during periods of delayed salaries (15–24 months).
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Additionally, we have <strong>11 volunteer teachers</strong> (ages 22–70) supporting Piobokoi Primary School in Lotukei sub-county, demonstrating incredible commitment to their communities.
              </p>
              <div className="bg-secondary-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-secondary-900 mb-3">Teacher Commitment</h3>
                <p className="text-secondary-800">
                  Despite challenges with delayed government salaries, our teachers continue to serve their communities, showing remarkable dedication to education.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-6">Why Support Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-900">Grassroots, Community-Led Education</h4>
                    <p className="text-primary-800 text-sm">Programs developed by and for the communities we serve</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-900">Comprehensive Family Support</h4>
                    <p className="text-primary-800 text-sm">Addressing educational and socio-economic needs of entire families</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-900">Sustainable Impact</h4>
                    <p className="text-primary-800 text-sm">Long-term community development through education</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary-900">Cultural Sensitivity</h4>
                    <p className="text-primary-800 text-sm">Honoring local values while building educational opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking Forward</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our vision extends beyond current achievements. We're working toward even greater impact in the coming years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expanded Access</h3>
              <p className="text-gray-600">
                Building more classrooms to serve 5,000–7,000 students in the next 5–10 years.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Growth</h3>
              <p className="text-gray-600">
                Expanding our holistic development programs to reach more families and communities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Enhancement</h3>
              <p className="text-gray-600">
                Improving educational quality and expanding teacher training programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Support Our Impact</h2>
          <p className="text-lg mb-5 max-w-3xl mx-auto">
            Your support helps us continue building classrooms, training teachers, and expanding educational opportunities for children in South Sudan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={openModal} className="btn-secondary text-lg px-8 py-4">
              Make a Donation
            </button>
            <Link to="/what-we-do" className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4">
              Learn About Our Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
