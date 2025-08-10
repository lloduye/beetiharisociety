import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Share2, Eye, Calendar, User, MapPin, ArrowRight } from 'lucide-react';

const Stories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Stories' },
    { id: 'students', name: 'Student Success' },
    { id: 'teachers', name: 'Teacher Stories' },
    { id: 'community', name: 'Community Impact' },
    { id: 'donors', name: 'Donor Stories' }
  ];

  const stories = [
    {
      id: 1,
      title: "From Cattle Herder to Scholar: Nakang's Educational Journey",
      excerpt: "Nakang, a 15-year-old Didinga girl from the Didinga Hills, never thought she'd see the inside of a classroom. Today, she's one of our brightest students with dreams of becoming a doctor.",
      content: "Nakang's family had never sent a child to school before. As traditional cattle herders in the Didinga Hills, education was seen as unnecessary. When we built our first classroom in her village, her parents were hesitant. But Nakang's determination changed everything. She walks 3 kilometers each day through the rugged hills to attend classes, and her grades are exceptional. 'I want to become a doctor to help my community,' she says with confidence that inspires everyone around her.",
      author: "Mary Loboi",
      date: "2024-01-15",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "students",
      image: "/Images/Story000001.jpg",
      views: 1247,
      shares: 89,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: "Teacher Lokonyen's 20-Year Commitment to Didinga Education",
      excerpt: "Despite delayed salaries and challenging conditions, Teacher Lokonyen has been educating Didinga children in Lotukei sub-county for two decades.",
      content: "Teacher Lokonyen started teaching in 2004, when there were no proper classrooms in the Didinga Hills. He taught under the shade of acacia trees and in makeshift shelters made from local materials. Even when government salaries were delayed for 18 months, he continued teaching. 'These children are our future,' he says. 'I cannot abandon them.' His dedication has inspired 11 other Didinga volunteers to join our teaching staff.",
      author: "David Lokang",
      date: "2024-01-10",
      location: "Lotukei sub-county, Didinga Hills",
      category: "teachers",
      image: "/Images/Story000002.jpg",
      views: 892,
      shares: 45,
      comments: 18,
      featured: false
    },
    {
      id: 3,
      title: "Building Dreams: How One Classroom Changed Everything",
      excerpt: "The construction of our first permanent classroom in the Didinga Hills has transformed education access for over 200 children.",
      content: "Before we built our first classroom, children in the Didinga Hills were learning under trees and in temporary shelters. When it rained, classes were cancelled. When it was too hot, children couldn't concentrate. The new classroom has changed everything. 'Now we can learn every day, no matter the weather,' says 12-year-old student Peter Lokang. 'I want to become a teacher so I can help other children like me.'",
      author: "Grace Nadai",
      date: "2024-01-05",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "community",
      image: "/Images/Story000003.jpg",
      views: 756,
      shares: 34,
      comments: 12,
      featured: false
    },
    {
      id: 4,
      title: "Empowering Girls Through Education in the Didinga Hills",
      excerpt: "Our girls' education program has increased female enrollment by 300% in the Didinga community.",
      content: "Traditionally, Didinga girls were expected to stay home and help with household chores. Education was seen as unnecessary for them. But our program has changed this mindset. 'My daughter will be the first woman in our family to read and write,' says mother Akuol Loboi. 'This changes everything for our family.' Today, girls make up 45% of our student body, and many are our top performers.",
      author: "Rebecca Lodai",
      date: "2023-12-28",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "students",
      image: "/Images/Story000004.jpg",
      views: 634,
      shares: 28,
      comments: 15,
      featured: false
    },
    {
      id: 5,
      title: "Volunteer Teachers: The Heart of Didinga Education",
      excerpt: "Our 11 volunteer teachers work without pay to ensure Didinga children receive quality education.",
      content: "When government salaries are delayed, our volunteer teachers continue working. They believe in the power of education to transform the Didinga community. 'I teach because I want to see my community prosper,' says volunteer teacher Michael Lokang. 'These children are our future leaders.' The volunteers work alongside our paid teachers, providing additional support and ensuring no child is left behind.",
      author: "Michael Lokang",
      date: "2023-12-22",
      location: "Lotukei sub-county, Didinga Hills",
      category: "teachers",
      image: "/Images/Story000005.jpg",
      views: 589,
      shares: 22,
      comments: 9,
      featured: false
    },
    {
      id: 6,
      title: "From Student to Teacher: Peter's Journey",
      excerpt: "Peter Lokang, once a student in our program, is now inspiring the next generation as a teacher.",
      content: "Peter Lokang was one of our first students when we started in 2010. Today, he's a teacher in the same classroom where he learned to read and write. 'I want to give back to my community what was given to me,' he says. 'Education opened doors I never knew existed.' His story inspires other students to dream big. 'If Peter can do it, so can I,' says his student, 12-year-old Nakang.",
      author: "James Lokang",
      date: "2023-12-18",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "teachers",
      image: "/Images/Story000006.jpg",
      views: 523,
      shares: 19,
      comments: 7,
      featured: false
    },
    {
      id: 7,
      title: "Community Fundraising: Building Schools One Bottle at a Time",
      excerpt: "The Didinga community has raised funds for 3 classrooms through bottle and can collection programs.",
      content: "When we couldn't afford to build classrooms, the Didinga community took action. They started collecting bottles and cans, selling them to recycling companies. The proceeds have funded 3 classrooms. 'Every bottle counts,' says Didinga community leader Thomas Lokang. 'We're building our children's future one bottle at a time.' This program has created a sense of ownership and pride in the Didinga community.",
      author: "Anna Nadai",
      date: "2023-12-20",
      location: "Lotukei sub-county, Didinga Hills",
      category: "community",
      image: "/Images/Story000007.jpg",
      views: 567,
      shares: 23,
      comments: 8,
      featured: false
    },
    {
      id: 8,
      title: "International Partnership: Building Bridges Through Didinga Education",
      excerpt: "Our partnership with international organizations has brought resources and expertise to our Didinga programs.",
      content: "Through partnerships with international NGOs, we've received educational materials, teacher training, and technical support for our Didinga communities. These partnerships have helped us improve our curriculum and teaching methods. 'The support we receive helps us provide better education for our Didinga children,' says program coordinator Mary Loboi. 'We're not alone in this mission.'",
      author: "David Lokang",
      date: "2023-12-18",
      location: "South Sudan, Didinga Hills",
      category: "community",
      image: "/Images/Story000008.jpg",
      views: 432,
      shares: 19,
      comments: 6,
      featured: false
    },
    {
      id: 9,
      title: "The Ripple Effect: How One Didinga Education Changes Everything",
      excerpt: "When one Didinga child receives an education, it creates a ripple effect that transforms entire families and communities.",
      content: "Education doesn't just change one Didinga life—it changes everything. When a child learns to read, they can help their parents with business transactions. When they learn math, they can manage family finances better. When they learn about health, they can care for their families. This ripple effect is why we believe education is the key to sustainable development in the Didinga Hills.",
      author: "Grace Nadai",
      date: "2023-12-15",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "community",
      image: "/Images/Story000009.jpg",
      views: 398,
      shares: 16,
      comments: 5,
      featured: false
    },
    {
      id: 10,
      title: "A New Beginning: The Future of Didinga Education",
      excerpt: "As we look ahead, the foundation we've built continues to grow stronger, promising brighter futures for generations to come.",
      content: "Our journey in the Didinga Hills has been one of transformation and hope. From humble beginnings under acacia trees to permanent classrooms, from a handful of students to hundreds of educated children, we've witnessed the power of community-driven education. The impact extends beyond individual students—it reaches families, villages, and the entire Didinga community. As we continue to expand our programs and build more classrooms, we're not just educating children; we're building a sustainable future for the Didinga people.",
      author: "Community Leaders",
      date: "2023-12-10",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "community",
      image: "/Images/Story000010.jpg",
      views: 345,
      shares: 12,
      comments: 4,
      featured: false
    }
  ];

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Stories of Impact</h1>
            <p className="text-xl text-primary-100">
              Real stories from the communities we serve, the students we educate, and the lives we transform.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'all' ? 'All Stories' : `${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the real impact of education through the stories of students, teachers, and communities.
            </p>
          </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredStories.map((story) => (
               <Link key={story.id} to={`/stories/${story.id}`} className="block">
                 <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                   {/* Story Image */}
                   <div className="relative h-40 bg-gray-200">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  {story.featured && (
                    <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Story Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(story.date)}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{story.location}</span>
                  </div>

                                     {/* Title and Excerpt */}
                   <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                     {story.title}
                   </h3>
                   <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                     {story.excerpt}
                   </p>

                                     {/* Author */}
                   <div className="flex items-center mb-3">
                     <User className="h-3 w-3 text-gray-400 mr-1" />
                     <span className="text-xs text-gray-600">By {story.author}</span>
                   </div>

                                     {/* Engagement Stats */}
                   <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                     <div className="flex items-center space-x-3">
                       <div className="flex items-center">
                         <Eye className="h-3 w-3 mr-1" />
                         <span>{formatNumber(story.views)}</span>
                       </div>
                       <div className="flex items-center">
                         <MessageCircle className="h-3 w-3 mr-1" />
                         <span>{formatNumber(story.comments)}</span>
                       </div>
                       <div className="flex items-center">
                         <Share2 className="h-3 w-3 mr-1" />
                         <span>{formatNumber(story.shares)}</span>
                       </div>
                     </div>
                   </div>

                                     {/* Read More Button */}
                   <div className="text-primary-600 hover:text-primary-700 font-semibold text-xs flex items-center group">
                     Read Full Story
                     <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </div>
               </article>
               </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="btn-primary">
              Load More Stories
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Have you been impacted by our work? We'd love to hear your story and share it with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contact@beetiharisociety.org" 
              className="btn-secondary text-lg px-8 py-4"
            >
              Share Your Story
            </a>
            <a 
              href="/get-involved" 
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
