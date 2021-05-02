// Agradecimento especial ao Rafael Dorneles - T10 - Tribo A- por todo incentivo e auxílio neste projeto. :)
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
// //-------------------------------------------------------------------------------------------------

// Requisito 5:
 const totalAPagar = async () => {
  const listaCarrinho = document.querySelectorAll('li.cart__item');
  const precoFinal = Array.from(listaCarrinho).reduce((total, item) => {
    const priceIndex = item.innerText.lastIndexOf('PRICE');
    return (total + Number(item.innerText.substr(priceIndex + 8)));
  }, 0);
  const priceSpan = document.querySelector('span.total-price');
  priceSpan.innerText = precoFinal;
};
      
// ---------------------------------------------------------------------------------------------
const getCartItems = () => document.querySelector('ol.cart__items');
const save = () => {
  localStorage.setItem('cart', getCartItems().innerHTML);
  totalAPagar();
};
// Requisito 3:
function cartItemClickListener(event) {
  const elementoPai = event.target.parentElement;
  elementoPai.removeChild(event.target);
  totalAPagar();
  save();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Adicione o elemento retornado da função createProductItemElement(product) como filho do elemento <section class="items">.

// Obs: as variáveis sku, no código fornecido, se referem aos campos id retornados pela API.

// Requisito 1:
function criaLista() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((produto) => {
        const prodObj = {
          sku: produto.id,
          name: produto.title,
          image: produto.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(prodObj));
        save();
      });
    });
}
 
// --------------------------------------------------------------------------------------------
// Requisito 2:
function colocaItemNoCarrinho() {
  document.querySelector('.items').addEventListener('click',
    (event) => {
      if (event.target.classList.contains('item__add')) {
        const sku = getSkuFromProductItem(event.target.parentElement);
        fetch(`https://api.mercadolibre.com/items/${sku}`).then((response) => response.json())
          .then((data) => {
            const carObj = {
              sku: data.id,
              name: data.title,
              salePrice: data.price,
            };
            document.querySelector('ol.cart__items').appendChild(createCartItemElement(carObj));
            totalAPagar();
            save();
          });
      }
    });
}

//---------------------------------------------------------------------------------------------

// Requisito 6:
function limpaCarrinho() {
  const cart = document.querySelector('.cart__items');
  document.querySelector('.empty-cart').addEventListener('click', () => {
    cart.innerHTML = '';
    totalAPagar();
    save();
  });
}

function load() {
  const localStorageCart = localStorage.getItem('cart'); 
  document.querySelector('.cart__items').innerHTML = localStorageCart;
}

// // ---------------------------------------------------------------------------------------------

window.onload = function onload() {
 load();
  criaLista();
  colocaItemNoCarrinho();
  limpaCarrinho();
  totalAPagar();
};