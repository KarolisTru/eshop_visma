export const deleteProduct = async (id) => {
  try {
    await fetch(`/products/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(err);
  }
};
