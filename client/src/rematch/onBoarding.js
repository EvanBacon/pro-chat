const onBoarding = {
  state: {},
  reducers: {
    update: (state, props) => ({ ...state, ...props }),
    set: (state, props) => props,
    clear: () => {},
  },
};

export default onBoarding;
