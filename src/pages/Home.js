import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Heart, Target, ArrowRight } from 'lucide-react';

const Home = () => {
  const highlights = [
    {
      icon: <Users className="h-8 w-8" />,
      number: "1,200+",
      label: "Students enrolled since 2010"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      number: "5",
      label: "Classrooms built through grassroots fundraising"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      number: "20+",
      label: "Dedicated teachers, including 11 volunteers"
    },
    {
      icon: <Target className="h-8 w-8" />,
      number: "2",
      label: "Active service areas: Budi County and Lotukei sub-county"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Beti-Hari Society for Education & Economic Development
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Empowering Young People. Strengthening Communities. Transforming South Sudan Through Education.
            </p>
            <p className="text-lg mb-12 text-primary-200 max-w-3xl mx-auto">
              We believe education is the most powerful tool for breaking the cycle of poverty and building a brighter, more sustainable future for children and communities in South Sudan.
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/get-involved" className="btn-secondary text-lg px-8 py-4">
                Donate Now
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
              <Link to="/about" className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {highlight.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {highlight.number}
                </div>
                <p className="text-gray-600">
                  {highlight.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <blockquote className="text-xl text-gray-700 italic mb-6 border-l-4 border-primary-600 pl-6">
                "To provide superior academic and life skills development to young people, to foster spiritual and moral excellence for present and future generations, and to instill a sense of life purpose and active community involvement, to achieve universal child education."
              </blockquote>
              <p className="text-gray-600 mb-8">
                We envision communities where children are nurtured mentally, morally, and spiritually; where education sparks self-sufficiency; and where knowledge becomes the key to building strong and vibrant societies.
              </p>
              <Link to="/mission" className="btn-primary">
                Learn About Our Mission
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Why Education Matters</h3>
              <ul className="space-y-3 text-primary-800">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Meaningful livelihoods through trades and skilled labor</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Empowering girls to understand their rights and opportunities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Protecting the environment through conservation awareness</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Building safer communities and preventing youth involvement in crime</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Creating hope for the future in families and communities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your support can make a lasting difference in the lives of children and communities in South Sudan. Every donation, no matter the size, helps us build a brighter future through education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-secondary text-lg px-8 py-4">
              Make a Donation
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

export default Home;
