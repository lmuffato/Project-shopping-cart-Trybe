function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

// Realizado com ajuda do Zezé, Adelino, Orlando Flores, Thiago Souza, Lucas Lara, Nathi, Nilson, Tiago Santos

function createProductList(computerData) {
  let computers = {};
  const computerSection = document.querySelector('.items');
  computerData.forEach((computer) => {
    computers = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    computerSection.appendChild(createProductItemElement(computers));
  });
}

async function getComputers() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const computerData = data.results;
  createProductList(computerData);
}

// function getSkuFromProductItem(item) {
//  return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
  // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//  const li = document.createElement('li');
//  li.className = 'cart__item';
//  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//  li.addEventListener('click', cartItemClickListener);
//  return li;
// }

window.onload = function onload() {
  getComputers();
};
