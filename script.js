// Crie uma listagem de produtos

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

  const sectionPai = document.querySelector('.items');
  sectionPai.appendChild(section);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// pegando o produto com api do mercado livre
function getProduct() {
    return new Promise((resolve) => {
    let produtos;

    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('.loading').remove(); // tira a frase "carregando" da tela quando a api termina a requisição requisito 7
      console.log(data);
      produtos = data.results;
      produtos.forEach((produto) => createProductItemElement(produto)); 
      resolve();
    }); 
  });  
}
// fim de Crie uma listagem de produtos

// carrinho de compras
// salvar itens do carrinho 
// function salvarItens() {
//   let conteudoOl = document.querySelector('.cart__items').innerHTML; // pego o conteudo do ol
//   localStorage.setItem('lista', conteudoOl); // salvo no storage toda a ol
//   conteudoOl = localStorage.getItem('lista');
// }

// apagar itens do carrtinho
function apagarCart() {
  const btnApagarCart = document.querySelector('.empty-cart');
  btnApagarCart.addEventListener('click', () => {
    const ol = document.querySelector('.cart__items');
    ol.innerHTML = '';
  });
}

// Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  const clicarItem = event.target;
  clicarItem.remove();
}

// somar o preço dos produtos
function soma(price) {
  const p = document.querySelector('.total-price');

  // const arrayLi = document.querySelector('.cart__items').childNodes; // array  com o fillhos da ol 
  // const arrayPreço = [];
  // arrayLi.forEach((li) => {
  //   const conteudoLi = li.innerText;
  //   const valor = conteudoLi.split('$');
  //   arrayPreço.push(valor[1]);
  // });

  const total = {
    prices: [],
  };
  total.prices.push(price); // o valor price é acumulado dentro do objeto a cada vez que a função é chamada

  const valorTotal = total.prices.reduce((acc, item) => acc + item, 0);

  p.innerText = `PREÇO: ${valorTotal}`;
}

// Crie uma listagem de produtos no cart
// crio os elementos html / adiciono o produto ao carrinho de compras
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  soma(price);
}

// pego o conteudo do produto especifico pela api com o id do produto especifico
function getItem(id) {
  let itemAdd;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      itemAdd = data;
      createCartItemElement(itemAdd);
    });
}

// uso essa função para buscar o conteudo do id do produto especifico
function getIDFromProductItem(item) {
  const iditem = item.querySelector('span.item__sku').innerText;
  return getItem(iditem);
}

// função para cliclar no botão e pegar o conteudo especifico desse clique
function clickAddToCart() {
  apagarCart(); // chamo a função de esvaziar o carrinho aqui, pois só posso apagar os intens depois que eles "existirem"
  // salvarItens(); // chamo a função de salvar intens do carrinho aqui, pois só posso salvar os intens depois que eles "existirem"
  const btnAddToCart = document.querySelectorAll('.item__add');
  btnAddToCart.forEach((index) => {
      index.addEventListener('click', (event) => {
      const clicarBtn = event.target.parentNode; // estou pegando o elemnto pai do botão, ou seja, o elemento todo
      getIDFromProductItem(clicarBtn);
    });
  });
}
// fim de crie uma listagem de produtos no cart
// fim carrinho de compras

// onload
window.onload = function onload() {
  // getProduct()
  //   .then(() => clickAddToCart()); // crio uma promisse dentro de get product pois só posso chamar o clickAddToCart() depois que o getPtoduct foir "resolvidos" 

    const execute = async () => {
      try {
        await getProduct();
        await clickAddToCart();
        // await soma();
      } catch (error) {
        console.log(error);
      } 
    };
    execute();
};