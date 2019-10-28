import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import parse from './parser';
import { renderFeed, renderNews } from './render';
import filterNews from './filter';

const axios = require('axios');

export default () => {
  // ---------- Model ----------

  const state = {
    input: {
      value: null,
      valid: null,
      submit: null,
    },
    listFeeds: {},
    update: false,
  };

  // ---------- View ----------

  // Input validation
  const form = document.querySelector('#my-form');
  const input = form.querySelector('#inputRss');
  const submit = form.querySelector('button.add');

  const cleanStyleInput = () => {
    input.classList.remove('border-danger');
    input.classList.remove('border-success');
    submit.removeAttribute('disabled');
  };

  const setStyleInputError = () => {
    input.classList.add('border-danger');
    input.classList.remove('border-success');
    submit.setAttribute('disabled', true);
  };

  const setStyleInputСorrect = () => {
    input.classList.add('border-success');
    input.classList.remove('border-danger');
    submit.removeAttribute('disabled');
  };

  const changeInput = () => {
    if (!state.input.valid) {
      setStyleInputError();
    } else {
      setStyleInputСorrect();
    }
  };

  // Preloader
  const preloaderOn = () => {
    document.querySelector('span[role="status"]').classList.remove('d-none');
  };
  const preloaderOff = () => {
    document.querySelector('span[role="status"]').classList.add('d-none');
  };

  // Show error
  const showError = () => {
    const errElement = document.querySelector('#errorInput');
    errElement.textContent = 'Ошибка, проверьте правильность введенного URL и попробуйте снова...';
    window.setTimeout(() => {
      errElement.textContent = '';
    }, 5000);
  };

  // Add feed to state
  const updateState = (feedKey, feedObj) => {
    if (feedKey in state.listFeeds) {
      const newsKeys = Object.keys(feedObj.news);
      newsKeys.forEach((newsKey) => {
        state.listFeeds[feedKey].news[newsKey] = feedObj.news[newsKey];
      });
    } else {
      state.listFeeds[feedKey] = feedObj;
    }
    return feedObj;
  };

  // Check updates feeds
  const checkUpdates = () => {
    window.setTimeout(() => {
      const feedKeys = Object.keys(state.listFeeds);
      feedKeys.forEach((feedKey) => {
        axios.get(new URL(`/${feedKey}`, 'https://cors-anywhere.herokuapp.com'))
          .then((response) => parse(response.data))
          .then((feedObj) => filterNews(state, feedKey, feedObj))
          .then((feedObj) => updateState(feedKey, feedObj))
          .then(renderNews)
          .catch((error) => {
            console.log(error);
          });
      });
      checkUpdates();
    }, 5000);
  };


  // Add feed
  const addFeed = (feedLink) => {
    if (feedLink) {
      preloaderOn();
      axios.get(new URL(`/${feedLink}`, 'https://cors-anywhere.herokuapp.com'))
        .then((response) => parse(response.data))
        .then((feed) => updateState(feedLink, feed))
        .then(renderFeed)
        .then(renderNews)
        .catch((error) => {
          showError();
          console.log(error);
        })
        .finally(() => {
          cleanStyleInput();
          preloaderOff();
          state.update = true;
        });
    }
  };

  // Watch
  watch(state.input, 'value', () => {
    state.input.valid = isURL(state.input.value) && !(state.input.value in state.listFeeds);
  });
  watch(state.input, 'valid', changeInput);
  watch(state.input, 'submit', () => {
    if (state.input.submit) {
      const feedLink = state.input.value;
      input.value = '';
      state.input.value = '';
      state.input.submit = false;
      addFeed(feedLink);
    }
  });
  watch(state, 'update', () => {
    if (state.update) {
      checkUpdates();
    }
  });

  // ---------- Controller ----------

  // Input validation
  input.addEventListener('input', (e) => {
    const { value } = e.target;
    state.input.value = value;
  });

  // Add feed
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.input.submit = true;
  });
};
