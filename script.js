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

const createList = (data) => {
   const dados = data.forEach((element) => {
   const section = document.querySelectorAll('.items')[0];
   section.appendChild(createProductItemElement(element));
   return section;
  });
  return dados;
};

const fetchDataList = () => new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        resolve(data.results);
        console.log(data.results);
      })
        .catch((erro) => {
          reject(erro);
        });
    });
});

fetchDataList();

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  console.log(event);
  const clicar = event.target;
  clicar.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const fetchAdicionar = (itemID) => new Promise((resolve, reject) => {
  fetch(`https://api.mercadolibre.com/items/${itemID}`)
  .then((response) => {
      response.json().then((dados) => {
        const sku = dados.id;
        const name = dados.title;
        const salePrice = dados.price;
        const olElement = document.getElementsByClassName('cart__items')[0];
       olElement.appendChild(createCartItemElement({ sku, name, salePrice }));
      resolve(dados);
    })
      .catch((erro) => {
       reject(erro);
    });
  });
 });
function addEvento() {
  const buttonElement = document.getElementsByClassName('item__add');
   for (let index = 0; index < buttonElement.length; index += 1) {
    buttonElement[index].addEventListener('click', function (e) {
      const btnEle = e.target.parentNode.getElementsByClassName('item__sku')[0];
      console.log(e.target.parentNode.getElementsByClassName('item__sku')[0]);
      return fetchAdicionar(btnEle.innerText);
    });
    }
  }

const assicronas = async () => {
  createList(await fetchDataList());
  await addEvento();
};

window.onload = function onload() { 
  assicronas();
};
