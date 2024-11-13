import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notfound-container">
    <img
      src="https://res.cloudinary.com/dyftxeexv/image/upload/v1731066592/gkhgjppimtgescigq3lb.jpg"
      alt="page not found"
      className="notfound-img"
    />
    <h1 className="notfound-head">Page Not Found</h1>
    <p className="notfound-description">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/">
      <button type="button" className="notfound-btn">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
