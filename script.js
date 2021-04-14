function fetchApi(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((respo) => respo.results);
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

  return section;
}

function getSkuFromProductItem(item) {
  // console.log(item.querySelector('span.item__sku'));
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToShoppingCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((result) => {
      const itemCart = createCartItemElement({
        sku: result.id,
        name: result.title,
        salePrice: result.price,
      });
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(itemCart);
    });
}

function getButtons(element) {
  const addButtons = element.querySelector('.item__add');
  const sku = getSkuFromProductItem(element);
  addButtons.addEventListener('click', () => addToShoppingCart(sku));
}

function productsList() {
  const itensSection = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchApi(url)
    .then((results) => {
      results.forEach((element) => {
        const product = createProductItemElement({
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        });
        itensSection.appendChild(product);
        getButtons(product);
      });
    });
}

window.onload = function onload() {
  productsList();
};