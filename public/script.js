const form = document.querySelector('#add-ingrediente')

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const formData = new FormData(form)
  const jsonData = {};

  for (let [key, value] of formData.entries()) {
    jsonData[key] = value;
  }
  fetch('/ingredientes/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  })
  .then(res => res.text())
  .then(data => {
    try {
        let obj = JSON.parse(data)
        alert(obj.aviso)
    } catch {
        return
    }
  })
  .catch(error => {
    console.error(error);
  })
  window.location.reload();
})
