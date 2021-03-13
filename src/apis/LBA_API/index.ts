import axios from "axios";
import { history } from "umi";


const ApiHelper = axios.create({
  // baseURL: "https://location-base-advertising.herokuapp.com/api/v1/",
  baseURL: "https://localhost:44333/api/v1",
  headers: {
    "Accept": "application/json",
    'Access-Control-Allow-Origin':  '*',
    // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  },
  withCredentials: true,
})

ApiHelper.interceptors.request.use(config => {
  const jwt = localStorage.getItem("JWT");
  // console.log("Interceptor >>>>", jwt);
  
  if (jwt) {
    config.headers['Authorization'] = `Bearer ${jwt}`;
    // console.log(config.headers);
    
  }
  return config;
  
}, error => {
    return Promise.reject(error)
})

ApiHelper.interceptors.response.use(
    response => response,
  error => {
    const { status } = error.response;
    if (status === 401) {
          
      history.push("/user");
    }
  }
)

export default ApiHelper;