import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showErrorMsg, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-card-container">
          <img
            src="https://res.cloudinary.com/dyftxeexv/image/upload/v1727779531/accsijudqktdfjsfwh5y.png"
            className="login-logo"
            alt="website login"
          />
          <form className="form" onSubmit={this.onSubmitForm}>
            <img
              src="https://res.cloudinary.com/dyftxeexv/image/upload/v1727779861/zohejygc5ij3ur4lhic8.png"
              className="website-logo"
              alt="website head"
            />
            <h1 className="logo-head">Insta Share</h1>
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.onChangeUsername}
              placeholder="Username"
              className="input"
            />
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
              className="input"
            />
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}
export default Login
