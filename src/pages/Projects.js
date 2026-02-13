import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, DollarSign } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';
import { projectsService } from '../services/projectsService';
import { projects as staticProjects } from '../data/projects';

const Projects = () => {
  const { openModal } = useDonation();

  const [currentProjects, setCurrentProjects] = useState(staticProjects.filter(() => true));
  const [pastProjects, setPastProjects] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const list = await projectsService.getAll();
        if (!cancelled && list?.length > 0) {
          setCurrentProjects(list.filter((p) => (p.status || 'current') === 'current'));
          setPastProjects(list.filter((p) => p.status === 'past' || p.status === 'completed'));
        }
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

      {/* Current Projects Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentProjects.map((project) => {
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

      {/* Past Projects */}
      {pastProjects.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Projects</h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Completed and past initiatives that have made a lasting impact in Lotukei.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastProjects.map((project) => {
                const progress = getProgressPercent(project.raisedFunds, project.targetFunds);
                const slug = project.slug || project.id;
                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow opacity-95"
                  >
                    <div className="p-6">
                      <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
                        {project.status === 'completed' ? 'Completed' : 'Past'}
                      </span>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 mt-1">{project.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.shortDescription}</p>
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
                            className="h-full bg-primary-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{progress}% funded</p>
                      </div>
                      <Link
                        to={`/projects/${slug}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors"
                      >
                        View Project
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Projects;
