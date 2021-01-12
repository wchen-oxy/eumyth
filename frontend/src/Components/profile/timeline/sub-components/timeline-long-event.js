import React from 'react';
import "./timeline-long-event.scss";
import { returnUserImageURL } from "../../../constants/urls";
import {returnFormattedDate} from "../../../constants/ui-text";

const LongEvent = (props) => {
    if (props.post.text_data === undefined) return (<></>);
    const post = props.post;
    const date = post.date ? returnFormattedDate(post.date) : null;
    const coverImage = <img className="longevent-cover-photo" src={returnUserImageURL(post.cover_photo_key)} />;
    const previewText = post.text_snippet;

    return (
        <div>
            <div className="longevent-cover-container">
                {post.cover_photo_key ? coverImage : <p className="longevent-preview-text">{previewText}</p>}
            </div>
            <h4 className="longevent-title-container">{post.title ? post.title : post.pursuit_category}</h4>
            {post.subtitle ? <p className="longevent-subtitle-container">{post.subtitle}</p> : <></>}
            {date ? <p>{date.month}, {date.day}, {date.year} </p> : <></>}
        </div>
    );
}

export default LongEvent;