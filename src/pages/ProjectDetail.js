import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Target, ImageIcon } from 'lucide-react';
import { useDonation } from '../contexts/DonationContext';
import { projectsService } from '../services/projectsService';
import { getProjectBySlug } from '../data/projects';

const gradientFromLeft = 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0) 100%)';
const gradientFromRight = 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0) 100%)';

const ProjectImage = ({ src, alt, caption, className = '', gradientFrom = null }) => {
  const imageContent = src ? (
    <img src={src} alt={alt || ''} className="w-full h-full min-h-[200px] object-cover rounded-xl border border-gray-200" />
  ) : (
    <div className="w-full min-h-[200px] aspect-[4/3] bg-gray-200 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
      <div className="text-center p-6">
        <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500 font-medium">{alt}</p>
        <p className="text-xs text-gray-400 mt-1">Image placeholder</p>
      </div>
    </div>
  );

  const gradientStyle = gradientFrom === 'left' ? gradientFromLeft : gradientFrom === 'right' ? gradientFromRight : null;

  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-xl">
        {imageContent}
        {gradientStyle && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{ background: gradientStyle }}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-500 italic">{caption}</figcaption>
      )}
    </figure>
  );
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const { openModal } = useDonation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const p = await projectsService.getBySlug(slug);
        if (!cancelled) setProject(p || getProjectBySlug(slug));
      } catch {
        if (!cancelled) setProject(getProjectBySlug(slug));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link to="/projects" className="text-primary-600 hover:underline">
            View all projects
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const progress = project.targetFunds > 0
    ? Math.min(100, Math.round(((project.raisedFunds || 0) / project.targetFunds) * 100))
    : 0;
  const remaining = Math.max(0, (project.targetFunds || 0) - (project.raisedFunds || 0));
  const images = project.images || [];

  const paragraphs = (project.story || '').split(/\n\n+/).filter(Boolean);
  const getImage = (index) => images[index] || null;

  return (
    <div>
      {/* Back link - compact */}
      <div className="bg-gray-50 border-b py-2">
        <div className="w-[75%] max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>

      {/* Compact hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-5">
        <div className="w-[75%] max-w-[75%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{project.title}</h1>
              <p className="text-sm text-primary-100 mt-0.5 line-clamp-2 sm:line-clamp-1">
                {project.shortDescription}
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-primary-200">Raised / Target</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(project.raisedFunds)} / {formatCurrency(project.targetFunds)}
                  </p>
                </div>
                <div className="w-24 sm:w-32">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-primary-200 mt-0.5">{progress}%</p>
                </div>
              </div>
              <button
                onClick={openModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-primary-700 font-semibold text-sm hover:bg-primary-50 transition-colors whitespace-nowrap"
              >
                <Target className="h-4 w-4" />
                Donate
              </button>
            </div>
          </div>
          {remaining > 0 && (
            <p className="text-xs text-primary-200 mt-3">{formatCurrency(remaining)} still needed</p>
          )}
        </div>
      </section>

      {/* Story content - 75% width, text + images integrated */}
      <section className="section-padding">
        <div className="w-[75%] max-w-[75%] mx-auto">
          <div className="w-full space-y-6 lg:space-y-8">
            {paragraphs.map((para, i) => {
              const img = getImage(i);
              const imageOnLeft = i % 2 === 1;

              return (
                <div
                  key={i}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center"
                >
                  {img && imageOnLeft ? (
                    <>
                      <div className="lg:col-start-1">
                        <ProjectImage src={img.src} alt={img.alt} caption={img.caption} gradientFrom="right" />
                      </div>
                      <div className="lg:col-start-2 flex items-center">
                        <p className="text-gray-700 leading-relaxed text-lg">{para}</p>
                      </div>
                    </>
                  ) : img ? (
                    <>
                      <div className="flex items-center">
                        <p className="text-gray-700 leading-relaxed text-lg">{para}</p>
                      </div>
                      <div>
                        <ProjectImage src={img.src} alt={img.alt} caption={img.caption} gradientFrom="left" />
                      </div>
                    </>
                  ) : (
                    <div className="lg:col-span-2">
                      <p className="text-gray-700 leading-relaxed text-lg">{para}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA - full width */}
          <div className="mt-16 lg:mt-20 w-full">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-10 lg:p-12 border border-primary-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Make a difference today</h2>
                  <p className="text-gray-700 text-lg">
                    Your donation goes directly to {project.title}. Every contribution—no matter the size—helps us move
                    closer to our goal and change lives in Lotukei.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button onClick={openModal} className="btn-primary text-lg px-8 py-4">
                    Donate to This Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetail;
