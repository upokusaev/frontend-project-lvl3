import i18next from 'i18next';

export default () => {
  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          duplicateUrl: 'Данный поток уже добавлен',
          invalid: 'Введен некорректный URL',
          failed: 'Ошибка загрузки потока. Проверьте URL и попробуйте снова...',
        },
      },
    },
  });
};
