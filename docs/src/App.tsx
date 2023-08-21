import { Header } from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Docs } from './Docs';
import { Home } from './Home';

export function App() {
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

