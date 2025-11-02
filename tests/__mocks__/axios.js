// Mock for axios
const mockPromise = () => Promise.resolve({ data: {} });

export default {
  post: mockPromise,
  get: mockPromise,
  put: mockPromise,
  delete: mockPromise,
};

export const post = mockPromise;
export const get = mockPromise;
export const put = mockPromise;
export const del = mockPromise;