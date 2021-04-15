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

const fetchMyCartContainer = () => document.querySelector('.cart__items');

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  ol.appendChild(li);
  return li;
}

const addToMyCart = (data) => {
  const btns = document.querySelectorAll('.item button');
  btns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const cartContainer = fetchMyCartContainer();
      const addItemstoCart = createCartItemElement(data[index]);
      cartContainer.appendChild(addItemstoCart);
    });
  });
};

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
function cartItemClickListener(event) {
  event.target.remove();
  // btn.addEventListener('click', );
}
function getSkuFromProductItem(item) {
  return item.querySelector('.item__sku').innerText;
}
*/
/*
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
*/

/*
const fetchProduct = async () => {
  try {
    await productPromise();
  } catch (error) {
    console.log(error);
  }
};
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
};