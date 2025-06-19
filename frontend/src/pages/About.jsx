import React from 'react';

const teamMembers = [
  {
    name: 'Vijeta',
    role: 'Founder & CEO',
    image: 'https://res.cloudinary.com/sun-light/image/upload/v1748072942/Screenshot_2025-05-24_131736_pgjbuo.png',
    bio: 'Visionary entrepreneur passionate about sharing economy and technology for good.'
    },
  {
    name: 'Suraj Prakash',
    role: 'Lead Developer',
    image: 'https://res.cloudinary.com/sun-light/image/upload/v1747751464/20250420_0718361_xrzqfi.jpg',
    bio: 'Builds robust, scalable web applications and loves open source.'
  },
  {
    name: 'Suraj Gupta',
    role: 'Lead Designer',
    image: 'https://res.cloudinary.com/sun-light/image/upload/v1748073318/gupta_p8vs9j.jpg',
    bio: 'Designs delightful user experiences and beautiful interfaces for this app.'
  },
  {
    name: 'Alpna',
    role: 'Manager',
    image: 'https://res.cloudinary.com/sun-light/image/upload/v1748102346/alpana_ij5war.jpg',
    bio: 'Connects people, builds community, and ensures everyone feels welcome.'
  },
  // {
  //   name: 'Amit',
  //   role: 'Binding Baba',
  //   image: 'https://res.cloudinary.com/sun-light/image/upload/v1748073781/baba_kqqt89.jpg',
  //   bio: 'Takes care of final formatting of the project report.Handles printing and binding.Prepares the report cover page and title slide.'
  // },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 font-bungee">About saajha</h1>
          <p className=" text-gray-700 max-w-2xl mx-auto font-lilgrotesk">
          SAAJHA is a peer-to-peer rental platform that allows users to earn money by renting out everyday items they own but don't use frequently. From tools and electronics to party supplies and outdoor gear, the app connects people who need specific items for a short time with those who have them sitting idle. Designed to promote sustainability and smart spending, Rent Your Things makes borrowing convenient, affordable, and community-driven.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-16">
          <div className="text-center mb-12 ">
              <h1 className="text-4xl font-bungee">Our Mission</h1>
                <p className="text-gray-700 max-w-2xl mx-auto font-lilgrotesk">
                  At SAAJHA, our mission is to create a sustainable sharing economy by connecting people who need things with those who have them. We believe in reducing waste, promoting resource efficiency, and helping people save money.
                </p>
                <p className='text-gray-700 max-w-2xl mx-auto font-lilgrotesk'>
                  By enabling peer-to-peer rentals, we're building a community where ownership is optional and access is everything. Whether you need something for a day or a month, RYT makes it easy to find, rent, and return items in your local area.
                </p>
          </div>
        </div>

      {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bungee text-center">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600 group-hover:text-violet-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900 font-lilgrotesk">1. Find What You Need</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Browse our extensive catalog of products available for rent in your area. Filter by category, price, and availability to find exactly what you need.
                </p>
              </div>
            </div>

            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600 group-hover:text-violet-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900 font-lilgrotesk">2. Book & Pay Securely</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Select your rental period and make a secure payment through our platform. We protect both renters and owners with our secure payment system.
                </p>
              </div>
            </div>

            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600 group-hover:text-violet-700 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900 font-lilgrotesk">3. Enjoy & Return</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Use the item during your rental period and return it when you're done. It's that simple! Leave a review to help others in the community.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bungee text-center">Why Choose saajha?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-violet-600 group-hover:text-violet-700 transition-colors duration-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 font-lilgrotesk">Save Money</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Why buy something you'll only use a few times? Rent it instead and save hundreds or even thousands of dollars.
                </p>
              </div>
            </div>

            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-violet-600 group-hover:text-violet-700 transition-colors duration-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 font-lilgrotesk">Eco-Friendly</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Reduce waste and your environmental footprint by sharing resources instead of buying new products.
                </p>
              </div>
            </div>

            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-violet-600 group-hover:text-violet-700 transition-colors duration-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 font-lilgrotesk">Community</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Join a community of like-minded individuals who believe in sharing resources and helping each other.
                </p>
              </div>
            </div>

            <div className="group bg-white overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-violet-600 group-hover:text-violet-700 transition-colors duration-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 font-lilgrotesk">Secure & Trusted</h3>
                <p className="mt-2 text-base text-gray-500 font-lilgrotesk">
                  Our platform includes user verification, secure payments, and a review system to ensure trust and safety.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Members */}
        <div className="mb-16 mt-10">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center font-bungee">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group relative h-[400px] rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-500">
                {/* Background Image with Blur Effect */}
                <div className="absolute inset-0 transition-all duration-500">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110 group-hover:blur-sm"
                    style={{ backgroundImage: `url(${member.image || 'https://images.unsplash.com/photo-1695893155161-e4cf7355322f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-950/90 via-violet-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-[70%] group-hover:translate-y-0 transition-all duration-500">
                  {/* Profile Image */}
                  <div className="relative flex justify-center mb-4">
                    <div className="w-24 h-24 rounded-full border-4 border-violet-200/30 shadow-lg overflow-hidden transform group-hover:scale-90 transition-all duration-500">
                      <img
                        src={member.image || 'https://images.unsplash.com/photo-1695893155161-e4cf7355322f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="text-center transform transition-all duration-500">
                    <h3 className="text-xl font-bold text-white mb-1 font-lilgrotesk">{member.name}</h3>
                    <p className="text-violet-200 font-semibold mb-4 font-bungee text-xl">{member.role}</p>
                    <p className="text-violet-100/90 text-center text-sm font-lilgrotesk opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-emerald-600 mb-2 font-bungee">Join Us on Our Mission!</h2>
          <p className="text-gray-700 max-w-xl mx-auto font-lilgrotesk">
            Whether you want to rent, lend, or simply connect, SAAJHA is here to help you make the most of what you have—and find what you need. Thank you for being part of our journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 