
export default function Home() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="text-center mb-4">Next.js with Bootstrap</h1>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome to your Next.js app!</h5>
              <p className="card-text">
                This application is set up with Next.js, TypeScript, Tailwind CSS, and Bootstrap.
                You now have access to both Tailwind utility classes and Bootstrap components.
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-primary">Bootstrap Button</button>
                <button className="btn btn-outline-secondary">Another Button</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
