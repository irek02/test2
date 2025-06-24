'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StoreData {
  id: string;
  name: string;
  tagline: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  products: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
  }>;
  content: {
    about: string;
    hero: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
  };
  createdAt: string;
  originalPrompt: string;
}

export default function StorePage() {
  const searchParams = useSearchParams();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll get store data from URL params
    // In a real app, this would fetch from a database
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsed = JSON.parse(decodeURIComponent(data));
        setStoreData(parsed);
      } catch (error) {
        console.error('Failed to parse store data:', error);
      }
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="container py-5 text-center">
        <h1>Store Not Found</h1>
        <p>The store you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  const { theme } = storeData;

  return (
    <div style={{ '--bs-primary': theme.primary, '--bs-secondary': theme.secondary } as React.CSSProperties}>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: theme.primary }}>
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">{storeData.name}</a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#products">Products</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: theme.secondary, color: 'white' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">{storeData.name}</h1>
              <p className="lead mb-4">{storeData.tagline}</p>
              <p className="mb-4">{storeData.content.hero}</p>
              <button className="btn btn-light btn-lg" style={{ color: theme.primary }}>
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ color: theme.primary }}>Our Products</h2>
          <div className="row g-4">
            {storeData.products.map((product) => (
              <div key={product.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div 
                    className="card-img-top d-flex align-items-center justify-content-center"
                    style={{ 
                      height: '200px', 
                      backgroundColor: theme.accent + '20',
                      color: theme.primary 
                    }}
                  >
                    <i className="fas fa-image fa-3x opacity-50"></i>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title">{product.name}</h5>
                      <span 
                        className="badge"
                        style={{ backgroundColor: theme.accent, color: 'white' }}
                      >
                        {product.category}
                      </span>
                    </div>
                    <p className="card-text text-muted small">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 mb-0" style={{ color: theme.primary }}>
                        ${product.price.toFixed(2)}
                      </span>
                      <button 
                        className="btn btn-sm"
                        style={{ backgroundColor: theme.primary, color: 'white' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="mb-4" style={{ color: theme.primary }}>About Us</h2>
              <div className="lead">{storeData.content.about}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="mb-4" style={{ color: theme.primary }}>Get in Touch</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card border-0">
                    <div className="card-body text-center">
                      <i className="fas fa-envelope fa-2x mb-3" style={{ color: theme.accent }}></i>
                      <h6>Email</h6>
                      <p className="text-muted">{storeData.content.contact.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0">
                    <div className="card-body text-center">
                      <i className="fas fa-phone fa-2x mb-3" style={{ color: theme.accent }}></i>
                      <h6>Phone</h6>
                      <p className="text-muted">{storeData.content.contact.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0">
                    <div className="card-body text-center">
                      <i className="fas fa-map-marker-alt fa-2x mb-3" style={{ color: theme.accent }}></i>
                      <h6>Address</h6>
                      <p className="text-muted">{storeData.content.contact.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: theme.primary, color: 'white' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h6>{storeData.name}</h6>
              <p className="mb-0">{storeData.tagline}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">
                <small>
                  Generated with AI Store Builder • {new Date(storeData.createdAt).toLocaleDateString()}
                </small>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}