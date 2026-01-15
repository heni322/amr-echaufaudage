import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Truck, Settings, FileCheck, Building2, Phone, Mail, MapPin, Star, Menu, X, CheckCircle, Clock, Award, Users } from 'lucide-react';

const AMRLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Échafaudage de façade",
      desc: "Solutions adaptées pour tous types de façades, résidentielles et commerciales"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Échafaudage industriel",
      desc: "Structures renforcées pour sites industriels et interventions complexes"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Montage & démontage sécurisé",
      desc: "Installation professionnelle selon les normes de sécurité en vigueur"
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Étude technique & conformité",
      desc: "Analyse de vos besoins et garantie de conformité réglementaire"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Livraison rapide sur chantier",
      desc: "Service logistique efficace pour respecter vos délais"
    }
  ];

  const benefits = [
    { icon: <Shield />, text: "Respect strict des normes de sécurité" },
    { icon: <Award />, text: "Équipe certifiée et expérimentée" },
    { icon: <Clock />, text: "Intervention rapide" },
    { icon: <CheckCircle />, text: "Matériel professionnel contrôlé" },
    { icon: <Users />, text: "Excellent rapport qualité/prix" }
  ];

  const reviews = [
    {
      name: "Jean-Marc L.",
      company: "BTP Constructions",
      rating: 5,
      text: "Entreprise sérieuse, montage rapide et sécurisé. Je recommande vivement pour tous vos chantiers."
    },
    {
      name: "Sophie D.",
      company: "Rénovation Plus",
      rating: 5,
      text: "Service impeccable, équipe professionnelle. Matériel de qualité et respect des délais."
    },
    {
      name: "Laurent M.",
      company: "Industrie & Co",
      rating: 5,
      text: "Parfait pour nos besoins industriels. Très réactifs et toujours conformes aux normes."
    }
  ];

  const projects = [
    { type: "Rénovation façade", location: "Paris 15ème" },
    { type: "Chantier industriel", location: "Lyon" },
    { type: "Immeuble résidentiel", location: "Marseille" },
    { type: "Site commercial", location: "Toulouse" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900 shadow-lg' : 'bg-slate-900/95'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AMR Échafaudage</h1>
                <p className="text-xs text-orange-400">Votre partenaire sécurité</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-200 hover:text-orange-400 transition-colors">Services</a>
              <a href="#realisations" className="text-slate-200 hover:text-orange-400 transition-colors">Réalisations</a>
              <a href="#avis" className="text-slate-200 hover:text-orange-400 transition-colors">Avis clients</a>
              <a href="#contact" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Devis gratuit
              </a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <a href="#services" className="block text-slate-200 hover:text-orange-400 py-2">Services</a>
              <a href="#realisations" className="block text-slate-200 hover:text-orange-400 py-2">Réalisations</a>
              <a href="#avis" className="block text-slate-200 hover:text-orange-400 py-2">Avis clients</a>
              <a href="#contact" className="block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold text-center">
                Devis gratuit
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold border border-orange-500/30">
                ✓ Certifié & Conforme aux normes
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Solutions d'échafaudage<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                sécurisées
              </span> pour vos chantiers
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Location, montage et démontage d'échafaudages conformes aux normes en vigueur
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a href="#contact" className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center space-x-2">
                <span>Demander un devis gratuit</span>
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </a>
              <a href="#realisations" className="bg-slate-700/50 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all border border-slate-600">
                Voir nos réalisations
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">15+</div>
                <div className="text-slate-400 text-sm mt-1">Ans d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">500+</div>
                <div className="text-slate-400 text-sm mt-1">Chantiers réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400">100%</div>
                <div className="text-slate-400 text-sm mt-1">Conformité</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-orange-400" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des solutions complètes pour tous vos besoins en échafaudage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveService(idx)}
                onMouseLeave={() => setActiveService(null)}
                className={`bg-slate-50 rounded-2xl p-8 transition-all duration-300 cursor-pointer border-2 ${
                  activeService === idx 
                    ? 'border-orange-500 shadow-2xl transform -translate-y-2 bg-white' 
                    : 'border-transparent hover:border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className={`inline-flex p-4 rounded-xl mb-6 transition-all ${
                  activeService === idx ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'
                }`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Découvrez notre savoir-faire sur le terrain
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Une équipe qualifiée, des procédures strictes et un engagement total pour la sécurité de vos chantiers.
              </p>
              <div className="space-y-4">
                {['Installation professionnelle', 'Équipements de sécurité certifiés', 'Respect des normes en vigueur'].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-orange-600 transition-colors">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-slate-400">Vidéo de présentation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section id="realisations" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Projets Réalisés
            </h2>
            <p className="text-xl text-slate-600">
              Projets réalisés pour des chantiers de toutes tailles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, idx) => (
              <div key={idx} className="group relative aspect-square bg-slate-800 rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900"></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{project.type}</h3>
                  <p className="text-orange-400 text-sm flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Pourquoi choisir AMR Échafaudage ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  {benefit.icon}
                </div>
                <p className="text-slate-700 font-medium pt-2">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section id="avis" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ce que disent nos clients
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-orange-400 text-orange-400" />
              ))}
              <span className="text-slate-300 ml-2">4.9/5 sur Google</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{review.text}"</p>
                <div>
                  <p className="text-white font-semibold">{review.name}</p>
                  <p className="text-slate-400 text-sm">{review.company}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="#" className="inline-flex items-center text-orange-400 hover:text-orange-300 font-semibold">
              Voir tous les avis Google
              <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Besoin d'un échafaudage fiable pour votre chantier ?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Recevez votre devis personnalisé sous 24h
          </p>
          <a href="#contact" className="inline-block bg-white text-orange-600 px-10 py-5 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all transform hover:scale-105 shadow-2xl">
            Obtenir un devis sous 24h
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Contactez-nous
              </h2>
              <p className="text-slate-600 mb-8">
                Remplissez le formulaire et notre équipe vous recontactera rapidement pour étudier votre projet.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Téléphone</p>
                    <p className="text-slate-600">01 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p className="text-slate-600">contact@amr-echafaudage.fr</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-900">Zone d'intervention</p>
                    <p className="text-slate-600">Île-de-France et régions limitrophes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nom</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Société</label>
                  <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                  <input type="tel" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea rows="4" className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"></textarea>
                </div>
                <button onClick={(e) => e.preventDefault()} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                  Envoyer ma demande
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">AMR Échafaudage</h3>
              </div>
              <p className="text-sm">Votre partenaire de confiance pour tous vos projets d'échafaudage.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-orange-400 transition-colors">Services</a></li>
                <li><a href="#realisations" className="hover:text-orange-400 transition-colors">Réalisations</a></li>
                <li><a href="#avis" className="hover:text-orange-400 transition-colors">Avis clients</a></li>
                <li><a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Échafaudage façade</li>
                <li>Échafaudage industriel</li>
                <li>Montage & démontage</li>
                <li>Étude technique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>01 23 45 67 89</li>
                <li>contact@amr-echafaudage.fr</li>
                <li>Île-de-France</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 AMR Échafaudage. Tous droits réservés. | <a href="#" className="hover:text-orange-400">Mentions légales</a> | <a href="#" className="hover:text-orange-400">CGV</a></p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl z-40">
        <a href="#contact" className="block bg-orange-500 text-white text-center py-4 rounded-lg font-bold shadow-lg active:scale-95 transition-transform">
          Devis gratuit sous 24h
        </a>
      </div>
    </div>
  );
};

export default AMRLanding;