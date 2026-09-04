import React, { useState } from 'react';

const productsData = [
  {
    id: 1,
    name: 'Tomato Grade A',
    crop: 'Tomato',
    category: 'Vegetables',
    farmer: 'Green Harvest FPO',
    location: 'Erode, Tamil Nadu',
    region: 'Erode',
    price: 24,
    unit: '/kg',
    availableQty: '800kg Available',
    harvestDate: 'Harvest: 12 Sep',
    logistics: 'Pickup/Del',
    quality: 'Grade A',
    aiMatch: '92% AI Match',
    isFpo: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPKVcx3avRLd10FHP4SZL_B_6lSBMy3Oggt69sIifcfrzhMOxZSoUgZxnJNti_Q7f2w11QZqP-gqZFclapLsYtC8tKkxiJLM0-JB1H4t6e3VP6o0eWilyZi9OTkd1p3Nzi0iD4szrjOn8j8M4Yzjq09O_HzdNDsARdqmLQdi5LObw5fZjuBmqXL18dRUyMM6xIl3L3rHggsBJw2gwpyFojR5KoOcmz1u5ry2qvpTrl4kEOY8rK016D2Q',
  },
  {
    id: 2,
    name: 'Tomato Grade A (Vine Ripened)',
    crop: 'Tomato',
    category: 'Vegetables',
    farmer: 'Ramesh Kumar Farms',
    location: 'Erode, Tamil Nadu',
    region: 'Erode',
    price: 25,
    unit: '/kg',
    availableQty: '450kg Available',
    harvestDate: 'Harvest: 10 Sep',
    logistics: 'Pickup Only',
    quality: 'Grade A',
    aiMatch: '88% AI Match',
    isFpo: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmhiB_UNpfCqszuVSoEpIJuHiUfn4BjPWC4jC2hPQ3g07c0lO2NiMXTyGq2oLh_7Q_8_924sLaGajLPhrOehO6kFyJDpm_XpQSF4WOVDdNB9Io-VSAhxgQVuncrrahbp3DHOWDTFxBnzj8c8sNAHbHcQNED80VNa82H4Klqd5R3tRBQYifdr744I759scu5mj61Mjt_10rfcdlD0TeGh4AFxmy6EGmh7EziyjnNcqQ7x9w75d8WiRFLA',
  },
  {
    id: 3,
    name: 'Tomato Grade B (Bulk Mandi)',
    crop: 'Tomato',
    category: 'Vegetables',
    farmer: 'Cauvery Valley Coop',
    location: 'Erode, Tamil Nadu',
    region: 'Erode',
    price: 20,
    unit: '/kg',
    availableQty: '1200kg Available',
    harvestDate: 'Harvest: 13 Sep',
    logistics: 'Del Available',
    quality: 'Grade B',
    aiMatch: '85% AI Match',
    isFpo: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQTH6ANb3exyyHRyDc48uFq4uwF3YQyQmOLkucjLsjmFgAwY5ZiflzO5W2_EXRFR1n2R1StJn92krk6lgEKLdW9roxOQPcRnRDcQedy7Sf-FKKlQw68fVjDQJZ0hIJ3Mho2l6PhY7n9lFszoU2KTwtrzrj_3hNH0bxvnhgpy9cDEaw8zz58-WpipTShulvT9eshTUKQq3FbJZ4XPUSzjwBQBZHHCQHz76CwH6Ze5aSFTSSOYssp-gYMA',
  },
  {
    id: 4,
    name: 'Ratnagiri Alphonso Mangoes',
    crop: 'Mango',
    category: 'Fruits',
    farmer: 'Devgad Orchards Collective',
    location: 'Ratnagiri, Maharashtra',
    region: 'Ratnagiri',
    price: 350,
    unit: '/dozen',
    availableQty: '300 Dozen Available',
    harvestDate: 'Harvest: Today',
    logistics: 'Cold-Chain Express',
    quality: 'Organic',
    aiMatch: '96% AI Match',
    isFpo: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCCRaD6vOUUYuAKFMA8yEr4AfuYl7EF_qLYL9MJoRUYrupwM9NyCv-AI73KNmQWweSob69KY30Ew3DNdNkt_gUqZpho7HF3mp8swMOb3ute2U-3CJ5GwnqZQMwlTEN3Azlo1bSuW8QjUOyC5Rv7DvCX3TIesb3rWDP6YHE7YDls1r9uw93cdtCxHusXsyALuXIKFe3kb6fpV7wnvqoi81fNxZ0NbwyPvkHPhpNB2edD2TnBIYTXKFx6-A',
  },
  {
    id: 5,
    name: 'MP Sehore Sharbati Wheat',
    crop: 'Wheat',
    category: 'Grains',
    farmer: 'Malwa Kisan Producer Org',
    location: 'Sehore, Madhya Pradesh',
    region: 'Malwa',
    price: 48,
    unit: '/kg',
    availableQty: '2500kg Available',
    harvestDate: 'Harvest: 05 Sep',
    logistics: 'Mandi Transport',
    quality: 'Grade A',
    aiMatch: '90% AI Match',
    isFpo: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrp76EbxgKVitgPsUozqIfTg1RY01rtH-xO9jIl_ahdYWzCJ1CubFmQtm05LBODpdqRNo5H5rY1ZgjjKTt_anPsohtKWyWGenyikvOFEL9jKjMZqKGHGtOcJTfyi93ZiVUqhGWgk0wtO9faUaMbD1jpPh5WtUo51hXvwRbyrQUTj74eNrNpEFpxOhaSrR1eNn5EX7I2ume-809p_p1KJXzdmNb_SoyS0eOmT7EGdx3u42NacsXw27F1Q',
  },
  {
    id: 6,
    name: 'Fresh Kodaikanal Hass Avocados',
    crop: 'Avocado',
    category: 'Fruits',
    farmer: 'Kodaikanal Valley Farmers',
    location: 'Kodaikanal, Tamil Nadu',
    region: 'Kodaikanal',
    price: 220,
    unit: '/kg',
    availableQty: '350kg Available',
    harvestDate: 'Harvest: Yesterday',
    logistics: 'Pickup/Del',
    quality: 'Grade A',
    aiMatch: '89% AI Match',
    isFpo: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmhiB_UNpfCqszuVSoEpIJuHiUfn4BjPWC4jC2hPQ3g07c0lO2NiMXTyGq2oLh_7Q_8_924sLaGajLPhrOehO6kFyJDpm_XpQSF4WOVDdNB9Io-VSAhxgQVuncrrahbp3DHOWDTFxBnzj8c8sNAHbHcQNED80VNa82H4Klqd5R3tRBQYifdr744I759scu5mj61Mjt_10rfcdlD0TeGh4AFxmy6EGmh7EziyjnNcqQ7x9w75d8WiRFLA',
  },
];

export default function Marketplace({ onOpenTraceability }) {
  const [selectedCrop, setSelectedCrop] = useState('All Crops');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [maxPrice, setMaxPrice] = useState(400);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const filteredProducts = productsData.filter((item) => {
    const matchCrop = selectedCrop === 'All Crops' || item.crop === selectedCrop;
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchRegion = selectedRegion === 'All Regions' || item.region === selectedRegion;
    const matchQuality = selectedQuality === 'All' || item.quality === selectedQuality;
    const matchPrice = item.price <= maxPrice;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.farmer.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    return matchCrop && matchCat && matchRegion && matchQuality && matchPrice && matchSearch;
  });

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    setToastMessage(`✓ Added 1x ${product.name} to cart!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleBuyNow = (product) => {
    setCart([...cart, product]);
    alert(`🎉 Proceeding to Direct Mandi Checkout for ${product.name} (₹${product.price}${product.unit}). Total direct payment to Kisan via UPI.`);
  };

  const getEstimatedCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <section id="marketplace" className="fd-content-section" aria-label="Fresh Harvest Marketplace">
      <div className="fd-wrapper">
        {/* Filters & Search Bento Layout */}
        <div className="bg-white rounded-4 border p-3 p-md-4 shadow-sm mb-4">
          <div className="row g-3 align-items-end">
            {/* Crop Select */}
            <div className="col-6 col-md-4 col-lg-2">
              <label className="fd-form-label mb-1">Crop</label>
              <select
                className="form-select form-select-sm"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option>All Crops</option>
                <option>Tomato</option>
                <option>Mango</option>
                <option>Wheat</option>
                <option>Avocado</option>
              </select>
            </div>

            {/* Category Select */}
            <div className="col-6 col-md-4 col-lg-2">
              <label className="fd-form-label mb-1">Category</label>
              <select
                className="form-select form-select-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
              </select>
            </div>

            {/* Location Select */}
            <div className="col-6 col-md-4 col-lg-2">
              <label className="fd-form-label mb-1">Location</label>
              <select
                className="form-select form-select-sm"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option>All Regions</option>
                <option>Erode</option>
                <option>Ratnagiri</option>
                <option>Malwa</option>
                <option>Kodaikanal</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="col-6 col-md-6 col-lg-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="fd-form-label mb-0">Max Price (₹)</label>
                <span className="small fw-bold text-success font-monospace">₹{maxPrice}/kg</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="20"
                max="400"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>

            {/* Quality Select */}
            <div className="col-6 col-md-3 col-lg-2">
              <label className="fd-form-label mb-1">Quality</label>
              <select
                className="form-select form-select-sm"
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
              >
                <option>All</option>
                <option>Grade A</option>
                <option>Grade B</option>
                <option>Organic</option>
              </select>
            </div>

            {/* Search Input & Reset */}
            <div className="col-6 col-md-3 col-lg-1 d-flex gap-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100 fw-semibold"
                title="Reset Filters"
                onClick={() => {
                  setSelectedCrop('All Crops');
                  setSelectedCategory('All');
                  setSelectedRegion('All Regions');
                  setSelectedQuality('All');
                  setMaxPrice(400);
                  setSearch('');
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick Search Row */}
          <div className="mt-3 pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <div className="position-relative w-100" style={{ maxWidth: '380px' }}>
              <i className="bi bi-search position-absolute text-muted" style={{ left: '12px', top: '9px' }}></i>
              <input
                type="text"
                className="form-control form-control-sm rounded-pill ps-5 bg-light border-0"
                placeholder="Search by crop, farmer, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="small text-muted">
              Showing <strong>{filteredProducts.length}</strong> fresh harvest lots
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <div key={item.id} className="col-md-6 col-lg-4">
                <article className="fd-marketplace-card">
                  {/* Card Image Banner */}
                  <div className="fd-mkt-image-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="fd-mkt-img"
                    />

                    {/* AI Match Badge */}
                    <div className="fd-mkt-ai-badge">
                      <i className="bi bi-cpu text-success me-1"></i>
                      <span>{item.aiMatch}</span>
                    </div>

                    {/* Verified FPO / Farmer Tag */}
                    <div className="fd-mkt-tag-badge">
                      {item.isFpo ? 'Verified FPO' : 'Verified Farmer'}
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      {/* Title & Price Header */}
                      <div className="d-flex justify-content-between align-items-start pb-2 border-bottom mb-2">
                        <div>
                          <h3 className="fs-5 fw-bold text-dark mb-0">{item.name}</h3>
                          <p className="small text-muted mb-0 d-flex align-items-center gap-1 mt-1">
                            <i className="bi bi-person-badge text-success"></i>
                            <span>{item.farmer}</span>
                          </p>
                        </div>
                        <div className="text-end">
                          <span className="fs-5 fw-bold text-success">₹{item.price}</span>
                          <span className="small text-muted">{item.unit}</span>
                        </div>
                      </div>

                      {/* 4-Item Telemetry Grid */}
                      <div className="row g-2 mb-3 text-muted small" style={{ fontSize: '0.8rem' }}>
                        <div className="col-6 d-flex align-items-center gap-1">
                          <i className="bi bi-geo-alt text-secondary"></i>
                          <span className="text-truncate">{item.location}</span>
                        </div>
                        <div className="col-6 d-flex align-items-center gap-1 font-monospace">
                          <i className="bi bi-box-seam text-secondary"></i>
                          <span>{item.availableQty}</span>
                        </div>
                        <div className="col-6 d-flex align-items-center gap-1">
                          <i className="bi bi-calendar3 text-secondary"></i>
                          <span>{item.harvestDate}</span>
                        </div>
                        <div className="col-6 d-flex align-items-center gap-1">
                          <i className="bi bi-truck text-secondary"></i>
                          <span>{item.logistics}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2 pt-2 border-top">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm flex-grow-1 fw-semibold py-2"
                        onClick={onOpenTraceability}
                      >
                        <i className="bi bi-qr-code-scan me-1"></i>
                        <span>Trace Batch</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-success btn-sm flex-grow-1 fw-bold py-2 shadow-sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="p-4 bg-white rounded-4 border text-muted">
                <i className="bi bi-search fs-2 mb-2 d-block text-secondary"></i>
                <h5>No crops match the selected filters</h5>
                <p className="small mb-3">Try adjusting your crop category, region, or price range filter.</p>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm px-4 fw-bold"
                  onClick={() => {
                    setSelectedCrop('All Crops');
                    setSelectedCategory('All');
                    setSelectedRegion('All Regions');
                    setSelectedQuality('All');
                    setMaxPrice(400);
                    setSearch('');
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Cart Floating Banner */}
        {cart.length > 0 && (
          <div className="p-3 bg-white rounded-4 border shadow-md mt-4 d-flex justify-content-between align-items-center animate__animated animate__fadeInUp">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success fs-6 rounded-circle p-2">🛒</span>
              <div>
                <span className="fw-bold text-dark">
                  Direct Mandi Cart: {cart.length} item{cart.length > 1 ? 's' : ''}
                </span>
                <span className="text-muted ms-2 small d-none d-sm-inline">
                  • Total: <strong>₹{getEstimatedCartTotal().toLocaleString('en-IN')}</strong> (100% to Kisan)
                </span>
              </div>
            </div>
            <button
              className="btn btn-success fw-bold px-4 rounded-pill shadow-sm"
              onClick={() =>
                alert(
                  `🎉 Direct Mandi Order Dispatched! Payment of ₹${getEstimatedCartTotal().toLocaleString(
                    'en-IN'
                  )} transferred to farmer bank account.`
                )
              }
            >
              Checkout (₹{getEstimatedCartTotal().toLocaleString('en-IN')})
            </button>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
            <div className="toast show align-items-center text-bg-success border-0 p-2 shadow-lg rounded-3">
              <div className="d-flex">
                <div className="toast-body fw-bold">{toastMessage}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
