import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, DollarSign } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';
import { projectsService } from '../services/projectsService';
import { projects as staticProjects } from '../data/projects';

const Projects = () => {
  const { openModal } = useDonation();
  // Start with static data so page renders immediately (no spinner flicker)
  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const list = await projectsService.getAll();
        if (!cancelled && list?.length > 0) setProjects(list);
      } catch {
        /* keep static fallback */
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const getProgressPercent = (raised, target) =>
    target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Projects</h1>
            <p className="text-xl text-primary-100">
              Our work in Lotukei sub-county focuses on education, teacher development, and community empowerment.
              Support a specific project and see your impact.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => {
              const progress = getProgressPercent(project.raisedFunds, project.targetFunds);
              const slug = project.slug || project.id;
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.shortDescription}</p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatCurrency(project.raisedFunds)} raised
                        </span>
                        <span>Target: {formatCurrency(project.targetFunds)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progress}% funded</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to={`/projects/${slug}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors"
                      >
                        View Project
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={openModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
                      >
                        <Target className="h-4 w-4" />
                        Donate to This Project
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
