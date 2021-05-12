export default async(url) => {
    const response = await fetch(url);
    return response.json();

    
}

function populateForm(data, form) {
    const fields = Object.keys(data);

    fields.forEach(field => {
        const fieldIsPresent = form.elements[field];
        console.log(fieldIsPresent);
        if(fieldIsPresent) {
            fieldIsPresent.value = data[field];
        }
    })
}

export async function fetchOneProduct(form, id) {
    try {
        const response = await fetch(`/products/${id}`);
        const data = await response.json();
        populateForm(data, form);
      } catch (err) {
        console.error(err);
      }
}


