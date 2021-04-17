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

const getSectionItems = () => {
  const sectionItems = document.querySelectorAll('.cart__items');
  return sectionItems;
};

const storageCartShop = () => {
  getSectionItems().forEach((item) => localStorage.setItem('cartShop', item.innerHTML));
};

const loadCartShop = () => {
  getSectionItems().forEach((item) => {
    const itemLoad = item;
    itemLoad.innerHTML = localStorage.getItem('cartShop');
  });
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const listItem = event.target;
  listItem.outerHTML = '';
  storageCartShop();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getCartItems = ((listCart) => {
  const { id, title, price } = listCart;
  const cartObj = {
    sku: id,
    name: title,
    salePrice: price,
  };
  const sectionCart = document.querySelector('.cart__items');
  sectionCart.appendChild(createCartItemElement(cartObj));
  storageCartShop();
});

const getFetchId = (idElement) => {
  fetch(`https://api.mercadolibre.com/items/${idElement}`)
    .then((response) => {
      response.json().then((data) => {
        getCartItems(data);
      });
    });
};

document.addEventListener('click', ((event) => {
  let parental = '';
  let firstChild = '';
  if (event.target.classList.contains('item__add')) {
    parental = event.target;
    firstChild = parental.parentNode.firstChild.innerText;
    return getFetchId(firstChild);
  }
}));

const getListItems = ((listItem) => {
  const { results } = listItem;
  results.forEach((result) => {
    const itensObj = {
      sku: result.id,
      name: result.title,
      image: result.thumbnail,
    };
    const sectionItem = document.querySelector('.items');
    sectionItem.appendChild(createProductItemElement(itensObj));
  });
});

const getListProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        getListItems(data);
      });
    });
};

window.onload = function onload() {
  getListProducts();
  loadCartShop();
};