export async function fetchItems(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchOneProduct(id) {
  try {
    const response = await fetch(`/products/${id}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export const addProduct = async (data) => {
  const postObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch("/products", postObject);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteProduct = async (id) => {
  try {
    await fetch(`/products/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error(err);
  }
};

export const editProduct = async (data, id) => {
  const putObject = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`/products/${id}`, putObject);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};
