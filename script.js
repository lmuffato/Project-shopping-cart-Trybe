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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const getItemNoCart = event.target;
  getItemNoCart.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

function promiseListaDeProdutos() {
  const getClassItems = document.querySelector('.items');
  let recebeFunc;
  return new Promise(() => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((data) => {
        data.results.forEach((element) => {
        recebeFunc = createProductItemElement(element);
          getClassItems.appendChild(recebeFunc); 
        });  
      });
  });
}

const acaoDoBotaoAddNoCarrinho = (getIdDoItem) => 
   new Promise(() => {
   fetch(`https://api.mercadolibre.com/items/${getIdDoItem}`)
     .then((response) => { 
      response.json()
     .then((data) => {
       const obj = createCartItemElement(data);
       const ol = document.querySelector('.cart__items');
       ol.appendChild(obj); 
     });
   });
 });      
 
function adcionaProdutoNoCarrinho() {
  const getSection = document.querySelectorAll('.items');
  getSection.forEach((element) => {
   element.addEventListener('click', (event) => {
     const getButton = document.querySelectorAll('.item__add');
     getButton.forEach((buttonAdd) => {
    if (event.target === buttonAdd) {
      const getBotaoAddInteiro = event.target.parentNode;
      const recebeId = getSkuFromProductItem(getBotaoAddInteiro);
      acaoDoBotaoAddNoCarrinho(recebeId); 
    }
  });
   });
});
}

const botaoLimparCart = () => {
  const getClassButtonClear = document.querySelector('.empty-cart');
  const getListaDeCompras = document.querySelector('.cart__items');

  getClassButtonClear.addEventListener('click', (event) => {
    if (event.target === getClassButtonClear) {
      getListaDeCompras.innerHTML = '';
    }  
  });
};

window.onload = function onload() { 
  promiseListaDeProdutos();
  adcionaProdutoNoCarrinho(); 
  botaoLimparCart();
};
