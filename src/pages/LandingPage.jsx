import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <h1 className="hero__title">Welcome to HireHub</h1>
          <p className="hero__subtitle">
            Join our team of innovators and make an impact. Start your journey
            with us today by expressing your interest in one of our departments.
          </p>
          <div className="hero__actions">
            <button
              className="hero__btn hero__btn--primary"
              onClick={() => navigate('/apply')}
            >
              Express Your Interest
            </button>
            <button
              className="hero__btn hero__btn--secondary"
              onClick={() => navigate('/admin')}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features__container">
          <h2 className="features__heading">Why Join Us?</h2>
          <p className="features__subheading">
            Discover what makes HireHub a great place to build your career.
          </p>
          <div className="features__grid">
            <FeatureCard
              icon="💡"
              title="Innovation"
              description="Work on cutting-edge projects that push boundaries and shape the future of technology. We encourage creative thinking and bold ideas."
            />
            <FeatureCard
              icon="📈"
              title="Growth"
              description="Accelerate your career with mentorship programs, learning opportunities, and clear paths for advancement within the organization."
            />
            <FeatureCard
              icon="🤝"
              title="Culture"
              description="Be part of a diverse, inclusive, and collaborative team that values every voice. We believe great work happens when people feel supported."
            />
            <FeatureCard
              icon="🌍"
              title="Impact"
              description="Make a meaningful difference in the lives of millions. Our products and services reach communities around the globe every day."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-section__container">
          <h2 className="cta-section__title">Ready to Get Started?</h2>
          <p className="cta-section__text">
            Take the first step toward an exciting career at HireHub. Submit
            your interest and our team will be in touch.
          </p>
          <button
            className="cta-section__btn"
            onClick={() => navigate('/apply')}
          >
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;