import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
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
  Send
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
      title: "From Cattle Herder to Scholar: Nakang's Educational Journey",
      excerpt: "Nakang, a 15-year-old Didinga girl from the Didinga Hills, never thought she'd see the inside of a classroom. Today, she's one of our brightest students with dreams of becoming a doctor.",
      content: `Nakang's family had never sent a child to school before. As traditional cattle herders in the Didinga Hills, education was seen as unnecessary. When we built our first classroom in her village, her parents were hesitant. But Nakang's determination changed everything. She walks 3 kilometers each day through the rugged hills to attend classes, and her grades are exceptional.

"I want to become a doctor to help my community," she says with confidence that inspires everyone around her.

Nakang's journey began in 2020 when our organization constructed the first classroom in her remote Didinga village. At the time, only 15% of children in the area had access to education. Her parents, like many other Didinga families, were skeptical about the value of education, especially for girls.

But Nakang's curiosity and determination were undeniable. She would walk past the construction site every day, watching with wide eyes as the classroom took shape. When the school finally opened, she was the first child to arrive, clutching a notebook made from recycled paper.

Today, Nakang is not only excelling academically but has become a role model for other Didinga girls in her community. She helps younger students with their studies and encourages families to send their daughters to school.

"Education has given me a voice," Nakang says. "I want to use that voice to help others and make my Didinga community stronger."

Her story represents the transformative power of education and the ripple effect it creates in Didinga communities.`,
      author: "Mary Loboi",
      date: "2024-01-15",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "students",
      image: "/Images/Story000001.jpg",
      views: 1247,
      shares: 89,
      comments: 23,
      likes: 156,
      featured: true,
      tags: ["Education", "Girls Empowerment", "Didinga Community", "South Sudan"]
    },
    {
      id: 2,
      title: "Teacher Lokonyen's 20-Year Commitment to Didinga Education",
      excerpt: "Despite delayed salaries and challenging conditions, Teacher Lokonyen has been educating Didinga children in Lotukei sub-county for two decades.",
      content: `Teacher Lokonyen started teaching in 2004, when there were no proper classrooms in the Didinga Hills. He taught under the shade of acacia trees and in makeshift shelters made from local materials. Even when government salaries were delayed for 18 months, he continued teaching.

"These children are our future," he says. "I cannot abandon them."

His dedication has inspired 11 other Didinga volunteers to join our teaching staff.

Lokonyen's story is one of unwavering commitment in the face of immense challenges. When he first began teaching, he had no classroom, no textbooks, and often no salary. But he had a vision of what education could do for his Didinga community.

He started by gathering children under the shade of large acacia trees, using sticks to write in the dirt. When it rained, they would move to whatever shelter was available. Despite these conditions, his students began to learn and thrive.

"Education is the only way we can break the cycle of poverty in the Didinga Hills," Lokonyen explains. "I see it in the eyes of my students - they understand that knowledge is their path to a better life."

Over the years, Lokonyen has taught hundreds of Didinga children, many of whom have gone on to become teachers, healthcare workers, and community leaders. His impact extends far beyond the classroom walls.

Today, Lokonyen continues to teach with the same passion he had 20 years ago, but now he has proper classrooms, teaching materials, and a supportive Didinga community behind him.`,
      author: "David Lokang",
      date: "2024-01-10",
      location: "Lotukei sub-county, Didinga Hills",
      category: "teachers",
      image: "/Images/Story000002.jpg",
      views: 892,
      shares: 45,
      comments: 18,
      likes: 78,
      featured: false,
      tags: ["Teacher Dedication", "Didinga Education", "Community Service", "South Sudan"]
    },
    {
      id: 3,
      title: "Building Dreams: How One Classroom Changed Everything",
      excerpt: "The construction of our first permanent classroom in the Didinga Hills has transformed education access for over 200 children.",
      content: `Before we built our first classroom, children in the Didinga Hills were learning under trees and in temporary shelters. When it rained, classes were cancelled. When it was too hot, children couldn't concentrate. The new classroom has changed everything.

"Now we can learn every day, no matter the weather," says 12-year-old student Peter Lokang. "I want to become a teacher so I can help other children like me."

The construction of this classroom was a community effort. Didinga men used traditional building techniques, women prepared meals for workers, and children watched with excitement as their future took shape. Today, that single classroom serves 120 students and has inspired the construction of four additional classrooms.`,
      author: "Grace Nadai",
      date: "2024-01-05",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "community",
      image: "/Images/Story000003.jpg",
      views: 756,
      shares: 34,
      comments: 12,
      likes: 45,
      featured: false,
      tags: ["Infrastructure", "Community Development", "Didinga Hills", "Education Access"]
    },
    {
      id: 4,
      title: "Empowering Girls Through Education in the Didinga Hills",
      excerpt: "Our girls' education program has increased female enrollment by 300% in the Didinga community.",
      content: `Traditionally, Didinga girls were expected to stay home and help with household chores. Education was seen as unnecessary for them. But our program has changed this mindset.

"My daughter will be the first woman in our family to read and write," says mother Akuol Loboi. "This changes everything for our family."

Today, girls make up 45% of our student body, and many are our top performers. The program includes special support for girls, including mentorship, hygiene education, and family counseling to ensure long-term success.

The impact extends beyond the classroom. Educated Didinga girls are more likely to marry later, have fewer children, and invest in their own children's education. They become role models and change agents in their communities.

"Education has given me confidence," says 16-year-old student Rebecca Nakang. "I know I can achieve anything I set my mind to."`,
      author: "Rebecca Lodai",
      date: "2023-12-28",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "students",
      image: "/Images/Story000004.jpg",
      views: 634,
      shares: 28,
      comments: 15,
      likes: 67,
      featured: false,
      tags: ["Girls Education", "Women Empowerment", "Didinga Community", "Gender Equality"]
    },
    {
      id: 5,
      title: "Volunteer Teachers: The Heart of Didinga Education",
      excerpt: "Our 11 volunteer teachers work without pay to ensure Didinga children receive quality education.",
      content: `When government salaries are delayed, our volunteer teachers continue working. They believe in the power of education to transform the Didinga community.

"I teach because I want to see my community prosper," says volunteer teacher Michael Lokang. "These children are our future leaders."

The volunteers work alongside our paid teachers, providing additional support and ensuring no child is left behind. They come from various backgrounds - some are former students, others are community members who want to contribute.

Volunteer teacher Sarah Nakang explains, "I was one of the first girls to graduate from our program. Now I want to help other girls achieve their dreams."

The volunteer program has created a sustainable model where community members take ownership of education. It's not just about teaching - it's about building a culture of learning and growth in the Didinga Hills.`,
      author: "Michael Lokang",
      date: "2023-12-22",
      location: "Lotukei sub-county, Didinga Hills",
      category: "teachers",
      image: "/Images/Story000005.jpg",
      views: 589,
      shares: 22,
      comments: 9,
      likes: 34,
      featured: false,
      tags: ["Volunteerism", "Community Service", "Didinga Education", "Teacher Dedication"]
    },
    {
      id: 6,
      title: "From Student to Teacher: Peter's Journey",
      excerpt: "Peter Lokang, once a student in our program, is now inspiring the next generation as a teacher.",
      content: `Peter Lokang was one of our first students when we started in 2010. Today, he's a teacher in the same classroom where he learned to read and write.

"I want to give back to my community what was given to me," he says. "Education opened doors I never knew existed."

His story inspires other students to dream big. "If Peter can do it, so can I," says his student, 12-year-old Nakang.

Peter's journey represents the full circle of education in the Didinga Hills. He started as a student with no hope for education, became a successful learner, and now serves as an inspiration and teacher for the next generation.

"Teaching here is more than a job," Peter explains. "It's my way of ensuring that what happened to me - getting an education - happens for every Didinga child who wants to learn."`,
      author: "James Lokang",
      date: "2023-12-18",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "teachers",
      image: "/Images/Story000006.jpg",
      views: 523,
      shares: 19,
      comments: 7,
      likes: 28,
      featured: false,
      tags: ["Student Success", "Teacher Development", "Didinga Community", "Role Models"]
    },
    {
      id: 7,
      title: "Community Fundraising: Building Schools One Bottle at a Time",
      excerpt: "The Didinga community has raised funds for 3 classrooms through bottle and can collection programs.",
      content: `When we couldn't afford to build classrooms, the Didinga community took action. They started collecting bottles and cans, selling them to recycling companies. The proceeds have funded 3 classrooms.

"Every bottle counts," says Didinga community leader Thomas Lokang. "We're building our children's future one bottle at a time."

This program has created a sense of ownership and pride in the Didinga community. Children participate in the collection, learning about environmental responsibility while contributing to their own education.

The community's commitment shows that education is valued here. Despite limited resources, they find creative ways to support their children's learning. This grassroots approach has inspired other communities to start similar programs.`,
      author: "Anna Nadai",
      date: "2023-12-20",
      location: "Lotukei sub-county, Didinga Hills",
      category: "community",
      image: "/Images/Story000007.jpg",
      views: 567,
      shares: 23,
      comments: 8,
      likes: 42,
      featured: false,
      tags: ["Community Fundraising", "Environmental Responsibility", "Didinga Initiative", "Grassroots Development"]
    },
    {
      id: 8,
      title: "International Partnership: Building Bridges Through Didinga Education",
      excerpt: "Our partnership with international organizations has brought resources and expertise to our Didinga programs.",
      content: `Through partnerships with international NGOs, we've received educational materials, teacher training, and technical support for our Didinga communities. These partnerships have helped us improve our curriculum and teaching methods.

"The support we receive helps us provide better education for our Didinga children," says program coordinator Mary Loboi. "We're not alone in this mission."

The partnerships have brought not just resources, but also new perspectives and ideas. International volunteers have shared teaching methods, while our Didinga teachers have shared local knowledge and cultural insights.

This exchange has created a richer educational experience for our students, combining global best practices with local Didinga wisdom.`,
      author: "David Lokang",
      date: "2023-12-18",
      location: "South Sudan, Didinga Hills",
      category: "community",
      image: "/Images/Story000008.jpg",
      views: 432,
      shares: 19,
      comments: 6,
      likes: 31,
      featured: false,
      tags: ["International Partnerships", "Global Education", "Didinga Development", "Cultural Exchange"]
    },
    {
      id: 9,
      title: "The Ripple Effect: How One Didinga Education Changes Everything",
      excerpt: "When one Didinga child receives an education, it creates a ripple effect that transforms entire families and communities.",
      content: `Education doesn't just change one Didinga life—it changes everything. When a child learns to read, they can help their parents with business transactions. When they learn math, they can manage family finances better. When they learn about health, they can care for their families.

This ripple effect is why we believe education is the key to sustainable development in the Didinga Hills. Each educated child becomes a catalyst for change in their family and community.

The impact extends beyond immediate benefits. Educated Didinga children grow up to become community leaders, healthcare workers, and teachers. They bring new ideas and solutions to local challenges.

This is why we focus on education as our primary mission. It's not just about individual success - it's about building a stronger, more prosperous Didinga community for generations to come.`,
      author: "Grace Nadai",
      date: "2023-12-15",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "community",
      image: "/Images/Story000009.jpg",
      views: 398,
      shares: 16,
      comments: 5,
      likes: 25,
      featured: false,
      tags: ["Community Impact", "Sustainable Development", "Didinga Future", "Education Benefits"]
    },
    {
      id: 10,
      title: "A New Beginning: The Future of Didinga Education",
      excerpt: "As we look ahead, the foundation we've built continues to grow stronger, promising brighter futures for generations to come.",
      content: `Our journey in the Didinga Hills has been one of transformation and hope. From humble beginnings under acacia trees to permanent classrooms, from a handful of students to hundreds of educated children, we've witnessed the power of community-driven education.

The impact extends beyond individual students—it reaches families, villages, and the entire Didinga community. As we continue to expand our programs and build more classrooms, we're not just educating children; we're building a sustainable future for the Didinga people.

Each new classroom represents another step toward our vision of universal education in the Didinga Hills. We've seen how education transforms not just individual lives, but entire communities. Children who once had no hope for education are now becoming teachers, healthcare workers, and community leaders.

The ripple effect continues to grow. Families who once saw no value in education now actively support their children's learning. Communities that were once isolated are now connected through shared educational goals and achievements.

As we look to the future, we see a Didinga community where every child has access to quality education, where traditional knowledge is preserved alongside modern learning, and where the next generation is equipped to build a brighter future for all.`,
      author: "Community Leaders",
      date: "2023-12-10",
      location: "Didinga Hills, Budi County, South Sudan",
      category: "community",
      image: "/Images/Story000010.jpg",
      views: 345,
      shares: 12,
      comments: 4,
      likes: 18,
      featured: false,
      tags: ["Future Vision", "Community Development", "Didinga Education", "Sustainable Growth"]
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
