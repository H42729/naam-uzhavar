import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'farmer',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert(language === 'ta' ? 'தயவுசெய்து உங்கள் பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter your name and phone number.');
      return;
    }
    setSubmitted(true);
    // Reset form fields after submission
    setFormData({
      name: '',
      phone: '',
      role: 'farmer',
      message: ''
    });
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between bg-light">
      <div>
        {/* Sticky Header Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoggedIn={isAuthenticated}
          currentUser={user}
          onOpenAuth={() => navigate('/login')}
        />

        {/* Hero Header Section */}
        <section className="bg-white border-bottom py-3 py-md-5">
          <div className="fd-wrapper">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-2 mb-md-3">
              <ol className="breadcrumb small mb-0">
                <li className="breadcrumb-item">
                  <Link to="/" className="text-decoration-none text-muted">
                    <i className="bi bi-house-door me-1"></i>
                    {t('navHome')}
                  </Link>
                </li>
                <li className="breadcrumb-item active text-success fw-semibold" aria-current="page">
                  {t('navContact')}
                </li>
              </ol>
            </nav>

            <div className="row align-items-center g-3 g-md-4">
              <div className="col-lg-8">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success-subtle text-success small fw-bold mb-2">
                  <span className="fd-pulse-dot" style={{ width: '8px', height: '8px' }}></span>
                  <span>{t('tollFreeBadge')}</span>
                </div>
                <h1 className="fw-extrabold text-dark mb-2" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.25rem)', lineHeight: 1.25 }}>
                  {t('contactTitle')}
                </h1>
                <p className="text-muted small fs-md-6 mb-0 lh-base" style={{ maxWidth: '680px' }}>
                  {t('contactSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="py-4 py-md-5">
          <div className="fd-wrapper">
            {/* 1. HERO TOLL-FREE HELPLINE BANNER CARD */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 mb-md-5" style={{ background: 'linear-gradient(135deg, #064e28 0%, #0c6b39 60%, #15803d 100%)', color: '#ffffff' }}>
              <div className="card-body p-3 p-sm-4 p-md-5 position-relative">
                <div className="row align-items-center g-4">
                  <div className="col-lg-8">
                    {/* Top Badges: Stack neatly on mobile, row on tablet/desktop */}
                    <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3 mb-3">
                      <span className="badge bg-warning text-dark fw-bold px-3 py-1.5 rounded-pill flex-shrink-0 align-self-start">
                        <i className="bi bi-shield-check me-1"></i>
                        {language === 'ta' ? 'அரசு அங்கீகாரம் பெற்றது' : 'Verified & Free'}
                      </span>
                      <span className="text-white text-opacity-80 small lh-sm">
                        {t('tollFreeSub')}
                      </span>
                    </div>

                    <h2 className="fs-6 fs-sm-5 fw-medium text-light mb-1">
                      {language === 'ta' ? 'நாம் உழவர் கட்டணமில்லா உதவி எண்:' : 'Naam Uzhavar Toll-Free Number:'}
                    </h2>

                    {/* Prominent Toll Free Number Display */}
                    <div className="d-flex flex-column flex-sm-row flex-wrap align-items-start align-items-sm-baseline gap-2 gap-sm-3 my-3">
                      <span
                        className="fw-black tracking-wider text-white"
                        style={{
                          fontSize: 'clamp(1.85rem, 7vw, 3.25rem)',
                          fontWeight: 900,
                          letterSpacing: '1px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          lineHeight: 1.15
                        }}
                      >
                        1800-890-8900
                      </span>
                      <span className="badge bg-white text-success fw-bold px-3 py-1.5 rounded-pill fs-6 shadow-sm align-self-start">
                        <i className="bi bi-clock-history me-1"></i>
                        {language === 'ta' ? '24 மணி நேரமும் செயல்படும்' : 'Available 24x7'}
                      </span>
                    </div>

                    <p className="text-light mb-0 opacity-90 small lh-base">
                      <i className="bi bi-info-circle me-1.5 text-warning"></i>
                      {t('tollFreeHours')}
                    </p>
                  </div>

                  <div className="col-lg-4 text-lg-end">
                    <div className="d-flex flex-column flex-sm-row flex-lg-column gap-2.5 gap-sm-3 justify-content-lg-end w-100">
                      {/* Direct Phone Call Button */}
                      <a
                        href="tel:18008908900"
                        id="call-toll-free-btn"
                        className="btn btn-warning btn-lg fw-bold rounded-pill px-4 py-3 shadow-lg d-inline-flex align-items-center justify-content-center gap-2 text-dark text-decoration-none transition-transform hover-scale w-100 w-sm-auto"
                      >
                        <i className="bi bi-telephone-outbound-fill fs-5"></i>
                        <span>{t('callNowBtn')}</span>
                      </a>

                      {/* WhatsApp Direct Chat Button */}
                      <a
                        href="https://wa.me/919840012345?text=Hello%20Naam%20Uzhavar,%20I%20need%20support%20regarding"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-light btn-lg rounded-pill px-4 py-2.5 d-inline-flex align-items-center justify-content-center gap-2 text-decoration-none w-100 w-sm-auto"
                      >
                        <i className="bi bi-whatsapp text-success fs-5"></i>
                        <span>{t('chatOnWhatsapp')}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. THREE DEDICATED SUPPORT DESKS */}
            <div className="row g-4 mb-5">
              {/* Farmer Desk */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 hover-shadow transition-all bg-white">
                  <div className="card-body">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-4 bg-success-subtle text-success p-3 mb-3">
                      <i className="bi bi-flower1 fs-3"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">{t('farmerDeskTitle')}</h3>
                    <p className="text-muted small mb-3">{t('farmerDeskDesc')}</p>
                    <div className="pt-2 border-top">
                      <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1 small fw-semibold">
                        <i className="bi bi-telephone-fill me-1"></i>
                        1800-890-8900 (Ext. 1)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buyer Desk */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 hover-shadow transition-all bg-white">
                  <div className="card-body">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-4 bg-primary-subtle text-primary p-3 mb-3">
                      <i className="bi bi-cart-check-fill fs-3"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">{t('buyerDeskTitle')}</h3>
                    <p className="text-muted small mb-3">{t('buyerDeskDesc')}</p>
                    <div className="pt-2 border-top">
                      <span className="badge bg-primary-subtle text-primary rounded-pill px-2.5 py-1 small fw-semibold">
                        <i className="bi bi-telephone-fill me-1"></i>
                        1800-890-8900 (Ext. 2)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics Desk */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-3 hover-shadow transition-all bg-white">
                  <div className="card-body">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-4 bg-warning-subtle text-warning-emphasis p-3 mb-3">
                      <i className="bi bi-truck fs-3"></i>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">{t('logisticsDeskTitle')}</h3>
                    <p className="text-muted small mb-3">{t('logisticsDeskDesc')}</p>
                    <div className="pt-2 border-top">
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-2.5 py-1 small fw-semibold">
                        <i className="bi bi-telephone-fill me-1"></i>
                        1800-890-8900 (Ext. 3)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. QUICK CALL-BACK FORM & OFFICE DETAILS */}
            <div className="row g-4 mb-5">
              {/* Form Column */}
              <div className="col-lg-7">
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-4 bg-white">
                  <div className="card-body">
                    <h3 className="h4 fw-bold text-dark mb-1">{t('sendUsMessage')}</h3>
                    <p className="text-muted small mb-4">{t('sendUsMessageDesc')}</p>

                    {submitted && (
                      <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 py-3 mb-4" role="alert">
                        <i className="bi bi-check-circle-fill fs-5"></i>
                        <div>{t('inquirySuccessMsg')}</div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-secondary mb-1">
                            {t('fullNameLabel')} <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            placeholder={language === 'ta' ? 'எ.கா: சுந்தரம்' : 'e.g. Sundaram'}
                            className="form-control form-control-md rounded-3"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-secondary mb-1">
                            {t('phoneLabel')} <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light text-muted small">+91</span>
                            <input
                              type="tel"
                              name="phone"
                              required
                              placeholder="98765 43210"
                              className="form-control form-control-md rounded-end-3"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-bold text-secondary mb-1">
                            {t('userTypeLabel')}
                          </label>
                          <select
                            name="role"
                            className="form-select rounded-3"
                            value={formData.role}
                            onChange={handleInputChange}
                          >
                            <option value="farmer">{t('roleFarmerOption')}</option>
                            <option value="buyer">{t('roleBuyerOption')}</option>
                            <option value="driver">{t('roleDriverOption')}</option>
                            <option value="other">{t('roleOtherOption')}</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-bold text-secondary mb-1">
                            {t('messageLabel')}
                          </label>
                          <textarea
                            name="message"
                            rows="3"
                            placeholder={language === 'ta' ? 'உங்கள் கேள்வி அல்லது தேவையை இங்கு குறிப்பிடவும்...' : 'Tell us about your requirement or question...'}
                            className="form-control rounded-3"
                            value={formData.message}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>

                        <div className="col-12 pt-2">
                          <button
                            type="submit"
                            id="submit-callback-btn"
                            className="btn btn-success fw-bold px-4 py-2.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                          >
                            <i className="bi bi-send-fill"></i>
                            <span>{t('submitInquiryBtn')}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Office & Official Contact Details */}
              <div className="col-lg-5">
                <div className="d-flex flex-column gap-3 h-100">
                  {/* Address Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white flex-grow-1">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-circle bg-success-subtle text-success p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-geo-alt-fill fs-5"></i>
                        </div>
                        <h4 className="h6 fw-bold text-dark mb-0">{t('officeAddressTitle')}</h4>
                      </div>
                      <p className="text-muted small mb-0 lh-base">
                        {t('officeAddress')}
                      </p>
                    </div>
                  </div>

                  {/* Email & Digital Support Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white flex-grow-1">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-circle bg-primary-subtle text-primary p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-envelope-at-fill fs-5"></i>
                        </div>
                        <h4 className="h6 fw-bold text-dark mb-0">{t('emailSupportTitle')}</h4>
                      </div>
                      <p className="small mb-1">
                        <strong className="text-dark">Support: </strong>
                        <a href="mailto:support@naamuzhavar.org" className="text-decoration-none text-success fw-semibold">
                          support@naamuzhavar.org
                        </a>
                      </p>
                      <p className="small mb-0">
                        <strong className="text-dark">Procurement: </strong>
                        <a href="mailto:procurement@naamuzhavar.org" className="text-decoration-none text-primary fw-semibold">
                          procurement@naamuzhavar.org
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* WhatsApp Support Card */}
                  <div className="card border-0 shadow-sm rounded-4 p-3 bg-white flex-grow-1">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="rounded-circle bg-success-subtle text-success p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-whatsapp fs-5"></i>
                        </div>
                        <h4 className="h6 fw-bold text-dark mb-0">{t('whatsappDeskTitle')}</h4>
                      </div>
                      <p className="text-muted small mb-2">{t('whatsappDeskDesc')}</p>
                      <a
                        href="https://wa.me/919840012345"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success rounded-pill fw-semibold"
                      >
                        +91 98400 12345
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. HELPLINE FAQ SECTION */}
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h3 className="h4 fw-bold text-dark mb-4 text-center">
                <i className="bi bi-question-circle-fill text-success me-2"></i>
                {t('faqHelplineTitle')}
              </h3>

              <div className="accordion accordion-flush" id="faqAccordion">
                <div className="accordion-item border-bottom py-2">
                  <h4 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button collapsed fw-bold text-dark bg-transparent shadow-none"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      {t('faq1Q')}
                    </button>
                  </h4>
                  <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted small pt-1">
                      {t('faq1A')}
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-bottom py-2">
                  <h4 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed fw-bold text-dark bg-transparent shadow-none"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      {t('faq2Q')}
                    </button>
                  </h4>
                  <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted small pt-1">
                      {t('faq2A')}
                    </div>
                  </div>
                </div>

                <div className="accordion-item py-2">
                  <h4 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed fw-bold text-dark bg-transparent shadow-none"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      {t('faq3Q')}
                    </button>
                  </h4>
                  <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted small pt-1">
                      {t('faq3A')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Standard Modern Footer */}
        <Footer onOpenAuth={() => navigate('/login')} />
      </div>
    </div>
  );
}
