"use client";
import React, { useState } from "react";
import {
  Shield,
  MapPin,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  Mail,
  Phone,
  MapPinned,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function GuardianEyeLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Guardian Eye
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-600 hover:text-blue-600 transition hover:cursor-pointer"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-blue-600 transition hover:cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-600 hover:text-blue-600 transition hover:cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-blue-600 transition hover:cursor-pointer"
              >
                Contact
              </button>
              <Link href="/login">
                <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold transition hover:cursor-pointer">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition hover:cursor-pointer">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left py-2 text-gray-600"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left py-2 text-gray-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="block w-full text-left py-2 text-gray-600"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left py-2 text-gray-600"
              >
                Contact
              </button>
              <Link href="/login">
                <button className="block w-full text-left py-2 text-blue-600 font-semibold">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Shield className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Protecting Lives Through
            <span className="block text-blue-600">
              Intelligent Disaster Management
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Guardian Eye predicts resource needs and optimizes evacuation routes
            during disasters, ensuring communities are prepared and protected
            when every second counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold hover:cursor-pointer text-lg flex items-center justify-center gap-2">
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
            </Link>
            <Link href="login">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition font-semibold hover:cursor-pointer text-lg border-2 border-blue-600">
              Login to Dashboard
            </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                About Guardian Eye
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Guardian Eye is an advanced disaster management platform
                designed to save lives and optimize emergency response. Built
                with cutting-edge predictive algorithms and real-time data
                processing, we help governments, organizations, and communities
                prepare for and respond to natural disasters.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our mission is to minimize casualties and ensure efficient
                resource allocation during critical moments when traditional
                systems fail. We believe that preparedness and intelligent
                planning are the keys to resilient communities.
              </p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">99%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    Real-time
                  </div>
                  <div className="text-sm text-gray-600">Updates</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl p-12 flex items-center justify-center">
              <Shield className="w-64 h-64 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Features & Capabilities
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for disaster preparedness and response
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Resource Prediction
              </h3>
              <p className="text-gray-600">
                AI-powered algorithms predict exact resource requirements based
                on disaster type, severity, and affected population for optimal
                preparedness.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Evacuation Routing
              </h3>
              <p className="text-gray-600">
                Intelligent pathfinding algorithms create optimal evacuation
                routes considering real-time traffic, road conditions, and safe
                zones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-time Alerts
              </h3>
              <p className="text-gray-600">
                Instant notifications and updates about disaster developments,
                resource status, and evacuation progress through multiple
                channels.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Predictive Analytics
              </h3>
              <p className="text-gray-600">
                Advanced data analysis and machine learning models forecast
                disaster impact and suggest preventive measures ahead of time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Collaborative Platform
              </h3>
              <p className="text-gray-600">
                Seamless coordination between government agencies, NGOs, and
                local authorities for unified disaster response efforts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <MapPinned className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                GIS Mapping
              </h3>
              <p className="text-gray-600">
                Interactive geographical information system visualization for
                disaster zones, safe areas, and resource distribution points.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step disaster management workflow for organizations
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Organization Registration
              </h3>
              <p className="text-gray-600">
                Organizations register once in the system; their setup ends here
                initially
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Alert Notification
              </h3>
              <p className="text-gray-600">
                When IMD sends a major disaster alert, organizations receive
                notifications and acknowledge them
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Resource Prediction
              </h3>
              <p className="text-gray-600">
                System predicts required resources based on disaster intensity
                in each region and broadcasts to organizations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Live Evacuation Paths
              </h3>
              <p className="text-gray-600">
                During a live disaster, the system provides optimal evacuation
                paths using satellite image analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-4 bg-gradient-to-br from-blue-50 to-teal-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">support@guardianeye.com</p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinned className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Safety Street, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6" />
                <span className="text-lg font-bold">Guardian Eye</span>
              </div>
              <p className="text-gray-400 text-sm">
                Protecting lives through intelligent disaster management and
                preparedness.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Features</div>
                <div>How It Works</div>
                <div>Pricing</div>
                <div>FAQ</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>About Us</div>
                <div>Careers</div>
                <div>Blog</div>
                <div>Contact</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Guardian Eye. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
