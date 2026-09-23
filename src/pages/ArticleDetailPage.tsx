import { useState, useEffect, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Zap,
  ShoppingCart,
  Check,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ARTICLES_DATA, type Article } from '../data/articles';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import InstantOrderModal from '../components/InstantOrderModal';
import ArticleStickyContact from '../components/ArticleStickyContact';
import type { Product } from '../data/products';

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [instantOrderProd, setInstantOrderProd] = useState<Product | null>(null);
  const [addedProdId, setAddedProdId] = useState<string | null>(null);

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Find article by slug or id
  const article: Article | undefined = ARTICLES_DATA.find(
    (a) => a.slug === slug || a.id === slug || a.aliases?.includes(slug || '')
  );

  // Scroll to top when article loads/changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <section style={{ padding: 'calc(var(--header-height) + 60px) 20px 80px', minHeight: '70vh', textAlign: 'center', backgroundColor: 'var(--beige-bg)' }}>
        <Helmet>
          <title>Article Not Found | All Fresh Naturals</title>
        </Helmet>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '24px',
            padding: '48px 32px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)'
          }}>
            <BookOpen size={48} style={{ color: 'var(--primary)', marginBottom: '16px', opacity: 0.7 }} />
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '12px' }}>
              Article Not Found
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              The article you are looking for might have been moved or updated.
            </p>
            <Link
              to="/articles"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '50px' }}
            >
              <ArrowLeft size={16} /> Back to All Articles
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const renderFormattedText = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements: ReactNode[] = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        elements.push(text.slice(lastIdx, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith('/') || linkUrl.includes('allfreshnaturals.com');
      let internalPath = linkUrl;
      if (linkUrl.includes('allfreshnaturals.com')) {
        try {
          const parsed = new URL(linkUrl);
          internalPath = parsed.pathname + parsed.search + parsed.hash;
        } catch {
          internalPath = linkUrl.replace(/^https?:\/\/(www\.)?allfreshnaturals\.com/, '') || '/';
        }
      }

      if (isInternal) {
        elements.push(
          <Link
            key={match.index}
            to={internalPath}
            className="reader-inline-link"
          >
            {linkText}
          </Link>
        );
      } else {
        elements.push(
          <a
            key={match.index}
            href={linkUrl}
            className="reader-inline-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        );
      }
      lastIdx = linkRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      elements.push(text.slice(lastIdx));
    }

    return elements.length > 0 ? elements : text;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const linkedProduct = article.relatedProductId
    ? products.find((p) => p.id === article.relatedProductId) || null
    : null;

  const otherArticles = ARTICLES_DATA.filter((a) => a.id !== article.id && !article.aliases?.includes(a.id)).slice(0, 2);

  return (
    <div className="article-detail-page-wrapper">
      {article.id === 'benefits-of-ragi-malt' ? (
        <Helmet>
          <title id="metaTitle">Benefits of Ragi Malt | Nutrition, Health Benefits &amp; More</title>

          <meta
            name="description"
            id="metaDescription"
            content="Discover the benefits of ragi malt, including its nutritional value and potential benefits for digestion, bone health, energy, immunity, and overall wellness."
          />

          <meta
            name="keywords"
            id="metaKeywords"
            content="benefits of ragi malt, advantages of ragi malt, benefits of drinking ragi malt, benefits of drinking ragi malt daily, benefits of ragi malt with milk, daily ragi malt benefits"
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="Benefits of Ragi Malt | Nutrition, Health Benefits &amp; Wellness Guide"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="Explore the benefits of ragi malt, its key nutrients, and how this wholesome drink may support digestion, bone health, energy, immunity, and overall health and wellness."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/articles/benefits-of-ragi-malt"
          />

          <meta
            id="ogSiteName"
            property="og:site_name"
            content="All Fresh Naturals"
          />

          <meta
            id="ogImage"
            property="og:image"
            content="https://allfreshnaturals.com/assets/benefits-of-ragi-malt.jpg"
          />

          <meta
            id="twitterSite"
            name="twitter:site"
            content="https://twitter.com/"
          />

          <meta
            id="twitterTitle"
            name="twitter:title"
            content="Benefits of Ragi Malt | Nutrition, Health Benefits &amp; Wellness"
          />

          <meta
            id="twitterDescription"
            name="twitter:description"
            content="Looking to learn about the benefits of ragi malt? Discover its nutritional value and how this traditional drink may support digestion, bone health, energy, and overall wellness."
          />

          <meta
            id="author"
            name="author"
            content="Akshay"
          />

          <link
            id="canonical"
            rel="canonical"
            href="https://allfreshnaturals.com/articles/benefits-of-ragi-malt"
          />

          <meta
            id="indexingStatus"
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />

          <meta
            id="Publisher"
            property="publisher"
            content="All Fresh Naturals"
          />

          <meta
            property="og:locale"
            content="en_US"
          />
        </Helmet>
      ) : article.id === 'benefits-of-abc-malt' ? (
        <Helmet>
          <title id="metaTitle">Benefits of ABC Malt: Nutrition &amp; Health Benefits | AllFresh Naturals</title>

          <meta
            name="description"
            id="metaDescription"
            content="Discover the benefits of ABC malt, including its nutritional value and potential benefits for digestion, energy, immunity, bone health, and overall wellness."
          />

          <meta
            name="keywords"
            id="metaKeywords"
            content="benefits of abc malt, advantages of abc malt, benefits of drinking abc malt, benefits of drinking abc malt daily, benefits of abc malt with milk, daily abc malt benefits"
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="Benefits of ABC Malt | Nutrition, Health Benefits &amp; Wellness Guide"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="Explore the benefits of ABC malt, its key nutrients, and how this wholesome drink may support digestion, energy, immunity, bone health, and overall health and wellness."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/articles/benefits-of-abc-malt"
          />

          <meta
            id="ogSiteName"
            property="og:site_name"
            content="All Fresh Naturals"
          />

          <meta
            id="ogImage"
            property="og:image"
            content="https://allfreshnaturals.com/assets/benefits-of-abc-malt.jpg"
          />

          <meta
            id="twitterSite"
            name="twitter:site"
            content="https://twitter.com/"
          />

          <meta
            id="twitterTitle"
            name="twitter:title"
            content="Benefits of ABC Malt | Nutrition, Health Benefits &amp; Wellness"
          />

          <meta
            id="twitterDescription"
            name="twitter:description"
            content="Looking to learn about the benefits of ABC malt? Discover its nutritional value and how this wholesome drink may support digestion, energy, immunity, bone health, and overall wellness."
          />

          <meta
            id="author"
            name="author"
            content="Akshay"
          />

          <link
            id="canonical"
            rel="canonical"
            href="https://allfreshnaturals.com/articles/benefits-of-abc-malt"
          />

          <meta
            id="indexingStatus"
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />

          <meta
            id="Publisher"
            property="publisher"
            content="All Fresh Naturals"
          />

          <meta
            property="og:locale"
            content="en_US"
          />
        </Helmet>
      ) : (article.id === 'homemade-ragi-malt' || article.id === 'homemade-ragi-malt-recipe') ? (
        <Helmet>
          <title id="metaTitle">Homemade Ragi Malt: Nutrition &amp; Health Benefits | AllFresh Naturals</title>

          <meta
            name="description"
            id="metaDescription"
            content="Discover the benefits of homemade ragi malt, including its nutritional value and potential benefits for digestion, energy, bone health, and overall wellness."
          />

          <meta
            name="keywords"
            id="metaKeywords"
            content="homemade ragi malt, home made ragi malt, homemade ragi malt powder, ragi malt home made"
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="Homemade Ragi Malt | Nutrition, Health Benefits &amp; Wellness Guide"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="Explore homemade ragi malt, its key nutrients, and how this wholesome drink may support digestion, energy, bone health, bone strength, and overall health and wellness."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/articles/homemade-ragi-malt"
          />

          <meta
            id="ogSiteName"
            property="og:site_name"
            content="All Fresh Naturals"
          />

          <meta
            id="ogImage"
            property="og:image"
            content="https://allfreshnaturals.com/assets/homemade-ragi-malt.jpg"
          />

          <meta
            id="twitterSite"
            name="twitter:site"
            content="https://twitter.com/"
          />

          <meta
            id="twitterTitle"
            name="twitter:title"
            content="Homemade Ragi Malt | Nutrition, Health Benefits &amp; Wellness"
          />

          <meta
            id="twitterDescription"
            name="twitter:description"
            content="Looking to learn about homemade ragi malt? Discover its nutritional value and how this wholesome drink may support digestion, energy, bone health, and overall wellness."
          />

          <meta
            id="author"
            name="author"
            content="Akshay"
          />

          <link
            id="canonical"
            rel="canonical"
            href="https://allfreshnaturals.com/articles/homemade-ragi-malt"
          />

          <meta
            id="indexingStatus"
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />

          <meta
            id="Publisher"
            property="publisher"
            content="All Fresh Naturals"
          />

          <meta
            property="og:locale"
            content="en_US"
          />
        </Helmet>
      ) : (
        <Helmet>
          <title>{`${article.title} | All Fresh Naturals`}</title>
          <meta name="description" content={article.summary} />
          <meta property="og:title" content={`${article.title} | All Fresh Naturals`} />
          <meta property="og:description" content={article.summary} />
          <meta property="og:image" content={article.coverImage} />
          <meta property="og:type" content="article" />
          <link rel="canonical" href={`https://allfreshnaturals.com/articles/${article.slug}`} />
        </Helmet>
      )}

      {/* Top Breadcrumbs & Back Bar */}
      <section className="article-detail-topbar">
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <ChevronRight size={13} />
              <Link to="/articles" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Articles</Link>
              <ChevronRight size={13} />
              <span style={{ color: 'var(--primary)', fontWeight: 600, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {article.title}
              </span>
            </div>

            {/* Back to list button */}
            <Link
              to="/articles"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                backgroundColor: 'var(--cream)',
                borderColor: 'var(--border-color)',
                color: 'var(--primary)'
              }}
            >
              <ArrowLeft size={15} /> All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* Main Article Container */}
      <main className="article-detail-container">
        <div className="article-detail-layout">
          <article className="article-detail-card">
          {/* Article Header Meta */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontWeight: 800,
                color: '#15803d',
                backgroundColor: '#edf7f0',
                padding: '4px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {article.category}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {article.readTime}
              </span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} /> {article.publishedDate}
              </span>
            </div>

            {/* Copy Link action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="reader-action-btn"
                onClick={handleCopyLink}
                title="Copy link to clipboard"
              >
                {copiedLink ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="article-detail-title">
            {article.title}
          </h1>

          {/* Author & FSSAI Bar */}
          <div className="reader-author-bar">
            <div className="reader-author-left">
              <div className="reader-author-avatar">{article.author.avatarInitials}</div>
              <div>
                <div className="reader-author-name">{article.author.name}</div>
                <div className="reader-author-role">{article.author.role} • All Fresh Naturals</div>
              </div>
            </div>
            <div className="reader-fssai-badge">
              <ShieldCheck size={16} />
              <span>FSSAI Lic. 21226186000460</span>
            </div>
          </div>

          {/* Cover Hero Image */}
          <div className="article-detail-cover">
            <img
              src={article.coverImage}
              alt={article.title}
            />
          </div>

          {/* Lead Summary (only show if article does not already start with an Introduction section) */}
          {article.summary && !article.sections.some(s => s.heading?.toLowerCase() === 'introduction') && (
            <p className="reader-lead-summary">
              {article.summary}
            </p>
          )}

          {/* Key Health Takeaways */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="reader-takeaways-card">
              <div className="takeaways-header">
                <Leaf size={16} color="var(--primary-color)" />
                <strong>Key Health Takeaways</strong>
              </div>
              <ul className="takeaways-list">
                {article.keyTakeaways.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} className="check-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Table of Contents Box */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="reader-toc-card">
              <div className="toc-header">
                <div className="toc-header-left">
                  <div className="toc-icon-wrap">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <strong className="toc-header-title">Table of Contents</strong>
                    <span className="toc-header-badge">{article.tableOfContents.length} Sections • Quick Jump</span>
                  </div>
                </div>
              </div>
              <ul className="toc-list">
                {article.tableOfContents.map((item, idx) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const target = document.getElementById(item.id);
                        if (target) {
                          const yOffset = -90;
                          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className="toc-link"
                    >
                      <span className="toc-number">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="toc-title">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Sections Flow */}
          <div className="reader-content-flow" style={{ marginBottom: '36px' }}>
            {article.sections.map((sec, sIdx) => (
              <div key={sIdx} id={sec.id} className="reader-section-block">
                {sec.heading && <h2 className="reader-section-h2">{renderFormattedText(sec.heading)}</h2>}
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="reader-paragraph">{renderFormattedText(p)}</p>
                ))}
                {sec.bulletList && (
                  <ul className="reader-bullet-list">
                    {sec.bulletList.map((bItem, bIdx) => (
                      <li key={bIdx}>{renderFormattedText(bItem)}</li>
                    ))}
                  </ul>
                )}
                {sec.table && (
                  <div className="reader-table-wrap">
                    <table className="reader-table">
                      {sec.table.caption && <caption>{sec.table.caption}</caption>}
                      <thead>
                        <tr>
                          {sec.table.headers.map((h, hIdx) => (
                            <th key={hIdx}>{renderFormattedText(h)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{renderFormattedText(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {sec.footerContent && sec.footerContent.map((p, fIdx) => (
                  <p key={`f-${fIdx}`} className="reader-paragraph">{renderFormattedText(p)}</p>
                ))}
                {sec.subsections && sec.subsections.map((sub, subIdx) => (
                  <div key={subIdx} className="reader-subsection-block">
                    <h3 className="reader-subsection-h3">{renderFormattedText(sub.title)}</h3>
                    {sub.content.map((p, pIdx) => (
                      <p key={pIdx} className="reader-paragraph">{renderFormattedText(p)}</p>
                    ))}
                    {sub.bulletList && (
                      <ul className="reader-bullet-list">
                        {sub.bulletList.map((bItem, bIdx) => (
                          <li key={bIdx}>{renderFormattedText(bItem)}</li>
                        ))}
                      </ul>
                    )}
                    {sub.footerContent && sub.footerContent.map((p, sfIdx) => (
                      <p key={`sf-${sfIdx}`} className="reader-paragraph">{renderFormattedText(p)}</p>
                    ))}
                  </div>
                ))}
                {sec.recipe && (
                  <div className="reader-recipe-card">
                    <div className="recipe-badge">Homemade Kitchen Recipe</div>
                    <div className="recipe-grid">
                      <div className="recipe-col">
                        <h4 className="recipe-subheading">Ingredients</h4>
                        <ul className="recipe-ingredients-list">
                          {sec.recipe.ingredients.map((ing, iIdx) => (
                            <li key={iIdx}>
                              <span className="bullet-dot">•</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="recipe-col">
                        <h4 className="recipe-subheading">Step-by-Step Method</h4>
                        <ol className="recipe-steps-list">
                          {sec.recipe.method.map((step, mIdx) => (
                            <li key={mIdx}>
                              <span className="step-num">{mIdx + 1}</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    {sec.recipe.note && (
                      <div className="recipe-note-callout">
                        <strong>Chef's Note:</strong> {sec.recipe.note}
                      </div>
                    )}
                  </div>
                )}
                {sec.quote && (
                  <blockquote className="reader-quote">
                    {sec.quote}
                  </blockquote>
                )}
              </div>
            ))}
          </div>

          {/* Frequently Asked Questions */}
          {article.faqs && article.faqs.length > 0 && (
            <div id="faqs" className="reader-faq-section">
              <div className="faq-section-header">
                <h2 className="reader-section-h2" style={{ marginTop: 0, marginBottom: '6px' }}>Frequently Asked Questions</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Clear answers to everyday questions about ragi malt nutrition, safety, and consumption.</p>
              </div>
              <div className="faq-items-list">
                {article.faqs.map((faq, fIdx) => (
                  <details key={fIdx} className="reader-faq-item" open={fIdx === 0}>
                    <summary className="faq-question">
                      <span>{faq.question}</span>
                    </summary>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* FEATURED PRODUCT IN ARTICLE BOX */}
          {linkedProduct && (
            <div id="featured-product-callout" className="reader-product-callout">
              <div className="callout-header">
                <ShoppingBag size={18} />
                <div>
                  <strong>Handcrafted Product Mentioned in This Guide</strong>
                  <p>Prepared in small batches with genuine traditional ingredients</p>
                </div>
              </div>
              <div className="callout-prod-content">
                <div className="callout-prod-img-wrap">
                  <img
                    src={linkedProduct.image}
                    alt={linkedProduct.name}
                    className="callout-prod-img"
                  />
                </div>
                <div className="callout-prod-info">
                  {linkedProduct.badge && (
                    <span className="store-card-badge" style={{ position: 'static', display: 'inline-block', marginBottom: 4 }}>
                      {linkedProduct.badge}
                    </span>
                  )}
                  <h3 className="callout-prod-title">{linkedProduct.name}</h3>
                  <p className="callout-prod-tagline">{linkedProduct.tagline}</p>
                  <div className="callout-prod-price">
                    <strong>₹{linkedProduct.price}</strong>
                    {linkedProduct.originalPrice && (
                      <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem', marginLeft: '4px' }}>
                        ₹{linkedProduct.originalPrice}
                      </span>
                    )}
                    <span>/ {linkedProduct.size}</span>
                  </div>
                </div>
                <div className="callout-prod-actions">
                  <button
                    type="button"
                    className={`callout-add-btn${addedProdId === linkedProduct.id ? ' callout-add-btn--added' : ''}`}
                    onClick={() => {
                      if (!isAuthenticated) {
                        openAuthModal();
                        return;
                      }
                      addToCart(linkedProduct, 1);
                      setAddedProdId(linkedProduct.id);
                      setTimeout(() => setAddedProdId(null), 1500);
                    }}
                  >
                    {addedProdId === linkedProduct.id ? (
                      <><Check size={15} /> Added to Cart!</>
                    ) : (
                      <><ShoppingCart size={15} /> Add to Cart</>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn-buy-now-card"
                    onClick={() => {
                      setInstantOrderProd(linkedProduct);
                    }}
                  >
                    <Zap size={15} fill="currentColor" /> Buy Now
                  </button>

                  <Link
                    to="/products"
                    className="callout-view-store-link"
                  >
                    View in Store →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Related Articles Section */}
          {otherArticles.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '28px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '18px' }}>
                Continue Reading More Guides
              </h3>
              <div className="article-detail-related-grid">
                {otherArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/articles/${rel.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/articles/${rel.slug}`);
                    }}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--cream)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.25s ease'
                    }}
                    className="related-article-page-card"
                  >
                    <div style={{ height: '160px', overflow: 'hidden', background: 'linear-gradient(180deg, #fdfbf7 0%, #f4eee1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                        {rel.category}
                      </span>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--primary)', lineHeight: '1.35', marginBottom: '8px' }}>
                        {rel.title}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {rel.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back button at the bottom */}
          <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <Link
              to="/articles"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '50px',
                fontSize: '0.88rem'
              }}
            >
              <ArrowLeft size={16} /> Back to All Articles
            </Link>
          </div>
        </article>

        {/* Sticky Sidebar Beside Article */}
        <aside className="article-sidebar-sticky" aria-label="Kitchen Helpline & Contact Form">
          <ArticleStickyContact
            articleTitle={article.title}
            linkedProduct={linkedProduct}
          />
        </aside>
      </div>
    </main>

      {/* Instant Order Modal */}
      {instantOrderProd && (
        <InstantOrderModal
          product={instantOrderProd}
          isOpen={!!instantOrderProd}
          onClose={() => setInstantOrderProd(null)}
        />
      )}
    </div>
  );
}
