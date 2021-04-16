window.onload = function onload() { 
  getData('computador');
  clearCart();
};

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
function clearCart() {
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', () => {
    const getProductsList = document.getElementsByTagName('li')
    while (getProductsList.length > 0) {
      getProductsList[0].remove()
    }
  })
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItem(item) {
  const id = item.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resp) => {
    resp.json()
    .then((data) => {
      const addedItem = { 
            sku: data.id, 
            name: data.title, 
            salePrice: data.price, 
          };
      document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(addedItem));
    });
  });
}

 async function getData(product) {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${product}`)
  .then((resp) => {
    resp.json()
    .then((data) => {
      data.results.forEach((item, index) => {
      const resultObj = { 
        sku: item.id, 
        name: item.title, 
        image: item.thumbnail, 
      };
      document.getElementsByClassName('items')[0].appendChild(createProductItemElement(resultObj));
      document.getElementsByClassName('item__add')[index].addEventListener('click', addItem); 
      });     
    });
  });
}

