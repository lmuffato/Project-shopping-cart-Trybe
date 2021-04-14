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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/// Meu código 

// Solução requisito 1: Criar uma listagem de produtos
async function verifiedFetch(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data);
  }
  throw new Error('endpoint não existe');
}

function createProductList(listComputers) {
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
}

async function fetchProductList(callback) {
  await verifiedFetch('https://api.mercadolibre.com/sites/MLB/search?q=compuador')
    .then((response) => {
      const listComputers = response.results;
      callback(listComputers);
    })
    .catch((err) => err);
}

window.onload = function onload() { 
  fetchProductList(createProductList);
};