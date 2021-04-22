const fetchMercadoLivre = () => {
  const api_Url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(api_Url)
    .then((response) => {
      response.json().then((computado) => {
        resolve(computado);
      });
    });
  });
};

const buscarItem = (idI) => {
  const endpointItem = `https://api.mercadolibre.com/items/${idI}`;
  return new Promise((resolve) => {
    fetch(endpointItem)
      .then((response) => {
        response.json().then((item) => {
          resolve(item);
        });
      });
  });
};

const createProductItemElement = async () => { 
  const computers = await fetchAPI();
  msgLoading();

  computers.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    const sectionItems = document.querySelector('.items');
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    sectionItems.appendChild(section);
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = (event) => {
  // coloque seu código aqui
  const eventListItem = event.target;
  eventListItem.remove();
};

const createCartItemElement = ({ id:sku, title:name, price:salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const adItem = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', async (event) => {
    const addEvent = event.target;
    const skulId = getSkuFromProductItem(addEvent.parentElement);
    const data = await fetchItem(skulId);
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.appendChild(createCartItemElement(data));
  }));
};

adItem();

const clear = () => { 
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.innerHTML = '';
  });
};
clear();

// Ajuda de Murilo 
const msgLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

window.onload = function onload() {
  fetchMercadoLivre();
  createProductItemElement();
 };