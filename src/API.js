export const Schema = {
  models: {},
  queries: {
    askBedrock: {
      input: { ingredients: [] },
      output: {
        body: "",
        error: ""
      }
    }
  },
  subscriptions: {},
  mutations: {}
};