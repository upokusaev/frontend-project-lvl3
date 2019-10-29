import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import parse from './parser';
import { renderFeed, renderNews } from './render';
import filterNews from './filter';


export default () => {
  const form = document.querySelector('#my-form');
  const input = form.querySelector('#inputRss');
  const submit = form.querySelector('button.add');

  /* -------------------- Model -------------------- */

  const state = {
    input: {
      valid: 'clean',
      submit: null,
    },
    update: false,
    listFeeds: {},
    error: '',
    preloader: 'off',
  };

  const checkValidInput = (value) => {
    if (value === '') {
      state.error = '';
      state.input.valid = 'clean';
    } else if (value in state.listFeeds) {
      state.error = 'Данный поток уже добавлен';
      state.input.valid = 'error';
    } else if (!isURL(value)) {
      state.error = 'Неверный URL';
      state.input.valid = 'error';
    } else {
      state.error = '';
      state.input.valid = 'correct';
    }
  };

  /* -------------------- Controller -------------------- */

  // Input validation
  input.addEventListener('input', (e) => {
    checkValidInput(e.target.value);
  });

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
    setTimeout(() => {
      const feedKeys = Object.keys(state.listFeeds);
      feedKeys.forEach((feedKey) => {
        axios.get(new URL(`/${feedKey}`, 'https://cors-anywhere.herokuapp.com'))
          .then((response) => parse(response.data))
          .then((feedObj) => filterNews(state, feedKey, feedObj))
          .then((feedObj) => updateState(feedKey, feedObj))
          .then(renderNews);
      });
      checkUpdates();
    }, 5000);
  };

  // Add feed
  const addFeed = (feedLink) => {
    state.preloader = 'on';
    axios.get(new URL(`/${feedLink}`, 'https://cors-anywhere.herokuapp.com'))
      .then((response) => parse(response.data))
      .then((feedObj) => updateState(feedLink, feedObj))
      .then(renderFeed)
      .then(renderNews)
      .then(() => {
        input.value = '';
        checkValidInput(input.value);
      })
      .catch(() => {
        state.error = 'Ошибка. Проверьте URL и попробуйте снова...';
      })
      .finally(() => {
        state.preloader = 'off';
        state.update = true;
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feedLink = input.value;
    if (feedLink) {
      addFeed(feedLink);
    }
  });

  /* -------------------- View -------------------- */

  // Input validation

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
    switch (state.input.valid) {
      case 'clean':
        cleanStyleInput();
        break;
      case 'error':
        setStyleInputError();
        break;
      case 'correct':
        setStyleInputСorrect();
        break;
      default:
        throw new Error(`Неверный тип: state.input.valid = ${state.input.valid}`);
    }
  };

  // Preloader
  const switchPreloader = () => {
    if (state.preloader === 'on') {
      document.querySelector('span[role="status"]').classList.remove('d-none');
    } else {
      document.querySelector('span[role="status"]').classList.add('d-none');
    }
  };

  // Errors
  const showError = () => {
    const errElement = document.querySelector('#errorInput');
    errElement.textContent = state.error;
  };

  watch(state.input, 'valid', changeInput);
  watch(state, 'error', showError);
  watch(state, 'preloader', switchPreloader);
  watch(state, 'update', checkUpdates);
};
