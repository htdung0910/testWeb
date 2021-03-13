import { history } from 'umi';
import axios from 'axios';

const TOMOApiHelper = axios.create({
  baseURL: "https://scan.testnet.tomochain.com/api/",
  headers: {
    "Accept": "application/json",
    // "Access-Control-Allow-Origin": '*',
  },
})

TOMOApiHelper.interceptors.request.use(config => {
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

TOMOApiHelper.interceptors.response.use(
    response => response,
  error => {
    const { status } = error.response;
    if (status === 401) {
          
      history.push("/user");
    }
  }
)

export default TOMOApiHelper;