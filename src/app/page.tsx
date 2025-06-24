
'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // TODO: Add API call to generate store
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Store generation started for: ${prompt}`);
    }, 2000);
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

          {/* Example Prompts */}
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
        </div>
      </div>
    </div>
  );
}
