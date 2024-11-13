import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import './index.css'

class HomeDetails extends Component {
  state = {isLiked: false, likedStatus: false, counter: 0}

  renderPostLiked = async () => {
    const {likedStatus} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const {postDetails} = this.props
    const {postId} = postDetails
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'post',
      body: JSON.stringify({like_status: likedStatus}),
    }
    const response = await fetch(url, option)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
    }
  }

  onClickLikeBtnIncreas = () => {
    this.setState({isLiked: true})
    this.setState({likedStatus: true}, this.renderPostLiked)
    this.setState(prevState => ({counter: prevState.counter + 1}))
  }

  onClickLikeBtnDecrease = () => {
    this.setState({isLiked: false})
    this.setState({likedStatus: false}, this.renderPostLiked)
    this.setState(prevState => ({counter: prevState.counter - 1}))
  }

  render() {
    const {isLiked, counter} = this.state
    const {postDetails} = this.props
    const {
      userId,
      userName,
      profilePic,
      likesCount,
      imageUrl,
      caption,
      comment,
      createdAt,
    } = postDetails

    const updateCount = likesCount + counter

    return (
      <li className="home-post-lists" data-testid="postCard">
        <div className="home-app-container">
          <div className="home-details-container">
            <div className="profile-section">
              <img
                src={profilePic}
                alt="post author profile"
                className="profile-img"
              />
              <Link to={`/users/${userId}`} className="home-post-listed">
                <h1 className="profile-name">{userName}</h1>
              </Link>
            </div>
            <img src={imageUrl} alt="post" className="post-img" />
            <div className="like-btn-container">
              {isLiked ? (
                <button
                  type="button"
                  testid="unLikeIcon"
                  className="like-iconBtn"
                  onClick={this.onClickLikeBtnDecrease}
                >
                  <FcLike className="icon-btn" size={24} />
                </button>
              ) : (
                <button
                  type="button"
                  testid="likeIcon"
                  className="like-iconBtn"
                  onClick={this.onClickLikeBtnIncreas}
                >
                  <BsHeart className="icon-btn" size={20} />
                </button>
              )}
              <FaRegComment className="icon-btn" size={20} />
              <BiShareAlt className="icon-btn" size={20} />
            </div>
            <div className="post-details-container">
              <p className="post-likes">{updateCount} likes</p>
              <p className="post-caption">{caption}</p>
              <ul className="comment-home-list">
                {comment.map(each => (
                  <li key={each.user_id} className="comments-list">
                    <p className="comment-post">
                      <span className="username-comment">{each.user_name}</span>
                      {each.comment}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="created-time">{createdAt}</p>
            </div>
          </div>
        </div>
      </li>
    )
  }
}
export default HomeDetails
