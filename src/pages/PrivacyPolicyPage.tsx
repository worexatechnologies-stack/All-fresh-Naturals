import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, ArrowLeft, Globe, Award } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title id="metaTitle">
          All Fresh Naturals Privacy Policy | Your Data &amp; Privacy
        </title>

        <meta
          name="description"
          id="metaDescription"
          content="Read the All Fresh Naturals Privacy Policy to learn how we collect, use, store, and protect personal information when you browse our website, place orders, or contact us."
        />

        <meta
          name="keywords"
          id="metaKeywords"
          content="all fresh naturals privacy policy, privacy policy of all fresh naturals, privacy policy at all fresh naturals"
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Read All Fresh Naturals Privacy Policy | Data Protection"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Understand the All Fresh Naturals Privacy Policy and how we collect, use, protect, store, and manage your personal information while you use our website and services."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/privacy-policy"
        />

        <meta
          id="ogSiteName"
          property="og:site_name"
          content="All Fresh Naturals"
        />

        <meta
          id="ogImage"
          property="og:image"
          content="https://allfreshnaturals.com/assets/logo-CNxtV1g6.jpg"
        />

        <meta
          id="twitterSite"
          name="twitter:site"
          content="https://twitter.com/"
        />

        <meta
          id="twitterTitle"
          name="twitter:title"
          content="All Fresh Naturals Privacy Policy | Information Security"
        />

        <meta
          id="twitterDescription"
          name="twitter:description"
          content="Learn about the All Fresh Naturals Privacy Policy, including personal data collection, usage, protection, storage, and your privacy choices when using our website."
        />

        <meta
          id="author"
          name="author"
          content="Akshay"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/privacy-policy"
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

      {/* Hero Banner */}
      <section className="hero-section" style={{ minHeight: '38vh', padding: 'calc(var(--header-height) + 20px) 20px 32px' }}>
        <div className="container">
          <div className="hero-content" style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--gold-accent)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px'
            }}>
              <ShieldCheck size={16} /> Legal &amp; Data Protection
            </span>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>
              Privacy Policy
            </h1>
            <p className="hero-desc" style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.6' }}>
              Our concern for your privacy will make you feel comfortable when browsing and shopping on the All Fresh Naturals' site at <a href="https://www.allfreshnaturals.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>www.allfreshnaturals.com</a>.
            </p>
            <p style={{ color: 'var(--gold-accent)', fontSize: '0.84rem', marginTop: '12px', fontWeight: 600 }}>
              Last updated: September 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '48px 0 80px', backgroundColor: 'var(--beige-bg)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Link
              to="/"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                backgroundColor: 'var(--white)',
                borderColor: 'var(--border-color)',
                color: 'var(--primary-color)'
              }}
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>

          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: '24px',
            padding: '40px 36px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            {/* Intro Notice */}
            <div style={{
              backgroundColor: '#faf8f4',
              padding: '20px 24px',
              borderRadius: '16px',
              borderLeft: '4px solid var(--primary-color)',
              color: 'var(--text-dark)',
              lineHeight: '1.7',
              fontSize: '0.95rem'
            }}>
              This Privacy Policy will tell you what type of information is collected from you by us, the purposes of the collection, and how the data is protected.
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>1</span>
                What Information We Collect
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '10px' }}>
                The following types of data can be collected during visits to our site, placing orders, and communicating with us:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '22px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Name</li>
                <li>Phone number</li>
                <li>Email</li>
                <li>Billing address</li>
                <li>Delivery address</li>
                <li>Order/purchase information</li>
                <li>Payment-related data</li>
                <li>Information submitted when you communicate with us</li>
                <li>Device data and information regarding your use of our website.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>2</span>
                How We Use Your Information
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '10px' }}>
                Your data is used for:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '22px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Processing and delivering your orders</li>
                <li>Confirmation of payments and orders</li>
                <li>Customer support services</li>
                <li>Answering your questions and enquiries</li>
                <li>Updating you about your orders and delivery</li>
                <li>Improvement of our products and website</li>
                <li>Getting insight into our customers' website use</li>
                <li>Protection against fraud and protection of our website</li>
                <li>Sending offers and promotions, where applicable</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>3</span>
                Cookies
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                Cookies and similar technologies may be used on our website to make your browsing more comfortable.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                Cookies allow us to track the website's activity, understand your preferences, optimize website performance, and measure the effectiveness of marketing campaigns.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                You can control or block cookies using your browser's settings. Some features of the site may work improperly without cookies.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>4</span>
                Payment Information
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                Payments may be made using third-party payment processors. We do not typically store credit/debit card numbers, CVVs, and other types of sensitive payment data on our server.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                The payment information is processed according to the security policy of the payment processor.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>5</span>
                Information Sharing
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '10px' }}>
                Your personal information will not be sold or rented to third parties. The essential personal information may be shared with trusted service providers that help us run our business, including:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '22px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <li>Payment processors</li>
                <li>Shipping and logistics service providers</li>
                <li>Website and hosting providers</li>
                <li>Analytics and marketing services providers</li>
                <li>Customer support service providers</li>
              </ul>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                Your personal information may be shared when it is required by law.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>6</span>
                Protecting Your Information
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                We make efforts to protect your information against any form of unauthorized access, use, loss, or disclosure. Note that there is no completely secure online environment.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>7</span>
                Retaining Your Information
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                Your information will be retained by us for only as long as required to deliver our services, process transactions, retain business records, solve disputes, prevent fraud, and comply with any applicable laws.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                Where it is no longer required, it will be destroyed or made anonymous.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>8</span>
                Your Choices About Your Privacy
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '10px' }}>
                Where applicable by law, you are entitled to:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '22px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <li>Get access to your personal information</li>
                <li>Ask for correction of inaccurate information</li>
                <li>Make a request for deletion of some information</li>
                <li>Revoke your consent, where possible</li>
                <li>Opt out of receiving marketing communications</li>
              </ul>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                For this purpose, please get in touch with us through the contact information provided below.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>9</span>
                Privacy of Children
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                This website does not intend to collect personal information from children without proper parental or guardian involvement.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                In case you feel a child has disclosed any personal information to us, then please contact us.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>10</span>
                Amendments to This Privacy Policy
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                We reserve the right to amend this Privacy Policy in case of any changes in our business, services, or other legal requirements.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                Any amendments will be made on this webpage with an updated effective date.
              </p>
            </div>

            {/* Section 11 - Contact Information Box */}
            <div style={{
              backgroundColor: 'var(--beige-bg)',
              borderRadius: '18px',
              padding: '28px 30px',
              border: '1.5px solid var(--border-color)',
              marginTop: '8px'
            }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'var(--white)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>11</span>
                Contact Information
              </h2>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.94rem', marginBottom: '16px', lineHeight: '1.6' }}>
                In case you have any queries or concerns related to this Privacy Policy and our processing of personal information, please contact us at:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.94rem', color: 'var(--text-dark)' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary-color)', letterSpacing: '0.3px' }}>
                  All Fresh Naturals
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Globe size={18} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>Website: <a href="https://www.allfreshnaturals.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>www.allfreshnaturals.com</a></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>Email: <a href="mailto:poori.monika@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>poori.monika@gmail.com</a></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>Phone: <a href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>+91 85534 28079</a></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} style={{ color: 'var(--gold-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Address: #251/B, Anjineya Temple Street, Uttarahalli, Bangalore-560061</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={18} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>Lic. No. <strong>21226186000460</strong></span>
                </div>
              </div>

              <p style={{ marginTop: '20px', fontSize: '0.92rem', color: 'var(--accent-color)', fontWeight: 600, borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginBottom: 0 }}>
                💚 Handcrafted with love and utmost respect for your privacy and health.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
