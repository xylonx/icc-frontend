// const { BASE_URL } = process.env;

let baseURL;
// eslint-disable-next-line no-undef
switch (process.env.NODE_ENV) {
    case "development":
        baseURL = "http://127.0.0.1:5050/api/v1";
        break;

    case "production":
        baseURL = "https://back.icc.xylonx.com/api/v1";
        break;
}

export default {
    BaseURL: baseURL,
};
