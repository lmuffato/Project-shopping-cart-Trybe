const getProduct = () => {
  const myPromisse = new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
      .then((response) => {
        response.json().then((data) => {
          resolve(data.results);
        });
      });
  });
  return myPromisse;
};

function createProductImageElement(imageSource) { // requisito 1 ajuda do Eduardo Costa e Andy
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // requisito 1 ajuda do Eduardo Costa e Andy
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // requisito 1 ajuda do Eduardo Costa e Andy
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

const addElement = async () => { // requisito 1 ajuda do Eduardo Costa e Andy
  const waitGetProduct = await getProduct();
  waitGetProduct.forEach((item) => {
    const firstSection = document.querySelector('.items');
    firstSection.appendChild(createProductItemElement(item));
  });
};

window.onload = function onload() {
  getProduct();
  addElement();
};