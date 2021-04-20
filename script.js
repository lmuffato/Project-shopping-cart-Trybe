const cartItems = '.cart__items';

const cartSaving = () => {
const myCart = document.querySelector(cartItems).innerHTML;
localStorage.setItem('cart', myCart);
};

// const createLoading = () => {
//   const loadingText = document.createElement('p');
//   loadingText.classList.add('loading');
//   loadingText.innerHTML = 'loading...';
//   document.querySelector('.items').appendChild(loadingText);
// };

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  const selectCartItem = document.querySelector(cartItems);
  const targetToRemove = event.target;
  selectCartItem.removeChild(targetToRemove);
  cartSaving();
  return event;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const getItemByID = async (itemID) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  const data = await response.json();
  return data;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getButtonsID = async (event) => {
  const cartElements = document.querySelector(cartItems);
    const itemTargeted = getSkuFromProductItem(event.target.parentNode);
    const computer = await getItemByID(itemTargeted);
    const obj = {
      sku: computer.id,
      name: computer.title,
      salePrice: computer.price,
    };
    cartElements.appendChild(createCartItemElement(obj));
    cartSaving();
  };

function createProductItemElement({ sku, name, image }) {
  const selectItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', getButtonsID);
  return selectItems.appendChild(section);
}

const getItem = async () => {
        await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
        .then((response) => response.json()).then((data) => data.results.forEach((pc) => {
            const items = {
                sku: pc.id,
                name: pc.title,
                image: pc.thumbnail,
            };
    createProductItemElement(items);
  }));
  document.querySelector('.loading').remove();
};

const emptyCart = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const selectCartItem = document.querySelector(cartItems);
    selectCartItem.innerHTML = '';
    localStorage.clear();
  });
};

// referência para o localStorage: Rogério Lambert (https://github.com/tryber/sd-010-a-project-shopping-cart/pull/48/files);
// No if, se o local storage tiver algum conteúdo, a lista do carrinho recebe o conteúdo do local storage. O for foi utilizado para
// que a função de remover itens possa ser acionada para os itens do carrinho (ela precisa ser definida posteriormente ao if
// caso contrário não vai ser possível remover os itens do carrinho pois estão sendo atribuídos pelo local storage);

window.onload = function onload() {
  // createLoading();
  getItem();
  const cartContent = document.querySelector(cartItems);
  const storageContent = localStorage.getItem('cart');
  if (storageContent) cartContent.innerHTML = storageContent;
  const liCart = document.getElementsByTagName('li');
  for (let index = 0; index < liCart.length; index += 1) {
    liCart[index].addEventListener('click', cartItemClickListener);
}
  emptyCart();
};
