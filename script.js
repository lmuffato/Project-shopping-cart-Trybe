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

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  return ol.appendChild(li);
}
/*
function cartItemClickListener(event) {
  return event.target.remove();
}
*/
const fetchMyCartContainer = () => document.querySelector('ol.cart__items');

/*
const removeCartItem = () => {
  const cartItem = fetchMyCartContainer();
  cartItem.childNodes.forEach((child) => {
    child.addEventListener('click', cartItemClickListener);
  });
};
*/
// Salva o carrinho no local Storage
const saveMyCart = () => {
  const cart = fetchMyCartContainer();
  localStorage.cart = cart.innerHTML;
};

// Recupera o carrinho do local Storage
const getMyCart = () => {
  const cart = fetchMyCartContainer();
  if (typeof Storage !== 'undefined' && localStorage.cart) {
    cart.innerHTML = localStorage.cart;
  }
};

const addToMyCart = (data) => {
  const btns = document.querySelectorAll('.item button');
  btns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const cartContainer = fetchMyCartContainer();
      const addItemstoCart = createCartItemElement(data[index]);
      cartContainer.appendChild(addItemstoCart);
      saveMyCart();
    });
  });
};

// Limpa local Storage
const clearLocalStorage = () => localStorage.clear();

// Remove todos os itens do carrinho
function eraseAll() {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', () => {
    const itensDoCarrinho = fetchMyCartContainer();
    while (itensDoCarrinho.childElementCount > 0) {
      itensDoCarrinho.firstElementChild.remove();
    }
    clearLocalStorage();
  });
}

const productPromise = (productName) => {
  startLoading();
  let products;
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
      .then((response) => {
        response.json().then((data) => { 
          stopLoading();
          products = data.results;
          products.forEach((product) => {
            createProductItemElement(product);
            console.log(product);
          });
          addToMyCart(products);
      });
    });
};
// Função productPromise feita com auxílio do plantão do instrutor Eliezer 

/*
const soma = async () => {
  const totalPrice = document.querySelector('.total-price');
  const itensCarrinho = document.querySelectorAll('.cart__item');
  const valorTotal = itensCarrinho.reduce((prev, value) => {
    prev.price.split('$');
    value.price.split('$');
    return parseFloat(prev.price + value.price);
  });
  totalPrice.innerText = ((Math.round(valorTotal * 100)) / 100);
  return totalPrice;
};
*/
/*
function getSkuFromProductItem(item) {
  return item.querySelector('.item__sku').innerText;
}
*/
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

const fetchProducts = async () => {
  try {
    await productPromise('computador');
  } catch (error) {
    console.log('Fail...');
  }
};

window.onload = function onload() { 
  fetchProducts();
  eraseAll();
  getMyCart();
};