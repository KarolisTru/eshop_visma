import fetchProducts from "../fetch/fetch.js";

//main function to fetch products and create the product list in document
export default async () => {
  try {
    const data = await fetchProducts("/products");
    createProductList(data);
  } catch (err) {
    console.error(err);
  }
};

function createProductList(data) {
  const productListMarkup = data
    .map(
      ({ photoUrl, price, name, url }) =>
        `
        <div class="product-card-regular">
            <div class="img-container-regular">
                <img src="${photoUrl}" alt="${name}">
            </div>
            <div class="data-container">
                <h3 class="product-name-regular">${name}</h3>
                <p class="price">€ ${Number.parseFloat(price).toFixed(2)}</p>
                <button class="cta-button" type="button">
                    <a href="${url}" class="stretched-link">See Product</a>
                </button>
            </div>
        </div>
        `
    )
    .join("");

  const productList = `
        <div class="product-list-container">
            ${productListMarkup}
        </div>
    `;
  document
    .querySelector(".product-list")
    .insertAdjacentHTML("beforeend", productList);
}
