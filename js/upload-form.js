import {isEscapeKey} from './utils.js';
import {EFFECTS} from './data.js';

const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_ERROR_TEXT = `Комментарий не обязателен.
  Максимальная длина комментария ${MAX_DESCRIPTION_LENGTH} символов`;
const MAX_TAGS_COUNT = 5;
const TAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;
const TAGS_ERROR_TEXT = `Хэш-теги необязательны! Пример хэш-тега: #ХэшТег
  (длина 1го хэш-тега не более 20 символов, не более 5 хэш-тегов под фотографией).`;
const DEFAULT_SCALE = 100;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const SCALE_STEP = 25;
const DEFAULT_EFFECT = EFFECTS[0];

let chosenEffect = DEFAULT_EFFECT;
let scaleValue = DEFAULT_SCALE;

const form = document.querySelector('#upload-select-image');
const imgUploadForm = form.querySelector('.img-upload__overlay');
const imgUploadButton = form.querySelector('.img-upload__input');
const imgUploadPreview = form.querySelector('img');
const imgUploadScale = form.querySelector('.img-upload__scale');
const buttonClose = form.querySelector('.img-upload__cancel');
const scaleField = form.querySelector('.scale__control--value');
const slider = form.querySelector('.effect-level__slider');
const sliderWrapper = form.querySelector('.effect-level');
const effectsFilters = form.querySelector('.effects');
const effectValue = form.querySelector('.effect-level__value');
const descriptionField = form.querySelector('.text__description');
const hashtagsField = form.querySelector('.text__hashtags');

const isDefault = () => chosenEffect === DEFAULT_EFFECT;

const showSlider = () => {
  sliderWrapper.classList.remove('hidden');
};

const hideSlider = () => {
  sliderWrapper.classList.add('hidden');
};

const updateSlider = () => {
  slider.noUiSlider.updateOptions({
    range: {
      min: chosenEffect.min,
      max: chosenEffect.max,
    },
    start: chosenEffect.max,
    step: chosenEffect.step,
  });

  if (isDefault()) {
    hideSlider();
  } else {
    showSlider();
  }
};

const onEffectsChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  chosenEffect = EFFECTS.find((effect) => effect.name === evt.target.value);
  imgUploadPreview.className = `effects__preview--${chosenEffect.name}`;
  updateSlider();
};

const onSliderUpdate = () => {
  const sliderValue = slider.noUiSlider.get();
  imgUploadPreview.style.filter = isDefault()
    ? DEFAULT_EFFECT.style
    : `${chosenEffect.style}(${sliderValue}${chosenEffect.unit})`;
  effectValue.value = sliderValue;
};

const resetEffects = () => {
  chosenEffect = DEFAULT_EFFECT;
  updateSlider();
};

noUiSlider.create(slider, {
  range: {
    min: DEFAULT_EFFECT.min,
    max: DEFAULT_EFFECT.max,
  },
  start: DEFAULT_EFFECT.max,
  step: DEFAULT_EFFECT.step,
  connect: 'lower',
});
hideSlider();

effectsFilters.addEventListener('change', onEffectsChange);
slider.noUiSlider.on('update', onSliderUpdate);

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
});

const changeScaleValue = (value) => {
  scaleField.value = `${value}%`;
  imgUploadPreview.style.transform = `scale(${value / 100})`;
};

const onButtonZoomClick = (evt) => {
  if (evt.target.classList.contains('scale__control--smaller') && scaleValue > MIN_SCALE) {
    scaleValue = scaleValue - SCALE_STEP;
    changeScaleValue(scaleValue);
  } else if (evt.target.classList.contains('scale__control--bigger') && scaleValue < MAX_SCALE) {
    scaleValue = scaleValue + SCALE_STEP;
    changeScaleValue(scaleValue);
  }
};

const openUploadForm = () => {
  document.body.classList.add('modal-open');
  imgUploadForm.classList.remove('hidden');

  changeScaleValue(DEFAULT_SCALE);

  buttonClose.addEventListener('click', onButtonCloseClick);
  imgUploadScale.addEventListener('click', onButtonZoomClick);
  effectsFilters.addEventListener('click', onEffectsChange);
  document.addEventListener('keydown', onDocumentKeydown);
};

const closeUploadForm = () => {
  document.body.classList.remove('modal-open');
  imgUploadForm.classList.add('hidden');

  scaleValue = DEFAULT_SCALE;
  changeScaleValue(DEFAULT_SCALE);

  form.reset();
  pristine.reset();
  resetEffects();

  buttonClose.removeEventListener('click', onButtonCloseClick);
  imgUploadScale.removeEventListener('click', onButtonZoomClick);
  effectsFilters.removeEventListener('click', onEffectsChange);
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onFileInputChange = () => {
  openUploadForm();
};

imgUploadButton.addEventListener('change', onFileInputChange);

function onButtonCloseClick() {
  closeUploadForm();
}

const isFieldFocused = () =>
  document.activeElement === hashtagsField ||
  document.activeElement === descriptionField;

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt) && !isFieldFocused()) {
    evt.preventDefault();
    closeUploadForm();
  }
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});

const isDescriptionValid = (description) => description.length <= MAX_DESCRIPTION_LENGTH;

const normalizeTags = (tags) => tags.trim().split(' ').filter((tag) => tag.trim().length);

const isSymbolsValid = (tags) => !tags.length ? true : tags.every((tag) => TAG_PATTERN.test(tag));

const isTagsCountValid = (tags) => tags.length <= MAX_TAGS_COUNT;

const isTagsUnique = (tags) => {
  const lowerCaseArr = tags.map((tag) => tag.toLowerCase());

  return lowerCaseArr.length === new Set(lowerCaseArr).size;
};

const isTagsValid = (tags) => {
  const tagsArr = normalizeTags(tags);

  return isSymbolsValid(tagsArr) && isTagsCountValid(tagsArr) && isTagsUnique(tagsArr);
};

pristine.addValidator(
  descriptionField,
  isDescriptionValid,
  DESCRIPTION_ERROR_TEXT
);

pristine.addValidator(
  hashtagsField,
  isTagsValid,
  TAGS_ERROR_TEXT
);
