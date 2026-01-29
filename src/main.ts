import './style.css'

/**
 * ============================
 * КАРУСЕЛЬ + LIGHTBOX
 * ============================
 */

// -----------------------------
// КАРУСЕЛЬ
// -----------------------------

const track = document.querySelector('.carousel__track') as HTMLElement
const items = Array.from(
  document.querySelectorAll('.carousel__item')
) as HTMLImageElement[]

const prevBtn = document.querySelector('.carousel__btn--prev') as HTMLButtonElement
const nextBtn = document.querySelector('.carousel__btn--next') as HTMLButtonElement

/**
 * Ширина одного элемента (с учётом gap)
 */
function getScrollAmount() {
  return items[0].clientWidth + 16
}

// кнопки мышью
nextBtn.addEventListener('click', () => {
  track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' })
})

prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' })
})

// -----------------------------
// СКРОЛЛ ТАЧПАДОМ (wheel)
// -----------------------------

track.addEventListener('wheel', (e) => {
  if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
    track.scrollLeft += e.deltaY
    e.preventDefault()
  }
}, { passive: false })

// -----------------------------
// СВАЙП НА ТЕЛЕФОНЕ
// -----------------------------

let touchStartX = 0

track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX
})

track.addEventListener('touchmove', (e) => {
  const touchX = e.touches[0].clientX
  const delta = touchStartX - touchX
  track.scrollLeft += delta
  touchStartX = touchX
})

/**
 * Плавная смена изображения (fade)
 */
function changeLightboxImage(index: number) {
  lightboxImage.classList.add('fade-out')

  setTimeout(() => {
    lightboxImage.src = items[index].src
    lightboxImage.classList.remove('fade-out')
  }, 300)

  preloadNeighbors(index)
}

// -----------------------------
// LIGHTBOX
// -----------------------------

const lightbox = document.getElementById('lightbox') as HTMLElement
const lightboxImage = lightbox.querySelector(
  '.lightbox__image'
) as HTMLImageElement

const lightboxPrev = lightbox.querySelector(
  '.lightbox__btn--prev'
) as HTMLButtonElement

const lightboxNext = lightbox.querySelector(
  '.lightbox__btn--next'
) as HTMLButtonElement

let lightboxIndex = 0

/**
 * Предзагрузка одного изображения
 */
function preloadImage(src: string) {
  const img = new Image()
  img.src = src
}

/**
 * Предзагрузка соседних изображений
 * (предыдущее и следующее)
 */
function preloadNeighbors(index: number) {
  const prevIndex = (index - 1 + items.length) % items.length
  const nextIndex = (index + 1) % items.length

  preloadImage(items[prevIndex].src)
  preloadImage(items[nextIndex].src)
}


function openLightbox(index: number) {
  lightboxIndex = index
  lightboxImage.src = items[lightboxIndex].src
  lightbox.classList.add('active')

  preloadNeighbors(lightboxIndex)
}

function closeLightbox() {
  lightbox.classList.remove('active')
}

// клик по фото
items.forEach((img, index) => {
  img.addEventListener('click', () => {
    openLightbox(index)
  })
})

// стрелки в lightbox
lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation()

  lightboxIndex = (lightboxIndex + 1) % items.length
  changeLightboxImage(lightboxIndex)

  // preloadNeighbors(lightboxIndex)
})

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation()

  lightboxIndex =
    (lightboxIndex - 1 + items.length) % items.length
  changeLightboxImage(lightboxIndex)

  // preloadNeighbors(lightboxIndex)
})

// закрытие
lightbox.addEventListener('click', closeLightbox)

// -----------------------------
// КЛАВИАТУРА ← →
// -----------------------------

document.addEventListener('keydown', (e) => {
  // если lightbox закрыт — игнорируем клавиатуру
  if (!lightbox.classList.contains('active')) return

  if (e.key === 'Escape') {
    closeLightbox()
  }

  if (e.key === 'ArrowRight') {
    lightboxIndex = (lightboxIndex + 1) % items.length
    changeLightboxImage(lightboxIndex)
  }

  if (e.key === 'ArrowLeft') {
    lightboxIndex =
      (lightboxIndex - 1 + items.length) % items.length
    changeLightboxImage(lightboxIndex)
  }
})