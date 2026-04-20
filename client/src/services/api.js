import axios from 'axios';

// Crea una instancia de Axios con configuración predeterminada
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitudes (Request)
// Aquí puedes añadir lógica para incluir tokens de autenticación en cada solicitud
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // O donde sea que guardes tu token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas (Response)
// Maneja errores de red y respuestas 4xx/5xx de forma centralizada
apiClient.interceptors.response.use(
  (response) => {
    // Cualquier código de estado que se encuentre dentro del rango de 2xx causa que esta función se active
    return response;
  },
  (error) => {
    // Cualquier código de estado que esté fuera del rango de 2xx causa que esta función se active
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta:', error.response.data);
      // Aquí podrías mostrar una notificación (toast) al usuario
      // Ejemplo: toast.error(error.response.data.message || 'Ocurrió un error');
      alert(`Error: ${error.response.data.message || 'Ocurrió un error en el servidor'}`);
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta (ej. el servidor está caído)
      console.error('Error de solicitud:', error.request);
      alert('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error('Error:', error.message);
      alert(`Error de configuración: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;