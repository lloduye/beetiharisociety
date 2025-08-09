import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MapPin, 
  Eye, 
  MessageCircle, 
  Share2, 
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  Send,
  Clock
} from 'lucide-react';

const StoryDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  // This would normally come from an API or database
  // For now, we'll simulate finding the story by ID
  const stories = [
    {
      id: 1,
      title: "From No School to University Dreams: Sarah's Journey",
      excerpt: "Sarah, a 15-year-old girl from Budi County, never thought she'd see the inside of a classroom. Today, she's one of our brightest students with dreams of becoming a doctor.",
      content: `Sarah's family had never sent a child to school before. When we built our first classroom in her village, her parents were hesitant. But Sarah's determination changed everything. She walks 3 kilometers each day to attend classes, and her grades are exceptional.

"I want to become a doctor to help my community," she says with confidence that inspires everyone around her.

Sarah's journey began in 2020 when our organization constructed the first classroom in her remote village. At the time, only 15% of children in the area had access to education. Her parents, like many others, were skeptical about the value of education, especially for girls.

But Sarah's curiosity and determination were undeniable. She would walk past the construction site every day, watching with wide eyes as the classroom took shape. When the school finally opened, she was the first child to arrive, clutching a notebook made from recycled paper.

Today, Sarah is not only excelling academically but has become a role model for other girls in her community. She helps younger students with their studies and encourages families to send their daughters to school.

"Education has given me a voice," Sarah says. "I want to use that voice to help others and make my community stronger."

Her story represents the transformative power of education and the ripple effect it creates in communities.`,
      author: "Mary Akol",
      date: "2024-01-15",
      location: "Budi County, South Sudan",
      category: "students",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
      views: 1247,
      shares: 89,
      comments: 23,
      likes: 156,
      featured: true,
      tags: ["Education", "Girls Empowerment", "Community Development", "South Sudan"]
    },
    {
      id: 2,
      title: "Teacher John's 20-Year Commitment to Education",
      excerpt: "Despite delayed salaries and challenging conditions, Teacher John has been educating children in Lotukei sub-county for two decades.",
      content: `Teacher John started teaching in 2004, when there were no proper classrooms. He taught under trees and in makeshift shelters. Even when government salaries were delayed for 18 months, he continued teaching.

"These children are our future," he says. "I cannot abandon them."

His dedication has inspired 11 other volunteers to join our teaching staff.

John's story is one of unwavering commitment in the face of immense challenges. When he first began teaching, he had no classroom, no textbooks, and often no salary. But he had a vision of what education could do for his community.

He started by gathering children under the shade of a large tree, using sticks to write in the dirt. When it rained, they would move to whatever shelter was available. Despite these conditions, his students began to learn and thrive.

"Education is the only way we can break the cycle of poverty," John explains. "I see it in the eyes of my students - they understand that knowledge is their path to a better life."

Over the years, John has taught hundreds of children, many of whom have gone on to become teachers, healthcare workers, and community leaders. His impact extends far beyond the classroom walls.

Today, John continues to teach with the same passion he had 20 years ago, but now he has proper classrooms, teaching materials, and a supportive community behind him.`,
      author: "David Luka",
      date: "2024-01-10",
      location: "Lotukei sub-county",
      category: "teachers",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=400&fit=crop",
      views: 892,
      shares: 45,
      comments: 18,
      likes: 98,
      featured: false,
      tags: ["Teaching", "Dedication", "Community Service", "Education"]
    },
    {
      id: 3,
      title: "How One Classroom Changed an Entire Village",
      excerpt: "The construction of our first classroom in Piobokoi village sparked a community transformation that continues to grow.",
      content: `When we built our first classroom in Piobokoi, the entire village came together. Men helped with construction, women prepared meals for workers, and children watched with excitement.

Today, that single classroom has grown into a school serving 120 students. The village now has a literacy rate of 85%, up from 15% in 2010.

"Education has given us hope," says village elder Peter Lokoro.

The transformation of Piobokoi village began with a simple idea: build one classroom and see what happens. What happened exceeded everyone's expectations.

The construction process itself became a community-building exercise. Villagers who had never worked together before came together with a common purpose. Skills were shared, relationships were formed, and a sense of collective ownership emerged.

As the classroom took shape, so did the community's vision for the future. Parents began to dream bigger dreams for their children. The village elders started planning for additional classrooms. Local businesses began to support the school.

Today, Piobokoi is a model village, known throughout the region for its commitment to education. The school has expanded to include multiple classrooms, a library, and a community center. The literacy rate has increased dramatically, and the village has become a destination for families seeking better educational opportunities.

"The classroom didn't just teach our children to read and write," says elder Peter Lokoro. "It taught our entire village how to work together for a better future."`,
      author: "Grace Nyibol",
      date: "2024-01-08",
      location: "Piobokoi village",
      category: "community",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=400&fit=crop",
      views: 1567,
      shares: 134,
      comments: 31,
      likes: 234,
      featured: true,
      tags: ["Community Development", "Village Transformation", "Education Impact", "South Sudan"]
    },
    {
      id: 4,
      title: "The Donor Who Changed Everything: Maria's Story",
      excerpt: "Maria, a retired teacher from Canada, decided to sponsor an entire classroom. Her impact has been transformative.",
      content: `Maria, 72, had never been to Africa, but she believed in the power of education. She donated $5,000 to sponsor a classroom, which now serves 35 students.

"I wanted to make a difference," she says. "Seeing photos of the children learning in the classroom I helped build brings me more joy than anything I've ever done."

Her generosity inspired 12 other donors to sponsor classrooms.

Maria's journey began when she read an article about the educational challenges in South Sudan. As a retired teacher with 35 years of experience, she understood the transformative power of education.

"I spent my life teaching children in Canada," Maria explains. "I know what a difference education makes in a child's life. When I learned about the children in South Sudan who had no access to schools, I knew I had to help."

Maria's donation funded the construction of a complete classroom, including furniture, teaching materials, and books. The classroom was named "Maria's Hope" in her honor.

Today, 35 children attend classes in Maria's classroom, and the impact extends far beyond those students. Their families are more engaged in education, the community has a renewed sense of hope, and other donors have been inspired by Maria's example.

"I receive regular updates about the children in my classroom," Maria says. "Seeing their progress and hearing about their dreams makes me feel like I'm still teaching, even though I'm thousands of miles away."`,
      author: "Sarah Johnson",
      date: "2024-01-05",
      location: "Toronto, Canada",
      category: "donors",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      views: 723,
      shares: 67,
      comments: 15,
      likes: 89,
      featured: false,
      tags: ["Donor Story", "International Support", "Classroom Sponsorship", "Education"]
    },
    {
      id: 5,
      title: "Breaking Barriers: Girls' Education Success",
      excerpt: "Our girls' education program has achieved remarkable results, with 95% of enrolled girls completing primary education.",
      content: `When we started our girls' education program in 2015, only 20% of girls in our service area attended school. Today, that number has increased to 85%.

We provide sanitary supplies, mentorship programs, and family education to support girls' education.

"My daughter will be the first woman in our family to read and write," says mother Akuol Deng. "This changes everything for our family."

The girls' education program was born out of a recognition that girls face unique barriers to education in South Sudan. Cultural norms, lack of sanitary facilities, and family responsibilities often prevent girls from attending school.

Our program addresses these barriers through a comprehensive approach. We provide sanitary supplies to ensure girls can attend school during their menstrual cycles. We offer mentorship programs where older girls support younger ones. We work with families to educate them about the importance of girls' education.

The results have been transformative. Girls who once had no hope of education are now excelling in school. They're becoming role models for their communities and breaking down barriers for future generations.

"Education has given me confidence," says 16-year-old student Rebecca. "I know I can achieve anything I set my mind to."

The program's success has inspired similar initiatives in neighboring communities, creating a ripple effect of positive change.`,
      author: "Rebecca Ajak",
      date: "2024-01-03",
      location: "Didinga Hills region",
      category: "students",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop",
      views: 1345,
      shares: 156,
      comments: 42,
      likes: 187,
      featured: true,
      tags: ["Girls Education", "Gender Equality", "Women Empowerment", "Education Access"]
    },
    {
      id: 6,
      title: "Volunteer Teacher Program: Community Heroes",
      excerpt: "Our volunteer teacher program has created a network of community heroes who are transforming education in South Sudan.",
      content: `Our 11 volunteer teachers range in age from 22 to 70. They teach without pay, driven by love for their community.

Teacher Rebecca, 45, walks 5 kilometers daily to teach. "I do this because I want my grandchildren to have a better future," she says.

These volunteers have helped us reach 200 additional students who would otherwise have no access to education.

The volunteer teacher program represents the heart of our community-based approach to education. These dedicated individuals come from the communities they serve, understanding the local context and challenges.

Each volunteer brings unique skills and experiences. Some are retired teachers who want to continue serving their communities. Others are young people who received education and want to give back. All share a common commitment to improving lives through education.

The program provides training and support to volunteers, ensuring they have the skills and resources they need to be effective teachers. We also provide small stipends to help cover transportation and other basic costs.

The impact of these volunteers extends far beyond the classroom. They serve as role models, community leaders, and advocates for education. Their dedication inspires others to get involved and support educational initiatives.

"Teaching is not just a job, it's a calling," says volunteer teacher Michael. "When I see my students learning and growing, I know I'm making a difference."`,
      author: "Michael Ochieng",
      date: "2023-12-28",
      location: "Southeastern South Sudan",
      category: "teachers",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=400&fit=crop",
      views: 678,
      shares: 34,
      comments: 12,
      likes: 67,
      featured: false,
      tags: ["Volunteer Teachers", "Community Service", "Education", "South Sudan"]
    },
    {
      id: 7,
      title: "From Student to Teacher: Peter's Full Circle Journey",
      excerpt: "Peter, once a student in our first classroom, is now a teacher inspiring the next generation.",
      content: `Peter was 8 years old when our first classroom opened. He was among the first 30 students. Today, at 22, he's a teacher in the same school.

"I want to give back what was given to me," he says. Peter teaches mathematics and science to 45 students.

His story inspires other students to dream big. "If Peter can do it, so can I," says his student, 12-year-old Akol.

Peter's journey represents the full circle of education - from student to teacher, from recipient to giver. His story demonstrates the transformative power of education and the importance of role models in inspiring future generations.

As a student, Peter showed exceptional promise in mathematics and science. His teachers recognized his potential and provided extra support and encouragement. When he completed his education, he chose to return to his community as a teacher.

"I could have pursued other opportunities," Peter explains. "But I wanted to come back and help other children like me. I know what it's like to grow up without access to education, and I want to make sure other children don't have to face that challenge."

Peter's teaching style is influenced by his own experiences as a student. He understands the challenges his students face and provides the same support and encouragement that he received.

His presence in the classroom serves as a powerful reminder to students that education can change lives and create opportunities.`,
      author: "James Lual",
      date: "2023-12-25",
      location: "Budi County",
      category: "students",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      views: 945,
      shares: 78,
      comments: 19,
      likes: 123,
      featured: false,
      tags: ["Student Success", "Teacher Development", "Education Impact", "Role Models"]
    },
    {
      id: 8,
      title: "Community Fundraising: The Power of Local Action",
      excerpt: "Local communities have raised over $15,000 through bottle and can collection to build classrooms.",
      content: `Our community fundraising program has been incredibly successful. Families collect bottles and cans, which we sell to recycling companies.

The proceeds have funded 3 classrooms. "Every bottle counts," says community leader Thomas Luka. "We're building our children's future one bottle at a time."

This program has created a sense of ownership and pride in the community.

The community fundraising program was born out of necessity and creativity. When we needed additional funding for classroom construction, we looked to the community for solutions.

The bottle and can collection program was simple but effective. Families collect recyclable materials, which are then sold to recycling companies. The proceeds are used to fund educational infrastructure.

What started as a small initiative has grown into a major source of funding. The program has raised over $15,000, enough to build three complete classrooms. More importantly, it has created a sense of ownership and pride in the community.

"Every family participates," explains community leader Thomas Luka. "Children help collect bottles, parents organize collection drives, and everyone feels invested in the success of our schools."

The program has also created employment opportunities. Several community members are now employed in the collection and processing of recyclable materials.

The success of this program has inspired similar initiatives in other communities, demonstrating the power of local action and community engagement.`,
      author: "Anna Nyadeng",
      date: "2023-12-20",
      location: "Lotukei sub-county",
      category: "community",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop",
      views: 567,
      shares: 23,
      comments: 8,
      likes: 45,
      featured: false,
      tags: ["Community Fundraising", "Recycling", "Local Action", "Education Funding"]
    },
    {
      id: 9,
      title: "International Partnership: Building Bridges Through Education",
      excerpt: "Our partnership with international organizations has brought resources and expertise to our programs.",
      content: `Through partnerships with international NGOs, we've received educational materials, teacher training, and technical support.

These partnerships have helped us improve our curriculum and teaching methods.

"The support we receive helps us provide better education," says program coordinator Mary Akol. "We're not alone in this mission."

Our international partnerships represent a recognition that education is a global challenge that requires global solutions. These partnerships bring together local knowledge and international expertise to create more effective educational programs.

The partnerships provide access to resources that would otherwise be unavailable. This includes textbooks, teaching materials, technology, and training programs. International partners also provide technical support and best practices from around the world.

But the partnerships are not one-way relationships. We share our local knowledge and experiences with our international partners, contributing to global understanding of educational challenges and solutions.

The partnerships have also created opportunities for cultural exchange and mutual learning. Students and teachers from different countries can learn from each other, building bridges of understanding and cooperation.

"These partnerships remind us that we're part of a global community," says program coordinator Mary Akol. "We're working together to solve a common challenge."`,
      author: "David Ochieng",
      date: "2023-12-18",
      location: "South Sudan",
      category: "community",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      views: 432,
      shares: 19,
      comments: 6,
      likes: 34,
      featured: false,
      tags: ["International Partnerships", "Global Education", "NGO Collaboration", "Education Resources"]
    },
    {
      id: 10,
      title: "The Ripple Effect: How One Education Changes Everything",
      excerpt: "When one child receives an education, it creates a ripple effect that transforms entire families and communities.",
      content: `Education doesn't just change one life—it changes everything. When a child learns to read, they can help their parents with business transactions. When they learn math, they can manage family finances better. When they learn about health, they can care for their families.

This ripple effect is why we believe education is the key to sustainable development.

The ripple effect of education is perhaps the most powerful aspect of our work. When one child receives an education, the benefits extend far beyond that individual. Families become more informed about health, nutrition, and economic opportunities. Communities become more engaged in civic life and development initiatives.

Educated children become educated adults who can contribute more effectively to their communities. They can read important documents, understand their rights, and participate in decision-making processes. They can start businesses, create jobs, and drive economic development.

The ripple effect also extends across generations. Educated parents are more likely to value education for their own children, creating a cycle of learning and improvement that continues indefinitely.

"Education is the foundation of everything," explains Grace Nyibol, one of our community leaders. "When you educate a child, you're not just helping that child. You're helping their family, their community, and future generations."

This understanding drives our commitment to universal education access. We know that every child who receives an education creates positive change that ripples outward, touching countless lives.`,
      author: "Grace Nyibol",
      date: "2023-12-15",
      location: "Didinga Hills region",
      category: "community",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
      views: 1123,
      shares: 98,
      comments: 27,
      likes: 145,
      featured: true,
      tags: ["Education Impact", "Community Development", "Sustainable Development", "Social Change"]
    }
  ];

  const story = stories.find(s => s.id === parseInt(id));

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-6">The story you're looking for doesn't exist.</p>
          <Link to="/stories" className="btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

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

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = story.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check out this story: ${url}`)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
    setShowShareMenu(false);
  };

  return (
    <div>
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link 
            to="/stories" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {story.featured && (
          <div className="absolute top-6 left-6 bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Featured Story
          </div>
        )}
      </div>

      {/* Story Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(story.date)}</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{story.location}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{story.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {story.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {story.excerpt}
            </p>

            <div className="flex items-center mb-8">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">By {story.author}</span>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-600">{formatNumber(story.views)} views</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-600">{formatNumber(story.comments)} comments</span>
              </div>
              <div className="flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-600">{formatNumber(story.shares)} shares</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                <span>{formatNumber(story.likes + (liked ? 1 : 0))}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Linkedin className="h-4 w-4 mr-3 text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Mail className="h-4 w-4 mr-3 text-gray-600" />
                      Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

                     {/* Main Content */}
           <div className="prose prose-lg max-w-none mb-12">
             {story.content.split('\n\n').map((paragraph, index) => (
               <p key={index} className="text-gray-700 leading-relaxed mb-6">
                 {paragraph}
               </p>
             ))}
           </div>

           {/* Comments Section */}
           <div className="mb-12">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-2xl font-bold text-gray-900">Comments ({story.comments})</h3>
               <button
                 onClick={() => setShowComments(!showComments)}
                 className="text-primary-600 hover:text-primary-700 font-medium"
               >
                 {showComments ? 'Hide Comments' : 'Show Comments'}
               </button>
             </div>

             {showComments && (
               <div className="space-y-6">
                 {/* Add Comment */}
                 <div className="bg-gray-50 rounded-lg p-4">
                   <div className="flex space-x-3">
                     <div className="flex-shrink-0">
                       <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                         <User className="h-4 w-4 text-white" />
                       </div>
                     </div>
                     <div className="flex-1">
                       <textarea
                         value={commentText}
                         onChange={(e) => setCommentText(e.target.value)}
                         placeholder="Share your thoughts..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                         rows="3"
                       />
                       <div className="flex justify-end mt-2">
                         <button
                           onClick={() => {
                             if (commentText.trim()) {
                               const newComment = {
                                 id: Date.now(),
                                 text: commentText,
                                 author: 'Anonymous User',
                                 date: new Date().toISOString(),
                                 likes: 0
                               };
                               setComments([newComment, ...comments]);
                               setCommentText('');
                             }
                           }}
                           disabled={!commentText.trim()}
                           className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                         >
                           <Send className="h-4 w-4 mr-1" />
                           Post Comment
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Comments List */}
                 <div className="space-y-4">
                   {comments.map((comment) => (
                     <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                       <div className="flex items-start space-x-3">
                         <div className="flex-shrink-0">
                           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                             <User className="h-4 w-4 text-gray-600" />
                           </div>
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center space-x-2 mb-2">
                             <span className="font-medium text-gray-900">{comment.author}</span>
                             <span className="text-gray-500">•</span>
                             <span className="text-sm text-gray-500">
                               {new Date(comment.date).toLocaleDateString()}
                             </span>
                           </div>
                           <p className="text-gray-700">{comment.text}</p>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>

                     {/* Call to Action */}
           <div className="bg-primary-50 rounded-lg p-8 text-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">
               Inspired by this story?
             </h3>
             <p className="text-gray-600 mb-6">
               Help us create more stories like this by supporting our educational programs.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <a 
                 href="mailto:donate@beetiharisociety.org" 
                 className="btn-primary"
               >
                 Make a Donation
               </a>
               <Link 
                 to="/get-involved" 
                 className="btn-outline"
               >
                 Get Involved
               </Link>
             </div>
           </div>
         </div>
       </div>

       {/* Next Stories Section */}
       <section className="bg-gray-50 py-16">
         <div className="container-custom">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">More Stories</h2>
             <p className="text-lg text-gray-600">Discover more inspiring stories from our community</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {stories
               .filter(s => s.id !== story.id)
               .slice(0, 6)
               .map((nextStory) => (
                 <Link key={nextStory.id} to={`/stories/${nextStory.id}`} className="block">
                   <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                     {/* Story Image */}
                     <div className="relative h-40 bg-gray-200">
                       <img
                         src={nextStory.image}
                         alt={nextStory.title}
                         className="w-full h-full object-cover"
                       />
                       {nextStory.featured && (
                         <div className="absolute top-3 left-3 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                           Featured
                         </div>
                       )}
                     </div>

                     {/* Story Content */}
                     <div className="p-4">
                       {/* Meta Information */}
                       <div className="flex items-center text-xs text-gray-500 mb-2">
                         <Calendar className="h-3 w-3 mr-1" />
                         <span>{formatDate(nextStory.date)}</span>
                         <span className="mx-2">•</span>
                         <span className="capitalize">{nextStory.category}</span>
                       </div>

                       {/* Title and Excerpt */}
                       <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                         {nextStory.title}
                       </h3>
                       <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                         {nextStory.excerpt}
                       </p>

                       {/* Author */}
                       <div className="flex items-center mb-3">
                         <User className="h-3 w-3 text-gray-400 mr-1" />
                         <span className="text-xs text-gray-600">By {nextStory.author}</span>
                       </div>

                       {/* Engagement Stats */}
                       <div className="flex items-center justify-between text-xs text-gray-500">
                         <div className="flex items-center space-x-3">
                           <div className="flex items-center">
                             <Eye className="h-3 w-3 mr-1" />
                             <span>{formatNumber(nextStory.views)}</span>
                           </div>
                           <div className="flex items-center">
                             <MessageCircle className="h-3 w-3 mr-1" />
                             <span>{formatNumber(nextStory.comments)}</span>
                           </div>
                         </div>
                         <div className="text-primary-600 hover:text-primary-700 font-semibold text-xs flex items-center group">
                           Read More
                           <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                         </div>
                       </div>
                     </div>
                   </article>
                 </Link>
               ))}
           </div>

           <div className="text-center mt-8">
             <Link to="/stories" className="btn-primary">
               View All Stories
             </Link>
           </div>
         </div>
       </section>
     </div>
   );
 };

export default StoryDetail;
