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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Requisito 01
async function getInfoProduct() {
  const objResults = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json()).then((data) => data.results);
  
  const sectionItems = document.querySelector('.items');
  
  objResults.forEach((result) => {
    const computerInfos = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(computerInfos));
  });
}
function addToCart() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentClick = event.target.parentElement;
      const IdProduct = getSkuFromProductItem(parentClick);
        fetch(`https://api.mercadolibre.com/items/${IdProduct}`)
        .then((response) => response.json())
        .then((data) => {
          const obj = {
            sku: data.id, 
            name: data.title, 
            salePrice: data.price,
          };
          const cartItem = document.querySelector('.cart__items');
          cartItem.appendChild(createCartItemElement(obj));
        });
    }
  });
}

window.onload = function onload() {
  getInfoProduct();
  addToCart();
 };