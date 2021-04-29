const listProducts = async () => {
  const item = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
};

const clear = (itens) => {
  const vars = document.querySelector('.empty-cart');
  vars.addEventListener('click', () => {
  itens.forEach((current) => current.remove()); 
  });
};

function cartItemClickListener(event) {
  const item = event.target;
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

// function total() {

// }

// Cria o LocalStorage dos carrinhos

const local = (prods) => {
  window.localStorage.setItem('keys', JSON.stringify(prods));
 const result = JSON.parse((window.localStorage.getItem('keys')));

 const addCart = createCartItemElement(result); 
 document.querySelector('.cart__items').appendChild(addCart);
};

async function eventClick(event) {
  const produtos = await listProducts(); // Pega todos os produtos
  const filho = event.target; // classe clicada
  const pai = filho.parentNode; // classe pai do filho
  const sku = pai.querySelector('.item__sku').innerText; // classe que tem o ID do produto
  
  produtos.forEach((element) => {
    if (element.id === sku) {
    const prods = {
   sku: element.id,
   name: element.title,
   salePrice: element.price,
   };
    local(prods);
    const result = document.querySelectorAll('.cart__item');
    clear(result);
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

// Cria o Loading

const load = () => {
  if (listProducts()) {
    const loading = document.querySelector('.loading');
    loading.remove();
  }
};

window.onload = function onload() {
  load();
  getProducts();
  listProducts();
  
  // pushElement();
};