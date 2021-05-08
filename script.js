window.onload = function onload() { };

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

const informationsAPI = (interectAPI) => {
  interectAPI.forEach((computer) => { 
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(computer));
  });
};

const interectAPI = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then((data) => {
      const informations = data.results;
      console.log(informations);
      informationsAPI(informations);
    });
  });
 };

// -------------------------------------------------------------------------------
const searchId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => {
    response.json()
    .then((data) => {
      const infoId = data;
      createCartItemElement(infoId);
      document.querySelector('.cart__items').appendChild(createCartItemElement(infoId));
    });
  });
};

const takeIdData = () => {
  const route = document.querySelectorAll('.item__add');
  route.forEach((button) => {
    button.addEventListener('click', (event) => {
      const pcId = getSkuFromProductItem(event.target.parentElement);
      searchId(pcId);
    });
  });
};
 window.onload = function onload() { 
   interectAPI(); 
   takeIdData();
 };