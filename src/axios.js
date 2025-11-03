import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://ipay.ibedc.com:7642/api'
});

axiosClient.interceptors.request.use((config) => {
    const appSecret = "UDCLIVE_168949MDUKDCMEU_45@MUDCaPP0921SDK_ibedc@";
    const appToken = "TlkDD_161719MFUPDCMEU_45@9023CaPP0921SDK_T2KL90MD";
    
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