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
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function startLoading() {
  const loading = document.createElement('h1');
  loading.classList.add('loading');
  loading.textContent = 'loading...';
  const appendBody = document.body.appendChild(loading);
  return appendBody;
}

const stopLoading = async () => {
  const loadingItem = document.querySelector('.loading');
  loadingItem.remove();
};

const productPromise = () => {
  startLoading();
  let products;
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => {
        response.json().then((data) => { 
          stopLoading();
          products = data.results;
          products.forEach((product) => {
            createProductItemElement(product);
            console.log(product);
          });
      });
    });
};

const fetchProduct = async () => {
  try {
    await productPromise();
  } catch (error) {
    console.log(error);
  }
};

// Limpar local storage
// function clearLocalStorage() {
//  localStorage.clear();
// }

// Remover todos os itens do carrinho
// const itensDoCarrinho = document.querySelector('.cart__items');
// function eraseAll() {
//  while (itensDoCarrinho.childElementCount > 0) {
//  itensDoCarrinho.firstElementChild.remove();
//  }
//  clearLocalStorage();
// }
// const btnEmptyCart = document.querySelector('.empty-cart');
// btnEmptyCart.addEventListener('click', eraseAll);

// salva os itens do carrinho no Local Storage
// function saveMyCart() {
//   localStorage.itensDoCarrinho = itensDoCarrinho.innerHTML;
// }
// const btnAddToCart = document.querySelector('.item__add');

// if (typeof Storage !== 'undefined' && localStorage.itensDoCarrinho) {
//  itensDoCarrinho.innerHTML = localStorage.itensDoCarrinho;
// }

/*
const searchItemId = (id) => {
  // const itemss = document.querySelectorAll('.item');
  // itemss.forEach((item) => {
  //   item.id
 //  });
  let itemsId;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
    response.json()
    .then((data) => {
      itemsId = data.id;
      itemsId.forEach((itemId) => {
        return itemId;
      });
    });
  });
};

function cartItemClickListener(event) {
  event.target(getItem());
  // btn.addEventListener('click', );
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  ol.appendChild(li);
  const btn = document.querySelector('.item .item__add');
  btn.addEventListener('click', cartItemClickListener); 
  return li;
}
*/
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/
window.onload = function onload() { 
  fetchProduct();
  // btnAddToCart.addEventListener('click', saveMyCart);
};