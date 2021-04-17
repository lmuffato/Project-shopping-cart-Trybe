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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

const searchComputers = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
.then((response) => response.json())
.then((data) => data.results)
.then((data) => data.forEach((pc) => {
  const section = document.querySelector('.items');
  section.appendChild(createProductItemElement(pc));
}));

// const syncTest = async () => {
//   const async1 = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
//   const async2 = await async1.json();
//   console.log(async2.results);
//   // console.log(sync3);
// };

// const takeaway = () => {
// searchComputers.forEach((item) => {
// const objComputer = {
//   sku: item.id,
//   name: item.title,
//   image: item.thumbnail,
// };
// document.querySelector('.items').appendChild(createProductItemElement(objComputer));
// });
// };

window.onload = function onload() { 
  searchComputers();
   // syncTest();
};