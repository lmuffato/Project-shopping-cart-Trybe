// Nota mental para eu do Futuro: usar Promise e tratar os dados em outra função async
// Nota mental para eu do Futuro: setItem salva, getItem coloca no localStorage

const literal3times = '.cart__items';

function SaveLocalStorage() {
  localStorage.setItem('cartItens', document.querySelector(literal3times).innerHTML);
}

// CART ITEM é os do Carrinho de compra!
function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function productClickListener(event) {
  const item = event.target.parentNode;
  const idItem = getSkuFromProductItem(item);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((resolve) => resolve.json())
    .then((data) => {
      const skuEvent = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const itemSelect = document.querySelector(literal3times);
      itemSelect.appendChild(createCartItemElement(skuEvent));
      SaveLocalStorage();
      console.log(localStorage);
    });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', productClickListener);
  return section;
}

function clearCart() {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    const emptyCart = document.querySelector('.cart__items');
    emptyCart.innerHTML = '';
  });
}

const fetchProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const compuiter = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
          salePrice: element.price };
        // Depois de 3 dias descobri que era aqui que eu puxava a criação dos elementos
        document.querySelector('.items').appendChild(createProductItemElement(compuiter));
        });
    });
  };
  
window.onload = async () => {
  await fetchProducts();
  clearCart();
};

// Não foi necessário já que o projeto pede para fazer outro endpoint no futuro
// const products = async () => {
//   const data = await fetchProducts();
//   // console.log(data);
//   data.forEach((element) => {
//     const compuiter = {
//       sku: element.id,
//       name: element.title,
//       image: element.thumbnail,
//       salePrice: element.price };
//     document.querySelector('.items').appendChild(createProductItemElement(compuiter));
//   });
// };
