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

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const keyword = searchInput.value.trim();
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
  fetchImages(keyword)
    .then(images => {
      if (images.length === 0) {
        iziToast.info({
          position: 'topRight',
          title: 'Info',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        createMarkup(images);
        lightbox.refresh();
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      iziToast.error({
        position: 'topRight',
        title: 'Error',
        message:
          'An error occurred while fetching images. Please try again later.',
      });
    })
    .finally(() => {
      loader.style.display = 'none';
    });
});
