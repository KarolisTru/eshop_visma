export const deleteProduct = async (id) => {
  try {
    await fetch(`/products/${id}`, {
      method: "DELETE",
    });
    deleteFromDOM(id);
  } catch (err) {
    console.error(err);
  }
};

const deleteFromDOM = (id) => {
  document.querySelector(`[data-product-id="${id}"]`).remove();
}
