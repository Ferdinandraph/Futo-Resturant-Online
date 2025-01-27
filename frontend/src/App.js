import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter } from 'react-router-dom';
import { AllRoutes } from './routes/AllRoutes';

function App() {
  return (
    <div className="min-h-screen bg-grey">
      <BrowserRouter>
        {/* Adjust the layout */}
        <Header />
        <div className="relative pt-24">
          <AllRoutes />
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
