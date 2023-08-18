import { Header } from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Docs } from './Docs';
import { Home } from './Home';
import { useEffect } from 'react';

export function App() {
  useEffect(()=>{
    window.addEventListener('popstate', e => {
      console.log(e);
    });
  },[])
  return (
    <Router>
      <div className="wrapper">
        <Header />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
      </div>
    </Router>
  );
}

