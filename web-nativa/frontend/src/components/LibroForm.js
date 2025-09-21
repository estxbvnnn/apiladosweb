import React from 'react';
import api from '../services/api';
import SimpleReactValidator from 'simple-react-validator';
import { withRouter, useParams, useNavigate } from 'react-router-dom';

// wrapper para usar params en clase
function withRouterClass(Component) {
  return props => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}

class LibroForm extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator();
    this.state = {
      ISBN: '',
      nombreLibro: '',
      autor: '',
      editorial: '',
      paginas: '',
      portadaFile: null,
      editMode: props.editMode || false,
      serverError: null // <-- nuevo estado
    };
  }

  componentDidMount() {
    const id = this.props.params?.id;
    if (id) {
      api.get(`/libros/${id}`).then(res => {
        const l = res.data;
        this.setState({
          ISBN: l.ISBN,
          nombreLibro: l.nombreLibro,
          autor: l.autor,
          editorial: l.editorial,
          paginas: l.paginas,
          portadaFile: null,
          editMode: true
        });
      }).catch(() => {});
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleFile = (e) => {
    this.setState({ portadaFile: e.target.files[0] });
  }

  submit = async (e) => {
    e.preventDefault();
    this.setState({ serverError: null });
    if (!this.validator.allValid()) {
      this.validator.showMessages();
      this.forceUpdate();
      return;
    }
    const form = new FormData();
    form.append('ISBN', this.state.ISBN);
    form.append('nombreLibro', this.state.nombreLibro);
    form.append('autor', this.state.autor);
    form.append('editorial', this.state.editorial);
    form.append('paginas', this.state.paginas);
    if (this.state.portadaFile) form.append('portada', this.state.portadaFile);

    try {
      if (this.state.editMode && this.props.params?.id) {
        await api.put(`/libros/${this.props.params.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/libros', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      this.props.navigate('/listado');
    } catch (err) {
      // Manejo mejorado del error: mostrar mensaje proveniente del servidor si existe
      console.error('Error guardando libro:', err);
      let message = 'Error al guardar';
      if (err.response && err.response.data) {
        // caso express-validator: { errors: [...] }
        if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
          message = err.response.data.errors.map(x => x.msg || x.msg || JSON.stringify(x)).join('; ');
        } else if (err.response.data.message) {
          message = err.response.data.message;
        } else {
          message = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
        message = err.message;
      }
      this.setState({ serverError: message });
      // opcional: alerta además del mensaje en UI
      // alert(message);
    }
  }

  render() {
    return (
      <div>
        <h2>{this.state.editMode ? 'Editar libro' : 'Nuevo libro'}</h2>
        <div className="form-card">
          <form onSubmit={this.submit}>
            <div className="form-row">
              <div className="field">
                <label>ISBN</label>
                <input name="ISBN" value={this.state.ISBN} onChange={this.handleChange} />
                {this.validator.message('ISBN', this.state.ISBN, 'required')}
              </div>
              <div className="field">
                <label>Páginas</label>
                <input name="paginas" type="number" value={this.state.paginas} onChange={this.handleChange} />
                {this.validator.message('paginas', this.state.paginas, 'required|numeric')}
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Nombre</label>
                <input name="nombreLibro" value={this.state.nombreLibro} onChange={this.handleChange} />
                {this.validator.message('nombreLibro', this.state.nombreLibro, 'required')}
              </div>
              <div className="field">
                <label>Autor</label>
                <input name="autor" value={this.state.autor} onChange={this.handleChange} />
                {this.validator.message('autor', this.state.autor, 'required')}
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Editorial</label>
                <input name="editorial" value={this.state.editorial} onChange={this.handleChange} />
                {this.validator.message('editorial', this.state.editorial, 'required')}
              </div>
              <div className="field">
                <label>Portada (imagen)</label>
                <input type="file" accept="image/*" onChange={this.handleFile} />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">{this.state.editMode ? 'Actualizar' : 'Crear'}</button>
              <button type="button" className="btn secondary" onClick={() => this.props.navigate('/listado')}>Cancelar</button>
            </div>
          </form>

          {/* Mensaje de error del servidor */}
          {this.state.serverError && (
            <div style={{ marginTop: 12, color: '#b91c1c', background: 'rgba(239,68,68,0.06)', padding: 10, borderRadius: 8 }}>
              {this.state.serverError}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouterClass(LibroForm);
