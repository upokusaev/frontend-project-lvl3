export const renderFeed = (feed) => {
  const listFeeds = document.querySelector('.list-feeds');
  const newFeed = document.createElement('div');
  newFeed.classList.add('list-group-item');
  const titleFeed = document.createElement('h5');
  titleFeed.classList.add('mb-1');
  titleFeed.textContent = feed.title;
  const descFeed = document.createElement('p');
  descFeed.classList.add('mb-1');
  descFeed.textContent = feed.description;
  newFeed.appendChild(titleFeed);
  newFeed.appendChild(descFeed);
  listFeeds.insertBefore(newFeed, listFeeds.firstChild);
  return feed;
};

export const renderNews = (feed) => {
  const listNews = document.querySelector('.list-news');
  const news = Object.keys(feed.news);
  news.reverse().forEach((link) => {
    const newsBlock = document.createElement('div');
    newsBlock.classList.add('list-group-item');
    const newsLink = document.createElement('a');
    newsLink.textContent = feed.news[link].title;
    newsLink.setAttribute('href', link);
    const button = document.createElement('button');
    button.textContent = 'Подробнее';
    button.classList.add('more-about-news', 'btn', 'btn-outline-info');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#mod');
    button.addEventListener('click', () => {
      const modal = document.querySelector('#mod');
      modal.querySelector('.modal-title').textContent = feed.news[link].title;
      modal.querySelector('.modal-body').innerHTML = feed.news[link].description;
    });
    newsBlock.appendChild(newsLink);
    newsBlock.appendChild(button);
    listNews.insertBefore(newsBlock, listNews.firstChild);
  });
  return feed;
};
