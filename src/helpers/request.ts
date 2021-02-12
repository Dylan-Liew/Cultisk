import axios from 'axios';

export default function GenerateClient(jwt: string) {
  return axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
}
