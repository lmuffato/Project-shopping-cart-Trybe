const fetchMercadoLivre = () => {
  const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(apiUrl)
    .then((response) => {
      response.json().then((computado) => {
        resolve(computado);
      });
    });
  });
};

const buscarItem = (idi) => {
  const endpointItem = `https://api.mercadolibre.com/items/${idi}`;
  return new Promise((resolve) => {
    fetch(endpointItem)
      .then((response) => {
        response.json().then((item) => {
          resolve(item);
        });
      });
  });
};

function createProductImageElement(image) { 
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = image;
  return img;
}

function createCustomElement(element, classNam, innerTex) { 
  const e = document.createElement(element);
  e.className = classNam;
  e.innerText = innerTex;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = (event) => {
  const eventListItem = event.target;
  eventListItem.remove();
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const addi = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', async (event) => {
    const addEvent = event.target;
    const skulId = getSkuFromProductItem(addEvent.parentElement);
    const data = await buscarItem(skulId);
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.appendChild(createCartItemElement(data));
  }));
};

const clear = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const itemsCart = document.querySelector('.cart__items');
    itemsCart.innerHTML = '';
  });
};

const msgLoading = () => { // requisito 7
  const loading = document.querySelector('.loading');
  loading.remove();
};

const createProductItemElement = async () => { // requisito 1
  const computers = await fetchMercadoLivre();
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

  addi();
  clear();
};

window.onload = function onload() {
  fetchMercadoLivre();
  createProductItemElement();
 };