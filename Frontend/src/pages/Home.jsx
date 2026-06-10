import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const stats = [
  { value: '10,000+', label: 'Happy Renters' },
  { value: '₹299', label: 'Starting From' },
  { value: '3 Cities', label: 'Serviceable' },
  { value: '48hr', label: 'Delivery' },
];

const features = [
  { icon: '💰', title: 'Affordable Plans', desc: 'Monthly rentals from ₹299. Zero down payment, zero long-term lock-in.' },
  { icon: '🚚', title: 'Free Delivery', desc: 'We deliver, install, and pick up at your doorstep. Moving? We\'ve got you.' },
  { icon: '🔧', title: 'Free Maintenance', desc: 'Something breaks? We fix it — for free, throughout your rental period.' },
  { icon: '🔄', title: 'Flexible Tenure', desc: 'Choose 3, 6, or 12 months. Extend or return whenever you need.' },
  { icon: '📦', title: 'Quality Products', desc: 'Thoroughly cleaned and quality-checked before every delivery.' },
  { icon: '⚡', title: 'Quick Setup', desc: 'Order today, delivered and installed within 48 hours.' },
];

const categories = [
  { name: 'Sofa', icon: '🛋️', category: 'Furniture', desc: '2 & 3 Seater' },
  { name: 'Bed', icon: '🛏️', category: 'Furniture', desc: 'Single & King' },
  { name: 'Table', icon: '🪑', category: 'Furniture', desc: 'Study & Dining' },
  { name: 'Fridge', icon: '🧊', category: 'Appliances', desc: '100L – 250L' },
  { name: 'Washing Machine', icon: '🫧', category: 'Appliances', desc: 'Fully Automatic' },
  { name: 'TV', icon: '📺', category: 'Appliances', desc: '32" – 55"' },
];

const steps = [
  { step: '01', title: 'Browse & Pick', desc: 'Choose from our curated collection of furniture and appliances.' },
  { step: '02', title: 'Select Tenure', desc: 'Pick 3, 6, or 12 months — whichever fits your plans.' },
  { step: '03', title: 'Pay & Confirm', desc: 'Secure payment via Razorpay. Invoice sent instantly.' },
  { step: '04', title: 'We Deliver', desc: 'Your items arrive within 48 hours, installed and ready to use.' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-300 blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🏠 Chennai · Mumbai · Bangalore
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Rent Smarter.<br />
            <span className="text-blue-200">Live Better.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Premium furniture and appliances on flexible monthly rentals. No upfront costs, free delivery, and maintenance included.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-blue-50 transition shadow-lg">
              Browse Products →
            </Link>
            <Link to="/register" className="bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-white/20 transition">
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-sm text-blue-200 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((item) => (
              <Link
                key={item.name}
                to={`/products?subCategory=${item.name}`}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-blue-300 hover:shadow-lg transition group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
                <div className="font-bold text-gray-800 text-base">{item.name}</div>
                <div className="text-sm text-gray-400 mt-0.5">{item.desc}</div>
                <div className="text-xs text-blue-500 font-medium mt-2">{item.category}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">How RentEase Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-0.5 bg-blue-100 z-0"></div>
                )}
                <div className="relative z-10 w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2">Everything Included</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to furnish your space?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of renters across Chennai, Mumbai & Bangalore.</p>
          <Link to="/products" className="inline-block bg-white text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg">
            Start Browsing →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">R</div>
            <span className="text-white font-bold">RentEase</span>
          </div>
          <p className="text-sm">© 2026 RentEase — Furniture & Appliance Rental Platform</p>
          <div className="flex gap-6 text-sm">
            <Link to="/products" className="hover:text-white transition">Products</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
