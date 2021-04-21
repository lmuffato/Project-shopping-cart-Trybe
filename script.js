window.onload = function onload() {
  fetchComputer();
};

const URL_API_id = 'https://api.mercadolibre.com/items/${id}';



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

const fetchComputer = async () => {
  const URL_API_computer = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  const data_API_computer = await fetch(URL_API_computer);
  const data = await data_API_computer.json();
  return data;
};

const fetchId = async (id) => {
  const data_API_id = await fetch(URL_API_id);
  const data = await data_API_id.json();
  return data;
}

const getComputers = ({ result }) => {
  result.forEach((result) => {
    document.querySelector('.items').appendChild(createProductItemElement(result));    
  });
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
