export const renderFeed = (feeds) => {
  const feedsContainer = document.querySelector('.list-feeds');
  const [...addedFeeds] = feedsContainer.querySelectorAll('div');
  const addedLinks = addedFeeds.map((el) => el.dataset.link);
  const newFeeds = feeds.filter(({ link }) => !addedLinks.includes(link));

  newFeeds.reverse().map((item) => {
    const newFeed = document.createElement('div');
    newFeed.setAttribute('data-link', item.link);
    newFeed.classList.add('list-group-item');
    newFeed.innerHTML = `
    <h5 class="mb-1">${item.title}</h5>
    <p class="mb-1">${item.description}</p>
    `;
    feedsContainer.insertBefore(newFeed, feedsContainer.firstChild);
    return newFeed;
  });
};

export const renderNews = (news) => {
  const newsContainer = document.querySelector('.list-news');
  const [...addedNews] = newsContainer.querySelectorAll('.list-group-item a');
  const addedLinks = addedNews.map((el) => el.href);
  const newNews = news.filter(({ link }) => !addedLinks.includes(link));

  newNews.reverse().map((item) => {
    const newsBlock = document.createElement('div');
    newsBlock.classList.add('list-group-item');
    newsBlock.innerHTML = `
      <a href="${item.link}" class="d-block">${item.title}</a>
      <button type="button" class="more-about-news btn btn-outline-info" data-toggle="modal" data-target="#mod">Подробнее</button>`;
    newsBlock.querySelector('button').addEventListener('click', () => {
      const modal = document.querySelector('#mod');
      modal.querySelector('.modal-title').textContent = item.title;
      modal.querySelector('.modal-body').innerHTML = item.description;
    });
    newsContainer.insertBefore(newsBlock, newsContainer.firstChild);
    return newsBlock;
  });
};
