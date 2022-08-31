const LOCAL_API_ROOT = 'http://localhost:4000';

const apiRoot = process.env.REACR_APP_API_ROOT || LOCAL_API_ROOT;

export default apiRoot;
