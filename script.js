const listProducts = async () => {
  const item = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

function cartItemClickListener(event) {
  const item = event.target;
  // const clearItem = document.querySelector(item);
  item.remove();
 }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

async function eventClick(event) {
  const produtos = await listProducts();
  const filho = event.target;
  const pai = filho.parentNode;
  const sku = pai.querySelector('.item__sku').innerText;  
  console.log(produtos);
  produtos.forEach((element) => {
    if (element.id === sku) {
    const prods = {
   sku: element.id,
   name: element.title,
   salePrice: element.price,
   };
   const item = createCartItemElement(prods);
   document.querySelector('.cart__items').appendChild(item); 
  }
   });
}

function createProductItemElement({ sku, name, image }) {
   const section = document.createElement('section');
   section.className = 'item';

   section.appendChild(createCustomElement('span', 'item__sku', sku));
   section.appendChild(createCustomElement('span', 'item__title', name));
   section.appendChild(createProductImageElement(image));
   const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
   btn.addEventListener('click', eventClick);
   section.appendChild(btn);
   
   return section;
  }

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function getProducts() {
  const produtos = await listProducts();
  produtos.forEach((element) => {
    const prods = {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
    };
    const item = createProductItemElement(prods);
    document.querySelector('.items').appendChild(item);
  });
}

async function pushItem() {
  const produtos = await listProducts();
  produtos.forEach((element) => {
    const prods = {
      sku: element.id,
      name: element.title,
      salePrice: element.price,
    };
    createCartItemElement(prods);
  });
}

// const pushElement = () => {
//   const button = document.querySelector('.item_add');
//   button.addEventListener('click', (a) => {
//     console.log(a.target);
//   })
// }

window.onload = function onload() {
  getProducts();
  listProducts();
  pushItem();
  // pushElement();
};