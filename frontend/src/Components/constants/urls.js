//AWS
const BUCKET_NAME = 'eumyth-bucket-1';
const REGION = 'us-west-1';

const returnUserImageURL = (key) => ("http://" + BUCKET_NAME + ".s3." + REGION + ".amazonaws.com/" + key);


const ROOT_URL = "http://localhost:5000";

//image
const IMAGE_BASE_URL = ROOT_URL + "/image";
const DISPLAY_PHOTO_URL = IMAGE_BASE_URL + "/display-photo";
const COVER_PHOTO_URL = IMAGE_BASE_URL + "/cover";

const DRAFT_BASE_URL = ROOT_URL + "/draft";

//user
const USER_BASE_URL = ROOT_URL + "/user";
const USER_BIO_URL = USER_BASE_URL + "/bio";
const USER_ACCOUNT_SETTINGS_INFO = USER_BASE_URL + "/account-settings-info";
const USER_PRIVACY = USER_BASE_URL + "/private";


//relation
const RELATION_BASE_URL = ROOT_URL + "/relation";
const RELATION_STATUS_URL = RELATION_BASE_URL + "/status";
const RELATION_INFO_URL = RELATION_BASE_URL + "/info";

//post
const POST_BASE_URL = ROOT_URL + "/post";
// const UPDATE_POST_URL = POST_BASE_URL + "/update";

const MULTIPLE_POSTS_URL =  POST_BASE_URL + "/multiple";

const WITH_IMAGE_POST_URL = POST_BASE_URL + "/with-image";
const NO_IMAGE_POST_URL = POST_BASE_URL + "/no-image";
const SOCIAL_FEED_POSTS_URL = POST_BASE_URL + "/feed";

const SINGLE_POST_TEXT_DATA_URL = POST_BASE_URL + "/single-text"

//project
const PROJECT_BASE_URL = ROOT_URL + "/project";
const MULTIPLE_PROJECTS_URL =  PROJECT_BASE_URL + "/multiple";

//index
const INDEX_BASE_URL = ROOT_URL + "/index";
const CHECK_USERNAME_URL = INDEX_BASE_URL + '/username';
const INDEX_USER_PURSUITS_URL = INDEX_BASE_URL + '/pursuits';

module.exports = {
    returnUserImageURL: returnUserImageURL,
    ROOT_URL,
    IMAGE_BASE_URL,
    DISPLAY_PHOTO_URL,
    COVER_PHOTO_URL,
    DRAFT_BASE_URL,
    USER_BASE_URL,
    USER_BIO_URL,
    USER_ACCOUNT_SETTINGS_INFO,
    USER_PRIVACY,
    RELATION_BASE_URL,
    RELATION_STATUS_URL,
    RELATION_INFO_URL,
    POST_BASE_URL,
    PROJECT_BASE_URL,
    MULTIPLE_PROJECTS_URL,
    MULTIPLE_POSTS_URL,
    WITH_IMAGE_POST_URL,
    NO_IMAGE_POST_URL,
    SOCIAL_FEED_POSTS_URL,
    SINGLE_POST_TEXT_DATA_URL,
    INDEX_BASE_URL,
    CHECK_USERNAME_URL,
    INDEX_USER_PURSUITS_URL
}