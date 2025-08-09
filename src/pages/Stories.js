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
      title: "From No School to University Dreams: Sarah's Journey",
      excerpt: "Sarah, a 15-year-old girl from Budi County, never thought she'd see the inside of a classroom. Today, she's one of our brightest students with dreams of becoming a doctor.",
      content: "Sarah's family had never sent a child to school before. When we built our first classroom in her village, her parents were hesitant. But Sarah's determination changed everything. She walks 3 kilometers each day to attend classes, and her grades are exceptional. 'I want to become a doctor to help my community,' she says with confidence that inspires everyone around her.",
      author: "Mary Akol",
      date: "2024-01-15",
      location: "Budi County, South Sudan",
      category: "students",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      views: 1247,
      shares: 89,
      comments: 23,
      featured: true
    },
    {
      id: 2,
      title: "Teacher John's 20-Year Commitment to Education",
      excerpt: "Despite delayed salaries and challenging conditions, Teacher John has been educating children in Lotukei sub-county for two decades.",
      content: "Teacher John started teaching in 2004, when there were no proper classrooms. He taught under trees and in makeshift shelters. Even when government salaries were delayed for 18 months, he continued teaching. 'These children are our future,' he says. 'I cannot abandon them.' His dedication has inspired 11 other volunteers to join our teaching staff.",
      author: "David Luka",
      date: "2024-01-10",
      location: "Lotukei sub-county",
      category: "teachers",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop",
      views: 892,
      shares: 45,
      comments: 18,
      featured: false
    },
    {
      id: 3,
      title: "How One Classroom Changed an Entire Village",
      excerpt: "The construction of our first classroom in Piobokoi village sparked a community transformation that continues to grow.",
      content: "When we built our first classroom in Piobokoi, the entire village came together. Men helped with construction, women prepared meals for workers, and children watched with excitement. Today, that single classroom has grown into a school serving 120 students. The village now has a literacy rate of 85%, up from 15% in 2010. 'Education has given us hope,' says village elder Peter Lokoro.",
      author: "Grace Nyibol",
      date: "2024-01-08",
      location: "Piobokoi village",
      category: "community",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=300&fit=crop",
      views: 1567,
      shares: 134,
      comments: 31,
      featured: true
    },
    {
      id: 4,
      title: "The Donor Who Changed Everything: Maria's Story",
      excerpt: "Maria, a retired teacher from Canada, decided to sponsor an entire classroom. Her impact has been transformative.",
      content: "Maria, 72, had never been to Africa, but she believed in the power of education. She donated $5,000 to sponsor a classroom, which now serves 35 students. 'I wanted to make a difference,' she says. 'Seeing photos of the children learning in the classroom I helped build brings me more joy than anything I've ever done.' Her generosity inspired 12 other donors to sponsor classrooms.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      location: "Toronto, Canada",
      category: "donors",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      views: 723,
      shares: 67,
      comments: 15,
      featured: false
    },
    {
      id: 5,
      title: "Breaking Barriers: Girls' Education Success",
      excerpt: "Our girls' education program has achieved remarkable results, with 95% of enrolled girls completing primary education.",
      content: "When we started our girls' education program in 2015, only 20% of girls in our service area attended school. Today, that number has increased to 85%. We provide sanitary supplies, mentorship programs, and family education to support girls' education. 'My daughter will be the first woman in our family to read and write,' says mother Akuol Deng. 'This changes everything for our family.'",
      author: "Rebecca Ajak",
      date: "2024-01-03",
      location: "Didinga Hills region",
      category: "students",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop",
      views: 1345,
      shares: 156,
      comments: 42,
      featured: true
    },
    {
      id: 6,
      title: "Volunteer Teacher Program: Community Heroes",
      excerpt: "Our volunteer teacher program has created a network of community heroes who are transforming education in South Sudan.",
      content: "Our 11 volunteer teachers range in age from 22 to 70. They teach without pay, driven by love for their community. Teacher Rebecca, 45, walks 5 kilometers daily to teach. 'I do this because I want my grandchildren to have a better future,' she says. These volunteers have helped us reach 200 additional students who would otherwise have no access to education.",
      author: "Michael Ochieng",
      date: "2023-12-28",
      location: "Southeastern South Sudan",
      category: "teachers",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=300&fit=crop",
      views: 678,
      shares: 34,
      comments: 12,
      featured: false
    },
    {
      id: 7,
      title: "From Student to Teacher: Peter's Full Circle Journey",
      excerpt: "Peter, once a student in our first classroom, is now a teacher inspiring the next generation.",
      content: "Peter was 8 years old when our first classroom opened. He was among the first 30 students. Today, at 22, he's a teacher in the same school. 'I want to give back what was given to me,' he says. Peter teaches mathematics and science to 45 students. His story inspires other students to dream big. 'If Peter can do it, so can I,' says his student, 12-year-old Akol.",
      author: "James Lual",
      date: "2023-12-25",
      location: "Budi County",
      category: "students",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      views: 945,
      shares: 78,
      comments: 19,
      featured: false
    },
    {
      id: 8,
      title: "Community Fundraising: The Power of Local Action",
      excerpt: "Local communities have raised over $15,000 through bottle and can collection to build classrooms.",
      content: "Our community fundraising program has been incredibly successful. Families collect bottles and cans, which we sell to recycling companies. The proceeds have funded 3 classrooms. 'Every bottle counts,' says community leader Thomas Luka. 'We're building our children's future one bottle at a time.' This program has created a sense of ownership and pride in the community.",
      author: "Anna Nyadeng",
      date: "2023-12-20",
      location: "Lotukei sub-county",
      category: "community",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      views: 567,
      shares: 23,
      comments: 8,
      featured: false
    },
    {
      id: 9,
      title: "International Partnership: Building Bridges Through Education",
      excerpt: "Our partnership with international organizations has brought resources and expertise to our programs.",
      content: "Through partnerships with international NGOs, we've received educational materials, teacher training, and technical support. These partnerships have helped us improve our curriculum and teaching methods. 'The support we receive helps us provide better education,' says program coordinator Mary Akol. 'We're not alone in this mission.'",
      author: "David Ochieng",
      date: "2023-12-18",
      location: "South Sudan",
      category: "community",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      views: 432,
      shares: 19,
      comments: 6,
      featured: false
    },
    {
      id: 10,
      title: "The Ripple Effect: How One Education Changes Everything",
      excerpt: "When one child receives an education, it creates a ripple effect that transforms entire families and communities.",
      content: "Education doesn't just change one life—it changes everything. When a child learns to read, they can help their parents with business transactions. When they learn math, they can manage family finances better. When they learn about health, they can care for their families. This ripple effect is why we believe education is the key to sustainable development.",
      author: "Grace Nyibol",
      date: "2023-12-15",
      location: "Didinga Hills region",
      category: "community",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      views: 1123,
      shares: 98,
      comments: 27,
      featured: true
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
