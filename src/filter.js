export default (state, feedKey, feedObj) => {
  const result = {};
  result.news = {};
  const newsKeys = Object.keys(feedObj.news);
  newsKeys.forEach((newsKey) => {
    if (!(newsKey in state.listFeeds[feedKey].news)) {
      result.news[newsKey] = feedObj.news[newsKey];
    }
  });
  return result;
};
