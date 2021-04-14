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

//  Requisito 1
async function fetchProducts() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
      .then((r) => r);
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

async function getProducts() {
  const items = document.querySelector('.items');
  const produtos = await fetchProducts()
    .then((resp) => resp.results);
    produtos.forEach((computador) => {
      const objItem = {
        sku: computador.id,
        name: computador.title,
        image: computador.thumbnail,
      };
      const item = createProductItemElement(objItem);
      items.appendChild(item);
    });
  }

/*

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

/*
function cartItemClickListener(event) {
  // coloque seu código aqui
}
*/

/*
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
*/

window.onload = function onload() { 
  getProducts();
};
