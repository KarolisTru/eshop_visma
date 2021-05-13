export default async(url) => {
    const response = await fetch(url);
    return response.json();
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


