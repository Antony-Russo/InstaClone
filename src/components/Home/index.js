import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import HomeDetails from '../HomeDetails'
import Header from '../Header'
import Stories from '../Stories'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    postData: [],
    commentList: [],
    onSearchInput: '',
  }

  componentDidMount() {
    this.getUserPost()
  }

  getUserPost = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {onSearchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${onSearchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const fetchedData = data.posts.map(each => ({
        postId: each.post_id,
        userId: each.user_id,
        userName: each.user_name,
        profilePic: each.profile_pic,
        likesCount: each.likes_count,
        imageUrl: each.post_details.image_url,
        caption: each.post_details.caption,
        comment: each.comments,
        createdAt: each.created_at,
      }))
      const commentData = data.posts.map(each => ({
        comments: each.comments,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        postData: fetchedData,
        commentList: commentData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSearchCaption = search => {
    this.setState({onSearchInput: search}, this.getUserPost)
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={40} width={40} />
    </div>
  )

  onClickRetry = () => {
    this.setState({onSearchInput: ''}, this.getUserPost)
  }

  renderHomePostView = () => {
    const {postData, commentList} = this.state
    const postLength = postData.length > 0
    return postLength ? (
      <ul className="post-list">
        {postData.map(each => (
          <HomeDetails
            key={each.postId}
            postDetails={each}
            commentDetails={commentList}
          />
        ))}
      </ul>
    ) : (
      <div className="failureView-content-home">
        <h1 className="failure-view-heading">Search Results</h1>
        <img
          src="https://res.cloudinary.com/r947j17/image/upload/v1645428892/Search-Not-Found_pezc4b.png"
          alt="search not found"
          className="home-failure-img"
        />
        <p className="failure-text">Try different keyword or search again</p>
        <button
          type="button"
          className="failure-btn"
          onClick={this.onClickRetry}
        >
          Try again
        </button>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="homeFailure-container">
      <img
        src="https://res.cloudinary.com/dyftxeexv/image/upload/v1728306845/btrakgkhkds22lzp7vdx.png"
        alt="failure view"
        className="home-failure-img"
      />
      <h1 className="failure-view-heading">
        Something went wrong.Please try again
      </h1>
      <button type="button" className="failure-btn" onClick={this.onClickRetry}>
        Try Again
      </button>
    </div>
  )

  renderHomePostDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderHomePostView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {postData} = this.state
    const postLength = postData.length > 0
    return (
      <>
        <Header onSearchCaption={this.onSearchCaption} />
        {postLength && <Stories />}
        {this.renderHomePostDetails()}
      </>
    )
  }
}
export default Home
