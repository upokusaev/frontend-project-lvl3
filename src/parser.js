export default (response) => {
  const result = {};
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.data, 'application/xml');
  result.title = doc.querySelector('title').textContent;
  result.description = doc.querySelector('description').textContent;
  result.news = {};
  const [...items] = doc.querySelectorAll('item');
  items.forEach((item) => {
    result.news[`${item.querySelector('link').textContent}`] = ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
    });
  });
  return result;
};
