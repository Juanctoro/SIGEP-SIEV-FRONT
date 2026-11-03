import { Link } from 'react-router'
import { Compass } from 'lucide-react'
import { EmptyState } from '../components/ui'
import { button } from '../components/styles'
import { paths } from '../routes'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-16">
      <EmptyState icon={Compass} title="Página no encontrada" action={<Link to={paths.home} className={button('primary')}>Volver a la tienda</Link>}>
        La página que buscas no existe o cambió de dirección.
      </EmptyState>
    </div>
  )
}
