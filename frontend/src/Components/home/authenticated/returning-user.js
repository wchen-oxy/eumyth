import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withAuthorization } from '../../session';
import { withFirebase } from '../../../Firebase';
import AxiosHelper from '../../../Axios/axios';
import PostViewerController from "../../post/viewer/post-viewer-controller";
import Event from "../../profile/timeline/sub-components/timeline-event";
import { returnUserImageURL, TEMP_PROFILE_PHOTO_URL } from "../../constants/urls";
import { POST, LONG } from "../../constants/flags";
import './returning-user.scss';

class ReturningUserPage extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.firebase.returnUsername(),
            firstName: null,
            lastName: null,
            pursuits: null,
            pursuitNames: null,
            displayPhoto: null,
            indexUserData: null,

            allPosts: [],
            hasMore: true,
            fixedDataLoadLength: 4,
            nextOpenPostIndex: 0,
            feedData: [],

            isModalShowing: false,
            selectedEvent: null,
            textData: '',
            recentPosts: null
        }

        this.modalRef = React.createRef();
        this.handlePursuitClick = this.handlePursuitClick.bind(this);
        this.handleRecentWorkClick = this.handleRecentWorkClick.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.openModal = this.openModal.bind(this);
        this.openLongPostModal = this.openLongPostModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleDeletePost = this.handleDeletePost.bind(this);
        this.fetchNextPosts = this.fetchNextPosts.bind(this);
        this.createFeed = this.createFeed.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.props.firebase.returnName().then((result) => {
                if (result) {
                    this.setState({ firstName: result.firstName, lastName: result.lastName });
                }
            });
        }

        if (this._isMounted && this.state.username) {
            let allPosts = null;
            let indexUserData = null;
            let displayPhoto = "";
            let pursuits = null;
            let pursuitNames = [];
            let recentPosts = [];
            let hasMore = true;
            let totalMin = 0;
            let pursuitInfoArray = [];
            return (AxiosHelper
                .returnIndexUser(this.state.username)
                .then(
                    (result) => {
                        allPosts = result.data.following_feed;
                        indexUserData = result.data;
                        displayPhoto = result.data.cropped_display_photo_key;
                        pursuits = result.data.pursuits;
                        if (!allPosts || allPosts.length === 0) hasMore = false;
                        const slicedFeed = allPosts.slice(this.state.nextOpenPostIndex, this.state.nextOpenPostIndex + this.state.fixedDataLoadLength);
                        if (result.data.pursuits) {
                            for (const pursuit of result.data.pursuits) {
                                pursuitNames.push(pursuit.name);
                                totalMin += pursuit.total_min;
                                pursuitInfoArray.push(
                                    <tr key={pursuit.name}>
                                        <th key={pursuit.name + " name"}>{pursuit.name}</th>
                                        <td key={pursuit.name + " experience"}>{pursuit.experience_level}</td>
                                        <td key={pursuit.total_min + "minutes"}>{pursuit.total_min}</td>
                                        <td key={pursuit.num_posts + "posts"}>{pursuit.num_posts}</td>
                                        <td key={pursuit.num_milestones + " milestones"}>{pursuit.num_milestones}</td>
                                    </tr>
                                );
                            }
                        }
                        return Promise.all([
                            AxiosHelper.returnMultiplePosts(result.data.recent_posts, false),
                            (hasMore === false ? null : AxiosHelper.returnMultiplePosts(
                                slicedFeed,
                                true))])
                    }
                )
                .then(result => {
                    if (result[0]) {
                        let index = 0;
                        for (const value of result[0].data) {
                            recentPosts.push(
                                <Event
                                    mediaType={POST}
                                    key={index++}
                                    eventData={value}
                                    onEventClick={this.handleEventClick}
                                />)
                        }
                    }
                    if (result[1] !== null) return this.createFeed(result[1].data);
                })
                .then(
                    (result) => {
                        this.setState(
                            {
                                allPosts: allPosts ? allPosts : null,
                                indexUserData: indexUserData,
                                displayPhoto: displayPhoto,
                                pursuits: pursuits,
                                pursuitNames: pursuitNames,
                                pursuitInfoArray: pursuitInfoArray,
                                totalMin: totalMin,
                                recentPosts: recentPosts.length > 0 ? recentPosts : null,
                                feedData: result ? result[0] : [],
                                nextOpenPostIndex: result ? result[1] : 0,
                                hasMore: hasMore
                            });
                    }
                )
                .catch((err) => {
                    console.log(err);
                    alert("Could Not Load Feed." + err);
                }));
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    createFeed(inputArray) {
        let masterArray = this.state.feedData;
        let nextOpenPostIndex = this.state.nextOpenPostIndex;
        for (const feedItem of inputArray) {
            masterArray.push(
                <PostViewerController
                    key={nextOpenPostIndex++}
                    isOwnProfile={feedItem.username === this.state.username}
                    displayPhoto={feedItem.display_photo_key}
                    preferredPostType={feedItem.username === this.state.username ? this.state.indexUserData.preferredPostType : null}
                    closeModal={null}
                    pursuitNames={this.state.pursuitNames}
                    username={feedItem.username}
                    eventData={feedItem}
                    textData={feedItem.post_format === LONG ? JSON.parse(feedItem.text_data) : feedItem.text_data}
                    onDeletePost={feedItem.username === this.state.username ? this.handleDeletePost : null}
                    openLongPostModal={this.openLongPostModal}
                    largeViewMode={false}
                />);
        }
        return [masterArray, nextOpenPostIndex];

    }

    fetchNextPosts() {
        let hasMore = true;
        if (this.state.nextOpenPostIndex + this.state.fixedDataLoadLength >= this.state.allPosts.length) {
            hasMore = false;
        }
        return (AxiosHelper
            .returnMultiplePosts(
                this.state.allPosts.slice(this.state.nextOpenPostIndex, this.state.nextOpenPostIndex + this.state.fixedDataLoadLength),
                false)
            .then((result) => {
                if (this._isMounted && result.data) {
                    return this.createFeed(result.data, this.props.mediaType)
                };
            }
            )
            .then((result) => {
                if (result) {
                    this.setState({
                        feedData: result[0],
                        nextOpenPostIndex: result[1],
                        hasMore: hasMore
                    })
                }
                else {
                    this.setState({ hasMore: false })
                }
            })
            .catch((error) => console.log(error)));
    }

    handleDeletePost() {
        return AxiosHelper.deletePost(
            this.state.indexUserData.user_profile_id,
            this.state.indexUserData._id,
            this.state.selectedEvent._id
        ).then(
            (result) => console.log(result)
        );
    }

    openLongPostModal(data) {
        this.setState({
            selectedEvent: data,
            textData: JSON.parse(data.text_data),
        }, this.openModal())
    }

    openModal() {
        this.modalRef.current.style.display = "block";
        document.body.style.overflow = "hidden";
        this.setState({ isModalShowing: true });

    }

    closeModal() {
        this.modalRef.current.style.display = "none";
        document.body.style.overflow = "visible";
        this.setState({ isModalShowing: false, selectedEvent: null });
    }

    handlePursuitClick(e) {
        e.preventDefault();
        this.props.history.push(this.state.username);
    }

    handleRecentWorkClick(e, value) {
        e.preventDefault();
        alert(value);
    }

    handleEventClick(selectedEvent) {
        return (AxiosHelper
            .retrievePost(selectedEvent._id, true)
            .then(
                (result) => {
                    if (this._isMounted) {
                        this.setState({
                            selectedEvent: selectedEvent,
                            textData: result.data,
                        }, this.openModal());
                    }
                }
            )
            .catch(error => console.log(error)));
    }

    renderModal(isModalCalled) {
        if (isModalCalled) {
            return (
                <PostViewerController
                    largeViewMode={true}
                    key={this.state.selectedEvent._id}
                    isOwnProfile={true}
                    displayPhoto={this.state.indexUserData.tiny_cropped_display_photo_key}
                    preferredPostType={this.state.indexUserData.preferredPostType}
                    closeModal={this.closeModal}
                    pursuitNames={this.state.pursuitNames}
                    username={this.state.selectedEvent.username}
                    eventData={this.state.selectedEvent}
                    textData={this.state.textData}
                    onDeletePost={this.handleDeletePost}
                />
            );
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <div>
                <div id="returninguser-profile-container" className="returninguser-main-row">
                    <div className="returninguser-profile-column">
                        <img
                            alt=""
                            id="returninguser-profile-photo"
                            src={this.state.displayPhoto ? returnUserImageURL(this.state.displayPhoto) : TEMP_PROFILE_PHOTO_URL}>
                        </img>
                        <div className="returninguser-profile-text-container">
                            <p>{this.state.username}</p>
                            <p>{this.state.firstName}</p>
                        </div>
                    </div>
                    <div className="returninguser-profile-column">
                        <div className="returninguser-profile-text-container">
                            Total Hours Spent: {Math.floor(this.state.totalMin / 60)}
                        </div>
                        <div className="returninguser-profile-text-container">
                            { }
                        </div>
                    </div>
                    <div className="returninguser-profile-column">
                        <table id="returninguser-pursuit-info-table">
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th>Level</th>
                                    <th>Minutes Spent</th>
                                    <th>Posts</th>
                                    <th>Milestones</th>
                                </tr>
                                {this.state.pursuitInfoArray}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="returninguser-recent-work-container" className="returninguser-main-row">
                    <div className="returninguser-row">
                        <h4>Recent Work</h4>
                        <button onClick={this.handlePursuitClick}>Pursuits</button>
                    </div>
                    <div className="returninguser-row">
                        {this.state.recentPosts}
                    </div>
                </div>
                <div id="returninguser-feed-container" className="returninguser-main-row">
                    <h4>Your Feed</h4>
                    <div id="returninguser-infinite-scroll-container" >
                        <InfiniteScroll
                            dataLength={this.state.nextOpenPostIndex}
                            next={this.fetchNextPosts}
                            hasMore={this.state.hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>}>
                            {
                                this.state.feedData.map((feedItem, index) =>
                                    <div className="returninguser-feed-object-container">
                                        {feedItem}
                                    </div>
                                )
                            }
                        </InfiniteScroll>
                    </div>
                </div>

                <div className="modal" ref={this.modalRef}>
                    <div className="overlay" onClick={(() => this.closeModal())}></div>
                    <span className="close" onClick={(() => this.closeModal())}>X</span>
                    {this.renderModal(this.state.isModalShowing && this.state.selectedEvent)}
                </div>
            </div>
        )
    }
}

const handleCheckUser = () => {
    this.props.firebase.checkIsExistingUser()
}

const condition = authUser => !!authUser && withFirebase(handleCheckUser);
export default withAuthorization(condition)(withFirebase(ReturningUserPage));
