import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Users, Share2, Mail, DollarSign, ArrowRight, Gift, HandHeart, X, CheckCircle, ExternalLink, TrendingUp, Target } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';

const GetInvolved = () => {
  const { openModal, openMembership, openDonationWithAmount } = useDonation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMembershipThankYou, setShowMembershipThankYou] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    donationAmount: '',
    donationType: '',
    donationProject: '',
    donationFrequency: '',
    membershipType: '',
    volunteerSkills: [],
    volunteerAvailability: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stripeDonations, setStripeDonations] = useState({ recentDonations: [], topDonors: [], loading: true, error: null });

  const waysToHelp = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Become a Member",
      description: "Support our mission by joining our community of advocates. Membership means standing with the Didinga children in Lotukei sub-county in their right to learn, grow, and thrive.",
      action: "Join Our Community",
      actionType: "membership"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Make a Donation",
      description: "Your support can sponsor a classroom, support a teacher, provide supplies for students, or help build a new school. Every gift — large or small — makes a difference.",
      action: "Donate Now",
      actionType: "donation"
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Spread the Word",
      description: "Speak up for the children of South Sudan by sharing our mission with friends, family, religious or civic groups, and local representatives.",
      action: "Share Our Mission",
      actionType: "share"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Volunteer",
      description: "We welcome volunteers with teaching, development, or administrative skills, as well as donated goods and services and assistance in organizing community events.",
      action: "Volunteer With Us",
      actionType: "volunteer"
    }
  ];

  const donationOptions = [
    {
      title: "Sponsor a Classroom",
      amount: "$10,000",
      amountCents: 1000000,
      description: "Help build a new classroom to provide education for 30-40 students.",
      project: "Classroom Construction"
    },
    {
      title: "Support a Teacher",
      amount: "$25",
      amountCents: 2500,
      description: "Provide ongoing support for a dedicated teacher serving the community.",
      project: "Teacher Support"
    },
    {
      title: "Student Supplies",
      amount: "$50",
      amountCents: 5000,
      description: "Provide essential school supplies for multiple students.",
      project: "Student Supplies"
    },
    {
      title: "General Support",
      amount: "Any Amount",
      amountCents: null,
      description: "Your donation will be used where it's needed most.",
      project: "General Fund"
    }
  ];

  const fetchStripeDonations = useCallback(async () => {
    try {
      const res = await fetch('/.netlify/functions/get-donations');
      const data = await res.json();
      setStripeDonations((prev) => ({
        ...prev,
        recentDonations: data.recentDonations || [],
        topDonors: data.topDonors || [],
        loading: false,
        error: data.error || null,
      }));
    } catch (err) {
      setStripeDonations((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Could not load donations',
      }));
    }
  }, []);

  useEffect(() => {
    fetchStripeDonations();
    const interval = setInterval(fetchStripeDonations, 60000);
    return () => clearInterval(interval);
  }, [fetchStripeDonations]);

  useEffect(() => {
    if (searchParams.get('membership') === 'success') {
      setShowMembershipThankYou(true);
      setSearchParams({}, { replace: true });
      const t = setTimeout(() => setShowMembershipThankYou(false), 8000);
      return () => clearTimeout(t);
    }
  }, [searchParams, setSearchParams]);

  const volunteerSkills = [
    'Teaching', 'Administration', 'Fundraising', 'Event Planning', 
    'Social Media', 'Graphic Design', 'Translation', 'Medical Services',
    'Construction', 'Transportation', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVolunteerSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      volunteerSkills: prev.volunteerSkills.includes(skill)
        ? prev.volunteerSkills.filter(s => s !== skill)
        : [...prev.volunteerSkills, skill]
    }));
  };

  const handleActionClick = (actionType) => {
    if (actionType === 'donation') {
      openModal();
      return;
    }
    if (actionType === 'membership') {
      openMembership();
      return;
    }
    setActiveModal(actionType);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      donationAmount: '',
      donationType: '',
      donationProject: '',
      donationFrequency: '',
      membershipType: '',
      volunteerSkills: [],
      volunteerAvailability: ''
    });
  };

  const handleDonationClick = async (option) => {
    if (option.amountCents) {
      await openDonationWithAmount(option.amountCents);
    } else {
      openModal();
    }
  };

  const handleSubmit = (type) => {
    if (type === 'membership') return; // Membership is handled by Stripe; no form submit
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveModal(null);
      console.log('Form submitted:', { type, formData });
    }, 2000);
  };

  const handleShare = async (type) => {
    const shareData = {
      'Share Our Mission': {
        title: 'Beti-Hari Society for Education & Economic Development',
        text: 'Supporting education and economic development in South Sudan. Join our mission to empower children and communities.',
        url: window.location.origin
      },
      'Share Our Story': {
        title: 'Beti-Hari Society - Our Story',
        text: 'Learn about our mission to empower children and communities through education in South Sudan.',
        url: `${window.location.origin}/about`
      }
    };

    const data = shareData[type];
    
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${data.text} ${data.url}`;
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleSpreadWordClick = (action) => {
    switch (action) {
      case 'Share Our Story':
        handleShare('Share Our Story');
        break;
      case 'Request Materials':
        setActiveModal('materials');
        break;
      case 'Get Advocacy Kit':
        setActiveModal('advocacy');
        break;
      default:
        break;
    }
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Get Involved</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const VolunteerForm = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">We welcome volunteers with various skills. Tell us how you'd like to help.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Interests</label>
        <div className="grid grid-cols-2 gap-2">
          {volunteerSkills.map((skill) => (
            <label key={skill} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.volunteerSkills.includes(skill)}
                onChange={() => handleVolunteerSkillToggle(skill)}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
        <select
          value={formData.volunteerAvailability}
          onChange={(e) => handleInputChange('volunteerAvailability', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Select availability</option>
          <option value="weekdays">Weekdays</option>
          <option value="weekends">Weekends</option>
          <option value="evenings">Evenings</option>
          <option value="flexible">Flexible</option>
          <option value="remote">Remote/Online</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us more about your interest in volunteering..."
        />
      </div>

      <button
        onClick={() => handleSubmit('volunteer')}
        disabled={!formData.name || !formData.email}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Volunteer Application
      </button>
    </div>
  );

  const MaterialsForm = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Request materials to present our work to your religious or civic group.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
        <input
          type="text"
          value={formData.organization}
          onChange={(e) => handleInputChange('organization', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Your church, mosque, temple, or community organization"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Materials Needed</label>
        <div className="space-y-2">
          {['Brochures', 'Presentation Slides', 'Videos', 'Fact Sheets', 'Donation Forms'].map((material) => (
            <label key={material} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.materials?.includes(material) || false}
                onChange={(e) => {
                  const current = formData.materials || [];
                  const updated = e.target.checked 
                    ? [...current, material]
                    : current.filter(m => m !== material);
                  handleInputChange('materials', updated);
                }}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{material}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us about your event or presentation..."
        />
      </div>

      <button
        onClick={() => handleSubmit('materials')}
        disabled={!formData.name || !formData.email}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Request Materials
      </button>
    </div>
  );

  const AdvocacyForm = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Get advocacy materials to help you advocate for international education support.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="City, State/Province, Country"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Advocacy Materials Needed</label>
        <div className="space-y-2">
          {['Talking Points', 'Fact Sheets', 'Sample Letters', 'Social Media Graphics', 'Contact Information'].map((material) => (
            <label key={material} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.advocacyMaterials?.includes(material) || false}
                onChange={(e) => {
                  const current = formData.advocacyMaterials || [];
                  const updated = e.target.checked 
                    ? [...current, material]
                    : current.filter(m => m !== material);
                  handleInputChange('advocacyMaterials', updated);
                }}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{material}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us about your advocacy plans..."
        />
      </div>

      <button
        onClick={() => handleSubmit('advocacy')}
        disabled={!formData.name || !formData.email}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Request Advocacy Kit
      </button>
    </div>
  );

  const SuccessMessage = () => (
    <div className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
      <p className="text-gray-600 mb-4">
        Your submission has been received. We'll get back to you within 24 hours.
      </p>
      <button
        onClick={() => setActiveModal(null)}
        className="btn-primary"
      >
        Close
      </button>
    </div>
  );

  const ShareModal = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Share our mission with your network and help spread awareness about education in South Sudan.</p>
      
      <div className="space-y-3">
        <button
          onClick={() => handleShare('Share Our Mission')}
          className="w-full flex items-center justify-center space-x-2 btn-primary"
        >
          <Share2 className="h-5 w-5" />
          <span>Share Our Mission</span>
        </button>
        
        <button
          onClick={() => handleShare('Share Our Story')}
          className="w-full flex items-center justify-center space-x-2 btn-outline"
        >
          <ExternalLink className="h-5 w-5" />
          <span>Share Our Story</span>
        </button>
      </div>

      {copied && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700 text-sm">Link copied to clipboard!</span>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="font-medium text-blue-900 mb-2">Other Ways to Share:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tell friends and family about our work</li>
          <li>• Share on social media platforms</li>
          <li>• Present to your community groups</li>
          <li>• Contact your local representatives</li>
        </ul>
      </div>
    </div>
  );

  const renderModalContent = () => {
    if (showSuccess) {
      return <SuccessMessage />;
    }

    switch (activeModal) {
      case 'volunteer':
        return <VolunteerForm />;
      case 'share':
        return <ShareModal />;
      case 'materials':
        return <MaterialsForm />;
      case 'advocacy':
        return <AdvocacyForm />;
      default:
        return null;
    }
  };

  return (
    <div>
      {showMembershipThankYou && (
        <div className="bg-green-600 text-white text-center py-3 px-4 flex items-center justify-center gap-2 flex-wrap">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>Thank you for becoming a member! Your receipt has been sent by email from Stripe.</span>
        </div>
      )}
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
                <button 
                  className="btn-primary cursor-pointer"
                  onClick={() => handleActionClick(way.actionType)}
                >
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
                <button 
                  className="btn-primary text-sm cursor-pointer"
                  onClick={() => handleDonationClick(option)}
                >
                  Donate Now
                </button>
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
                href="mailto:donate@betiharisociety.org" 
                className="text-xl font-semibold hover:text-primary-200 transition-colors"
              >
                donate@betiharisociety.org
              </a>
              <p className="mt-4 text-primary-100">
                Donations can be monthly, annual, or one-time pledges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Donors & Recent Donations */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Donation Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Thank you to our supporters. We are grateful to our top donors and pleased to share recent donations that are helping empower education in South Sudan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Recent Donations
              </h3>
              {stripeDonations.loading ? (
                <p className="text-gray-500 py-4">Loading…</p>
              ) : stripeDonations.error ? (
                <p className="text-gray-500 py-4">{stripeDonations.error}</p>
              ) : stripeDonations.recentDonations.length === 0 ? (
                <p className="text-gray-500 py-4">No donations yet. Be the first!</p>
              ) : (
                <div className="space-y-3">
                  {stripeDonations.recentDonations.slice(0, 10).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{d.name}</div>
                          <div className="text-xs text-gray-500">{d.time}</div>
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        ${typeof d.amount === 'number' ? d.amount.toLocaleString() : d.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary-600" />
                Top Donors
              </h3>
              {stripeDonations.loading ? (
                <p className="text-gray-500 py-4">Loading…</p>
              ) : stripeDonations.error ? (
                <p className="text-gray-500 py-4">{stripeDonations.error}</p>
              ) : stripeDonations.topDonors.length === 0 ? (
                <p className="text-gray-500 py-4">No donor data yet.</p>
              ) : (
                <div className="space-y-3">
                  {stripeDonations.topDonors.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-primary-600 w-6">{i + 1}</span>
                        <div>
                          <div className="font-medium text-gray-900">{d.name}</div>
                          <div className="text-xs text-gray-500">{d.count} donation{d.count !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        ${typeof d.total === 'number' ? d.total.toLocaleString() : d.total}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={openModal}
              className="btn-primary text-lg px-8 py-4"
            >
              <Target className="mr-2 h-5 w-5 inline" />
              Make a Donation
            </button>
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
                Supporting the Beti-Hari Society for Education & Economic Development means investing in grassroots, community-led education that understands the unique challenges faced by rural families and students.
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
              <button 
                className="btn-outline cursor-pointer"
                onClick={() => handleSpreadWordClick('Share Our Story')}
              >
                Share Our Story
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Religious & Civic Groups</h3>
              <p className="text-gray-600 mb-4">
                Present our work to your church, mosque, temple, or community organization.
              </p>
              <button 
                className="btn-outline cursor-pointer"
                onClick={() => handleSpreadWordClick('Request Materials')}
              >
                Request Materials
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Representatives</h3>
              <p className="text-gray-600 mb-4">
                Advocate for international education support with your local officials.
              </p>
              <button 
                className="btn-outline cursor-pointer"
                onClick={() => handleSpreadWordClick('Get Advocacy Kit')}
              >
                Get Advocacy Kit
              </button>
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
              href="mailto:contact@betiharisociety.org" 
              className="btn-secondary text-lg px-8 py-4"
            >
              <Mail className="mr-2 h-5 w-5 inline" />
              Contact Us
            </a>
            <button 
              onClick={openModal}
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4"
            >
              <DollarSign className="mr-2 h-5 w-5 inline" />
              Make a Donation
            </button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default GetInvolved;
