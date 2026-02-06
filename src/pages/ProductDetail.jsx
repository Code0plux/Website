import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching product:', error)
    } else {
      setProduct(data)
    }
  }

  const handleOrder = () => {
    const message = `Hi, I would like to order ${product.name}`
    const whatsappUrl = `https://wa.me/918344197738?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  if (!product) return <div className="loading">Loading...</div>

  return (
    <div className="product-detail-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo" onClick={() => navigate('/')}>HYZI GreenSignal India</h1>
        </div>
      </nav>

      <div className="product-detail-container">
        <button onClick={() => navigate('/')} className="back-button">← Back to Products</button>
        
        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <button className="slider-btn prev" onClick={prevImage}>‹</button>
              <img src={product.images[currentImageIndex]} alt={product.name} />
              <button className="slider-btn next" onClick={nextImage}>›</button>
            </div>
            <div className="image-thumbnails">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={currentImageIndex === index ? 'active' : ''}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="product-price">₹{product.price}</p>
            <button onClick={handleOrder} className="order-btn-detail">Order on WhatsApp</button>
            
            <div className="product-description">
              <h2>Product Description</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
