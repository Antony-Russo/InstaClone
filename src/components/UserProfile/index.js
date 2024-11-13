import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfile extends Component {
  state = {
    profileData: {},
    postList: [],
    storyList: [],
    apiStatus: apiUrlStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserProfile()
  }

  getFormattedData = data => ({
    followersCount: data.followers_count,
    followingCount: data.following_count,
    id: data.id,
    profilePic: data.profile_pic,
    userBio: data.user_bio,
    userId: data.user_id,
    userName: data.user_name,
    postsCount: data.posts_count,
  })

  getUserProfile = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {userId} = params
    const url = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const profileUserData = this.getFormattedData(data.user_details)
      console.log(profileUserData)
      const {posts} = data.user_details
      const {stories} = data.user_details
      this.setState({
        profileData: profileUserData,
        postList: posts,
        storyList: stories,
        apiStatus: apiUrlStatusConstants.success,
      })
    }
    if (response.status === 400) {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={40} width={40} />
    </div>
  )

  renderStoriesList = () => {
    const {storyList} = this.state

    return (
      <div className="stories-container">
        <ul className="stories-list ">
          {storyList.map(story => (
            <li key={story.id} className="stories-list-items">
              <img src={story.image} alt="user story" className="stories-img" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderPostList = () => {
    const {postList, profileData} = this.state
    const postsCount = profileData.postsCount > 0

    return (
      <div className="cotain">
        <div className="post-heading-container">
          <BsGrid3X3 className="bs-logo" />
          <h1 className="head-post">Posts</h1>
        </div>
        {postsCount ? (
          <div className="post-img-container">
            <ul className="posts-lists">
              {postList.map(eachPost => (
                <li key={eachPost.id} className="posts-lists-item">
                  <img
                    src={eachPost.image}
                    alt="user post"
                    className="post-logo"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="nopost-container">
            <BiCamera className="nopost-logo" />
            <h1 className="nopost-head">No Posts</h1>
          </div>
        )}
      </div>
    )
  }

  renderProfileView = () => {
    const {profileData} = this.state
    const {
      userName,
      profilePic,
      followersCount,
      followingCount,
      userBio,
      postsCount,
      userId,
    } = profileData

    return (
      <div className="myprofile-list-items">
        <div className="profile-main-container">
          <div className="myprofile-container">
            <div className="profile-details-container">
              <img
                src={profilePic}
                alt="user profile"
                className="myprofile-img"
              />
              <div className="profile-list-container">
                <h1 className="profile-username">{userName}</h1>
                <div className="profile-post-container">
                  <p className="profile-posts">
                    <span className="span-profile">{postsCount}</span> posts
                  </p>
                  <p className="profile-posts">
                    <span className="span-profile">{followersCount} </span>
                    followers
                  </p>
                  <p className="profile-posts">
                    <span className="span-profile">{followingCount} </span>
                    following
                  </p>
                </div>
                <p className="profileuser-id">{userId}</p>
                <p className="userBio">{userBio}</p>
              </div>
            </div>
            {this.renderStoriesList()}
            <hr />
            {this.renderPostList()}
          </div>
        </div>
      </div>
    )
  }

  onClickRetry = () => this.getUserProfile()

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

  renderMyProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiUrlStatusConstants.success:
        return this.renderProfileView()
      case apiUrlStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="user-profile-view">{this.renderMyProfile()}</div>
      </>
    )
  }
}
export default UserProfile
