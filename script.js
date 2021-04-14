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

const APIUrlComputador = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const tratarElemento = (objeto) => ({
    sku: objeto.id,
    name: objeto.title,
    image: objeto.thumbnail,
    salePrice: objeto.price,
  });

const createItem = (array) => {
  const items = document.querySelector('.items');
  array.forEach((element) => {
    items.appendChild(createProductItemElement(tratarElemento(element)));
  });
};

const fetchAPI = () => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  
  fetch(APIUrlComputador, myObject)
  .then((response) => response.json())
  .then((data) => createItem(data.results));
};

window.onload = function onload() { 
  fetchAPI();
};