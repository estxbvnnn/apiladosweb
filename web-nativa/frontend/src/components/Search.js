import React from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

class Search extends React.Component {
  state = { q: '', results: [] };

  handle = (e) => this.setState({ q: e.target.value });

  submit = (e) => {
    e.preventDefault();
    api.get(`/libros/search?q=${encodeURIComponent(this.state.q)}`).then(res => this.setState({ results: res.data })).catch(() => {});
  }

  render() {
    return (
      <div>
        <h2>Buscar libros</h2>
        <form onSubmit={this.submit} className="search-box">
          <input value={this.state.q} onChange={this.handle} placeholder="Nombre, autor o editorial" />
          <button type="submit" className="btn">Buscar</button>
        </form>

        {this.state.results.length === 0 ? (
          <div className="no-results">No hay resultados. Pruebe otra búsqueda.</div>
        ) : (
          <ul>
            {this.state.results.map(r => (
              <li key={r._id} className="book-item">
                {r.portada && <img src={`http://localhost:5000${r.portada}`} alt={r.nombreLibro} />}
                <div className="book-meta">
                  <Link to={`/libro/${r._id}`} className="book-title">{r.nombreLibro}</Link>
                  <div className="book-sub">{r.autor} · {r.editorial}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default Search;
