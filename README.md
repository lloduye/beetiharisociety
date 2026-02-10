# Beti-Hari Society for Education & Economic Development

A modern, responsive React website for the Beti-Hari Society, a nonprofit organization dedicated to providing quality education and community development in South Sudan.

## 🌟 Features

- **Modern Design**: Clean, professional design with beautiful gradients and typography
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Navigation**: Smooth navigation with active state indicators
- **Contact Forms**: Functional contact forms with email integration
- **Donation Options**: Clear donation pathways and information
- **Accessibility**: Built with accessibility best practices
- **Performance**: Optimized for fast loading and smooth interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd beti-hari-society
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (optional):

```bash
cp .env.example .env
# Edit .env and set your admin password
```

4. Start the development server:

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🔐 Admin Dashboard

The website includes a fully functional admin dashboard for tracking donations and managing the organization.

### Accessing the Dashboard

1. Navigate to `/dashboard/login` (e.g., `http://localhost:3000/dashboard/login`)
2. Enter the admin password (default: `betihari2024` or set via `REACT_APP_ADMIN_PASSWORD` environment variable)
3. Once logged in, you'll have access to the dashboard at `/dashboard`

### Dashboard Features

- **Donation Tracking**: View all donations with details (donor name, amount, date, project, status)
- **Statistics**: Real-time stats including total raised, total donations, monthly totals, and average donation
- **Search & Filter**: Search donations by name/email and filter by time period
- **Export**: Export donation data to CSV for external analysis
- **Stripe Donations**: Donations are processed with Stripe Checkout (one-time payments)

### Setting Up Stripe Donations

1. Create a Stripe account and get your **Secret key** from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. In Netlify: **Site settings → Environment variables** → Add `STRIPE_SECRET_KEY` with your secret key (mark as secret/sensitive).
3. Redeploy the site. The donation modal will create a Checkout Session and redirect donors to Stripe’s hosted payment page.
4. Optionally, use Stripe webhooks to record donations in your own database or dashboard; the dashboard currently shows sample data.

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation component
│   └── Footer.js       # Footer component
├── pages/              # Page components
│   ├── Home.js         # Homepage
│   ├── About.js        # About page
│   ├── Mission.js      # Mission & Vision page
│   ├── WhatWeDo.js     # Programs page
│   ├── Impact.js       # Impact page
│   ├── GetInvolved.js  # Get Involved page
│   └── Contact.js      # Contact page
├── App.js              # Main app component with routing
├── index.css           # Global styles and Tailwind CSS
└── index.js            # App entry point
```

## 🎨 Design System

### Colors

- **Primary**: Blue shades (#0ea5e9, #0284c7, #0369a1)
- **Secondary**: Yellow shades (#eab308, #ca8a04, #a16207)
- **Neutral**: Gray shades for text and backgrounds

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components

- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Consistent card design with shadows and hover effects
- **Sections**: Standardized section padding and container widths

## 📱 Pages

### Home

- Hero section with call-to-action buttons
- Quick highlights with statistics
- Mission preview
- Call-to-action section

### About

- Organization overview
- Core values
- The people we serve (Didinga community)
- Leadership information

### Mission & Vision

- Mission statement
- Vision statement
- Why education matters
- Impact areas

### What We Do

- Core programs overview
- Educational access focus
- Holistic development initiatives
- Community approach

### Impact

- Key achievements
- Areas of impact
- Teacher stories
- Future goals

### Get Involved

- Ways to help
- Donation options
- Why support us
- Spread the word

### Contact

- Contact information
- Contact form
- Service areas
- Quick contact details

## 🛠️ Technologies Used

- **React**: Frontend framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Google Fonts**: Typography

## 📧 Contact Information

- **General Inquiries**: contact@betiharisociety.org
- **Donations**: donate@betiharisociety.org
- **Service Areas**: Budi County & Lotukei sub-county, South Sudan

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy Options

1. **Netlify**: Drag and drop the `build` folder to Netlify
2. **Vercel**: Connect your repository to Vercel for automatic deployments
3. **GitHub Pages**: Use `gh-pages` package for GitHub Pages deployment
4. **Traditional Hosting**: Upload the `build` folder to any web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for the Beti-Hari Society for Education & Economic Development. All rights reserved.

## 🙏 Acknowledgments

- The Beti-Hari Society team for their mission and vision
- The Didinga community in South Sudan
- All volunteers and supporters of the organization

---

**Beti-Hari Society for Education & Economic Development**
Empowering children and communities through purpose-driven education in South Sudan.
