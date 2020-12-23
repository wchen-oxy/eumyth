import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withAuthorization } from '../../session';
import { withFirebase } from '../../../Firebase';
import AxiosHelper from '../../../Axios/axios';
import RecentWorkObject from "./sub-components/recent-work-object";
import FeedObject from "./sub-components/feed-object";
import EventModal from "../../profile/sub-components/event-modal";
import Event from "../../profile/timeline/sub-components/timeline-event";
import { returnUserImageURL } from "../../constants/urls";
import { PRIVATE, PERSONAL_PAGE } from "../../constants/flags";
import './returning-user.scss';

const POST = "POST";
class ReturningUserPage extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.firebase.returnUsername(),
            firstName: null,
            lastName: null,
            pursuits: null,
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
            postType: null,
            recentPosts: null
        }

        this.modalRef = React.createRef();
        this.handlePursuitClick = this.handlePursuitClick.bind(this);
        this.handleRecentWorkClick = this.handleRecentWorkClick.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleDeletePost = this.handleDeletePost.bind(this);

    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) this.props.firebase.returnName().then((result) => {
            if (result) this.setState({ firstName: result.firstName, lastName: result.lastName });
        });
        if (this._isMounted && this.state.username) {
            let allPosts = null;
            let indexUserData = null;
            let displayPhoto = "";
            let pursuits = null;
            let feedData = [];
            let recentPosts = null;
            return AxiosHelper.returnIndexUser(this.state.username).then(
                (result) => {
                    allPosts = result.data.following_feed;
                    indexUserData = result.data;
                    displayPhoto = result.data.cropped_display_photo_key;
                    pursuits = result.data.pursuits;
                    return AxiosHelper.returnMultiplePosts(result.data.recent_posts, false);
                }
            )
                .then((result) => {
                    console.log(result.data);
                    console.log(typeof(result.data));
                    recentPosts = result.data.map((value, index) => {
                        return (
                            <Event
                                mediaType={POST}
                                newProjectView={this.props.newProjectView}
                                key={index}
                                eventData={value}
                                onEventClick={this.handleEventClick}
                            />
                        );
                    });
                    return result.data.following_feed;
                })
                .then(
                    (feed) => {
                        const slicedFeed = allPosts.slice(this.state.nextOpenPostIndex, this.state.nextOpenPostIndex + this.state.fixedDataLoadLength);
                        if (!feed || feed.length === 0) return this.setState({ hasMore: false });
                        return AxiosHelper.returnMultiplePosts(
                            slicedFeed,
                            true)
                            .then(
                                (result) => {
                                    console.log(result.data);
                                    if (this._isMounted) {
                                        for (const item of result.data) {
                                            if (item.post_privacy_type !== PRIVATE && item.post_privacy_type !== PERSONAL_PAGE )
                                            feedData.push(item);
                                        }
                                    };
                                }
                            )
                            .catch((error) => console.log(error));
                    }
                )
                .then(
                    () => {
                        console.log(allPosts);
                        this.setState(
                            {
                                allPosts: allPosts ? allPosts : null,
                                feedData: feedData.length > 0 ? feedData : [],
                                nextOpenPostIndex: this.state.nextOpenPostIndex + this.state.fixedDataLoadLength,
                                indexUserData: indexUserData,
                                displayPhoto: displayPhoto,
                                pursuits: pursuits,
                                recentPosts: recentPosts ? recentPosts : null
                            });
                    }
                )
                .catch((err) => {
                    console.log(err);
                    alert("Could Not Load Feed." + err);
                })
                ;
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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
        return AxiosHelper.retrieveTextData(selectedEvent._id)
            .then(
                (result) => {
                    console.log(selectedEvent);
                    console.log(selectedEvent.post_format);
                    if (this._isMounted) {
                        this.setState({
                            selectedEvent: selectedEvent,
                            textData: result.data,
                            postType: selectedEvent.post_format
                        }, this.openModal());
                    }
                }
            )
            .catch(error => console.log(error));
        // .then(() => this.setState({ selectedEvent: selectedEvent }));
    }

    render() {

        let pursuitInfoArray = [];
        let pursuitNames = []
        let totalMin = 0;
        if (this.state.pursuits) {
            for (const pursuit of this.state.pursuits) {
                totalMin += pursuit.total_min;
                const hobbyTableData = (
                    <tr key={pursuit.name}>
                        <th key={pursuit.name + " name"}>{pursuit.name}</th>
                        <td key={pursuit.name + " experience"}>{pursuit.experience_level}</td>
                        <td key={pursuit.total_min + "minutes"}>{pursuit.total_min}</td>
                        <td key={pursuit.num_posts + "posts"}>{pursuit.num_posts}</td>
                        <td key={pursuit.num_milestones + " milestones"}>{pursuit.num_milestones}</td>
                    </tr>);
                pursuitInfoArray.push(hobbyTableData);
                pursuitNames.push(pursuit.name);
            }
        }

        //TEST 
        const recentWork = (<RecentWorkObject value="test" onRecentWorkClick={this.handleRecentWorkClick} />);
        return (
            <div >
                <div className="home-row-container flex-display">
                    <div className="home-profile-column-container">
                        <img alt="" id="home-profile-photo" src={this.state.displayPhoto ? returnUserImageURL(this.state.displayPhoto) : "https://i.redd.it/73j1cgr028u21.jpg"}></img>
                        <div className="home-profile-text">
                            <p>{this.state.username}</p>
                            <p>{this.state.firstName}</p>
                        </div>

                    </div>

                    <div className="home-profile-column-container">
                        <div className="home-profile-text">
                            Total Hours Spent: {Math.floor(totalMin / 60)}
                        </div>
                        <div className="home-profile-text">
                            { }
                        </div>
                    </div>
                    <div className="home-profile-column-container">
                        <table id="profile-info-table">
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th>Level</th>
                                    <th>Minutes Spent</th>
                                    <th>Posts</th>
                                    <th>Milestones</th>
                                </tr>
                                {pursuitInfoArray}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className="flex-display flex-direction-column">
                    <div className="flex-display">
                        <div className="flex-display">
                            <h4>Recent Work</h4>
                            <button onClick={this.handlePursuitClick}>Pursuits</button>
                        </div>
                    </div>
                    <div className="flex-display">
                        {this.state.recentPosts}
                    </div>
                </div>
                <div className="home-row-container flex-display flex-direction-column">

                    <h4>Your Feed</h4>
                    <div id="feed-container" className="flex-display flex-direction-column">
                        <InfiniteScroll
                            dataLength={this.state.nextOpenPostIndex}
                            next={this.fetchNextPosts}
                            hasMore={this.state.hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }>
                            {
                                this.state.feedData.map((feedItem, index) =>
                                    <div className="feed-object-container">
                                        <FeedObject feedItem={feedItem} key={index} />
                                    </div>

                                )
                            }

                        </InfiniteScroll>
                        {/* : <></>} */}
                    </div>

                </div>

                <div className="modal" ref={this.modalRef}>
                    <div className="overlay" onClick={(() => this.closeModal())}></div>
                    <span className="close" onClick={(() => this.closeModal())}>X</span>
                    {
                        this.state.isModalShowing && this.state.selectedEvent ?

                            <EventModal
                                key={this.state.selectedEvent._id}
                                isOwnProfile={true}
                                displayPhoto={this.state.indexUserData.tiny_cropped_display_photo_key}
                                preferredPostType={this.state.indexUserData.preferredPostType}
                                closeModal={this.closeModal}
                                postType={this.state.postType}
                                pursuits={pursuitNames}
                                username={this.state.username}
                                eventData={this.state.selectedEvent}
                                textData={this.state.textData}
                                onDeletePost={this.handleDeletePost}
                            />
                            :
                            <>                            {console.log("Disappear")}
                            </>
                    }
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
