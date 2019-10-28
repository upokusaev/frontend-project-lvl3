export const renderFeed = (feed) => {
  const listFeeds = document.querySelector('.list-feeds');
  const newFeed = document.createElement('div');
  newFeed.classList.add('list-group-item');

  newFeed.innerHTML = `
    <h5 class="mb-1">${feed.title}</h5>
    <p class="mb-1">${feed.description}</p>
  `;
  listFeeds.insertBefore(newFeed, listFeeds.firstChild);
  return feed;
};

export const renderNews = (feed) => {
  const listNews = document.querySelector('.list-news');
  const news = Object.keys(feed.news);
  news.reverse().forEach((link) => {
    const newsBlock = document.createElement('div');
    newsBlock.innerHTML = `
    <div class="list-group-item">
      <a href="${link}">${feed.news[link].title}</a>
      <button type="button" class="more-about-news btn btn-outline-info" data-toggle="modal" data-target="#mod">Подробнее</button>
    </div>`;
    newsBlock.querySelector('button').addEventListener('click', () => {
      const modal = document.querySelector('#mod');
      modal.querySelector('.modal-title').textContent = feed.news[link].title;
      modal.querySelector('.modal-body').innerHTML = feed.news[link].description;
    });
    listNews.insertBefore(newsBlock, listNews.firstChild);
  });
  return feed;
};
