import React from 'react';
import api from '../services/api';

class Home extends React.Component {
  state = { last: [] };

  componentDidMount() {
    api.get('/libros/last3').then(res => this.setState({ last: res.data })).catch(() => {});
  }

  render() {
    return (
      <div>
        <div className="home-hero">
          <div>
            <h2>Bienvenido a Apilados - Admin Libros</h2>
            <div className="home-sub">Administre, busque y visualice los libros rápidamente.</div>
          </div>
          <div className="hint">Últimos libros añadidos</div>
        </div>

        <h3>Últimos 3 libros</h3>
        <ul className="book-list">
          {this.state.last.map(l => (
            <li key={l._id} className="book-item">
              {l.portada && <img src={`http://localhost:5000${l.portada}`} alt={l.nombreLibro} />}
              <div className="book-meta">
                <div className="book-title">{l.nombreLibro}</div>
                <div className="book-sub">{l.autor} · {l.editorial}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Home;
