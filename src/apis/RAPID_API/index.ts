import { history } from 'umi';
import axios from 'axios';

const RapidAPIHelper = axios.create({
  baseURL: "https://google-maps-geocoding.p.rapidapi.com/",
  headers: {
    "Accept": "application/json",
    'x-rapidapi-key': '64d2eae8ddmshf0a295ed1b48a24p10ab27jsn4986212cfeb4',
    'x-rapidapi-host': 'google-maps-geocoding.p.rapidapi.com',
    // "Access-Control-Allow-Origin": '*',
  },
})

RapidAPIHelper.interceptors.request.use(config => {
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

RapidAPIHelper.interceptors.response.use(
    response => response,
  error => {
    const { status } = error.response;
    if (status === 401) {
          
      history.push("/user");
    }
  }
)

export default RapidAPIHelper;