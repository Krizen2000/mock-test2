import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)
const mockAdapter = axios.defaults.adapter

const disableMock = () => mock.restore()
const enableMock = () => {
  axios.defaults.adapter = mockAdapter

  return Promise.resolve()
}

export { enableMock, disableMock }
export default mock
