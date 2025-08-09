import React, { useState, useEffect } from 'react';
import { Heart, Users, Share2, Mail, DollarSign, ArrowRight, Gift, HandHeart, X, CheckCircle, ExternalLink, Copy, TrendingUp, Users as UsersIcon, Target } from 'lucide-react';

const GetInvolved = () => {
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
  const [recentDonations, setRecentDonations] = useState([]);
  const [showDonationPopup, setShowDonationPopup] = useState(false);

  const waysToHelp = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Become a Member",
      description: "Support our mission by joining our community of advocates. Membership means standing with the children of Budi County and Lotukei sub-county in their right to learn, grow, and thrive.",
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
      amount: "$5,000",
      description: "Help build a new classroom to provide education for 30-40 students.",
      project: "Classroom Construction"
    },
    {
      title: "Support a Teacher",
      amount: "$100/month",
      description: "Provide ongoing support for a dedicated teacher serving the community.",
      project: "Teacher Support"
    },
    {
      title: "Student Supplies",
      amount: "$50",
      description: "Provide essential school supplies for multiple students.",
      project: "Student Supplies"
    },
    {
      title: "General Support",
      amount: "Any Amount",
      description: "Your donation will be used where it's needed most.",
      project: "General Fund"
    }
  ];

  const donationProjects = [
    { 
      id: 'classroom', 
      name: 'Classroom Construction', 
      description: 'Build new classrooms for 30-40 students each',
      target: 50000,
      raised: 32450,
      donors: 127,
      image: '🏫'
    },
    { 
      id: 'teacher', 
      name: 'Teacher Support', 
      description: 'Provide ongoing support for dedicated teachers',
      target: 12000,
      raised: 8900,
      donors: 89,
      image: '👨‍🏫'
    },
    { 
      id: 'supplies', 
      name: 'Student Supplies', 
      description: 'Provide essential school supplies and materials',
      target: 8000,
      raised: 5670,
      donors: 234,
      image: '📚'
    },
    { 
      id: 'library', 
      name: 'School Library', 
      description: 'Establish and maintain school libraries',
      target: 15000,
      raised: 12340,
      donors: 156,
      image: '📖'
    },
    { 
      id: 'water', 
      name: 'Clean Water Access', 
      description: 'Provide clean drinking water to schools',
      target: 25000,
      raised: 18900,
      donors: 203,
      image: '💧'
    },
    { 
      id: 'nutrition', 
      name: 'School Nutrition', 
      description: 'Provide meals and nutrition programs',
      target: 18000,
      raised: 14560,
      donors: 178,
      image: '🍎'
    },
    { 
      id: 'technology', 
      name: 'Technology Access', 
      description: 'Provide computers and educational technology',
      target: 30000,
      raised: 22340,
      donors: 145,
      image: '💻'
    },
    { 
      id: 'transportation', 
      name: 'Student Transportation', 
      description: 'Help students get to and from school safely',
      target: 12000,
      raised: 8900,
      donors: 112,
      image: '🚌'
    },
    { 
      id: 'general', 
      name: 'General Fund', 
      description: 'Support where it\'s needed most',
      target: 50000,
      raised: 45670,
      donors: 445,
      image: '🤝'
    }
  ];

  // Simulate recent donations
  useEffect(() => {
    const mockRecentDonations = [
      { name: "Sarah M.", amount: 100, project: "Student Supplies", time: "2 minutes ago" },
      { name: "Michael R.", amount: 500, project: "Teacher Support", time: "5 minutes ago" },
      { name: "Anonymous", amount: 250, project: "Clean Water Access", time: "8 minutes ago" },
      { name: "Jennifer L.", amount: 75, project: "School Nutrition", time: "12 minutes ago" },
      { name: "David K.", amount: 1000, project: "Classroom Construction", time: "15 minutes ago" }
    ];
    setRecentDonations(mockRecentDonations);

    // Simulate new donations every 30 seconds
    const interval = setInterval(() => {
      const newDonation = {
        name: ["Alex", "Maria", "John", "Lisa", "Robert", "Emma", "James", "Anna"][Math.floor(Math.random() * 8)] + ".",
        amount: [25, 50, 75, 100, 150, 200, 250, 500][Math.floor(Math.random() * 8)],
        project: donationProjects[Math.floor(Math.random() * donationProjects.length)].name,
        time: "Just now"
      };
      setRecentDonations(prev => [newDonation, ...prev.slice(0, 4)]);
      setShowDonationPopup(true);
      setTimeout(() => setShowDonationPopup(false), 4000);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const membershipTypes = [
    { id: 'individual', label: 'Individual Member', price: '$25/year' },
    { id: 'family', label: 'Family Membership', price: '$50/year' },
    { id: 'student', label: 'Student Member', price: '$10/year' },
    { id: 'corporate', label: 'Corporate Partner', price: '$500/year' }
  ];

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

  const handleDonationClick = (option) => {
    setActiveModal('donation');
    setFormData(prev => ({
      ...prev,
      donationType: option.title,
      donationAmount: option.amount === 'Any Amount' ? '' : option.amount,
      donationProject: option.project
    }));
  };

  const handleSubmit = (type) => {
    // Simulate form submission
    setShowSuccess(true);
    
    // Add to recent donations if it's a donation
    if (type === 'donation') {
      const newDonation = {
        name: formData.name.split(' ')[0] + ".",
        amount: parseInt(formData.donationAmount.replace(/[^0-9]/g, '')),
        project: formData.donationProject,
        time: "Just now"
      };
      setRecentDonations(prev => [newDonation, ...prev.slice(0, 4)]);
      setShowDonationPopup(true);
      setTimeout(() => setShowDonationPopup(false), 4000);
    }
    
    setTimeout(() => {
      setShowSuccess(false);
      setActiveModal(null);
      // Here you would typically send the data to your backend
      console.log('Form submitted:', { type, formData });
    }, 2000);
  };

  const handleShare = async (type) => {
    const shareData = {
      'Share Our Mission': {
        title: 'Beeti Hari Society for Education & Economic Development',
        text: 'Supporting education and economic development in South Sudan. Join our mission to empower children and communities.',
        url: window.location.origin
      },
      'Share Our Story': {
        title: 'Beeti Hari Society - Our Story',
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

  const ProjectProgressCard = ({ project }) => {
    const progress = (project.raised / project.target) * 100;
    const remaining = project.target - project.raised;
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">{project.image}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold text-primary-600">${project.raised.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Raised</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-700">${project.target.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Goal</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{project.donors}</div>
            <div className="text-xs text-gray-600">Donors</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            ${remaining.toLocaleString()} still needed
          </div>
          <button 
            className="btn-primary text-sm w-full"
            onClick={() => {
              setActiveModal('donation');
              setFormData(prev => ({
                ...prev,
                donationProject: project.name
              }));
            }}
          >
            Support This Project
          </button>
        </div>
      </div>
    );
  };

  const DonationPopup = () => {
    if (!showDonationPopup || recentDonations.length === 0) return null;
    
    const latestDonation = recentDonations[0];
    
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-green-200 p-4 max-w-sm z-50 animate-slide-up">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {latestDonation.name} donated ${latestDonation.amount}
            </div>
            <div className="text-sm text-gray-600">
              to {latestDonation.project}
            </div>
            <div className="text-xs text-gray-500">
              {latestDonation.time}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RecentDonationsWidget = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
        Recent Donations
      </h3>
      <div className="space-y-3">
        {recentDonations.slice(0, 5).map((donation, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{donation.name}</div>
                <div className="text-sm text-gray-600">{donation.project}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600">${donation.amount}</div>
              <div className="text-xs text-gray-500">{donation.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const OverallProgressWidget = () => {
    const totalRaised = donationProjects.reduce((sum, project) => sum + project.raised, 0);
    const totalTarget = donationProjects.reduce((sum, project) => sum + project.target, 0);
    const totalDonors = donationProjects.reduce((sum, project) => sum + project.donors, 0);
    const overallProgress = (totalRaised / totalTarget) * 100;
    
    return (
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-6 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Overall Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <div className="text-2xl font-bold">${totalRaised.toLocaleString()}</div>
            <div className="text-sm opacity-90">Total Raised</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{overallProgress.toFixed(1)}%</div>
            <div className="text-sm opacity-90">Goal Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalDonors}</div>
            <div className="text-sm opacity-90">Total Donors</div>
          </div>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const MembershipForm = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Join our community of advocates and make a difference in the lives of children in South Sudan.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type</label>
        <div className="space-y-2">
          {membershipTypes.map((type) => (
            <label key={type.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="membershipType"
                value={type.id}
                checked={formData.membershipType === type.id}
                onChange={(e) => handleInputChange('membershipType', e.target.value)}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">{type.label}</span>
              <span className="text-sm font-medium text-primary-600">{type.price}</span>
            </label>
          ))}
        </div>
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us why you'd like to join our community..."
        />
      </div>

      <button
        onClick={() => handleSubmit('membership')}
        disabled={!formData.name || !formData.email || !formData.membershipType}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Join Our Community
      </button>
    </div>
  );

  const DonationForm = () => (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Your support can transform lives. Choose how you'd like to make an impact.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Donation Type</label>
        <input
          type="text"
          value={formData.donationType}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project to Support *</label>
        <select
          value={formData.donationProject}
          onChange={(e) => handleInputChange('donationProject', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Select a project</option>
          {donationProjects.map((project) => (
            <option key={project.id} value={project.name}>
              {project.name} - {project.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Donation Frequency *</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="donationFrequency"
              value="one-time"
              checked={formData.donationFrequency === 'one-time'}
              onChange={(e) => handleInputChange('donationFrequency', e.target.value)}
              className="text-primary-600"
            />
            <span className="text-sm text-gray-700">One-time donation</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="donationFrequency"
              value="monthly"
              checked={formData.donationFrequency === 'monthly'}
              onChange={(e) => handleInputChange('donationFrequency', e.target.value)}
              className="text-primary-600"
            />
            <span className="text-sm text-gray-700">Monthly recurring donation</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="donationFrequency"
              value="annual"
              checked={formData.donationFrequency === 'annual'}
              onChange={(e) => handleInputChange('donationFrequency', e.target.value)}
              className="text-primary-600"
            />
            <span className="text-sm text-gray-700">Annual recurring donation</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="text"
            value={formData.donationAmount}
            onChange={(e) => handleInputChange('donationAmount', e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter amount (e.g., 50, 100)"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.donationFrequency === 'monthly' && 'This amount will be charged monthly'}
          {formData.donationFrequency === 'annual' && 'This amount will be charged annually'}
          {formData.donationFrequency === 'one-time' && 'This is a one-time donation'}
        </p>
      </div>

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
        <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Tell us about your donation or any specific instructions..."
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <p className="text-sm text-blue-800">
          <strong>Next Steps:</strong> After submitting this form, we'll contact you within 24 hours to discuss payment options and provide you with a secure donation link.
        </p>
        {formData.donationFrequency === 'monthly' && (
          <p className="text-sm text-blue-700 mt-2">
            <strong>Monthly Donations:</strong> You can cancel or modify your monthly donation at any time.
          </p>
        )}
        {formData.donationFrequency === 'annual' && (
          <p className="text-sm text-blue-700 mt-2">
            <strong>Annual Donations:</strong> You can cancel or modify your annual donation at any time.
          </p>
        )}
      </div>

      <button
        onClick={() => handleSubmit('donation')}
        disabled={!formData.name || !formData.email || !formData.donationAmount || !formData.donationProject || !formData.donationFrequency}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Donation Request
      </button>
    </div>
  );

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
      case 'membership':
        return <MembershipForm />;
      case 'donation':
        return <DonationForm />;
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

      {/* Project Progress Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Progress</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how your donations are making a difference. Track the progress of our various projects and join the community of supporters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {donationProjects.slice(0, 6).map((project) => (
                  <ProjectProgressCard key={project.id} project={project} />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <OverallProgressWidget />
              <RecentDonationsWidget />
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setActiveModal('donation')}
              className="btn-primary text-lg px-8 py-4"
            >
              <Target className="mr-2 h-5 w-5 inline" />
              Support Our Projects
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

      {/* Modals */}
      <Modal isOpen={activeModal !== null} onClose={() => setActiveModal(null)}>
        {renderModalContent()}
      </Modal>

      {/* Donation Popup */}
      <DonationPopup />
    </div>
  );
};

export default GetInvolved;
