// Requisito 4 - salvando na webstore
function saveOnWebStore() {
  const ItemsOnCart = document.querySelector('.te').nextElementSibling.innerHTML;
  localStorage.setItem('cart', ItemsOnCart);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource.replace('I.jpg', 'O.jpg');
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

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveOnWebStore();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Requisito 01 - Feito com Ajuda de Mutilo Gonçalves e Lucas Pedroso Turma - 10A
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
// Requisito 05
// async function cartTotalPrice() {
//   // const paragraph = document.getElementsByTagName('p');
//   const cartPrice = document.querySelectorAll('.cart__item');
//   let result = 0;
//   cartPrice.forEach((price) => {
//     result += parseFloat(price.innerHTML.split('$')[1]);
//   });
//   // console.log((Math.round(result * 100)) / 100);
//   document.querySelector('.total-price').innerHTML = result;
// }

// Requisito 02 - Exercicício ralizado com o vídeo https://trybecourse.slack.com/archives/C01A9A2N93R/p1608238090190400?thread_ts=1608237982.190300&cid=C01A9A2N93R
function addToCart() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentClick = event.target.parentElement;
      const IdProduct = getSkuFromProductItem(parentClick);
        fetch(`https://api.mercadolibre.com/items/${IdProduct}`)
        .then((response) => response.json())
        .then((data) => {
          const obj = { sku: data.id, name: data.title, salePrice: data.price };
          document.querySelector('.te').nextElementSibling.appendChild(createCartItemElement(obj));
          saveOnWebStore();
        });
    }
  });
}

// requisito 04 - carregando págica com carrinho conhecimentos ** recover Items é ideia de Pollyana Oliveira Turma 10 a
function loadCartFromWebStore() {
  const loadedCart = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = loadedCart;
  const recoverItems = document.querySelectorAll('.cart__item');
 recoverItems.forEach((listItem) => 
 listItem.addEventListener('click', cartItemClickListener));
}

function emptyCart() {
  const totalPrice = document.querySelector('.total-price');
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice.innerHTML = '';
    saveOnWebStore();
  });
}
window.onload = function onload() {
  getInfoProduct();
  addToCart();
  loadCartFromWebStore();
  emptyCart();
 };
