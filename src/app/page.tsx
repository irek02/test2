
'use client';

import { useState, useEffect } from 'react';
import { StoreData, saveStore, getStoredStores, deleteStore } from '@/utils/storeStorage';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStore, setGeneratedStore] = useState<StoreData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedStores, setSavedStores] = useState<StoreData[]>([]);

  // Load saved stores on component mount
  useEffect(() => {
    setSavedStores(getStoredStores());
  }, []);

  const handleGenerateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedStore(null);

    try {
      const response = await fetch('/api/generate-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate store');
      }

      const storeData: StoreData = await response.json();
      
      // Save the store to localStorage
      saveStore(storeData);
      
      // Update state
      setGeneratedStore(storeData);
      setSavedStores(getStoredStores());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteStore = (storeId: string) => {
    deleteStore(storeId);
    setSavedStores(getStoredStores());
    // If we're viewing the deleted store, clear it
    if (generatedStore?.id === storeId) {
      setGeneratedStore(null);
    }
  };

  const handleViewStore = (store: StoreData) => {
    const storeUrl = `/store/${store.id}?data=${encodeURIComponent(JSON.stringify(store))}`;
    window.open(storeUrl, '_blank');
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="mb-4">
                <span 
                  className="badge rounded-pill px-3 py-2 mb-3"
                  style={{ backgroundColor: '#e3f2fd', color: '#1565c0' }}
                >
                  ✨ Powered by AI
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-3" style={{ color: '#1a202c' }}>
                AI Store Builder
              </h1>
              <p className="lead mb-4" style={{ color: '#4a5568' }}>
                Transform your ideas into beautiful online stores in seconds.<br/>
                Just describe your vision and let AI handle the rest.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {/* Prompt Input Form */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <form onSubmit={handleGenerateStore}>
                  <div className="mb-4">
                    <label 
                      htmlFor="storePrompt" 
                      className="form-label fw-semibold mb-3"
                      style={{ color: '#2d3748', fontSize: '1.1rem' }}
                    >
                      What kind of store do you want to create?
                    </label>
                    <textarea
                      id="storePrompt"
                      className="form-control border-0 shadow-sm"
                      rows={4}
                      placeholder="e.g., Create a vintage vinyl record store with rare jazz albums, or a sustainable home goods shop focusing on eco-friendly products..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isGenerating}
                      required
                      style={{ 
                        borderRadius: '12px',
                        backgroundColor: '#f7fafc',
                        fontSize: '1rem',
                        padding: '16px'
                      }}
                    />
                    <div className="form-text mt-2" style={{ color: '#718096' }}>
                      💡 Be specific about your products, target audience, and store style for best results.
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-lg border-0 shadow-sm"
                      disabled={isGenerating || !prompt.trim()}
                      style={{
                        backgroundColor: isGenerating || !prompt.trim() ? '#e2e8f0' : '#3182ce',
                        color: isGenerating || !prompt.trim() ? '#a0aec0' : 'white',
                        borderRadius: '12px',
                        padding: '16px',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Generating Your Store...
                        </>
                      ) : (
                        <>
                          🚀 Generate My Store
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div 
                className="alert border-0 mt-4 shadow-sm" 
                role="alert"
                style={{ 
                  backgroundColor: '#fed7d7', 
                  color: '#c53030',
                  borderRadius: '12px'
                }}
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">⚠️</span>
                  <div>
                    <h6 className="alert-heading mb-1" style={{ color: '#c53030' }}>Generation Failed</h6>
                    <span style={{ color: '#742a2a' }}>{error}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Store Preview */}
            {generatedStore && (
              <div className="mt-5">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div 
                    className="card-header border-0 text-white"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '16px 16px 0 0'
                    }}
                  >
                    <h5 className="mb-0 d-flex align-items-center">
                      <span className="me-2">🎉</span>
                      Your Store Has Been Generated!
                    </h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2" style={{ color: '#2d3748' }}>
                          {generatedStore.name}
                        </h6>
                        <p className="mb-3" style={{ color: '#4a5568' }}>
                          {generatedStore.tagline}
                        </p>
                        
                        <div className="mb-3">
                          <small className="d-block mb-2" style={{ color: '#718096', fontWeight: '500' }}>
                            Theme Colors:
                          </small>
                          <div className="d-flex gap-2">
                            <div 
                              className="rounded-circle shadow-sm" 
                              style={{ 
                                backgroundColor: generatedStore.theme.primary, 
                                width: '32px', 
                                height: '32px',
                                border: '2px solid white'
                              }}
                              title={`Primary: ${generatedStore.theme.primary}`}
                            ></div>
                            <div 
                              className="rounded-circle shadow-sm" 
                              style={{ 
                                backgroundColor: generatedStore.theme.secondary, 
                                width: '32px', 
                                height: '32px',
                                border: '2px solid white'
                              }}
                              title={`Secondary: ${generatedStore.theme.secondary}`}
                            ></div>
                            <div 
                              className="rounded-circle shadow-sm" 
                              style={{ 
                                backgroundColor: generatedStore.theme.accent, 
                                width: '32px', 
                                height: '32px',
                                border: '2px solid white'
                              }}
                              title={`Accent: ${generatedStore.theme.accent}`}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <small className="d-block mb-2" style={{ color: '#718096', fontWeight: '500' }}>
                            Products Generated:
                          </small>
                          <span 
                            className="badge rounded-pill px-3 py-2"
                            style={{ backgroundColor: '#bee3f8', color: '#2c5282' }}
                          >
                            {generatedStore.products.length} Products
                          </span>
                        </div>
                        
                        <div>
                          <small className="d-block mb-2" style={{ color: '#718096', fontWeight: '500' }}>
                            Sample Products:
                          </small>
                          <ul className="list-unstyled mb-0">
                            {generatedStore.products.slice(0, 3).map((product) => (
                              <li key={product.id} className="small mb-1" style={{ color: '#4a5568' }}>
                                • {product.name} - <span className="fw-semibold">${product.price}</span>
                              </li>
                            ))}
                            {generatedStore.products.length > 3 && (
                              <li className="small" style={{ color: '#a0aec0' }}>
                                • And {generatedStore.products.length - 3} more...
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-top">
                      <div className="d-flex gap-3">
                        <button 
                          className="btn border-0 shadow-sm"
                          onClick={() => {
                            const storeUrl = `/store/${generatedStore.id}?data=${encodeURIComponent(JSON.stringify(generatedStore))}`;
                            window.open(storeUrl, '_blank');
                          }}
                          style={{
                            backgroundColor: '#38a169',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '12px 24px',
                            fontWeight: '600'
                          }}
                        >
                          👁️ View Full Store
                        </button>
                        <button 
                          className="btn border-0"
                          onClick={() => {
                            setGeneratedStore(null);
                            setPrompt('');
                          }}
                          style={{
                            backgroundColor: '#f7fafc',
                            color: '#4a5568',
                            borderRadius: '10px',
                            padding: '12px 24px',
                            fontWeight: '600'
                          }}
                        >
                          🔄 Generate Another Store
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Example Prompts */}
            {!generatedStore && (
              <div className="mt-5">
                <div className="text-center mb-4">
                  <h5 style={{ color: '#2d3748' }}>💡 Need inspiration? Try these examples:</h5>
                </div>
                <div className="row g-3">
                  {[
                    { icon: "🎵", text: "Create a vintage vinyl record store with rare jazz albums" },
                    { icon: "🌱", text: "Build a sustainable home goods shop focusing on eco-friendly products" },
                    { icon: "☕", text: "Make a boutique coffee shop selling artisanal blends from around the world" }
                  ].map((example, index) => (
                    <div key={index} className="col-md-4">
                      <button
                        className="btn border-0 shadow-sm w-100 text-start p-3"
                        onClick={() => setPrompt(example.text)}
                        disabled={isGenerating}
                        style={{
                          backgroundColor: '#f7fafc',
                          color: '#4a5568',
                          borderRadius: '12px',
                          transition: 'all 0.2s',
                          minHeight: '80px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#edf2f7';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f7fafc';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div className="d-flex align-items-start">
                          <span className="me-2" style={{ fontSize: '1.2rem' }}>{example.icon}</span>
                          <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{example.text}</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Stores Section */}
            {savedStores.length > 0 && (
              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 d-flex align-items-center" style={{ color: '#2d3748' }}>
                    <span className="me-2">🏪</span>
                    Your Generated Stores ({savedStores.length})
                  </h5>
                  <button 
                    className="btn border-0 shadow-sm btn-sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all stores?')) {
                        localStorage.removeItem('ai_store_builder_stores');
                        setSavedStores([]);
                        setGeneratedStore(null);
                      }
                    }}
                    style={{
                      backgroundColor: '#fed7d7',
                      color: '#c53030',
                      borderRadius: '8px',
                      padding: '8px 16px'
                    }}
                  >
                    🗑️ Clear All
                  </button>
                </div>
              
                <div className="row g-4">
                  {savedStores.map((store) => (
                    <div key={store.id} className="col-md-6 col-lg-4">
                      <div 
                        className="card h-100 border-0 shadow-sm"
                        style={{ borderRadius: '16px' }}
                      >
                        <div 
                          className="card-header border-0 d-flex align-items-center p-3"
                          style={{ 
                            backgroundColor: '#f7fafc',
                            borderRadius: '16px 16px 0 0'
                          }}
                        >
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold" style={{ color: '#2d3748' }}>
                              {store.name}
                            </h6>
                            <small style={{ color: '#718096' }}>{store.tagline}</small>
                          </div>
                          <div className="d-flex gap-1 ms-2">
                            <div 
                              className="rounded-circle shadow-sm" 
                              style={{ 
                                backgroundColor: store.theme.primary, 
                                width: '14px', 
                                height: '14px',
                                border: '1px solid white'
                              }}
                              title={store.theme.primary}
                            ></div>
                            <div 
                              className="rounded-circle shadow-sm" 
                              style={{ 
                                backgroundColor: store.theme.secondary, 
                                width: '14px', 
                                height: '14px',
                                border: '1px solid white'
                              }}
                              title={store.theme.secondary}
                            ></div>
                            <div 
                              className="rounded-circle shadow-sm" 
                              style={{ 
                                backgroundColor: store.theme.accent, 
                                width: '14px', 
                                height: '14px',
                                border: '1px solid white'
                              }}
                              title={store.theme.accent}
                            ></div>
                          </div>
                        </div>
                        <div className="card-body p-3">
                          <p className="card-text small mb-3" style={{ color: '#4a5568', lineHeight: '1.4' }}>
                            &ldquo;{store.originalPrompt}&rdquo;
                          </p>
                          <div className="mb-3">
                            <small style={{ color: '#718096' }}>
                              <span className="fw-semibold">{store.products.length}</span> products • {new Date(store.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn border-0 shadow-sm btn-sm flex-grow-1"
                              onClick={() => handleViewStore(store)}
                              style={{
                                backgroundColor: '#3182ce',
                                color: 'white',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}
                            >
                              👁️ View Store
                            </button>
                            <button 
                              className="btn border-0 shadow-sm btn-sm"
                              onClick={() => {
                                if (confirm(`Delete "${store.name}"?`)) {
                                  handleDeleteStore(store.id);
                                }
                              }}
                              title="Delete Store"
                              style={{
                                backgroundColor: '#fed7d7',
                                color: '#c53030',
                                borderRadius: '8px',
                                padding: '8px 12px'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top mt-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <span style={{ color: '#2d3748', fontWeight: '600' }}>AI Store Builder</span>
                <span className="ms-2" style={{ color: '#a0aec0' }}>•</span>
                <span className="ms-2" style={{ color: '#718096', fontSize: '0.9rem' }}>
                  Powered by OpenAI GPT-4
                </span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <small style={{ color: '#a0aec0' }}>
                Built with Next.js & Bootstrap
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
