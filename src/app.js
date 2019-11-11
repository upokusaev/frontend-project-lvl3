import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import i18next from 'i18next';
import parse from './parser';
import { renderFeed, renderNews } from './render';
import i18nextInit from './i18next';

export default () => {
  const cors = 'https://cors-anywhere.herokuapp.com';
  const checkInterval = 5000;
  const form = document.querySelector('#my-form');
  const input = form.querySelector('#inputRss');
  const button = form.querySelector('button.add');
  const errElement = document.querySelector('#errorInput');
  i18nextInit();

  /* -------------------- Model -------------------- */

  const state = {
    formState: 'waiting',
    formCurrentUrl: '',
    updateState: 'stopped',
    feeds: [],
    news: [],
  };

  const createCorsUrl = (url) => new URL(`/${url}`, cors);

  const setFormState = (newState) => {
    state.formState = newState;
  };

  const setUpdateState = (newState) => {
    state.updateState = newState;
  };

  const getFormState = (url) => {
    if (url === '') return 'waiting';
    const listAddedUrl = state.feeds.map(({ link }) => link);
    if (listAddedUrl.includes(url)) return 'duplicateUrl';
    return isURL(url) ? 'valid' : 'invalid';
  };

  /* -------------------- Controller -------------------- */

  const addNewFeed = (feed) => {
    state.feeds.push({ ...feed, link: state.formCurrentUrl });
  };

  const addNewNews = (news) => {
    const listAddedLinks = state.news.map(({ link }) => link);
    const newNews = news.filter(({ link }) => !listAddedLinks.includes(link));
    newNews.map((item) => state.news.push(item));
  };

  const uploadFeed = (url) => {
    axios.get(url)
      .then((response) => parse(response.data))
      .then(({ feed, news }) => {
        addNewFeed(feed);
        addNewNews(news);
      })
      .then(() => setUpdateState('launched'))
      .then(() => setFormState('waiting'))
      .catch(() => setFormState('failed'));
  };

  const startCheckingUpdates = () => {
    setTimeout(() => {
      state.feeds.map(({ link }) => {
        const url = createCorsUrl(link);
        return axios.get(url)
          .then((response) => parse(response.data))
          .then(({ news }) => addNewNews(news));
      });
      startCheckingUpdates();
    }, checkInterval);
  };

  // Events
  input.addEventListener('input', (e) => {
    const currentUrl = e.target.value;
    state.formCurrentUrl = currentUrl;
    state.formState = getFormState(currentUrl);
    console.log(currentUrl);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.formState === 'valid') {
      setFormState('loading');
      const url = createCorsUrl(state.formCurrentUrl);
      uploadFeed(url);
    }
  });

  /* -------------------- View -------------------- */
  const showError = () => { errElement.textContent = i18next.t(state.formState); };
  const hideError = () => { errElement.textContent = ''; };
  const showSpinner = () => { document.querySelector('span[role="status"]').classList.remove('d-none'); };
  const hideSpinner = () => { document.querySelector('span[role="status"]').classList.add('d-none'); };

  const cleanStyleInput = () => {
    input.classList.remove('border-danger');
    input.classList.remove('border-success');
    button.removeAttribute('disabled');
  };

  const setStyleInputError = () => {
    input.classList.add('border-danger');
    input.classList.remove('border-success');
    button.setAttribute('disabled', true);
  };

  const setStyleInputСorrect = () => {
    input.classList.add('border-success');
    input.classList.remove('border-danger');
    button.removeAttribute('disabled');
  };

  const renderForm = () => {
    switch (state.formState) {
      case 'waiting':
        hideSpinner();
        cleanStyleInput();
        form.reset();
        hideError();
        break;
      case 'duplicateUrl':
        setStyleInputError();
        showError();
        break;
      case 'invalid':
        hideSpinner();
        setStyleInputError();
        showError();
        break;
      case 'valid':
        setStyleInputСorrect();
        hideError();
        break;
      case 'loading':
        showSpinner();
        cleanStyleInput();
        hideError();
        break;
      case 'failed':
        hideSpinner();
        showError();
        break;
      default:
        throw new Error(`Wrond type: state.formState = ${state.formState}`);
    }
  };

  // Watchers
  watch(state, 'formState', renderForm);

  watch(state, 'feeds', () => {
    renderFeed(state.feeds);
  });

  watch(state, 'news', () => {
    renderNews(state.news);
  });

  watch(state, 'updateState', () => {
    if (state.updateState === 'launched') {
      startCheckingUpdates();
    }
  });
};
