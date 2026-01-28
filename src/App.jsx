import React, { useState, useEffect } from 'react';
import { ChevronDown, Shield, Truck, Settings, FileCheck, Building2, Phone, Mail, MapPin, Star, Menu, X, CheckCircle, Clock, Award, Users } from 'lucide-react';

const AMRLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(null);
  
  // État pour le formulaire de contact
  const [formData, setFormData] = useState({
    nom: '',
    societe: '',
    telephone: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envoyer l'email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Validation simple
    if (!formData.nom || !formData.telephone || !formData.email || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Veuillez remplir tous les champs obligatoires.'
      });
      setIsSubmitting(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Veuillez entrer une adresse email valide.'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Construction de l'email
      const emailBody = `
Nouvelle demande de devis - AMR Échafaudage

Nom: ${formData.nom}
Société: ${formData.societe || 'Non renseigné'}
Téléphone: ${formData.telephone}
Email: ${formData.email}

Message:
${formData.message}

---
Cette demande a été envoyée depuis le site web AMR Échafaudage.
      `.trim();

      // Utilisation de mailto pour ouvrir le client email
      const mailtoLink = `mailto:contact@amr-echafaudage.fr?subject=${encodeURIComponent('Nouvelle demande de devis - ' + formData.nom)}&body=${encodeURIComponent(emailBody)}`;
      
      // Ouvrir le client email
      window.location.href = mailtoLink;

      // Message de succès
      setFormStatus({
        type: 'success',
        message: 'Votre client email a été ouvert. Veuillez envoyer l\'email pour finaliser votre demande.'
      });

      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setFormData({
          nom: '',
          societe: '',
          telephone: '',
          email: '',
          message: ''
        });
        setFormStatus({ type: '', message: '' });
      }, 3000);

    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement au +33 4 91 31 44 74.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      name: "Philippe M.",
      company: "Entreprise BTP Marseille",
      rating: 5,
      text: "Équipe très professionnelle et réactive. Le matériel est conforme aux normes et le montage a été fait rapidement. Je recommande sans hésitation.",
      date: "Il y a 2 mois"
    },
    {
      name: "Thomas B.",
      company: "Rénovation Provence",
      rating: 5,
      text: "Excellent service ! AMR Échafaudage a su répondre à nos besoins avec efficacité. Matériel de qualité type Altrad Plettac, équipe sérieuse.",
      date: "Il y a 3 mois"
    },
    {
      name: "Karim D.",
      company: "Construction 13",
      rating: 5,
      text: "Très bon rapport qualité/prix. L'équipe est à l'écoute et respecte les délais. Parfait pour nos chantiers dans les Bouches-du-Rhône.",
      date: "Il y a 1 mois"
    }
  ];

  const team = [
    {
      name: "HAMMAMI Amor",
      role: "DIRECTEUR ADMINISTRATIF",
      image: "/assets/directeur.jpg"
    },
    {
      name: "HAMMAMI Ramzi",
      role: "CHARGÉ D'AFFAIRE",
      image: "/assets/charger.avif"
    },
    {
      name: "HAMMAMI Mohamed",
      role: "MAÎTRE D'OUVRAGE",
      image: "/assets/ouvrage.avif"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0077BE] shadow-lg' : 'bg-[#0077BE]/95'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img 
                src="/assets/logo-removebg.png" 
                alt="AMR Échafaudage" 
                className="w-32 h-32 md:w-40 md:h-40 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold text-white">AMR Échafaudage</h1>
                <p className="text-xs text-[#0077BE]">Votre partenaire sécurité</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#services" className="text-slate-200 hover:text-white transition-colors text-sm xl:text-base">Services</a>
              <a href="#about" className="text-slate-200 hover:text-white transition-colors text-sm xl:text-base">Qui sommes-nous ?</a>
              <a href="#realisations" className="text-slate-200 hover:text-white transition-colors text-sm xl:text-base">Réalisations</a>
              <a href="#team" className="text-slate-200 hover:text-white transition-colors text-sm xl:text-base">Notre équipe</a>
              <a href="#avis" className="text-slate-200 hover:text-white transition-colors text-sm xl:text-base">Avis clients</a>
              <a href="#contact" className="bg-white text-[#0077BE] px-4 xl:px-6 py-2 xl:py-3 rounded-lg font-semibold text-sm xl:text-base transition-all transform hover:scale-105 shadow-lg">
                Devis gratuit
              </a>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-[#005A8F] border-t border-[#0077BE]">
            <div className="px-4 py-4 space-y-3">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="block text-slate-200 hover:text-white py-2">Services</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-slate-200 hover:text-white py-2">Qui sommes-nous ?</a>
              <a href="#realisations" onClick={() => setIsMenuOpen(false)} className="block text-slate-200 hover:text-white py-2">Réalisations</a>
              <a href="#team" onClick={() => setIsMenuOpen(false)} className="block text-slate-200 hover:text-white py-2">Notre équipe</a>
              <a href="#avis" onClick={() => setIsMenuOpen(false)} className="block text-slate-200 hover:text-white py-2">Avis clients</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block bg-white text-[#0077BE] px-6 py-3 rounded-lg font-semibold text-center">
                Devis gratuit
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-12">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-block">
              <span className="bg-[#0077BE]/20 text-[#0077BE] px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold border border-[#0077BE]/30">
                ✓ Certifié & Conforme aux normes
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight px-4">
              Solutions d'échafaudage<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077BE] to-[#005A8F]">
                sécurisées
              </span> pour vos chantiers
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto px-4">
              Location, montage et démontage d'échafaudages conformes aux normes en vigueur
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 px-4">
              <a href="#contact" className="w-full sm:w-auto group bg-[#0077BE] hover:bg-[#005A8F] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2">
                <span>Demander un devis gratuit</span>
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-y-1 transition-transform" />
              </a>
              <a href="#realisations" className="w-full sm:w-auto bg-slate-700/50 hover:bg-slate-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all border border-slate-600">
                Voir nos réalisations
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 max-w-2xl mx-auto px-4">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-[#0077BE]">15+</div>
                <div className="text-slate-400 text-xs md:text-sm mt-1">Ans d'expérience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-[#0077BE]">500+</div>
                <div className="text-slate-400 text-xs md:text-sm mt-1">Chantiers réalisés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-[#0077BE]">100%</div>
                <div className="text-slate-400 text-xs md:text-sm mt-1">Conformité</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-[#0077BE]" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 md:mb-6" style={{color: '#8B9AA3'}}>
                Qui sommes nous ?
              </h2>
              <div className="space-y-3 md:space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
                <p>
                  Nous sommes une <strong>entreprise familiale dynamique et passionnée</strong>, spécialisée dans le montage, le démontage ainsi que la location d'échafaudages pour les professionnels et les particuliers.
                </p>
                <p>
                  Fondée sur des valeurs de sécurité, de confiance et de proximité, notre mission est d'accompagner nos clients dans leurs projets en leur proposant des solutions adaptées et un service de qualité.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden">
                <img 
                  src="/assets/image-1.jpeg" 
                  alt="Échafaudage AMR"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-[#3B4F5C] text-white p-6 md:p-8 rounded-xl shadow-2xl max-w-xs">
                <p className="text-sm leading-relaxed">
                  Une équipe dédiée à la sécurité et à la qualité de service pour tous vos projets d'échafaudage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
              Nos Services
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Des solutions complètes pour tous vos besoins en échafaudage
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveService(idx)}
                onMouseLeave={() => setActiveService(null)}
                className={`bg-white rounded-2xl p-6 md:p-8 transition-all duration-300 cursor-pointer border-2 ${
                  activeService === idx 
                    ? 'border-[#0077BE] shadow-2xl transform -translate-y-2' 
                    : 'border-transparent hover:border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className={`inline-flex p-3 md:p-4 rounded-xl mb-4 md:mb-6 transition-all ${
                  activeService === idx ? 'bg-[#0077BE] text-white' : 'bg-[#D4E9F7] text-[#0077BE]'
                }`}>
                  {service.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">{service.title}</h3>
                <p className="text-slate-600 text-sm md:text-base">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Découvrez notre savoir-faire sur le terrain
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-6 md:mb-8">
                Une équipe qualifiée, des procédures strictes et un engagement total pour la sécurité de vos chantiers.
              </p>
              <div className="space-y-3 md:space-y-4">
                {['Installation professionnelle', 'Équipements de sécurité certifiés', 'Respect des normes en vigueur'].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#0077BE] flex-shrink-0" />
                    <span className="text-slate-200 text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              <video 
                className="absolute inset-0 w-full h-full object-cover"
                controls
                poster="/assets/image-1.jpeg"
              >
                <source src="/assets/video-1.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{color: '#8B9AA3'}}>
              Réalisations
            </h2>
          </div>

          <div className="bg-gradient-to-br from-[#3B4F5C] to-[#2C3E4C] rounded-3xl p-6 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#0077BE] opacity-10 rounded-full -mr-16 md:-mr-32 -mt-16 md:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-[#0077BE] opacity-10 rounded-full -ml-24 md:-ml-48 -mb-24 md:-mb-48"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 mb-6 md:mb-8">
                <div className="bg-[#0077BE] p-2 md:p-3 rounded-lg">
                  <Award className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Diplômé CATEC</h3>
                  <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                    Cette certification témoigne de notre capacité à intervenir dans des espaces confinés, tout en respectant les normes les plus strictes en matière de sécurité. Grâce à cette qualification, nous renforçons notre expertise et élargissons nos compétences pour répondre à vos besoins les plus spécifiques.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#0077BE] mb-2 md:mb-3" />
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Espaces confinés</h4>
                  <p className="text-xs md:text-sm text-slate-300">Intervention sécurisée dans tous types d'espaces restreints</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20">
                  <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-[#0077BE] mb-2 md:mb-3" />
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Normes strictes</h4>
                  <p className="text-xs md:text-sm text-slate-300">Respect rigoureux des réglementations de sécurité</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 sm:col-span-2 md:col-span-1">
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-[#0077BE] mb-2 md:mb-3" />
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">Expertise renforcée</h4>
                  <p className="text-xs md:text-sm text-slate-300">Compétences élargies pour projets spécifiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section id="realisations" className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
              Projets Réalisés
            </h2>
            <p className="text-lg md:text-xl text-slate-600 px-4">
              Projets réalisés pour des chantiers de toutes tailles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="group relative aspect-square bg-slate-800 rounded-2xl overflow-hidden cursor-pointer">
                <img 
                  src={`/assets/image-${num}.jpeg`} 
                  alt={`Projet ${num}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <p className="text-[#0077BE] text-xs md:text-sm flex items-center font-semibold">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    Chantier réalisé
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" style={{color: '#8B9AA3'}}>
              Structure
            </h2>
            <p className="text-lg md:text-xl text-slate-600 px-4">
              Une équipe expérimentée à votre service
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group">
                <div className="relative aspect-[3/4] bg-slate-200 rounded-2xl overflow-hidden mb-4 md:mb-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3B4F5C]/90 via-[#3B4F5C]/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-base md:text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-[#0077BE] font-semibold text-xs md:text-sm bg-white/90 px-2 md:px-3 py-1 rounded-full inline-block">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4 px-4">
              Pourquoi choisir AMR Échafaudage ?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start space-x-3 md:space-x-4 p-4 md:p-6 bg-white rounded-xl hover:shadow-lg transition-shadow border border-slate-100">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-[#D4E9F7] rounded-lg flex items-center justify-center text-[#0077BE]">
                  {benefit.icon}
                </div>
                <p className="text-slate-700 font-medium pt-2 text-sm md:text-base">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section id="avis" className="py-12 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 px-4">
              Ce que disent nos clients
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 md:w-6 md:h-6 fill-[#0077BE] text-[#0077BE]" />
              ))}
              <span className="text-slate-300 ml-2 text-sm md:text-base">5/5 - Avis vérifiés</span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm px-4">Basé sur les avis de nos clients professionnels</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-[#0077BE]/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#0077BE] text-[#0077BE]" />
                    ))}
                  </div>
                  <span className="text-slate-500 text-xs">{review.date}</span>
                </div>
                <p className="text-slate-300 mb-4 md:mb-6 italic leading-relaxed text-sm md:text-base">"{review.text}"</p>
                <div className="border-t border-slate-700 pt-4">
                  <p className="text-white font-semibold text-sm md:text-base">{review.name}</p>
                  <p className="text-slate-400 text-xs md:text-sm">{review.company}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <a href="https://fr.mappy.com/poi/67cba4a82166a21c761b7cd6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#0077BE] hover:text-[#005A8F] font-semibold transition-colors text-sm md:text-base">
              Voir tous nos avis
              <ChevronDown className="w-4 h-4 md:w-5 md:h-5 ml-2 rotate-[-90deg]" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#0077BE] to-[#005A8F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 px-4">
            Besoin d'un échafaudage fiable pour votre chantier ?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 px-4">
            Recevez votre devis personnalisé sous 24h
          </p>
          <a href="#contact" className="inline-block bg-white text-[#0077BE] px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-base md:text-lg hover:bg-slate-100 transition-all transform hover:scale-105 shadow-2xl">
            Obtenir un devis sous 24h
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-12 md:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 md:mb-6">
                Contactez-nous
              </h2>
              <p className="text-slate-600 mb-6 md:mb-8 text-sm md:text-base">
                Remplissez le formulaire et notre équipe vous recontactera rapidement pour étudier votre projet.
              </p>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#0077BE] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Téléphone</p>
                    <a href="tel:+33491314474" className="text-slate-600 hover:text-[#0077BE] text-sm md:text-base">+33 4 91 31 44 74</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#0077BE] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Email</p>
                    <a href="mailto:contact@amr-echafaudage.fr" className="text-slate-600 hover:text-[#0077BE] text-sm md:text-base break-all">contact@amr-echafaudage.fr</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#0077BE] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Adresse</p>
                    <p className="text-slate-600 text-sm md:text-base">49 Boulevard des Libérateurs</p>
                    <p className="text-slate-600 text-sm md:text-base">13011 Marseille</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#0077BE] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Zone d'intervention</p>
                    <p className="text-slate-600 text-sm md:text-base">Bouches-du-Rhône et régions PACA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nom *</label>
                  <input 
                    type="text" 
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none text-sm md:text-base" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Société</label>
                  <input 
                    type="text" 
                    name="societe"
                    value={formData.societe}
                    onChange={handleInputChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none text-sm md:text-base" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone *</label>
                  <input 
                    type="tel" 
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none text-sm md:text-base" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none text-sm md:text-base" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4" 
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077BE] focus:border-transparent outline-none resize-none text-sm md:text-base"
                  ></textarea>
                </div>

                {formStatus.message && (
                  <div className={`p-4 rounded-lg ${
                    formStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <p className="text-sm">{formStatus.message}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0077BE] hover:bg-[#005A8F] text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/assets/logo-removebg.png" 
                  alt="AMR Échafaudage" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
                <h3 className="text-lg md:text-xl font-bold text-white">AMR Échafaudage</h3>
              </div>
              <p className="text-sm">Votre partenaire de confiance pour tous vos projets d'échafaudage.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Liens rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="hover:text-[#0077BE] transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-[#0077BE] transition-colors">Qui sommes-nous ?</a></li>
                <li><a href="#realisations" className="hover:text-[#0077BE] transition-colors">Réalisations</a></li>
                <li><a href="#team" className="hover:text-[#0077BE] transition-colors">Notre équipe</a></li>
                <li><a href="#avis" className="hover:text-[#0077BE] transition-colors">Avis clients</a></li>
                <li><a href="#contact" className="hover:text-[#0077BE] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Échafaudage façade</li>
                <li>Échafaudage industriel</li>
                <li>Montage & démontage</li>
                <li>Étude technique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm md:text-base">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:+33491314474" className="hover:text-[#0077BE] transition-colors">+33 4 91 31 44 74</a></li>
                <li><a href="mailto:contact@amr-echafaudage.fr" className="hover:text-[#0077BE] transition-colors break-all">contact@amr-echafaudage.fr</a></li>
                <li>49 Bd des Libérateurs</li>
                <li>13011 Marseille</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 md:pt-8 text-center text-xs md:text-sm">
            <p>&copy; 2025 AMR Échafaudage. Tous droits réservés. | <a href="#" className="hover:text-[#0077BE]">Mentions légales</a> | <a href="#" className="hover:text-[#0077BE]">CGV</a></p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 md:p-4 shadow-2xl z-40 safe-area-padding">
        <a href="#contact" className="block bg-[#0077BE] text-white text-center py-3 md:py-4 rounded-lg font-bold shadow-lg active:scale-95 transition-transform text-sm md:text-base">
          Devis gratuit sous 24h
        </a>
      </div>
    </div>
  );
};

export default AMRLanding;
