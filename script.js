const fetchMercadoLivre = () => {
  const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(apiUrl)
    .then((response) => {
      response.json().then((computado) => {
        resolve(computado);
      });
    });
  });
};

window.onload = function onload() {
  fetchMercadoLivre();
  createProductItemElement();
 };