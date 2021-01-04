import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import "./text-container.scss";

const TextContainer = (props) => (
    <div>
        <h4>{props.username}</h4>
        {props.validFilesLength > 0 && !props.isPaginated ? <button onClick={props.onCaptionStyleChange}>Caption Photos Individually</button> : <></>}
        {props.validFilesLength > 0 && props.isPaginated ? <button onClick={props.onCaptionStyleChange}>Return to Single Caption</button> : <></>}
        <TextareaAutosize
            id='textcontainer-text-input'
            placeholder='Write something here.'
            onChange={props.onTextChange}
            minRows={5}
            value={
                props.isPaginated ?
                    props.textPageText[props.textPageIndex] :
                    props.textPageText
            }
        />
    </div>
);

export default TextContainer;