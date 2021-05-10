const spanPrice = document.querySelector('.price');
const chave = 'key';

const aumentarPreço = async (price) => {
  spanPrice.innerText = (parseFloat(spanPrice.innerText) + price).toFixed(2);
};

const diminuirPreço = async (price) => {
  spanPrice.innerText = (parseFloat(spanPrice.innerText) - price).toFixed(2);
};

const removeLStorage = async (item) => {
  let carrinho = await JSON.parse(localStorage.getItem(chave));
  if (carrinho !== null) {
    carrinho.forEach((element, index) => {
      if (element === item) {
        carrinho.splice(index, 1);
      }
    });
  } else {
    carrinho = [];
  }
  localStorage.setItem(chave, JSON.stringify(carrinho));
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

async function cartItemClickListener(event) {
  const { id } = event.target.dataset;
  event.target.remove();
  removeLStorage(id);
  const fetcH = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const data = await fetcH.json();
  const dataItem = await data;
  diminuirPreço(dataItem.price);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.dataset.id = sku;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemId = async (event) => {
  const id = event.target.parentNode;
  const fetcH = await fetch(`https://api.mercadolibre.com/items/${id.dataset.id}`);
  const data = await fetcH.json();
  const dataItem = await data;
  const cartItem = document.querySelector('.cart__items');
  cartItem.appendChild(createCartItemElement(dataItem));
  await addLStorage(id.dataset.id);
  aumentarPreço(dataItem.price);
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.dataset.id = sku;
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', getItemId);
  section.appendChild(button);

  return section;
}

const addLStorage = async (item) => {
  let carrinho = await JSON.parse(localStorage.getItem(chave));
  if (carrinho !== null) {
    carrinho.push(item);
  } else {
    carrinho = [item];
  }
  localStorage.setItem(chave, JSON.stringify(carrinho));
};


/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

async function getDataAPIML(query) {
  const fetcH = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const fetchedObj = await fetcH.json();
  const itemList = document.querySelector('.items');
  fetchedObj.results.forEach((item) => {
    const newItem = createProductItemElement(item);
    itemList.appendChild(newItem);
  });
}

const loadCart = async () => {
  const carrinho = await JSON.parse(localStorage.getItem(chave));
  if (carrinho !== null) { 
    const fetcH = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await fetcH.json();
    const dataItem = await data;
    const carro = carrinho.map((id) => dataItem);
    await Promise.all(carro).then((itens) => {
      itens.forEach((item) => {
        const cartItem = document.querySelector('.cart__items');
        cartItem.appendChild(createCartItemElement(item));
      });
    });
  }
};

const loadingCart = async () => {
  const carrinho = await JSON.parse(localStorage.getItem(chave));
  if (carrinho !== null) { 
    const fetcH = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await fetcH.json();
    const dataItem = await data;
    const carro = carrinho.map((id) => dataItem);
      await Promise.all(carro).then((itens) => {
        itens.forEach((item) => {
          const total = parseFloat(getPrice.innerText) + item.price;
          spanPrice.innerText = total;
        });
      });
    }getPrice
};

window.onload = async function onload() {
 getDataAPIML('computador');
 await loadCart();
 await loadingCart();
};