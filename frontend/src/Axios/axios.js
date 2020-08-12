import axios from 'axios';
import { DRAFT_URL } from "../Components/constants/index";
import * as UserEndpoint from "../Components/constants/user";
import * as PostEndpoint from "../Components/constants/post";



export default class AxiosHelper {
    static testString() {
        console.log("TEST SUCCESS");
    }
    static checkUsernameAvailable(username) {
        return axios.post(UserEndpoint.USERNAME_AVAILABLE_URL, { username: username });
    }

    static createUserProfile(username, pursuitsArray) {
        return axios.post(UserEndpoint.USER_URL, { username: username, pursuits: pursuitsArray });
    }

    static returnPursuitNames(username) {
        return axios.get(UserEndpoint.INDEX_INFO_URL, {
            params: {
                username: username
            }
        });
    }

    // static returnIndexUsername(uid) {
    //     return axios.post(UserEndpoint.USERNAME_URL, {
    //         uid: uid
    //     })
    // }

    // static postImage(formData) {
    //     return axios.post(PostEndpoint.IMAGE_POST, formData);
    // }

    static createPost(postType, textData, imageArray, date, min, milestone) {
        let formData = new FormData();
        if (date) formData.append("date", date);
        if (min) formData.append("min", min);
        if (milestone) formData.append("milestone", milestone);
        if (textData) formData.append("textData", textData);
        if (imageArray && imageArray.length > 0) { formData.append("imageArray", imageArray); }
        formData.append("postType", postType);
        axios.post(PostEndpoint.POST_URL, formData);
    }
    //FIXME 
    //STEAL THE UPLOAD THING FROM HERE
    // static postShortPost(formData, progressRef, uploadRef, textOnly){
    //     if (textOnly) return axios.post(PostEndpoint.SHORT_POST_URL, formData);
    //     else{
    //         return axios.post(PostEndpoint.SHORT_POST_URL, formData, {
    //         onUploadProgress: (progressEvent) => {
    //             const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
    //             progressRef.current.innerHTML = `${uploadPercentage}%`;
    //             progressRef.current.style.width = `${uploadPercentage}%`;

    //             if (uploadPercentage === 100) {
    //                 uploadRef.current.innerHTML = 'File(s) Uploaded';
    //                 // alert("Upload Complete!")
    //                 // validFiles.length = 0;
    //                 // setValidFiles([...validFiles]);
    //                 // setSelectedFiles([...validFiles]);
    //                 // setUnsupportedFiles([...validFiles]);
    //             }
    //         },
    //     });
    //     }
    // }

    // static savePost(content) {
    //     return axios.post(PostEndpoint.NEW_POST_URL, content)
    // }

    // static saveDraft(username, editorState) {
    //     return axios.post(DRAFT_UPLOAD_URL, { username: username, editorState: editorState });
    // }

    static retrieveDraft(username) {
        return axios.get(DRAFT_URL,
            { params: { username: username } }
        )
    }
}

