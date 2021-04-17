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
  const fatherSection = document.querySelector('.items');
  fatherSection.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function cartItemClickListener(event) {
  const { target } = event;
    target.remove();
}
async function products(product) {
  const URL = `https://api.mercadolibre.com/items/${product}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

const classe = '.cart__items';

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  const fatherLi = document.querySelector(classe);
  fatherLi.appendChild(li);
  return li;
}

const saveList = () => {
  const fatherLi = document.querySelector(classe).innerHTML;
  localStorage.setItem('result', fatherLi);
};

const eventClick = () => {
  const fatherButton = document.querySelector('.items');
  fatherButton.addEventListener('click', async (e) => {
    const { target } = e;
    if (target.classList.contains('item__add')) {
      const { parentElement } = target;
      const get = getSkuFromProductItem(parentElement);
      const result = await products(get);
      createCartItemElement(result);
      saveList();
    }
  });
};

const addComputers = async (product) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const dates = await response.json();
  dates.results.forEach((element) => {
    createProductItemElement(element);
  });
};

const recordItens = () => {
  const result = localStorage.getItem('result');
  const fatherLi = document.querySelector(classe);
  fatherLi.innerHTML = result;
};

window.onload = function onload() {
  addComputers('computador');
  eventClick();
  recordItens();  
};