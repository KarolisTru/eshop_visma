import {fetchItems} from "../fetch/fetch.js";

//static elements, are in html file (not created by js) and won't change dynamically
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const carousel = document.querySelector(".carousel");

//state of carousel + relevant getters to always get the updated value of relevant DOM elements
const state = {
  currentlyActiveIndex: 0,
  translateX: 0,

  get carouselCards() {
    return document.querySelectorAll(".product-card-carousel");
  },
  get currentSlideElement() {
    return document.querySelector(".active");
  },
  get nextSlideElement() {
    return document.querySelectorAll(".product-card-carousel")[
      this.currentlyActiveIndex + 1
    ];
  },
  get previousSlideElement() {
    return document.querySelectorAll(".product-card-carousel")[
      this.currentlyActiveIndex - 1
    ];
  },
  get activeSlideButton() {
    return document.querySelector(".button-active");
  },
  get nextSlideButton() {
    return document.querySelectorAll(".carousel-nav-button")[
      this.currentlyActiveIndex + 1
    ];
  },
  get previousSlideButton() {
    return document.querySelectorAll(".carousel-nav-button")[
      this.currentlyActiveIndex - 1
    ];
  },
  get carouselButtons() {
    return document.querySelectorAll(".carousel-nav-button");
  },
  get carouselLength() {
    return document.querySelectorAll(".product-card-carousel").length;
  },
  get carouselCardsContainer() {
    return document.querySelector(".cards-container");
  },
  get showsNotFirstSlide() {
    return this.currentlyActiveIndex !== 0;
  },
  get showsNotLastSlide() {
    return this.currentlyActiveIndex !== this.carouselLength - 1;
  },
};

//main function to fetch carousel items, sort them, create carousel and its nav buttons below
export default async () => {
  try {
    const data = await fetchItems("/carousel");
    data.sort((a, b) => a.priority - b.priority);
    createCarouselSection(data);
    createCarouselNavButtons(data);
  } catch (err) {
    console.error(err);
  }
};

function createCarouselSection(data) {
  const carouselItemsMarkup = data
    .map(
      ({ link, photoUrl, text }, index) => `
    <section class="${
      index === 0 ? "product-card-carousel active" : "product-card-carousel"
    }">
        <a href="${link}">
            <div class="carousel-img-container">
                <img src="${photoUrl}" alt="product-photo" class="carousel-img">
                <p class="carousel-data-container">${text}</p>
            </div>
        </a>
    </section>`
    )
    .join("");

  state.carouselCardsContainer.innerHTML = `
      <div class="cards-container">
      ${carouselItemsMarkup}
      </div>`;
}

function createCarouselNavButtons(data) {
  if (data.length < 6) {
    const buttonsMarkup = data
      .map(
        (el, index) => `
                <button class="${
                  index === 0
                    ? "carousel-nav-button button-active"
                    : "carousel-nav-button"
                }" type="button" data-value="${index}"></button>
            `
      )
      .join("");

    const buttonsContainer = `
        <div class="coordinates-button-container">
            ${buttonsMarkup}
        </div>
    `;

    carousel.insertAdjacentHTML("beforeend", buttonsContainer);
    addEventListeners(state.carouselButtons, updateSlideButtons);
  }
}

function addEventListeners(elements, handler) {
  elements.forEach((btn) => btn.addEventListener("click", handler));
}

//below - event listeners for previous/next buttons
nextButton.addEventListener("click", () => {
  if (state.showsNotLastSlide) {
    const offset = -state.currentSlideElement.offsetWidth;
    updateState(offset, "nextSlideElement", "nextSlideButton");
    state.currentlyActiveIndex++;
  }
});

previousButton.addEventListener("click", () => {
  if (state.showsNotFirstSlide) {
    const offset = state.currentSlideElement.offsetWidth;
    updateState(offset, "previousSlideElement", "previousSlideButton");
    state.currentlyActiveIndex--;
  }
});

//updating state depending on the value of buttons above
function updateState(offset, targetSlide, targetButton) {
  state.translateX += offset;
  state.carouselCardsContainer.style.transform = `translateX(${state.translateX}px)`;
  state.currentSlideElement.classList.remove("active");
  state[targetSlide].classList.add("active");

  if (state.activeSlideButton) {
    state.activeSlideButton.classList.remove("button-active");
    state[targetButton].classList.add("button-active");
  }
}

//updating state when nav buttons below the carousel are clicked
function updateSlideButtons(e) {
  const buttonIndex = e.target.dataset.value
  const isButtonActive = +buttonIndex === state.currentlyActiveIndex;

  if (!isButtonActive) {
    state.translateX = buttonIndex * -state.currentSlideElement.offsetWidth;
    state.carouselCardsContainer.style.transform = `translateX(${state.translateX}px)`;
    state.currentSlideElement.classList.remove("active");
    state.carouselCards[buttonIndex].classList.add("active");
    state.activeSlideButton.classList.remove("button-active");
    state.carouselButtons[buttonIndex].classList.add("button-active");

    state.currentlyActiveIndex = +buttonIndex;
  }
}
