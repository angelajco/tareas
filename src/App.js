import Listado from './pages/listado'
import Historial from './pages/historial'
//Importaciones para uso de React Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
//Importaciones para uso de React Bootstrap
import { Nav, Container, Image } from 'react-bootstrap'

function App() {
  return (
    <>
      {/* Router permite hacer la dirección a las páginas */}
      <Router>
        <Container className="tw-text-2xl tw-mb-6">
          <Nav activeKey="/" className="justify-content-center">
            <Nav.Item>
              {/* Nav Link se usa como Link de React Router */}
              <Nav.Link as={Link} to="/" className="tw-text-black hover:tw-text-black hover:tw-font-bold">
                Página principal
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/listado" className="tw-text-black hover:tw-text-black hover:tw-font-bold">
                Listado
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/historial" className="tw-text-black hover:tw-text-black hover:tw-font-bold">
                Historial
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>

        {/* Switch muestra lo que se renderiza de acuerdo a la url de la página */}
        <Switch>
          {/* en la url / muestra la imagen reloj */}
          <Route path="/" exact>
            <div className="container tw-text-center">
              <div className="row">
                <div className="col-12">
                  <h2 className="tw-mb-3">Organiza tus actividades</h2>
                  <Image src="/reloj.png" alt="reloj" fluid width="100px" />
                </div>
              </div>
            </div>
          </Route>
          {/* en la url /listado muestra el componente Listado */}
          <Route path="/listado">
            <Listado />
          </Route>
          {/* en la url /historial muestra el componente Historial */}
          <Route path="/historial">
            <Historial />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
