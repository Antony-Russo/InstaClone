import {BiCamera} from 'react-icons/bi'
import {FaCamera} from 'react-icons/fa'
import './index.css'

const MyProfileCard = props => {
  const {profileDetails, storiesList, postList} = props
  const {
    userName,
    profilePic,
    followersCount,
    followingCount,
    userBio,
    postsCount,
    userId,
  } = profileDetails

  return (
    <li className="myprofile-list-items">
      <div className="profile-main-container">
        <div className="myprofile-container">
          <div className="profile-details-container">
            <img src={profilePic} alt="my profile" className="myprofile-img" />
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
              <h1 className="profileuser-id">{userId}</h1>
              <p className="userBio">{userBio}</p>
            </div>
          </div>
          <div className="stories-container">
            <ul className="stories-list">
              {storiesList.map(each => (
                <li
                  key={each.storiesId}
                  storiesList={each}
                  className="stories-list-items"
                >
                  <img
                    src={each.imageStory}
                    alt="my story"
                    className="stories-img"
                  />
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className="post-heading-container">
            <BiCamera className="bs-logo" />
            <h1 className="head-post">Posts</h1>
          </div>
          {postsCount > 0 ? (
            <div className="post-img-container">
              <ul className="posts-lists">
                {postList.map(each => (
                  <li
                    key={each.postId}
                    postList={each}
                    className="posts-lists-item"
                  >
                    <img
                      src={each.imagePost}
                      alt="my post"
                      className="post-logo"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="nopost-container">
              <FaCamera className="nopost-logo" />
              <h1 className="nopost-head">No Posts</h1>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
export default MyProfileCard
