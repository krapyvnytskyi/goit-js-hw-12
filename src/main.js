import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from '../src/js/pixabay-api.js';
import { clearGallery, createMarkup } from '../src/js/render-functions.js';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const loader = document.querySelector('.loader');
const loadMoreButton = document.getElementById('load');

let keyword = '';
const perPage = 15;
let page = 1;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  keyword = searchInput.value.trim();
  page = 1;
  loadMoreButton.style.display = 'none';
  if (!keyword) {
    iziToast.error({
      position: 'topRight',
      title: 'Error',
      message: 'Please enter a keyword for search.',
    });
    return;
  }
  loader.style.display = 'block';
  clearGallery();
  try {
    const images = await fetchImages(keyword, page);
    if (images.length === 0) {
      iziToast.info({
        position: 'topRight',
        title: 'Info',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      createMarkup(images.hits);
      lightbox.refresh();
      loadMoreButton.style.display = 'block'; // Show load more button
    }

    if (images.totalHits < perPage) {
      iziToast.info({
        position: 'topRight',
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMoreButton.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      position: 'topRight',
      title: 'Error',
      message:
        'An error occurred while fetching images. Please try again later.',
    });
  } finally {
    loader.style.display = 'none';
  }
});

loadMoreButton.addEventListener('click', async () => {
  page += 1;
  loader.style.display = 'block';

  try {
    const images = await fetchImages(keyword, page);

    if (images.hits.length < perPage) {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        position: 'topRight',
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
    createMarkup(images.hits);
    lightbox.refresh();
    if (images.hits.length > 0) {
      // Отримання висоти однієї карточки галереї
      const galleryItemHeight = document
        .querySelector('.card')
        .getBoundingClientRect().height;

      // Прокрутка сторінки на дві висоти карточки галереї
      window.scrollBy({
        top: galleryItemHeight * 2,
        behavior: 'smooth', // Додаємо плавність
      });
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    iziToast.error({
      position: 'topRight',
      title: 'Error',
      message:
        'An error occurred while fetching more images. Please try again later.',
    });
  } finally {
    loader.style.display = 'none';
  }
});
