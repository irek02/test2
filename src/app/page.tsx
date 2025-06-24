
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">AI Store Builder</h1>
            <p className="lead text-muted">
              Describe your dream store and watch AI bring it to life in seconds
            </p>
          </div>

          {/* Prompt Input Form */}
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleGenerateStore}>
                <div className="mb-4">
                  <label htmlFor="storePrompt" className="form-label fw-semibold">
                    What kind of store do you want to create?
                  </label>
                  <textarea
                    id="storePrompt"
                    className="form-control"
                    rows={4}
                    placeholder="e.g., Create a vintage vinyl record store with rare jazz albums, or a sustainable home goods shop focusing on eco-friendly products..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                    required
                  />
                  <div className="form-text">
                    Be specific about your products, target audience, and store style for best results.
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generating Your Store...
                      </>
                    ) : (
                      'Generate My Store'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger mt-4" role="alert">
              <h6 className="alert-heading">Generation Failed</h6>
              {error}
            </div>
          )}

          {/* Generated Store Preview */}
          {generatedStore && (
            <div className="mt-5">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">🎉 Your Store Has Been Generated!</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold">{generatedStore.name}</h6>
                      <p className="text-muted mb-3">{generatedStore.tagline}</p>
                      
                      <div className="mb-3">
                        <small className="text-muted d-block">Theme Colors:</small>
                        <div className="d-flex gap-2">
                          <div 
                            className="rounded" 
                            style={{ 
                              backgroundColor: generatedStore.theme.primary, 
                              width: '30px', 
                              height: '30px' 
                            }}
                            title={`Primary: ${generatedStore.theme.primary}`}
                          ></div>
                          <div 
                            className="rounded" 
                            style={{ 
                              backgroundColor: generatedStore.theme.secondary, 
                              width: '30px', 
                              height: '30px' 
                            }}
                            title={`Secondary: ${generatedStore.theme.secondary}`}
                          ></div>
                          <div 
                            className="rounded" 
                            style={{ 
                              backgroundColor: generatedStore.theme.accent, 
                              width: '30px', 
                              height: '30px' 
                            }}
                            title={`Accent: ${generatedStore.theme.accent}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted d-block mb-1">Products Generated:</small>
                      <span className="badge bg-primary">{generatedStore.products.length} Products</span>
                      
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">Sample Products:</small>
                        <ul className="list-unstyled mb-0">
                          {generatedStore.products.slice(0, 3).map((product) => (
                            <li key={product.id} className="small">
                              • {product.name} - ${product.price}
                            </li>
                          ))}
                          {generatedStore.products.length > 3 && (
                            <li className="small text-muted">
                              • And {generatedStore.products.length - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-top">
                    <button 
                      className="btn btn-success me-2"
                      onClick={() => {
                        const storeUrl = `/store/${generatedStore.id}?data=${encodeURIComponent(JSON.stringify(generatedStore))}`;
                        window.open(storeUrl, '_blank');
                      }}
                    >
                      View Full Store
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setGeneratedStore(null);
                        setPrompt('');
                      }}
                    >
                      Generate Another Store
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Example Prompts */}
          {!generatedStore && (
            <div className="mt-5">
              <h5 className="text-center mb-3">Need inspiration? Try these examples:</h5>
              <div className="row g-3">
                {[
                  "Create a vintage vinyl record store with rare jazz albums",
                  "Build a sustainable home goods shop focusing on eco-friendly products",
                  "Make a boutique coffee shop selling artisanal blends from around the world"
                ].map((example, index) => (
                  <div key={index} className="col-md-4">
                    <button
                      className="btn btn-outline-secondary btn-sm w-100 text-start"
                      onClick={() => setPrompt(example)}
                      disabled={isGenerating}
                    >
                      {example}
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
                <h5 className="mb-0">Your Generated Stores ({savedStores.length})</h5>
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all stores?')) {
                      localStorage.removeItem('ai_store_builder_stores');
                      setSavedStores([]);
                      setGeneratedStore(null);
                    }
                  }}
                >
                  Clear All
                </button>
              </div>
              
              <div className="row g-3">
                {savedStores.map((store) => (
                  <div key={store.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                      <div 
                        className="card-header d-flex align-items-center p-3"
                        style={{ backgroundColor: store.theme.primary + '15' }}
                      >
                        <div className="flex-grow-1">
                          <h6 className="mb-0 fw-bold">{store.name}</h6>
                          <small className="text-muted">{store.tagline}</small>
                        </div>
                        <div className="d-flex gap-1 ms-2">
                          <div 
                            className="rounded-circle" 
                            style={{ 
                              backgroundColor: store.theme.primary, 
                              width: '12px', 
                              height: '12px' 
                            }}
                            title={store.theme.primary}
                          ></div>
                          <div 
                            className="rounded-circle" 
                            style={{ 
                              backgroundColor: store.theme.secondary, 
                              width: '12px', 
                              height: '12px' 
                            }}
                            title={store.theme.secondary}
                          ></div>
                          <div 
                            className="rounded-circle" 
                            style={{ 
                              backgroundColor: store.theme.accent, 
                              width: '12px', 
                              height: '12px' 
                            }}
                            title={store.theme.accent}
                          ></div>
                        </div>
                      </div>
                      <div className="card-body">
                        <p className="card-text small text-muted mb-2">
                          &ldquo;{store.originalPrompt}&rdquo;
                        </p>
                        <div className="mb-3">
                          <small className="text-muted">
                            {store.products.length} products • {new Date(store.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary btn-sm flex-grow-1"
                            onClick={() => handleViewStore(store)}
                          >
                            View Store
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              if (confirm(`Delete "${store.name}"?`)) {
                                handleDeleteStore(store.id);
                              }
                            }}
                            title="Delete Store"
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
  );
}
