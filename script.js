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
 
 // Requisito 5:
 async function totalAPagar() {
  const calcResult = document.querySelector('.total-price');
  const item = document.querySelectorAll('.cart__item');
  let calc = 0;
  for (let index = 0; index < item.length; index += 1) {
    calc += parseFloat(item[index].innerText.split('$')[1]);
  }
  const valueResult = Math.fround(calc).toFixed(2);
  const result = valueResult;
  calcResult.innerHTML = result;
} 
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
 save();
 totalAPagar();
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

// Requisito 7:
 function loadingInit() {
  const items = document.querySelector('.items');
  items.appendChild(createCustomElement('span', 'loading', 'loading...'));
}

//  
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
      // 
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
        totalAPagar();
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
    totalAPagar();
  });
}
// ----------------------------------------------------------------------------------------------
 // Requisito 7:
//  function loadingInit(onOff) {
//       const items = document.querySelector('.items');
//     items.appendChild(createCustomElement('span', 'loading', 'loading...'));
//   }
// }

window.onload = function onload() {
  criaLista();
  colocaItemNoCarrinho();
  save();
  limpaCarrinho();
  totalAPagar();
  loadingInit();
};