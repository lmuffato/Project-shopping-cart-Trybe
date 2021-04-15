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
  const eraseCart = document.querySelector('.empty-cart');
  eraseCart.addEventListener('click', () => {
  const list = document.querySelector('.cart__items');
  list.innerHTML = '';
  });
};

// código melhorado e funcionando corretamente após dica do Patrick Morais - https://files.slack.com/files-pri/TMDDFEPFU-F01U57B6XKQ/image.png
async function fetchComputer() {
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

// function cartItemClickListener() {
//   console.log('teste');
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener());
  return li;
}

async function fetchList(ItemID) {
  const endpoint = `https://api.mercadolibre.com/items/${ItemID}`;
  const response = await fetch(endpoint);
  const obj = await response.json();
  const fatherElement = document.querySelector('.cart__items');
  console.log(fatherElement);
    const pc = {
      sku: obj.id,
      name: obj.title,
      salePrice: obj.price,
    };
    const item = createCartItemElement(pc);
    console.log(item);
    fatherElement.appendChild(item);
}

const markingTargets = () => {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach((element) => element.addEventListener('click', async event => {
    const clickedElement = event.target;
    const realTarget = clickedElement.parentNode;
    const ID = getSkuFromProductItem(realTarget);
    fetchList(ID);
  }));
};

window.onload = function onload() { 
  fetchComputer()
  .then(() => markingTargets());
  removeAllFromCart();
};