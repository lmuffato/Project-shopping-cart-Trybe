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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchMercadoLivreResults(query) {
  const data = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const dataJson = await data.json();
  return dataJson.results;
}

async function cartApiRequisition(ItemID) {
  const data = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
  const dataJson = await data.json();
  return dataJson;
}

async function getItemSku(event) {
  const createCartItem = createCartItemElement(
    await cartApiRequisition(
      event.target.previousElementSibling.previousElementSibling.previousElementSibling.innerText,
    ),
  );

  const selectCartItem = document.querySelector('.cart__items');
  selectCartItem.appendChild(createCartItem);
}

function addItemCart() {
  const itemAdd = document.querySelectorAll('.item__add');
  itemAdd.forEach((item) => {
    item.addEventListener('click', getItemSku);
  });
}

const apiAppendChild = () => {
  fetchMercadoLivreResults('computador')
    .then((results) => {
      results.forEach((element) => {
        const createProduct = createProductItemElement(element);
        const getItems = document.querySelector('.items');
        getItems.appendChild(createProduct);
      });
    })
    .then(() => {
      addItemCart();
    });
};

// async function everyAsyncFunction() {
//   apiAppendChild();
//   await addItemCart();
// }

window.onload = function onload() {
  apiAppendChild();
};
