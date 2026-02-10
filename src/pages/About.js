import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Target, ArrowRight, X, User, Mail } from 'lucide-react';
import { usersService } from '../services/usersService';

const boardMembers = [
    {
      name: 'Alex Atiol',
      role: 'Chairman',
      email: 'alex.atiol@betiharisociety.org',
      roleDescription: 'Leads the Board and ensures the organization stays true to its mission and governance.',
      bio: 'Alex Atiol brings leadership and vision to the Beti-Hari Society, guiding strategic direction and governance. His commitment to education and community development in South Sudan has been central to the organization\'s growth and impact in Lotukei sub-county.',
      image: null,
    },
    {
      name: 'Charles Lokonyen',
      role: 'Treasurer',
      email: 'c.lokonyen@betiharisociety.org',
      roleDescription: 'Oversees financial oversight, budgeting, and transparency for the organization.',
      bio: 'Charles Lokonyen ensures the Society\'s resources are managed with integrity and accountability. His financial stewardship supports sustainable programs and helps donors trust that their contributions directly serve education and development in South Sudan.',
      image: null,
    },
    {
      name: 'Angelo Gola',
      role: 'Director (South Sudan)',
      email: 'a.gola@betiharisociety.org',
      roleDescription: 'Represents the organization on the ground and connects board decisions with community realities.',
      bio: 'Angelo Gola brings essential on-the-ground perspective from South Sudan, linking the Board with the Didinga communities we serve. His local knowledge and field experience help shape programs that truly meet the needs of students and families in Lotukei.',
      image: null,
    },
    {
      name: 'Lino Lokonobei',
      role: 'Director (USA)',
      email: 'l.lokonobei@betiharisociety.org',
      roleDescription: 'Bridges diaspora engagement and US-based advocacy and fundraising.',
      bio: 'Lino Lokonobei strengthens ties between the Beti-Hari Society and supporters in the United States, advancing advocacy and community engagement. His work helps amplify the mission and connect resources to education and development in South Sudan.',
      image: null,
    },
    {
      name: 'Amedeo Awai Martin',
      role: 'Director',
      email: 'a.martin@betiharisociety.org',
      roleDescription: 'Supports governance, strategy, and organizational development.',
      bio: 'Amedeo Awai Martin contributes to the Board\'s strategic and governance work, drawing on experience in community development and education. His involvement supports the long-term sustainability and impact of the Society\'s programs.',
      image: null,
    },
    {
      name: 'Albert Lonyia',
      role: 'Director',
      email: 'a.lonyia@betiharisociety.org',
      roleDescription: 'Supports governance, strategy, and organizational development.',
      bio: 'Albert Lonyia serves as Director, bringing expertise and commitment to the Beti-Hari Society\'s mission. His contributions help ensure effective governance and alignment with the goal of universal child education in South Sudan.',
      image: null,
    },
    {
      name: 'Joseph Nachungura',
      role: 'Director',
      email: 'j.nachungura@betiharisociety.org',
      roleDescription: 'Supports governance, strategy, and organizational development.',
      bio: 'Joseph Nachungura is a dedicated Director who supports the Board in advancing education and economic development. His perspective and commitment help the organization stay focused on serving the Didinga community with integrity and impact.',
      image: null,
    },
    {
      name: 'Paul Atanya',
      role: 'Director / Project Officer',
      email: 'p.atanya@betiharisociety.org',
      roleDescription: 'Combines board governance with day-to-day project coordination and field implementation.',
      bio: 'Paul Atanya serves both as Director and Project Officer, linking board strategy with program delivery. His dual role helps ensure that decisions made at the board level are effectively translated into action in Lotukei and beyond.',
      image: null,
    },
  ];

const About = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [leadership, setLeadership] = useState(boardMembers);

  // Load live leadership info from user profiles once on mount.
  // boardMembers is a static constant defined outside the component, so we intentionally
  // do not include it in the dependency array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const profiles = await usersService.getTeamProfiles();
        if (!profiles || profiles.length === 0) {
          setLeadership(boardMembers);
          return;
        }

        const updated = boardMembers.map((member) => {
          const match = profiles.find(
            (p) => p.email && p.email.toLowerCase() === member.email.toLowerCase()
          );
          if (!match) return member;

          const nameFromProfile = `${match.firstName || ''} ${match.lastName || ''}`.trim();

          return {
            ...member,
            name: nameFromProfile || member.name,
            role: match.position || member.role,
            bio: match.bio || member.bio,
            image: match.profileImageUrl || member.image,
          };
        });

        setLeadership(updated);
      } catch (err) {
        console.error('Failed to load leadership profiles from user accounts:', err);
        // Fallback to static data on error
        setLeadership(boardMembers);
      }
    };

    loadProfiles();
  }, []);

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
            <p className="text-sm text-gray-500 mt-2">Click a profile to view full information.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((member, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedMember(member)}
                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg hover:ring-2 hover:ring-primary-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium text-sm">{member.role}</p>
                <span className="text-xs text-gray-500 mt-2 inline-block">Learn more</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership profile modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelectedMember(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex-shrink-0 flex items-center justify-center">
                    {selectedMember.image ? (
                      <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-primary-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 id="profile-title" className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                    <p className="text-primary-600 font-semibold">{selectedMember.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 flex-shrink-0"
                  aria-label="Close profile"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {selectedMember.bio && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">About</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedMember.bio}</p>
                </div>
              )}
              {selectedMember.email && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact</h3>
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    {selectedMember.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Support our mission by joining our community of advocates. Stand with the Didinga children in Lotukei sub-county in their right to learn, grow, and thrive.
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
