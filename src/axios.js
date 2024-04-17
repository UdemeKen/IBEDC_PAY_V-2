import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://ipay.ibedc.com:7642/api/V2_ibedc_OAUTH_tokenReviwed'
});

axiosClient.interceptors.request.use((config) => {
    const appSecret = "SK_161719MDUKDCMEU_45@MUDCaPP0921SDK_VSION11";
    const appToken = "TK_161719MDUKDCMEU_45@MUDCaPP0921SDK_TK190MD";
    
    config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`;
    config.headers.Accept = 'application/json';
    config.headers['appsecret'] = appSecret;
    config.headers['apptoken'] = appToken;
    return config;
  });

axiosClient.interceptors.response.use((response) => {
    return response;
    },
    error => {
        if(error.response && error.response.status === 401) {
            // localStorage.removeItem('TOKEN');
            // window.location.href = '/default/customerdashboard';
            // window.location.reload();
            return error;
        }
        // return Promise.reject(error);
        throw error;
    }
);

export default axiosClient;