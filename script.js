

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

// REQUISITO 1 (USAR)
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// REQUISITO 2 (USAR)
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// REQUISITO 2 (USAR)
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// REQUISITO 2 (MONTAR)
const getEndPoint = (itemID) => fetch(`https://api.mercadolibre.com/items/${itemID}`)
   .then((response) => response.json());
  
  const cartItemClickListener = async (event) => {
  const itens = getSkuFromProductItem(event.target.parentNode);
  const elements = await getEndPoint(itens);
  const arrObj = { sku: elements.id, name: elements.title, salePrice: elements.price };
  // até aqui captura os elementos que vão no objeto 
  
  const insertInCart = createCartItemElement(arrObj);
  document.querySelector('.cart__items').appendChild(insertInCart);
};
  const creatAddList = () => {
  document.querySelector('.items').addEventListener('click', cartItemClickListener);
};

// REQUISITO 1 (MONTAR)
async function getInfo() {
  const elementListItem = document.querySelector('.items');
  const products = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const response = await products.json();
  const res = response.results;

  res.forEach((infoItem) => {
    const listItem = { sku: infoItem.id, name: infoItem.title, image: infoItem.thumbnail };

    // console.log(listItem);
    elementListItem.appendChild(createProductItemElement(listItem));
  }); 
}

window.onload = function onload() {
getInfo();
creatAddList();
};
