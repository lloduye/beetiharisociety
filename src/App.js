import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Mission from './pages/Mission';
import Services from './pages/Services';
import Education from './pages/Education';
import Impact from './pages/Impact';
import WhySupport from './pages/WhySupport';
import HowToHelp from './pages/HowToHelp';
import PeopleWeServe from './pages/PeopleWeServe';
import Leadership from './pages/Leadership';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/services" element={<Services />} />
            <Route path="/education" element={<Education />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/why-support" element={<WhySupport />} />
            <Route path="/how-to-help" element={<HowToHelp />} />
            <Route path="/people-we-serve" element={<PeopleWeServe />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 