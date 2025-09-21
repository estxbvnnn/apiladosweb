import React from 'react';
import api from '../services/api';
import { Link, useParams, useNavigate } from 'react-router-dom';

function withRouterClass(Component) {
  return props => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}

class LibroDetail extends React.Component {
  state = { libro: null };

  componentDidMount() {
    const id = this.props.params?.id;
    if (id) api.get(`/libros/${id}`).then(res => this.setState({ libro: res.data })).catch(() => {});
  }

  remove = () => {
    if (!window.confirm('Eliminar?')) return;
    api.delete(`/libros/${this.props.params.id}`).then(() => this.props.navigate('/listado')).catch(() => {});
  }

  render() {
    const l = this.state.libro;
    if (!l) return <div>Cargando...</div>;
    return (
      <div>
        <h2>{l.nombreLibro}</h2>
        {l.portada && <img src={`http://localhost:5000${l.portada}`} alt="" width="150" />}
        <p><strong>Autor:</strong> {l.autor}</p>
        <p><strong>Editorial:</strong> {l.editorial}</p>
        <p><strong>ISBN:</strong> {l.ISBN}</p>
        <p><strong>Páginas:</strong> {l.paginas}</p>
        <div>
          <Link to={`/editar/${l._id}`} style={{ marginRight: 10 }}>Editar</Link>
          <button onClick={this.remove}>Eliminar</button>
        </div>
      </div>
    );
  }
}

export default withRouterClass(LibroDetail);
