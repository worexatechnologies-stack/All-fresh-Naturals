import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  ArrowRight,
  Leaf,
  BookOpen,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Heart
} from 'lucide-react';
import { ARTICLES_DATA } from '../data/articles';
import { useProducts } from '../context/ProductContext';

export default function ArticlesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products } = useProducts();

  // Redirect legacy deep links (?id=slug) to /articles/:slug
  useEffect(() => {
    const articleId = searchParams.get('id');
    if (articleId) {
      const found = ARTICLES_DATA.find((a) => a.id === articleId || a.slug === articleId || a.aliases?.includes(articleId));
      if (found) {
        navigate(`/articles/${found.slug}`, { replace: true });
      }
    }
  }, [searchParams, navigate]);

  // Helper to find related product object
  const getProductForArticle = (prodId?: string) => {
    if (!prodId) return null;
    return products.find((p) => p.id === prodId) || null;
  };

  return (
    <>
      {/* 1. AESTHETIC EDITORIAL HERO HEADER */}
      <section className="articles-aesthetic-hero">
        <div className="container">
          <div className="aesthetic-hero-inner">
            <div className="aesthetic-tagline">
              <Leaf size={14} className="aesthetic-leaf-icon" />
              <span>NATURAL NUTRITION JOURNAL</span>
            </div>

            <h1 className="aesthetic-hero-title">
              Ancient Grain Wisdom &amp; Clean Living Guides
            </h1>

            <p className="aesthetic-hero-subtitle">
              Thoughtful articles on Ayurvedic grain sprouting, blood purification science, and wholesome home kitchen recipes.
            </p>

            {/* Aesthetic Trust Badges */}
            <div className="aesthetic-pill-strip">
              <span className="aesthetic-pill-item">
                <Leaf size={13} /> 100% Homemade Recipes
              </span>
              <span className="aesthetic-pill-item">
                <BookOpen size={13} /> Ayurvedic Grain Science
              </span>
              <span className="aesthetic-pill-item">
                <Heart size={13} /> Zero White Sugar
              </span>
              <span className="aesthetic-pill-item">
                <ShieldCheck size={13} /> FSSAI Certified Kitchen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AESTHETIC ARTICLES GRID */}
      <section className="articles-aesthetic-section">
        <div className="container">
          <div className="articles-grid">
            {ARTICLES_DATA.map((article) => {
              const linkedProduct = getProductForArticle(article.relatedProductId);
              return (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="aesthetic-article-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={(e) => {
                    // Prevent multiple dispatches and ensure instant navigation anywhere on mobile
                    e.preventDefault();
                    navigate(`/articles/${article.slug}`);
                  }}
                  role="link"
                  tabIndex={0}
                  aria-label={`Read article: ${article.title}`}
                >
                  <div className="article-card-thumb-wrap">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="article-card-thumb"
                    />
                  </div>

                  <div className="aesthetic-card-body">
                    <div className="article-card-meta">
                      <span className="meta-item">
                        <Clock size={12} /> {article.readTime}
                      </span>
                      <span className="meta-item">
                        <Calendar size={12} /> {article.publishedDate}
                      </span>
                    </div>

                    <h3 className="aesthetic-card-title">
                      {article.title}
                    </h3>

                    <p className="aesthetic-card-summary">
                      {article.summary}
                    </p>

                    {/* Linked Product Micro Badge */}
                    {linkedProduct && (
                      <div className="article-linked-prod-micro">
                        <Tag size={12} />
                        <span>Mentions: <strong>{linkedProduct.name}</strong></span>
                      </div>
                    )}

                    <div className="aesthetic-card-footer">
                      <div className="article-author-mini">
                        <div className="author-mini-avatar">{article.author.avatarInitials}</div>
                        <span className="author-mini-name">{article.author.name}</span>
                      </div>

                      <div className="article-card-actions">
                        <span className="btn-aesthetic-read">
                          Read Article <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 3. AESTHETIC ARTISAN KITCHEN FOOTER CARD */}
          <div className="artisan-kitchen-banner">
            <div className="artisan-banner-icon">
              <Leaf size={24} />
            </div>
            <div className="artisan-banner-text">
              <h3>Prepared with Care, Rooted in Tradition</h3>
              <p>
                We believe healthy food shouldn't come with shortcuts, preservatives, or artificial additives. Every recipe and malt mix is crafted with the same honest care we give our own family in Bengaluru.
              </p>
            </div>
            <div className="artisan-banner-actions">
              <Link to="/products" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', borderRadius: '50px' }}>
                <ShoppingBag size={15} /> Explore All Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
