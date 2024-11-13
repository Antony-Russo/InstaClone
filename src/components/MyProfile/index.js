import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import MyProfileCard from '../MyProfileCard'
import './index.css'

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MyProfile extends Component {
  state = {
    apiStatus: apiUrlStatusConstants.initial,
    profileData: [],
    postList: [],
    storiesList: [],
  }

  componentDidMount() {
    this.getMyProfileView()
  }

  getMyProfileView = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.profile].map(each => ({
        id: each.id,
        userId: each.user_id,
        userName: each.user_name,
        profilePic: each.profile_pic,
        followersCount: each.followers_count,
        followingCount: each.following_count,
        postsCount: each.posts_count,
        userBio: each.user_bio,
      }))
      const postData = fetchedData.profile.posts.map(eachPost => ({
        postId: eachPost.id,
        imagePost: eachPost.image,
      }))
      const storiesData = fetchedData.profile.stories.map(eachStories => ({
        storiesId: eachStories.id,
        imageStory: eachStories.image,
      }))
      this.setState({
        apiStatus: apiUrlStatusConstants.success,
        profileData: updatedData,
        postList: postData,
        storiesList: storiesData,
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

  renderMyProfileView = () => {
    const {profileData, storiesList, postList} = this.state
    return (
      <ul className="myprofile-list">
        {profileData.map(each => (
          <MyProfileCard
            key={each.id}
            profileDetails={each}
            storiesList={storiesList}
            postList={postList}
          />
        ))}
      </ul>
    )
  }

  onClickRetry = () => this.getMyProfileView()

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

  renderMyProfiles = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiUrlStatusConstants.success:
        return this.renderMyProfileView()
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
        <div className="my-profile-view">{this.renderMyProfiles()}</div>
      </>
    )
  }
}
export default MyProfile
