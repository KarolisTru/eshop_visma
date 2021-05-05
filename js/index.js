const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const carouselItemsArr = Array.from(
  document.querySelectorAll(".product-card-carousel")
);
const cardsContainer = document.querySelector(".cards-container");
const carouselNavButtons = document.querySelectorAll(".carousel-nav-button");

//Numbers below are used to track translate state of cards-container and to track which carousel item is currently shown
let translateX = 0;
let currentlyActiveIndex = 0;

//
nextButton.addEventListener("click", () => {
  const currentlyActiveElement = document.querySelector(".active");
  const currentlyActiveButton = document.querySelector(".button-active");

  if (currentlyActiveIndex !== carouselItemsArr.length - 1) {
    //subtract as the current item has to move to the left once next is clicked
    translateX -= currentlyActiveElement.offsetWidth;
    cardsContainer.style.transform = `translateX(${translateX}px)`;
    currentlyActiveElement.classList.remove("active");

    //activate next item in carousel
    document
      .querySelectorAll(".product-card-carousel")
      [currentlyActiveIndex + 1].classList.add("active");

    //remove active class from previously active item
    currentlyActiveButton.classList.remove("button-active");

    //accordingly update slide-buttons below
    document
      .querySelectorAll(".carousel-nav-button")
      [currentlyActiveIndex + 1].classList.add("button-active");

    currentlyActiveIndex++;
  }
});

previousButton.addEventListener("click", () => {
  const currentlyActiveElement = document.querySelector(".active");
  const currentlyActiveButton = document.querySelector(".button-active");

  if (currentlyActiveIndex !== 0) {
    //add as the current item has to move to the left once next is clicked, and later same as above
    translateX += currentlyActiveElement.offsetWidth;
    cardsContainer.style.transform = `translateX(${translateX}px)`;
    currentlyActiveElement.classList.remove("active");

    document
      .querySelectorAll(".product-card-carousel")
      [currentlyActiveIndex - 1].classList.add("active");

    currentlyActiveButton.classList.remove("button-active");

    document
      .querySelectorAll(".carousel-nav-button")
      [currentlyActiveIndex - 1].classList.add("button-active");

    currentlyActiveIndex--;
  }
});


carouselNavButtons.forEach(btn => {
    btn.addEventListener('click', updateSlideButtons)
});


function updateSlideButtons (e) {
    const currentlyActiveElement = document.querySelector(".active");
    const currentlyActiveButton = document.querySelector(".button-active");

    if (+e.target.value !== currentlyActiveIndex) {
        translateX = e.target.value * -currentlyActiveElement.offsetWidth;
        
        cardsContainer.style.transform = `translateX(${translateX}px)`;
        currentlyActiveElement.classList.remove("active");
        document
          .querySelectorAll(".product-card-carousel")
          [e.target.value].classList.add("active");

          currentlyActiveButton.classList.remove("button-active");
          document
            .querySelectorAll(".carousel-nav-button")
            [e.target.value].classList.add("button-active");

        currentlyActiveIndex = +e.target.value;
    }
}