import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart } from 'lucide-react';

const Mission = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Mission & Vision</h1>
            <p className="text-xl text-primary-100">
              Purpose-driven education that transforms lives and builds sustainable communities.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8 md:p-12 mb-12">
              <blockquote className="text-2xl md:text-3xl text-primary-900 italic font-medium text-center leading-relaxed">
                "To provide superior academic and life skills development to young people, to foster spiritual and moral excellence for present and future generations, and to instill a sense of life purpose and active community involvement, to achieve universal child education."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Excellence</h3>
                <p className="text-gray-600">
                  Providing superior academic development through quality education and learning resources.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Life Skills</h3>
                <p className="text-gray-600">
                  Developing practical skills that prepare students for meaningful livelihoods and community leadership.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Moral Excellence</h3>
                <p className="text-gray-600">
                  Fostering spiritual and moral development to build character and purpose-driven individuals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-6">
                <Eye className="h-8 w-8 text-secondary-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
            </div>
            
            <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-8 md:p-12 mb-12">
              <blockquote className="text-2xl md:text-3xl text-secondary-900 italic font-medium text-center leading-relaxed">
                "Purpose-driven education that contributes to the development of mental faculties, spiritual, and character—that fosters a socioeconomically sustainable lifestyle, which will propel individuals and communities from endemic poverty to prosperity and abundance."
              </blockquote>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Envision</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Nurtured Communities</h4>
                      <p className="text-gray-600">Children nurtured mentally, morally, and spiritually</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Self-Sufficiency</h4>
                      <p className="text-gray-600">Education that sparks self-sufficiency and independence</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Knowledge as Power</h4>
                      <p className="text-gray-600">Knowledge becomes the key to building strong societies</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sustainable Prosperity</h4>
                      <p className="text-gray-600">Communities moving from poverty to prosperity</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Approach</h3>
                <p className="text-gray-700 mb-6">
                  We believe that education is about more than textbooks — it's about transformation. When you give the gift of education, you create lasting change that ripples through families and communities.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">Holistic development approach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">Community-centered programs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">Cultural sensitivity and respect</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-primary-600" />
                    <span className="text-gray-700">Long-term sustainable impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Education Matters */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Education Matters</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Education is the foundation for breaking cycles of poverty and building brighter futures. Here's why our work is so crucial:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Meaningful Livelihoods</h3>
              <p className="text-gray-600">
                Education leads to participation in trades, skilled labor, and other productive work that provides sustainable income.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Empowering Girls</h3>
              <p className="text-gray-600">
                When girls understand their rights and future opportunities, they delay early marriage, avoid exploitation, and become leaders.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protecting the Environment</h3>
              <p className="text-gray-600">
                Educated children are more likely to conserve and respect their surroundings, leading to better environmental stewardship.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Building Safer Communities</h3>
              <p className="text-gray-600">
                Education helps prevent youth involvement in crime, addiction, and idleness, creating safer environments for everyone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Hope for the Future</h3>
              <p className="text-gray-600">
                When children learn, families and entire communities can begin to hope and plan for the future with confidence.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lasting Change</h3>
              <p className="text-gray-600">
                When you give the gift of education, you create lasting change that transforms generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg mb-5 max-w-3xl mx-auto">
            Help us achieve our mission of universal child education and community transformation. Your support makes a lasting difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/get-involved" className="btn-secondary text-lg px-8 py-4">
              Support Our Mission
            </Link>
            <Link to="/what-we-do" className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4">
              Learn About Our Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mission;
