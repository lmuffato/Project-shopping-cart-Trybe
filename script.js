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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

// Requisito 4
const classCartItems = '.cart__items';

const updateLocalStorage = () => {
  const cart = document.querySelector(classCartItems);
  localStorage.setItem('cartList', cart.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage();
}

const loudLocalStorage = () => {
  const cart = document.querySelector(classCartItems);
  cart.innerHTML = localStorage.getItem('cartList');
  const cartLi = document.querySelectorAll('.cart__item');
  const arrayLi = [...cartLi];
  arrayLi.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  console.log(arrayLi);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const fetchProtucts = () => {
//   const itens = document.querySelector('.items');
//   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//     .then((response) => response.json())
//     .then((data) => {
//       const pcsList = data.results;
//       pcsList.forEach((pc) => {
//         const pcsObjects = {
//           sku: pc.id,
//           name: pc.title,
//           image: pc.thumbnail,
//         };
//         itens.appendChild(createProductItemElement(pcsObjects));
//         console.log(pcsObjects);
//       });
//       });
//     };

// Requisito 1
const fetchProtucts = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  const pcList = data.results;
  const section = document.querySelector('.items');

  pcList.forEach((itens) => {
    section.appendChild(createProductItemElement(itens));
  });
};

// Requisito 2
const addItensToCart = () => {
  const itemAdd = document.querySelectorAll('.items');
  const cart = document.querySelector(classCartItems);

  itemAdd.forEach((item) => {
    item.addEventListener('click', async (event) => {
      const id = getSkuFromProductItem(event.target.parentNode);
      const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
      const data = await response.json();
      const cartItem = createCartItemElement(data);
      cart.appendChild(cartItem);
      updateLocalStorage();
      console.log(data);
    });
  });
};

window.onload = () => {
  fetchProtucts();
  addItensToCart();
  loudLocalStorage();
};
