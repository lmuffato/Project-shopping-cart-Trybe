const elementos = () => {
  const ul = document.querySelector('.cart__items');
  const priceOne = document.querySelector('.total-price');
  return { ul, priceOne };
};
const { ul, priceOne } = elementos();

const sum = (acc, elemento) => {
  const array = elemento.innerText.split('$');
  const preco = Number(array[1]);
  const total = acc + preco;
  return total;
};

const upPreco = async () => {
  const itens = document.querySelectorAll('li.cart__item');
  const precoTotal = [...itens].reduce(sum, 0);
  priceOne.innerText = precoTotal;
};

const upLocalStorage = async () => {
   localStorage.setItem('cart', ul.innerHTML);
    localStorage.setItem('valuesCart', priceOne.innerHTML);
};

function cartItemClickListener(event) {
  const eventlist = event.target;
  eventlist.remove();
  upPreco();
  upLocalStorage();
}

const recupera = () => {
  if (localStorage.getItem('cart')) {
    const valouesrecuperado = localStorage.getItem('cart');
    ul.innerHTML = valouesrecuperado;
    const recuperclass = document.querySelectorAll('.cart__item');
    recuperclass.forEach((elemento) => {
      elemento.addEventListener('click', cartItemClickListener);
    });
  }
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getIdFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const listagem = async () => {
const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
const json1 = await api.json();
return json1.results;
};

const addItem = async () => {
const obj = await listagem();
const items1 = document.querySelector('.items');
  obj.forEach((elemento) => {
  const filho = createProductItemElement(elemento);
    items1.appendChild(filho);
  }); 
};

const apiCart = async (id) => {
  const api1 = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const json2 = await api1.json();
  return json2;
};

const addItem1 = () => {
  document.querySelectorAll('.item__add')
    .forEach((element) => element.addEventListener('click', async (button) => {
      const objCart = await apiCart(getIdFromProductItem(button.target.parentNode));
      createCartItemElement(objCart);
      const li = document.querySelector('.cart__items');
      li.appendChild(createCartItemElement(objCart));
      upPreco();
      upLocalStorage();
    }));
};

const limpCart = () => {
const limpButton = document.querySelector('.empty-cart');
limpButton.addEventListener('click', () => {
  ul.innerText = '';
  priceOne.innerText = 0;
  upLocalStorage();
  });
};

window.onload = async function onload() {
 await addItem();
 await addItem1();
 await recupera();
 limpCart();
 };
 
/* const bttonAddItem = () => {
  const addInCart1 = [...document.querySelectorAll('.item__add')];
  addInCart1.forEach((elemetButton) => {
    elemetButton.addEventListener('click', (event) => {
      const idOfComputer = getIdFromProductItem(event.target.parentElement);
      apiCart(idOfComputer);
    });
  });
}; */
 
/* const buttinClickCart = async () => {
  const capTEdvent = document.querySelectorAll('.item__add');
  capTEdvent.forEach((parametro) => parametro
    .addEventListener('click', async () => {
      try {
        const data = await apiCart(getIdFromProductItem(getIdFromProductItem(parametro.parentNode));
        ul.appendChild(createCartItemElement(data));
        )
      }
    }))
}
*/