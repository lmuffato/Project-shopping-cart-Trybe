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

// ideia de adicionar o loading no html e só removê-lo via JS vista no repositório do Renzo - https://github.com/tryber/sd-010-a-project-shopping-cart/pull/58
const removeLoading = () => {
  const local = document.querySelector('.loading');
  local.remove();
};

const removeAllFromCart = () => {
  let eraseCart = document.querySelector('.empty-cart');
  eraseCart.addEventListener('click', removeAllFromCart());
  const list = document.querySelectorAll('li');
  list.forEach((element) => element.remove);
}

// código melhorado e funcionando corretamente após dica do Patrick Morais - https://files.slack.com/files-pri/TMDDFEPFU-F01U57B6XKQ/image.png
async function fetchComputador() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(endpoint);
  removeLoading();
  const obj = await response.json();
  const computers = obj.results;
  const items = document.querySelector('.items');

  computers.forEach((computer) => {
    const pc = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    const item = createProductItemElement(pc);
    items.appendChild(item);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function fetchList() {
  const ItemID = getSkuFromProductItem();
  const endpoint = 'https://api.mercadolibre.com/items/${ItemID}';
  const response = await fetch(endpoint);
  const obj = await response.json();
  const computers = obj.results;
  const fatherElement = document.querySelector('.cart_items');

  computers.forEach((computer) => {
    const pc = {
      sku: computer.id,
      name: computer.title,
      salePrice: price,
    };
    const item = createCartItemElement(pc);
    fatherElement.appendChild(item);
  })
}

let teste = document.querySelectorAll('.item__add')
teste.forEach((element) => {
element.addEventListener('click', fetchList());
});

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener());
  return li;
}

window.onload = function onload() { 
  fetchComputador();
  removeAllFromCart();
};