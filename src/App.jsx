import { BrowserRouter } from 'react-router'
import MarketRoutes from './market/MarketApp'

// El marketplace vive en /tienda. Cuando se integren la landing y el login,
// se agregan sus rutas aquí junto a <MarketRoutes />.
function App() {
  return (
    <BrowserRouter>
      <MarketRoutes />
    </BrowserRouter>
  )
}

export default App
