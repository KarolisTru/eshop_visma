export const editProduct = async (data, id) => {
  const putObject = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }

    try {
      const response = await fetch(`/products/${id}`, putObject);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  };