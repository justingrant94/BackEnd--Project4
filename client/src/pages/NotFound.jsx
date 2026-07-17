import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="page-shell not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>That route is not in the playbook.</p>
      <Link className="button" to="/">Back home</Link>
    </main>
  )
}

export default NotFound
