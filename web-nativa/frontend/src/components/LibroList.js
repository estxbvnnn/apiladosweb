import React from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

class LibroList extends React.Component {
  state = { libros: [] };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    api.get('/libros').then(res => this.setState({ libros: res.data })).catch(() => {});
  }

  remove = (id) => {
    if (!window.confirm('Eliminar registro?')) return;
    api.delete(`/libros/${id}`).then(() => this.fetch()).catch(() => {});
  }

  render() {
    return (
      <div>
        <div className="list-header">
          <h2>Listado de libros</h2>
          <Link to="/nuevo" className="btn">Añadir libro</Link>
        </div>

        <div className="list-grid">
          {this.state.libros.map(l => (
            <div key={l._id} className="book-item">
              {l.portada && <img src={`http://localhost:5000${l.portada}`} alt={l.nombreLibro} />}
              <div className="book-meta">
                <div className="book-title">{l.nombreLibro}</div>
                <div className="book-sub">{l.autor} · {l.editorial}</div>
                <div className="inline-actions">
                  <Link to={`/libro/${l._id}`} className="btn small">Detalle</Link>
                  <Link to={`/editar/${l._id}`} className="btn small secondary">Editar</Link>
                  <button onClick={() => this.remove(l._id)} className="btn small danger">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default LibroList;
