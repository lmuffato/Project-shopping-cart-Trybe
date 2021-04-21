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

const fetchProduto = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json().then((data) => data.results.forEach((produto) => {
      const objProduct = {
        sku: produto.id,
        name: produto.title,
        image: produto.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(objProduct));
    }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {

// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const buscaItem = () => {
  document.querySelector('.items').addEventListener('click', 
    (event) => {
      if (event.target.classList.contains('item__add')) {
        const eventProdut = getSkuFromProductItem(event.target.parentElement);
        fetch(`https://api.mercadolibre.com/items/${eventProdut}`)
        .then((response) => {
          response.json().then((data) => {
            const produtCar = {
              sku: data.id,
              name: data.title,
              salePrice: data.price,
          };
            document.querySelector('.cart__items').appendChild(createCartItemElement(produtCar));
          });
        });
      };
    }
  )
};

// const clickAddCar = () => {
//   const buttonEvent = document.querySelectorAll('.item__add');
//   buttonEvent.forEach((button) => button.addEventListener('click', buscaItem));
//   console.log(buttonEvent);
// };

window.onload = function onload() {
  fetchProduto();
  buscaItem();
};