import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import LibroList from './components/LibroList';
import LibroForm from './components/LibroForm';
import LibroDetail from './components/LibroDetail';
import Search from './components/Search';
import NotFound from './components/NotFound';
import './styles.css'; // <-- nueva importación

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app-container">
          <nav className="app-nav">
            <div className="app-brand">Apilados - Admin Libros</div>
            <div>
              <Link to="/" style={{ marginRight: 10 }}>Inicio</Link>
              <Link to="/nuevo" style={{ marginRight: 10 }}>Nuevo</Link>
              <Link to="/listado" style={{ marginRight: 10 }}>Listado</Link>
              <Link to="/buscar">Buscar</Link>
            </div>
          </nav>
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nuevo" element={<LibroForm />} />
              <Route path="/editar/:id" element={<LibroForm editMode={true} />} />
              <Route path="/listado" element={<LibroList />} />
              <Route path="/libro/:id" element={<LibroDetail />} />
              <Route path="/buscar" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
