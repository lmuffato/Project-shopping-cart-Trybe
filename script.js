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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

const fetchPcs = () => new Promise((resolve) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
      .then((data) => {
        resolve(data.results);
      });
    });
});

const addProducts = async () => {
  const pcList = await fetchPcs();
  pcList.forEach((pc) => {
    const pcData = [{
    sku: pc.id,
    name: pc.title,
    image: pc.thumbnail,         
    }];
    pcData.forEach((pcItem) => createProductItemElement(pcItem));
  });
};

// function getSkuFromProductItem(item) {
  //         return item.querySelector('span.item__sku').innerText;
  // }
  
  // function cartItemClickListener(event) {}
  
// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//     li.className = 'cart__item';
//     li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//     li.addEventListener('click', cartItemClickListener);
//     return li;
// }
    
window.onload = function onload() { addProducts(); };