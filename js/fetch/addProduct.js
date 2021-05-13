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
