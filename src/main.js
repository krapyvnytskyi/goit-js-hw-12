import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, fetchMoreImages } from '../src/js/pixabay-api.js';
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

searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  keyword = searchInput.value.trim();
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
    const images = await fetchImages(keyword);
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
      loadMoreButton.style.display = 'block';
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
  loader.style.display = 'block';
  try {
    const moreImages = await fetchMoreImages();
    if (moreImages.length > 0) {
      createMarkup(moreImages);
      lightbox.refresh();

      const galleryItemHeight = document
        .querySelector('.card')
        .getBoundingClientRect().height;

      window.scrollBy({
        top: galleryItemHeight * 2,
        behavior: 'smooth',
      });
    } else {
      iziToast.info({
        position: 'topRight',
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
      });
      loadMoreButton.style.display = 'none';
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
