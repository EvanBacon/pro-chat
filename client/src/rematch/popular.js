const popular = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  },
  effects: {
    getAsync: () => {},
  },
};
export default popular;
