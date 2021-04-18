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
  
  // requisito 1
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// requisito 1 
// feito com ajuda da colega Heloísa Hackenhaar
const addProduct = (products) => {
  products.forEach((product) => {
    const { id, title, thumbnail } = product;
  createProductItemElement({ id, title, thumbnail });
  });
};

function productList() {
  let products; 
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json().then((data) => {
      products = data.results;
      addProduct(products);
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2
const getItemId = () => {
  const cartItem = document.querySelector('.cart__items');
  const buttons = document.querySelector('.items');
    buttons.addEventListener('click', async (e) => {
      const itemId = getSkuFromProductItem(e.target.parentElement);
      const getFetch = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
      const itemData = await getFetch.json();
        const { id, title, price } = itemData;
        cartItem.appendChild(createCartItemElement({ id, title, price }));
      });
};

window.onload = function onload() {
  productList();
  getItemId();
};