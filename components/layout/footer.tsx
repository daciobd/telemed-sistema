'use client'

import { Heart, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  product: [
    { name: 'Funcionalidades', href: '#features' },
    { name: 'Preços', href: '/pricing' },
    { name: 'Demonstração', href: '/demo' },
    { name: 'Integrações', href: '/integrations' },
  ],
  company: [
    { name: 'Sobre', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carreiras', href: '/careers' },
    { name: 'Contato', href: '/contact' },
  ],
  support: [
    { name: 'Central de Ajuda', href: '/help' },
    { name: 'Documentação', href: '/docs' },
    { name: 'Status do Sistema', href: '/status' },
    { name: 'Suporte', href: '/support' },
  ],
  legal: [
    { name: 'Privacidade', href: '/privacy' },
    { name: 'Termos de Uso', href: '/terms' },
    { name: 'LGPD', href: '/lgpd' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">TeleMed Pro</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Plataforma completa de telemedicina que conecta médicos e pacientes 
              através de tecnologia avançada e segura.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produto</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-gray-400">contato@telemed.com.br</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Telefone</div>
                <div className="text-gray-400">(11) 99999-8888</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium">Endereço</div>
                <div className="text-gray-400">São Paulo, SP - Brasil</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © 2025 TeleMed Pro. Todos os direitos reservados. 
            <span className="mx-2">|</span>
            Desenvolvido com ❤️ para a saúde digital.
          </p>
        </div>
      </div>
    </footer>
  )
}