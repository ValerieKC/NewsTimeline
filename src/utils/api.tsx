const baseUrl = `https://newsapi.org/v2/`;
const apiKey = `ea52c362b8da48b58557203c34dba3ef`;
const country = `tw`;

const api = {
  async fetchApi() {
    try {
      const response = await fetch(
        `${baseUrl}top-headlines?country=us&category=entertainment&pageSize=100&apiKey=${apiKey}`
      );
      console.log(response)
      return await response.json();
    } catch (e) {
      console.error("fetchApi() failed", e);
    }
  },
};

export default api;
