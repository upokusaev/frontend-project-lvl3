import { watch } from 'melanke-watchjs';
import isURL from 'validator/lib/isURL';

const axios = require('axios');

export default () => {
  const state = {
    value: null,
    valid: false,
    feeds: [],
  };

  const input = document.querySelector('input.form-control');
  const btn = document.querySelector('button.add');

  const change = () => {
    if (!state.valid) {
      input.classList.add('border-danger');
      input.classList.remove('border-success');
      btn.setAttribute('disabled', true);
    } else {
      input.classList.add('border-success');
      input.classList.remove('border-danger');
      btn.removeAttribute('disabled');
    }
  };

  input.addEventListener('input', (e) => {
    state.value = e.target.value;
  });

  input.addEventListener('focus', change);

  watch(state, 'value', () => {
    state.valid = isURL(state.value) && !state.feeds.includes(state.value);
  });

  watch(state, 'valid', change);

  btn.addEventListener('click', () => {
    state.feeds.push(state.value);
    input.value = '';
    console.log(state.feeds);

    axios.get(state.value)
      .then((response) => {
      // handle success
        console.log(response);
      })
      .catch((error) => {
      // handle error
        console.log(error);
      })
      .finally(() => {
      // always executed
        console.log('Finally');
      });
  });
};
