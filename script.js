async function getProductsAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function getSectionItems() {
  return document.getElementById('__items');
}

function getOlCartItems() {
  return document.getElementById('__cart_ol');
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
  return item.querySelector('span.item__sku').innerText;
}

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

async function populatePageProducts(data) {
  data.results.forEach((product) => {
    const productObj = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };

    const section = createProductItemElement(productObj);
    getSectionItems().appendChild(section);
  });
}

async function insertItemToCartListener() {
  const url = 'https://api.mercadolibre.com/items';
  const items = document.getElementsByClassName('item');
  const buttonsAdd = document.getElementsByClassName('item__add');

  for (let i = 0; i < items.length; i += 1) {
    const sku = getSkuFromProductItem(items[i]);
    getProductsAPI(`${url}/${sku}`)
        .then((item) => {
          const productFormat = { sku: item.id, name: item.title, salePrice: item.price };
          buttonsAdd[i].addEventListener('click', () => {
            const li = createCartItemElement(productFormat);
            getOlCartItems().appendChild(li);
          });
        });
  }
}

window.onload = async function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const data = await getProductsAPI(url);

  await populatePageProducts(data);

  await insertItemToCartListener();
};