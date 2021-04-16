const arrayItems = JSON.parse(localStorage.getItem('li')) || [];
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
  document.querySelector('.items').appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
 function cartItemClickListener(event) {
  event.target.remove();
} 
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  arrayItems.push(li.textContent);
  localStorage.setItem('li', JSON.stringify(arrayItems));
  document.querySelector('.cart__items').appendChild(li);
   li.addEventListener('click', cartItemClickListener);
  return li;
}
function fetchCartItem() {
  const btns = document.querySelectorAll('.item__add');
  if (btns.length > 0) {
    btns.forEach((btn) => {
      btn.addEventListener('click', (event) => {
       const itemSection = event.target.parentNode;
       const itemChildren = itemSection.children;
        const searchId = [...itemChildren];
       const idElement = searchId.find((element) => element.className === 'item__sku');
       const id = idElement.textContent;
       fetch(`https://api.mercadolibre.com/items/${id}`)
       .then((response) => {
        response.json().then((product) => {
          createCartItemElement(product);
        });
       });
      });
    });
  }
} 

function fetchItem() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach((result) => {
          createProductItemElement(result);
        });
        fetchCartItem();
      });
    });
}
function storageList() {  
  arrayItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = item;
    document.querySelector('.cart__items').appendChild(li);
  });
}

 /* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */
window.onload = function onload() { 
  fetchItem();
  storageList();
};