/**
 * Knowledge base for the Beti-Hari Society chatbot. Sourced from the website content.
 * Each entry: { keywords: [], answer: string, suggestedReplies: string[] }
 * The chatbot matches user messages against keywords and returns the best-matching answer.
 */
export const chatbotKnowledge = [
  {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer: "Hello! I'm the Beti-Hari Society assistant. I can answer questions about our mission, the Didinga people we serve in Lotukei (South Sudan), how to donate or become a member, volunteering, our impact, and how to contact us. What would you like to know?",
    suggestedReplies: ['What is Beti-Hari Society?', 'How can I donate?', 'Where do you work?'],
  },
  {
    keywords: ['what is beti-hari', 'who are you', 'organization', 'about the society', 'tell me about'],
    answer: "Beti-Hari Society for Education & Economic Development is a grassroots nonprofit dedicated to building access to quality education, life skills, and essential community support services in rural South Sudan. We were founded on values of purpose, service, and empowerment and work to uplift communities through the classroom. Our tagline: Empowering Young People. Strengthening Communities. Transforming South Sudan Through Education.",
    suggestedReplies: ['Your mission', 'Where you work', 'How to get involved'],
  },
  {
    keywords: ['mission', 'purpose', 'goal', 'why do you exist'],
    answer: "Our mission is: \"To provide superior academic and life skills development to young people, to foster spiritual and moral excellence for present and future generations, and to instill a sense of life purpose and active community involvement, to achieve universal child education.\" We focus on academic excellence, life skills, and moral development.",
    suggestedReplies: ['Your vision', 'What you do', 'Impact'],
  },
  {
    keywords: ['vision', 'envision', 'future', 'dream'],
    answer: "Our vision is purpose-driven education that contributes to the development of mental faculties, spiritual growth, and character—fostering a socioeconomically sustainable lifestyle and propelling individuals and communities from poverty to prosperity. We envision nurtured communities, self-sufficiency, and knowledge as the key to strong societies.",
    suggestedReplies: ['Mission', 'What we do', 'Get involved'],
  },
  {
    keywords: ['where', 'location', 'serve', 'work', 'south sudan', 'lotukei', 'didinga', 'service area'],
    answer: "We serve the Didinga people in southeastern South Sudan, specifically in Lotukei sub-county. The Didinga are an ethnic group of about 160,000–200,000 people living in the Didinga Hills and surrounding lowlands. They are pastoralists and farmers, culturally rich and deeply connected to the land. Our active service area is Lotukei sub-county (Didinga Hills region, southeastern South Sudan).",
    suggestedReplies: ['Who are the Didinga?', 'How to help', 'Contact'],
  },
  {
    keywords: ['didinga', 'people we serve', 'community', 'ethnic'],
    answer: "We work in partnership with the Didinga people—an ethnic group of 160,000–200,000 in the Didinga Hills and surrounding lowlands of southeastern South Sudan. They are pastoralists and farmers who value cattle (for dowry and wealth), have limited access to basic services and education, and are culturally rich. We honor their values while building opportunity through education.",
    suggestedReplies: ['Where you work', 'Programs', 'Impact'],
  },
  {
    keywords: ['donate', 'donation', 'give', 'money', 'support financially', 'pay', 'contribute', 'sponsor', 'sponsorship', 'classroom', 'teacher support', 'supplies', '10,000', '10000', 'stripe'],
    answer: "You can donate through our website—click 'Donate' anywhere on the site. We use Stripe for secure payments. Options include: Sponsor a Classroom ($10,000), Support a Teacher ($25), Student Supplies ($50), or General Support (any amount). For donation inquiries you can also email donate@betiharisociety.org. Thank you for supporting education in South Sudan!",
    suggestedReplies: ['Membership', 'Where does money go?', 'Contact'],
  },
  {
    keywords: ['membership', 'member', 'join', '120', '$120', 'monthly'],
    answer: "You can become a member for $120 per month. Click 'Join Our Community' or 'Become a Member' on our Get Involved page—you'll be taken to our secure Stripe page to complete the subscription. You can cancel anytime. Membership supports our mission and the Didinga children in Lotukei sub-county.",
    suggestedReplies: ['Donate once', 'Get involved', 'Contact'],
  },
  {
    keywords: ['volunteer', 'help', 'get involved', 'participate'],
    answer: "We welcome volunteers with teaching, development, or administrative skills, as well as donated goods and services and help organizing community events. You can also spread the word about our mission, request materials for your religious or civic group, or get an advocacy kit. Visit our Get Involved page to fill out a volunteer form or contact us at contact@betiharisociety.org.",
    suggestedReplies: ['Donate', 'Spread the word', 'Contact'],
  },
  {
    keywords: ['contact', 'email', 'reach', 'get in touch', 'phone', 'inquiry'],
    answer: "General inquiries: contact@betiharisociety.org. Donations and fundraising: donate@betiharisociety.org. We typically respond within 24–48 hours. For urgent matters, include 'URGENT' in the subject line. We serve Lotukei sub-county in southeastern South Sudan.",
    suggestedReplies: ['Donate', 'Get involved', 'Where are you?'],
  },
  {
    keywords: ['impact', 'achievement', 'result', 'stat', 'number', 'student', 'classroom', 'teacher'],
    answer: "Since 2010 we've made substantial progress: 5 classrooms built (including through community bottle/can collection), 1,200+ students enrolled, 9 full-time teachers on the South Sudanese government payroll (often serving despite delayed salaries of 15–24 months), and 11 volunteer teachers (ages 22–70) at Piobokoi Primary School in Lotukei sub-county. We're expanding toward 5,000–7,000 students in 5–10 years.",
    suggestedReplies: ['Programs', 'Donate', 'Stories'],
  },
  {
    keywords: ['program', 'what we do', 'education', 'school', 'classroom', 'curriculum'],
    answer: "Our core work includes: (1) Expanding educational access—building classrooms and high schools so young people, especially girls, can continue past Grade 6 without traveling long distances. (2) Nurturing learning environments—community-supported, spiritually grounded, emotionally safe. (3) Holistic development—healthcare support, microcredit, financial literacy, adult education, environmental awareness. We also focus on universal primary education, adult literacy, and apprenticeship opportunities.",
    suggestedReplies: ['Impact', 'Where you work', 'Donate'],
  },
  {
    keywords: ['board', 'leadership', 'director', 'who runs', 'governance'],
    answer: "We are governed by a Board of Directors representing South Sudan and the diaspora. Board members include: Alex Atiol (Chairman), Charles Lokonyen (Treasurer), Angelo Gola (Director, South Sudan), Lino Lokonobei (Director, USA), Amedeo Awai Martin, Albert Lonyia, Joseph Nachungura, and Paul Atanya (Director / Project Officer).",
    suggestedReplies: ['Mission', 'Contact', 'Get involved'],
  },
  {
    keywords: ['value', 'belief', 'principle', 'commitment'],
    answer: "Our values are Purpose (serving and empowering through education), Service (selfless service, putting children and communities first), and Empowerment (helping individuals and communities become self-reliant). We are committed to community-driven development, cultural sensitivity, sustainable impact, and transparency.",
    suggestedReplies: ['Mission', 'What we do', 'About us'],
  },
  {
    keywords: ['story', 'stories', 'example', 'testimonial', 'read'],
    answer: "We share stories from the field on our website—student and teacher stories from the Didinga community. You can read them under the Stories section. They highlight the impact of education, volunteer teachers, classroom construction, and community initiatives.",
    suggestedReplies: ['Impact', 'Donate', 'Get involved'],
  },
  {
    keywords: ['piobokoi', 'school', 'primary'],
    answer: "Piobokoi Primary School is in Lotukei sub-county. We have 11 volunteer teachers (ages 22–70) supporting the school alongside our full-time teachers, demonstrating strong commitment to the Didinga community.",
    suggestedReplies: ['Impact', 'Where you work', 'Donate'],
  },
  {
    keywords: ['girl', 'female', 'woman', 'women'],
    answer: "We prioritize girls' education. Many children in rural South Sudan end at Grade 6; we build local high schools so young people—especially girls—can continue without traveling long distances. Our girls' education efforts have increased female enrollment significantly.",
    suggestedReplies: ['Programs', 'Impact', 'Donate'],
  },
  {
    keywords: ['spread', 'share', 'word', 'advocacy', 'material'],
    answer: "You can spread the word by sharing our mission with friends, family, and community groups; presenting to religious or civic organizations; or contacting local representatives. We offer materials for presentations and an advocacy kit. See the Get Involved page for options.",
    suggestedReplies: ['Volunteer', 'Donate', 'Contact'],
  },
];

export const defaultReply = {
  answer: "I'm not sure about that. I can help with: our mission and vision, where we work (Didinga in Lotukei, South Sudan), how to donate or become a member, volunteering, our impact (classrooms, students, teachers), contact details, and our board. Try one of the suggestions below or email contact@betiharisociety.org.",
  suggestedReplies: ['What is Beti-Hari Society?', 'How can I donate?', 'Where do you work?', 'Contact you'],
};
