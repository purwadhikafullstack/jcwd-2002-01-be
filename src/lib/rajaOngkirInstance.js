const axios = require("axios")

const API_URL = "https://api.rajaongkir.com/starter";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
 
    config.headers.key = "22b3b0a3b1b08ed774b52f3db068ea92";


  return config;
});

module.exports=axiosInstance