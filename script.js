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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  console.log(li);
  return li;
}

/// Minhas implementações

// Implementação requisito 1: Criar uma lista de produtos
async function verifiedFetchSearch(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data);
  }
  throw new Error('endpoint not exist');
}

const createProductList = (listComputers) => {
  const itemsElement = document.querySelector('.items');
  const listComputerValues = listComputers.map((computer) => ({
    sku: computer.id,
    name: computer.title,
    image: computer.thumbnail,
  }));
  listComputerValues.forEach((computer) => {
    const item = createProductItemElement(computer);
    itemsElement.appendChild(item);
  });
};

async function fetchProductList(callback) {
  await verifiedFetchSearch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      const listComputers = response.results;
      callback(listComputers);
    })
    .catch((err) => err);
}

// Implementação requisito 2: Adicionar o produto ao carrinho de compras

async function verifiedFetchItems(url, itemId) {
  if (url === `https://api.mercadolibre.com/items/${itemId}`) {
    return fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => data);
  }
  throw new Error('endpoint not exist');
}

function addItemCar(response) {
  const obj = {
    sku: response.id,
    name: response.title,
    salePrice: response.price,
  };
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(obj));
}

async function getItems(event) { 
  if (event.target.classList.contains('item__add')) {
    const itemId = event.target.parentNode.firstChild.textContent;
    await verifiedFetchItems(`https://api.mercadolibre.com/items/${itemId}`, itemId)
    .then((response) => {
      addItemCar(response);
    })
    .catch((err) => err);
  }
}

async function fetchProductItems() {
  const items = document.querySelector('.items');
  items.addEventListener('click', getItems);
}

window.onload = function onload() { 
  fetchProductList(createProductList);
  fetchProductItems();
};
