function addProductItem(product) {
  const items = document.querySelector('.items');
  items.appendChild(product);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  addProductItem(section);
}

/* Source: https://github.com/tryber/sd-09-project-shopping-cart/tree/37a1f85227593cca8a06045f06c4d6bc72ef7060 */
function fetchProducts() {
  const param = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${param}`;
  
  fetch(endpoint)
    .then((response) => response.json())
    .then((object) => object.results)
    .then((array) => {
      array.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        createProductItemElement({ sku, name, image });
      });
    })
    .catch((error) => console.log(error));
}

/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(product) {
  const cartListElement = document.querySelector('.cart__items');
  cartListElement.appendChild(product);
}

/**
 * Para fazer o requisito 2, me baseei no código do John Alves
 * Link: https://github.com/tryber/sd-09-project-shopping-cart/pull/79
 */

function getProductById(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
  .then((response) => response.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    const listItem = createCartItemElement({ sku, name, salePrice });
    addItemToCart(listItem);
  })
  .catch((error) => window.alert(error));
}

function getIdEvent() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const item = event.target.parentNode;
      const id = item.firstChild.innerText;
      getProductById(id);
    }
  });
}

window.onload = function onload() { 
  fetchProducts();
  getIdEvent();
};