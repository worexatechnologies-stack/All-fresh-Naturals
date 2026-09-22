import { Link } from 'react-router-dom';
import { FileText, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title id="metaTitle">
          All Fresh Naturals Terms and Conditions | Customer Guidelines
        </title>

        <meta
          name="description"
          id="metaDescription"
          content="Please review All Fresh Naturals terms and conditions, which include guidelines on website usage, product purchases, orders, payments, and customer responsibilities."
        />

        <meta
          name="keywords"
          id="metaKeywords"
          content="all fresh naturals terms and conditions, terms and conditions of all fresh naturals, all fresh naturals terms, all fresh naturals conditions"
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Read All Fresh Naturals Terms and Conditions | Policies"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Review All Fresh Naturals Terms and Conditions for information about website access, purchases, orders, payments, customer responsibilities, and the policies that govern your use of our services."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/terms-and-conditions"
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
          content="All Fresh Naturals Terms and Conditions | Important Guidelines"
        />

        <meta
          id="twitterDescription"
          name="twitter:description"
          content="Learn about All Fresh Naturals Terms and Conditions, including website usage, product purchases, order requirements, customer responsibilities, policies, and other important information."
        />

        <meta
          id="author"
          name="author"
          content="Akshay"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/terms-and-conditions"
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
          <div className="hero-content" style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
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
              <FileText size={16} /> Legal & Policies
            </span>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>
              Terms and Conditions
            </h1>
            <p className="hero-desc" style={{ fontSize: '0.98rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
              Welcome to All Fresh Naturals. These Terms and Conditions govern your use of our website and the purchase of our homemade products. By placing an order or using our website, you agree to these terms.
            </p>
            <p style={{ color: 'var(--gold-accent)', fontSize: '0.82rem', marginTop: '12px', fontWeight: 600 }}>
              Last updated: August 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Terms Content */}
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
            {/* Section 1 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>1</span>
                About Us
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                All Fresh Naturals is a small batch, homemade food initiative based in Uttarahalli, Bengaluru. All products (Ragi Malt Health Mix and ABC Malt Powder) are prepared personally by Poornima in a home kitchen under <strong>FSSAI License No. 21226186000460</strong>.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                We do not operate a large commercial factory. Every batch is made fresh after orders are confirmed.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>2</span>
                Acceptance of Terms
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                By browsing our website, placing an order via WhatsApp, or purchasing our products, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                If you do not agree with any part of these terms, please do not place an order.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>3</span>
                Products
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>All products are homemade, prepared in small batches, and free from artificial preservatives, colours, and chemical stabilisers.</li>
                <li>Because our products are freshly prepared, slight variations in colour, aroma, or texture may occur between batches. This is natural and does not affect quality.</li>
                <li>We reserve the right to change product formulations, packaging, or availability without prior notice.</li>
                <li>Product images on the website are for representation purposes only.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>4</span>
                Ordering Process
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Orders are currently accepted primarily through WhatsApp.</li>
                <li>When you send an order, you will receive a confirmation message from us with product details, total amount, and approximate delivery timeline.</li>
                <li>An order is considered confirmed only after we send a clear confirmation message.</li>
                <li>We reserve the right to refuse or cancel any order at our discretion (for example, if ingredients are unavailable or if there is suspicion of misuse).</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>5</span>
                Pricing
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.</li>
                <li>Prices may change from time to time. The price applicable will be the one confirmed at the time of your order.</li>
                <li>Delivery charges (if any) will be clearly communicated before order confirmation.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>6</span>
                Payment
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Payment methods will be shared with you during order confirmation (commonly UPI or bank transfer).</li>
                <li>Full payment is required before the product is prepared and dispatched, unless otherwise agreed.</li>
                <li>We do not store your payment information on our website.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>7</span>
                Delivery
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>We currently deliver primarily within Bangalore.</li>
                <li>For locations outside Bangalore, delivery options (if available) will be discussed on WhatsApp.</li>
                <li>Delivery timelines are approximate and depend on preparation time and courier/availability.</li>
                <li>Once the product is handed over to the delivery partner, All Fresh Naturals is not responsible for delays caused by the courier, traffic, weather, or incorrect address provided by the customer.</li>
                <li>Please ensure someone is available to receive the order. We are not responsible for products left unattended.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>8</span>
                Cancellation & Refunds
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>You may cancel an order before we begin preparation by informing us on WhatsApp.</li>
                <li>Once preparation has started, cancellation is generally not possible because products are made fresh in small batches.</li>
                <li>In case of any quality issue (spoilage, damaged packaging, or wrong product), please contact us within 24 hours of delivery with clear photos. We will review and offer a replacement or refund at our discretion.</li>
                <li>Refunds, when approved, will be processed to the original payment method within 5 to 7 working days.</li>
                <li>We do not offer refunds for change of mind after the product has been prepared or delivered.</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>9</span>
                Product Quality & Storage
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Our products contain no chemical preservatives. Please store them as advised (usually in a clean, dry place or refrigerated after opening).</li>
                <li>Best before dates or recommended usage periods will be mentioned on the packaging or shared with you.</li>
                <li>We are not responsible for spoilage caused by improper storage after delivery.</li>
              </ul>
            </div>

            {/* Section 10 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>10</span>
                Health & Allergen Disclaimer
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Our products are made from natural ingredients. However, individual reactions can vary.</li>
                <li>Customers with allergies (especially to nuts or any specific grains) should carefully check the ingredient list and consult a doctor if needed.</li>
                <li>Our products are not intended to diagnose, treat, cure, or prevent any medical condition. They are traditional food products for general nutrition and wellness.</li>
                <li>Pregnant women, nursing mothers, and individuals with medical conditions should seek professional advice before use.</li>
              </ul>
            </div>

            {/* Section 11 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>11</span>
                Intellectual Property
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                All content on this website (text, images, logo, product names, and design) belongs to All Fresh Naturals. You may not copy, reproduce, or use any content for commercial purposes without our written permission.
              </p>
            </div>

            {/* Section 12 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>12</span>
                Limitation of Liability
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', marginBottom: '8px' }}>
                To the fullest extent permitted by law:
              </p>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>All Fresh Naturals shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</li>
                <li>Our total liability for any claim related to a product shall not exceed the amount paid by you for that specific order.</li>
              </ul>
            </div>

            {/* Section 13 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>13</span>
                User Conduct
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                You agree not to misuse the website or WhatsApp ordering system, including placing false orders, providing incorrect information, or engaging in any abusive behaviour.
              </p>
            </div>

            {/* Section 14 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>14</span>
                Changes to These Terms
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                We may update these Terms and Conditions from time to time. The latest version will always be available on this page. Continued use of our services after changes means you accept the updated terms.
              </p>
            </div>

            {/* Section 15 */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>15</span>
                Governing Law
              </h2>
              <p style={{ color: 'var(--text-dark)', lineHeight: '1.7', fontSize: '0.94rem' }}>
                These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
              </p>
            </div>

            {/* Section 16 - Contact Us Box */}
            <div style={{
              backgroundColor: 'var(--beige-bg)',
              borderRadius: '16px',
              padding: '24px 28px',
              border: '1px solid var(--border-color)',
              marginTop: '12px'
            }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--primary-color)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'var(--white)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700 }}>16</span>
                Contact Us
              </h2>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.92rem', marginBottom: '14px' }}>
                For any questions regarding these Terms and Conditions, orders, or products, please contact us:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-color)' }}>All Fresh Naturals</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>Address: No. 251/B, 4th main, Anjineya temple street, Uttarahalli, Bangalore - 560061</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>WhatsApp: <a href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>8553428079</a></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} style={{ color: 'var(--gold-accent)', flexShrink: 0 }} />
                  <span>Email: <a href="mailto:poori.monika@gmail.com" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>poori.monika@gmail.com</a></span>
                </div>
              </div>
              <p style={{ marginTop: '18px', fontSize: '0.92rem', color: 'var(--accent-color)', fontWeight: 600, borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginBottom: 0 }}>
                💚 Thank you for choosing All Fresh Naturals. We prepare every batch with care for your family’s health.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
