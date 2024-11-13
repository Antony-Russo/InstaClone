import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },

    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Stories extends Component {
  state = {apiStatus: apiUrlStatusConstants.initial, storiesData: []}

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))
      this.setState({
        apiStatus: apiUrlStatusConstants.success,
        storiesData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="loader-container-story" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={35} width={35} />
    </div>
  )

  renderStoriesView = () => {
    const {storiesData} = this.state

    return (
      <>
        <Slider {...settings}>
          {storiesData.map(eachLogo => {
            const {userId, userName, storyUrl} = eachLogo
            return (
              <div className="slick-item" key={userId}>
                <img className="logo-image" src={storyUrl} alt="user story" />
                <p className="slick-name">{userName}</p>
              </div>
            )
          })}
        </Slider>
      </>
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
      <button type="button" className="failure-btn">
        Try Again
      </button>
    </div>
  )

  renderUsersStories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiUrlStatusConstants.success:
        return this.renderStoriesView()
      case apiUrlStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="userstories-posts-container">
        <div className="story-container">{this.renderUsersStories()}</div>
      </div>
    )
  }
}
export default Stories
