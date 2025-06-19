import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-black py-16 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-violet-500/20 animate-aurora"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,theme(colors.violet.400/15%),transparent)]"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-gradient-x font-yatra">साझा</h2>
              <p className="mt-4 text-gray-400 leading-relaxed ">Empowering communities through sharing. Rent, share, and connect with your neighbors.</p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/@saajhalive" className="group relative p-3 rounded-full bg-white/5 hover:bg-white/10 text-violet-200/80 hover:text-violet-500 transition-all duration-300 hover:scale-110">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
                <span className="sr-only">Youtube</span>
                <svg className="h-5 w-5 relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 15.5l6-3.5-6-3.5v7zm12-3.5c0-1.93-.157-3.64-.448-5.01-.296-1.39-1.383-2.476-2.772-2.772C17.414 4.157 15.704 4 13.774 4h-3.548c-1.93 0-3.64.157-5.01.448-1.39.296-2.476 1.383-2.772 2.772C2.157 8.36 2 10.07 2 12s.157 3.64.448 5.01c.296 1.39 1.383 2.476 2.772 2.772C6.36 20.843 8.07 21 10 21h4c1.93 0 3.64-.157 5.01-.448 1.39-.296 2.476-1.383 2.772-2.772.291-1.37.448-3.08.448-5.01z" clipRule="evenodd" />
                </svg>

              </a>
              <a href="https://www.instagram.com/saajhalive" className="group relative p-3 rounded-full bg-white/5 hover:bg-white/10 text-violet-200/80 hover:text-violet-500 transition-all duration-300 hover:scale-110">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5 relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://x.com/SAAJHALIVE" className="group relative p-3 rounded-full bg-white/5 hover:bg-white/10 text-violet-200/80 hover:text-violet-500 transition-all duration-300 hover:scale-110">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 relative z-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { text: 'Home', path: '/' },
                { text: 'About Us', path: '/about' },
                { text: 'How It Works', path: '/how-it-works' },
                { text: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-gradient-to-r from-violet-400 to-fuchsia-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Categories</h3>
            <ul className="space-y-4">
              {[
                { text: 'Electronics', path: '/browse' },
                { text: 'Books', path: '/browse' },
                { text: 'Agriculture Tools', path: '/browse' },
                { text: 'Gadgets', path: '/browse' }
              ].map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-gradient-to-r from-violet-400 to-fuchsia-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {category.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-300"></div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-400/50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Saajha. All rights reserved.
          </p>
          <p className='text-gray-400 text-2xl font-bonheur'>
            Made with ❤️ by Our Team
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;