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
//-------------------------------------------------------------------------------------------------
// Requisito 4:
function save() {
  const carrinho = document.getElementById('listaCarrinho').innerHTML;
  localStorage.setItem('cart', carrinho);
  }
  
// ---------------------------------------------------------------------------------------------
// Requisito 3:
function cartItemClickListener(event) {
const elementoPai = event.target.parentElement;
elementoPai.removeChild(event.target);  
// save();
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
    .then((data) => data.results.forEach((produto) => {
      const prodObj = {
        sku: produto.id,
        name: produto.title,
        image: produto.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(prodObj));
    }));
}

// --------------------------------------------------------------------------------------------
// Requisito 2:
function colocaItemNoCarrinho() {
  document.querySelector('.items').addEventListener('click', 
    (event) => {
       if (event.target.classList.contains('item__add')) {
        const sku = getSkuFromProductItem(event.target.parentElement);
        fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((response) => response.json())
        .then((data) => {
          const carObj = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,     
          };
        document.querySelector('.cart__items').appendChild(createCartItemElement(carObj));
        save();
        });
      }
    });
}

//---------------------------------------------------------------------------------------------
// Requisito 6:
function limpaCarrinho() {
    document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    save();
  });
}
// ----------------------------------------------------------------------------------------------
// Requisito 5:
const totalAPagar = async () => {
  const total = document.querySelector('.total-price');
  const carrinho = document.querySelectorAll('.cart__item');
  let sum = 0;
  for (let i = 0; i < carrinho.length; i += 1) {
    sum += parseFloat(carrinho[i].innerText.split('$')[1]);
  }
  const totalFinal = Math.fround(sum).toFixed(2);
  const result = `Valor à pagar: $ <strong>${totalFinal}</strong>`;
  total.innerHTML = result;
  //  
};
  
window.onload = function onload() {
  criaLista();
  colocaItemNoCarrinho();
  save();
  limpaCarrinho();
  totalAPagar();
};