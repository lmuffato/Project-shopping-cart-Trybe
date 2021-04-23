const divItems = document.querySelector('.items');

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

  divItems.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const searchComputers = async () => {
  try {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  // console.log(data.results);
  if (data) {
    const computersArr = data.results;
    computersArr.forEach((computer) => {
      divItems.appendChild(createProductItemElement(computer));
  }); 
  } else {
    divItems.innerHTML = data.error;
       } 
      } catch (err) {
    console.log(err);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  console.log(event);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const pushItem = () => {
  const cartOl = document.querySelector('.cart__items');
  divItems.addEventListener('click', async (event) => {
    try {
      const itemID = getSkuFromProductItem(event.target.parentNode);
      const response = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
      const data = await response.json();
      console.log(data);
      cartOl.appendChild(createCartItemElement(data));
    } catch (err) {
        console.log(err);
    }
  });
}; 

window.onload = function onload() {
  searchComputers();
  pushItem();
 };
