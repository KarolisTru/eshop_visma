import fetchProducts, { fetchOneProduct } from "../fetch/fetch.js";
import { deleteProduct } from "../fetch/deleteProduct.js";
import { addProduct } from "../fetch/addProduct.js";
import { editProduct } from "../fetch/editProduct.js";

const state = {
  activeProductID: "",

  activateModal(id) {
    document.getElementById(id).classList.add("modal-active");
  },
  deactivateModal() {
    document.querySelector(".modal-active").classList.remove("modal-active");
  },

  createProductObject(formID) {
    const dataObj = {};
    const formData = new FormData(document.getElementById(formID));
    const entriesIterator = formData.entries();

    for (let i of entriesIterator) {
      if (i[1]) {
        dataObj[i[0]] = i[1];
      }
    }

    return dataObj;
  },

  addNewProduct(product) {
    document.querySelector(".product-list-container").append(product);
  },

  get productEditForm() {
    return document.getElementById("edit-product-form");
  },
};

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
      ({ photoUrl, price, name, url, id }) =>
        `
        <div class="product-card-regular" data-product-id=${id}>
            <div class="img-container-regular">
                <img src="${photoUrl}" alt="${name}">
            </div>
            <div class="data-container">
                <button type="button" class="icon-button icon-button--primary edit edit-modal-opener">
                  <i class="fa fa-pencil-square-o"></i>
                </button>
                <h3 class="product-name-regular">${name}</h3>
                <p class="price">€ ${Number.parseFloat(price).toFixed(2)}</p>
                <button class="cta-button" type="button">
                  <a href="${url}" class="stretched-link">See Product</a>
                </button>
                <button type="button" class="icon-button icon-button--danger delete delete-modal-opener">
                  <i class="fa fa-trash"></i>
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

  document.querySelectorAll(".delete-modal-opener").forEach((btn) =>
    btn.addEventListener("click", function () {
      state.activateModal("delete-modal");
      state.activeProductID = this.closest(
        "[data-product-id]"
      ).dataset.productId;
    })
  );

  document.querySelectorAll(".edit-modal-opener").forEach((btn) =>
    btn.addEventListener("click", function () {
      state.activateModal("edit-product-modal");
      state.activeProductID = this.closest(
        "[data-product-id]"
      ).dataset.productId;
      fetchOneProduct(state.productEditForm, state.activeProductID);
    })
  );

  document.querySelectorAll(".close-button").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.deactivateModal();
      state.activeProductID = "";
    })
  );
}

const addProductBtn = document.getElementById("add-new-product-btn");
const deleteProductBtn = document.getElementById("delete-product");
const addNewProductBtn = document.getElementById("submit-product");
const editProductBtn = document.getElementById("submit-edit-product");

addProductBtn.addEventListener("click", () => {
  state.activateModal("add-product-modal");
});

deleteProductBtn.addEventListener("click", () => {
  deleteProduct(state.activeProductID);
});

addNewProductBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const dataObject = state.createProductObject("new-product-form");
  addProduct(dataObject);
});

editProductBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const dataObject = state.createProductObject("edit-product-form");
  editProduct(dataObject, state.activeProductID);
});

export function createProductCard({ photoUrl, price, name, url, id }) {
  const productCard = `
          <div class="img-container-regular">
              <img src="${photoUrl}" alt="${name}">
          </div>
          <div class="data-container">
              <button type="button" class="icon-button icon-button--primary edit edit-modal-opener">
                <i class="fa fa-pencil-square-o"></i>
              </button>
              <h3 class="product-name-regular">${name}</h3>
              <p class="price">€ ${Number.parseFloat(price).toFixed(2)}</p>
              <button class="cta-button" type="button">
                <a href="${url}" class="stretched-link">See Product</a>
              </button>
              <button type="button" class="icon-button icon-button--danger delete delete-modal-opener">
                <i class="fa fa-trash"></i>
              </button>
          </div>
      `;

  const productCardContainer = document.createElement("div");
  productCardContainer.className = "product-card-regular";
  productCardContainer.setAttribute("data-product-id", id);

  productCardContainer.insertAdjacentHTML("beforeend", productCard);

  productCardContainer.querySelectorAll(".delete-modal-opener").forEach((btn) =>
    btn.addEventListener("click", function () {
      state.activateModal("delete-modal");
      state.activeProductID = this.closest(
        "[data-product-id]"
      ).dataset.productId;
    })
  );

  productCardContainer.querySelectorAll(".edit-modal-opener").forEach((btn) =>
    btn.addEventListener("click", function () {
      state.activateModal("edit-product-modal");
      state.activeProductID = this.closest(
        "[data-product-id]"
      ).dataset.productId;
      fetchOneProduct(state.productEditForm, state.activeProductID);
    })
  );

  productCardContainer.querySelectorAll(".close-button").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.deactivateModal();
      state.activeProductID = "";
    })
  );

  state.addNewProduct(productCardContainer);
}
