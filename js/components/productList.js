import {
  fetchItems,
  fetchOneProduct,
  deleteProduct,
  addProduct,
  editProduct,
} from "../fetch/fetch.js";

const state = {
  activeProductID: null,

  activateModal(id) {
    document.getElementById(id).classList.add("modal-active");
  },
  deactivateModal() {
    document.querySelector(".modal-active").classList.remove("modal-active");
    this.activeProductID = null;
  },
  createProductObject(formID) {
    const dataObj = {};
    //using form data as it ignores checkbox value and checks if it's checked, entries list name-value pairs
    const formData = new FormData(document.getElementById(formID));
    const entriesIterator = formData.entries();

    for (let i of entriesIterator) {
      //if has a value (checkbox is ignored if not checked)
      if (i[1]) {
        dataObj[i[0]] = i[1];
      }
    }

    return dataObj;
  },
  addNewProduct(productElement) {
    document.querySelector(".product-list-container").append(productElement);
  },
  updateProduct(updatedProductElement) {
    document
      .querySelector(`[data-product-id="${this.activeProductID}"]`)
      .replaceWith(updatedProductElement);
  },
  appendProductList(productListElement) {
    document.querySelector(".product-list").append(productListElement);
  },
  deleteFromDOM() {
    const deletedID = this.activeProductID;
    this.deactivateModal();
    document.querySelector(`[data-product-id="${deletedID}"]`).remove();
  },
  clearAddProductForm() {
    this.addProductForm.reset();
  },
  clearEditProductForm() {
    this.productEditForm.reset();
  },
  populateForm(productData) {
    const keyValueList = Object.entries(productData);
    const productEditForm = this.productEditForm;

    keyValueList.forEach((field) => {
      const [key, value] = field;
      const fieldValueInForm = productEditForm.elements[key];

      if (key === "flagged" && value === "true") {
        document.getElementById("display-in-carousel-edit").checked = true;
      } else if (fieldValueInForm) {
        fieldValueInForm.value = value;
      }
    });
  },
  formIsValid(formID) {
    return document.getElementById(formID).checkValidity();
  },

  get productEditForm() {
    return document.getElementById("edit-product-form");
  },
  get addProductForm() {
    return document.getElementById("new-product-form");
  },
  get addProductBtn() {
    return document.getElementById("add-new-product-btn");
  },
  get deleteProductBtn() {
    return document.getElementById("delete-product");
  },
  get submitNewProductBtn() {
    return document.getElementById("submit-product");
  },
  get submitUpdatedProductBtn() {
    return document.getElementById("submit-edit-product");
  },
  get exitModalButtons() {
    return document.querySelectorAll(".close-button");
  },
  set currentID(button) {
    this.activeProductID = button.closest("[data-product-id]").dataset.productId;
  },
};

//main function to fetch products and create the product list in document
export default async () => {
  try {
    const data = await fetchItems("/products");
    createProductList(data);
  } catch (err) {
    console.error(err);
  }
};

function createProductList(data) {
  const emptyProductListContainer = document.createElement("div");
  emptyProductListContainer.className = "product-list-container";

  const filledProductList = makeProductListFrom(
    data,
    emptyProductListContainer
  );
  state.appendProductList(filledProductList);
}

function makeProductListFrom(products, container) {
  return products.reduce((accumulator, product) => {
    const productCard = createProductCard(product);
    accumulator.append(productCard);

    return accumulator;
  }, container);
}

function createProductCard({ photoUrl, price, name, url, id }) {
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

  const openDeleteButton = productCardContainer.querySelector(
    ".delete-modal-opener"
  );
  const openEditButton =
    productCardContainer.querySelector(".edit-modal-opener");

  openDeleteButton.addEventListener("click", openDeleteModal);
  openEditButton.addEventListener("click", openEditModal);

  return productCardContainer;
}

function openDeleteModal() {
  state.activateModal("delete-modal");
  state.currentID = this;
}

async function openEditModal() {
  state.activateModal("edit-product-modal");
  state.currentID = this;
  try {
    const currentProductData = await fetchOneProduct(state.activeProductID);
    state.populateForm(currentProductData);
  } catch (err) {
    console.error(err);
  }
}

//Modal buttons are static - below are the assigned click listeners on all of the modal buttons.
state.addProductBtn.addEventListener("click", () => {
  state.activateModal("add-product-modal");
});

state.deleteProductBtn.addEventListener("click", async () => {
  try {
    await deleteProduct(state.activeProductID);
    state.deleteFromDOM();
  } catch (err) {
    console.error(err);
  }
});

state.submitNewProductBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (state.formIsValid("new-product-form")) {
    const dataObject = state.createProductObject("new-product-form");
    try {
      const newProduct = await addProduct(dataObject);
      const productCard = createProductCard(newProduct);
      state.addNewProduct(productCard);
      state.deactivateModal();
      state.clearAddProductForm();
    } catch (err) {
      console.error(err);
    }
  } else state.addProductForm.reportValidity();
});

state.submitUpdatedProductBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (state.formIsValid("edit-product-form")) {
    const dataObject = state.createProductObject("edit-product-form");
    try {
      const updatedProductData = await editProduct(
        dataObject,
        state.activeProductID
      );
      const updatedProduct = createProductCard(updatedProductData);
      state.updateProduct(updatedProduct);
      state.deactivateModal();
    } catch (err) {
      console.error(err);
    }
  } else state.productEditForm.reportValidity();
});

state.exitModalButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.deactivateModal();
    state.clearEditProductForm();
  });
});
