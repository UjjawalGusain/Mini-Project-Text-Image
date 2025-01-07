const ENDPOINT_PREFIX = 'http://127.0.0.1:8000/';

const ENDPOINTS = {
    IMAGE: {
        UPLOAD_IMAGE: ENDPOINT_PREFIX + "images/upload-image",
        GET_IMAGES: ENDPOINT_PREFIX + "images/get-images/",
        GET_IMAGES_BY_ID: ENDPOINT_PREFIX + "images/get-images-by-ids",
        
    },
    USER: {
        GET_USER_ID: ENDPOINT_PREFIX + "user/get-user-id/",
        LOGIN: ENDPOINT_PREFIX + "user/login",
        CREATE_USER: ENDPOINT_PREFIX + "user/create-user",

    },
    EMBEDDING: {
        TEXT_EMBEDDING: ENDPOINT_PREFIX + "embedding/text-embedding",

    },
    DB: {
        QUERY_IMAGE_EMBEDDING: ENDPOINT_PREFIX + "db/query-image-embedding",
        REMOVE_IMAGE_EMBEDDING: ENDPOINT_PREFIX + "db/remove-image-embedding"
    }
}

export default ENDPOINTS;