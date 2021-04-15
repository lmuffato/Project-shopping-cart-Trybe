// const { default: fetch } = require('node-fetch');

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
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function pcList() {
  let pcData;
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json()
    .then((data) => {
      pcData = data.results;
      pcData.forEach((pc) => {
        createProductItemElement(pc);
      });
    });
  });
}

async function pcPromise() {
  try {
    pcList();
  } catch (error) {
    console.log(error);
  }
} 

// function getSkuFromProductItem(item) {
  //         return item.querySelector('span.item__sku').innerText;
  // }
  
  // function cartItemClickListener(event) {}
  
  // function createCartItemElement({ sku, name, salePrice }) {
    //   const li = document.createElement('li');
    //   li.className = 'cart__item';
    //   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    //   li.addEventListener('click', cartItemClickListener);
    //   return li;
    // }
    
    window.onload = function onload() { pcPromise(); };