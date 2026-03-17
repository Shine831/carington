import { Shield, Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <Shield className="w-6 h-6 text-[var(--red)]" />
              <span className="font-black text-lg tracking-tight">
                E-JARNALUD<span className="text-[var(--red)]"> SOFT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Partenaire technologique de confiance des entreprises de Douala depuis plus de 10 ans.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Expertise</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Gestion IT & Infogérance</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Audit Cybersécurité</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Installation Réseau</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Vidéosurveillance</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-white transition-colors">Développement Web</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Entreprise</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Notre Mission</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Nous Contacter</Link></li>
              <li><Link href="/booking" className="text-gray-400 hover:text-white transition-colors">Demander un Devis</Link></li>
              <li><Link href="/account" className="text-gray-400 hover:text-white transition-colors">Espace Client</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Coordonnées</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[var(--red)] shrink-0 mt-0.5" />
                <span className="text-gray-400">Akwa, Douala, Cameroun</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[var(--red)] shrink-0" />
                <span className="text-gray-400">+237 600 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[var(--red)] shrink-0" />
                <span className="text-gray-400">contact@ejarnalud.cm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} E-JARNALUD SOFT. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-400 transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">CGV / CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
