import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Admin() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', price: '', description: '' })
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/Login')
      return
    }
    setUser(user)
    fetchProducts()
  }

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      console.error('Error fetching products:', error)
    } else {
      setProducts(data || [])
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = fileName

      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        alert(`Error uploading ${file.name}: ${uploadError.message}`)
      } else {
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    setImages([...images, ...uploadedUrls])
    setUploading(false)
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({ name: product.name, price: product.price, description: product.description })
    setImages(product.images || [])
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ name: '', price: '', description: '' })
    setImages([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (images.length === 0) {
      alert('Please upload at least one image')
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('products')
        .update({ ...form, images })
        .eq('id', editingId)
      
      if (error) {
        console.error('Error updating product:', error)
      } else {
        handleCancel()
        fetchProducts()
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([{ ...form, images }])
      
      if (error) {
        console.error('Error adding product:', error)
      } else {
        setForm({ name: '', price: '', description: '' })
        setImages([])
        fetchProducts()
      }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting product:', error)
    } else {
      fetchProducts()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/Login')
  }

  if (!user) return null

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div>
          <button onClick={() => navigate('/')} className="back-btn">Back to Store</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-form">
          <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Price (e.g., $29.99)"
              value={form.price}
              onChange={(e) => setForm({...form, price: e.target.value})}
              required
            />
            <textarea
              placeholder="Product Description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows="4"
              required
            />
            <div className="image-upload-section">
              <label className="upload-label">
                {uploading ? 'Uploading...' : 'Upload Images'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{display: 'none'}}
                />
              </label>
              <div className="uploaded-images">
                {images.map((img, index) => (
                  <div key={index} className="uploaded-image">
                    <img src={img} alt={`Upload ${index + 1}`} />
                    <button type="button" onClick={() => removeImage(index)} className="remove-img-btn">×</button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="add-btn" disabled={uploading}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="admin-products">
          <h2>Current Products ({products.length})</h2>
          <div className="products-list">
            {products.map(product => (
              <div key={product.id} className="admin-product-card">
                <img src={product.images?.[0] || product.image} alt={product.name} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.price}</p>
                  <small>{product.images?.length || 1} image(s)</small>
                </div>
                <div className="product-actions">
                  <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
