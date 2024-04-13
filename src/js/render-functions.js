export function clearGallery() {
  const galleryElement = document.querySelector('.gallery');
  galleryElement.innerHTML = '';
}

export function createMarkup(images) {
  const galleryElement = document.querySelector('.gallery');
  const markup = images
    .map(
      image => `<li class="card">
    <a href="${image.largeImageURL}" data-lightbox="gallery-item">
      <img class="contentCard" src="${image.webformatURL}" alt="${image.tags}">
    </a>
    <div class="imgCard">
      <p><b>Likes:</b> ${image.likes}</p>
      <p><b>Views:</b> ${image.views}</p>
      <p><b>Comments:</b> ${image.comments}</p>
      <p><b>Downloads:</b> ${image.downloads}</p>
    </div></li>
  `
    )
    .join('');

  galleryElement.insertAdjacentHTML('beforeend', markup);
}
