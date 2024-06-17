import {getRandomInteger, getRandomArrElement} from './utils.js';
import {
  MIN_LIKES,
  MAX_LIKES,
  MIN_COMMENTS,
  MAX_COMMENTS,
  PICTURE_COUNT,
  AVATAR_COUNT,
  MESSAGES,
  PHOTO_DESCRIPTIONS,
  NAMES
} from './data.js';

const createComment = (id) => ({
  id,
  avatar: `img/avatar-${getRandomInteger(1, AVATAR_COUNT)}.svg`,
  message: getRandomArrElement(MESSAGES),
  name: getRandomArrElement(NAMES),
});

const createPicture = (id) => ({
  id,
  url: `photos/${id}.jpg`,
  description: getRandomArrElement(PHOTO_DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: Array.from(
    { length: getRandomInteger(MIN_COMMENTS, MAX_COMMENTS) },
    (_, comentIndex) =>
      createComment(comentIndex + 1)
  ),
});

const createGallery = () =>
  Array.from({ length: PICTURE_COUNT }, (_, pictureIndex) =>
    createPicture(pictureIndex + 1)
  );

const createPictureEl = ({id, url, likes, comments}) => {
  const pictureTemplate = document.querySelector('#picture').content;
  const picture = pictureTemplate.cloneNode(true);
  const pictureSrc = picture.querySelector('.picture__img');
  const pictureLikes = picture.querySelector('.picture__likes');
  const pictureComments = picture.querySelector('.picture__comments');

  pictureSrc.src = url;
  pictureSrc.dataset.id = id;
  pictureLikes.textContent = likes;
  pictureComments.textContent = comments.length;

  return picture;
};

const renderGallery = (photos) => {
  const galleryWrapper = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createPictureEl(photo));
  });

  galleryWrapper.appendChild(fragment);
};

const createGalleryData = createGallery();

renderGallery(createGalleryData);

const renderComment = ({avatar, name, message}) => {
  const commentItem = document.querySelector('.social__comment').cloneNode(true);
  const commentText = commentItem.querySelector('.social__text');
  const commentPicture = commentItem.querySelector('.social__picture');

  commentPicture.src = avatar;
  commentPicture.alt = name;
  commentText.textContent = message;

  return commentItem;
};

const renderComments = (dataComments) => {
  const commentWrapper = document.querySelector('.social__comments');
  const fragment = document.createDocumentFragment();

  dataComments.forEach((comment) => {
    fragment.appendChild(renderComment(comment));
    console.log(fragment);
  });

  commentWrapper.innerHTML = '';
  console.log(commentWrapper);
  commentWrapper.appendChild(fragment);
};

const renderBigPicture = (evt) => {
  const bigPicture = document.querySelector('.big-picture');
  const dataObject = createGalleryData.find(({id}) => id === +evt.target.dataset.id);

  bigPicture.querySelector('img').src = dataObject.url;
  bigPicture.querySelector('.likes-count').textContent = dataObject.likes;
  bigPicture.querySelector('.comments-count').textContent = dataObject.comments.length;
  bigPicture.querySelector('.social__caption').textContent = dataObject.description;

  console.log(dataObject);
  renderComments(dataObject.comments);
};

const handleClickPicture = (evt) => {
  evt.preventDefault();

  const body = document.querySelector('body');
  const bigPicture = document.querySelector('.big-picture');
  const commentCount = document.querySelector('.social__comment-count');
  const commentsLoader = document.querySelector('.comments-loader');

  if (evt.target.matches('.picture__img')) {
    console.log(evt.target);

    bigPicture.classList.remove('hidden');
    commentCount.classList.add('hidden');
    commentsLoader.classList.add('hidden');
    body.classList.add('modal-open');

    renderBigPicture(evt);
  }

};

const galleryWrapper2 = document.querySelector('.pictures');

galleryWrapper2.addEventListener('click', handleClickPicture);
