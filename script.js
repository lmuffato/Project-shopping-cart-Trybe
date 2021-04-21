const getComputer = () => { // requisito 1
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

const getItem = async (idItem) => { // requisito 2
  const url = `https://api.mercadolibre.com/items/${idItem}`;
  const response = await fetch(url);
  const data = await response.json();
  const { id, title, price } = data;
  const result = { sku: id, name: title, salePrice: price }
  return result;
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

function getSkuFromProductItem(item) { // requisito 2
  return item.querySelector('span.item__sku').innerText;
}

/* function cartItemClickListener(event) { // requisito 3
  // coloque seu código aqui
} */

function createCartItemElement({ sku, name, salePrice }) { // requiito 2
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const addElement = async () => { // requisito 1 ajuda do Eduardo Costa e Andy
  const waitGetComputer = await getComputer();
  waitGetComputer.forEach((item) => {
    const firstSection = document.querySelector('.items');
    firstSection.appendChild(createProductItemElement(item));
  });
  eventButt();
};

const eventButt = () => { // requisito 2
  const buttons =  document.querySelectorAll('.item__add');
  buttons.forEach((butt) => butt.addEventListener('click', async (event) => {
    const eventItem = event.target;
    const skuId = getSkuFromProductItem(eventItem.parentElement);
    const dataProduct = await getItem(skuId);
    const cardItems = document.querySelector('.cart__items');
    cardItems.appendChild(createCartItemElement(dataProduct));
  }));
};

window.onload = function onload() {
  getComputer();
  addElement();
};

/* const getItem = (idItem) => {
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
        });
      });
}
getItem('MLB1341706310') */