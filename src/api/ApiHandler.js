import axios from 'axios'

export const postRequest = async (query, token) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  return await axios
    .post('http://localhost:8000/api', JSON.stringify(query), {
      headers: headers,
    })
    .then(async function (response) {
      return response
    })
    .catch(function (error) {
      return error
    })
}

export const getRequest = async (query) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  return await axios
    .post('http://localhost:8000/api', JSON.stringify(query), {
      headers: headers,
    })
    .then(async function (response) {
      return response
    })
    .catch(function (error) {
      return error
    })
}
