import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { Search, Mail, Phone, MessageCircle, MapPin, Clock, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import logo from '../assets/logo.png'

export default function Home() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })

    if (!error) setProducts(data || [])
  }

  const handleOrder = (product) => {
    const message = `Hi, I would like to order ${product.name}`
    const whatsappUrl = `https://wa.me/918344197738?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="HYZI GreenSignal India" className="h-12 w-auto" />
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">HYZI GreenSignal India</h1>
            </div>
            <div className="flex justify-center gap-6 md:gap-8 text-sm font-medium">
              <a href="#hero" className="hover:text-amber-600 transition">Home</a>
              <a href="#products" className="hover:text-amber-600 transition">Products</a>
              <a href="#about" className="hover:text-amber-600 transition">About</a>
              <a href="#location" className="hover:text-amber-600 transition">Location</a>
              <a href="#contact" className="hover:text-amber-600 transition">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <section id="hero" className="py-24 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Premium Air Fresheners & Diffuser Systems
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Transform any space with professional fragrance solutions for cars, homes, offices, gyms & hospitals.
            </p>
            <div className="flex justify-center">
              <Button className="flex items-center gap-2" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                <ShoppingBag size={18} />
                Shop Now
              </Button>
            </div>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            src={logo}
            alt="HYZI GreenSignal India"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-3">Our Products</h2>
            <p className="text-gray-600 text-lg">Professional fragrance systems for every environment</p>
          </div>

          <div className="relative max-w-xl mx-auto mb-12">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:outline-none transition"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <motion.div key={product.id} whileHover={{ y: -8 }} transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                      onClick={() => navigate(`/product/${product.id}`)}>
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-slate-800">{product.name}</h3>
                    <p className="text-xl font-bold text-amber-600 mb-3">₹{product.price}</p>
                    <Button
                      className="w-full text-sm py-2 flex items-center justify-center gap-2"
                      onClick={(e) => { e.stopPropagation(); handleOrder(product); }}>
                      <MessageCircle size={16} />
                      Order on WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
            alt="About Us"
            className="rounded-2xl shadow-xl"
          />
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">About HYZI GreenSignal India</h2>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              We deliver advanced fragrance solutions for cars, offices, hospitals, malls and commercial spaces across India.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our systems combine technology and premium scents to create clean, refreshing and welcoming environments.
            </p>
          </div>
        </div>
      </section>

      <section id="location" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">Where We Serve</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <Card className="p-8">
                <div className="flex items-start gap-3">
                  <MapPin className="text-amber-600 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">Solutions For</h3>
                    <p className="text-gray-600 text-lg">Cars • Homes • Offices • Gyms • Hospitals • Hotels</p>
                  </div>
                </div>
              </Card>
              <Card className="p-8">
                <div className="flex items-start gap-3">
                  <Clock className="text-amber-600 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-slate-800">Business Hours</h3>
                    <p className="text-gray-600 text-lg">Monday - Saturday: 9 AM – 6 PM</p>
                  </div>
                </div>
              </Card>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3888.8213667652212!2d80.08642507507555!3d12.919199987391377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU1JzA5LjEiTiA4MMKwMDUnMjAuNCJF!5e0!3m2!1sen!2sin!4v1770373215755!5m2!1sen!2sin"
              className="w-full h-[400px] rounded-2xl border-0 shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Email', value: 'hyzigreensignal2025@gmail.com', icon: Mail },
              { title: 'Phone', value: '+91 8344197738', icon: Phone },
              { title: 'WhatsApp', value: '+91 8344197738', icon: MessageCircle }
            ].map((item, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <item.icon className="text-amber-600" size={32} />
                </div>
                <h3 className="font-bold text-xl mb-2 text-slate-800">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.value}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-3">HYZI GreenSignal India</h3>
              <p className="text-gray-300">Premium fragrance solutions across India</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2">
                <a href="#products" className="text-gray-300 hover:text-amber-400 transition">Products</a>
                <a href="#about" className="text-gray-300 hover:text-amber-400 transition">About</a>
                <a href="#contact" className="text-gray-300 hover:text-amber-400 transition">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 text-center text-gray-400">
            <p>© 2025 HYZI GreenSignal India. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}