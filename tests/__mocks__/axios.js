// Mock for axios
const mockPromise = () => Promise.resolve({ data: {} });

module.exports = {
  default: {
    post: mockPromise,
    get: mockPromise,
    put: mockPromise,
    delete: mockPromise,
  },
  post: mockPromise,
  get: mockPromise,
  put: mockPromise,
  delete: mockPromise,
};