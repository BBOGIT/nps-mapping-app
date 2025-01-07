import React from 'react';
import { FileUpload } from './components/FileUpload';

function App() {
  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-[95%] mx-auto px-4 py-4">
          <img 
            src="https://webview.nps.42flows.tech/assets/nova-global-logo-kqnedJrA.svg" 
            alt="Nova Global" 
            className="h-8"
          />
        </div>
      </header>
      <div className="min-h-screen bg-[#F5F5F5] py-12">
        <div className="max-w-[95%] mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-[#333] mb-8">
            File Processing System
          </h1>
          <FileUpload />
        </div>
      </div>
    </>
  );
}

export default App;