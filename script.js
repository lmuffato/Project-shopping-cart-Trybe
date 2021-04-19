// função para chama a ol,pois a chamo muita vezes durante o codigo
const ol = '.cart__items';
const pValor = '.total-price';

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
      // console.log(data);
      produtos = data.results;
      produtos.forEach((produto) => createProductItemElement(produto)); 
      resolve();
    }); 
  });  
}
// fim de Crie uma listagem de produtos

// carrinho de compras
// somar preço do carrinho de compras
  function soma() {
    const arrayLi = document.querySelector(ol).childNodes; // array  de li - pego os filhos a ol
  
    let valorTotal = 0;
    arrayLi.forEach((li) => {
      const conteudoLi = li.innerText;
      const valor = conteudoLi.split('$')[1]; // http://devfuria.com.br/javascript/split/ separo a string em duas, uma antes $ e um depois, a depois index[1] só tem o numero que quero
      valorTotal += (parseFloat(valor)); // transformo o numero de string para numero e faço a soma, a cada li pego a variavel valor total e somo ela mesmo com o valor da li atual
    }); 
  
    document.querySelector(pValor).innerText = valorTotal; 
  }

// salvar itens do carrinho 
function salvarItens() {  
  localStorage.setItem('preço', document.querySelector(pValor).innerText); // salvo o preço total (soma) da lista

  const ArrayLi = document.querySelectorAll('.cart__item'); // array de li
  const conteudoCart = [];
  ArrayLi.forEach((li) => conteudoCart.push(li.innerText));// coloco cada conteudo de cada li dentro do array conteudoCart, tendo assum um array de conteudo/strings onde cada index é o conteudo de um li
  localStorage.setItem('compras', conteudoCart); // ao salvar o array no localStoragee vira apenas uma string gigante
}

// apagar itens do carrinho
function apagarCart() {
  const btnApagarCart = document.querySelector('.empty-cart');
  btnApagarCart.addEventListener('click', () => {
    document.querySelector(ol).innerHTML = '';
  });
}

// Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  const clicarItem = event.target;
  clicarItem.remove();
  soma();
  salvarItens();
  // chamo as funções soma e salvarItens aqui também pois quando eu tirar algum intem da lista preciso somar de novo e salvar de novo
}

// carregar itens salvos no localStorage
function carregarItens() {
  document.querySelector(pValor).innerText = localStorage.getItem('preço'); // carrego o preço total (soma) da lista que foi salvo anteriormente

  if (localStorage.compras !== undefined) { // se tiver algo salvo dentro do localStorage 
    const itensSalvos = localStorage.compras.split(','); // separo a string como o conteudo e transformo em um array, onde cada idex do array é o conteudo de uma li

    itensSalvos.forEach((item) => {
      // crio novamente as li igual na função createCartItemElement abaixo 
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      li.addEventListener('click', cartItemClickListener);
      document.querySelector(ol).appendChild(li);
      soma();
      salvarItens();
    });
  }    
}

// Crie uma listagem de produtos no cart
// crio os elementos html/conteudo e adiciono o produto ao carrinho de compras
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector(ol).appendChild(li);
  soma();
  salvarItens();
  // chamo as funções soma e salvar itens aqui, pois só posso chama-las depois que a li do carrinho de compras foi feita
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
  const iditem = item.querySelector('span.item__sku').innerText; // pego o id que está dentro do innetText do elemento
  return getItem(iditem);
}

// função para cliclar no botão e pegar o conteudo especifico desse clique
function clickAddToCart() {
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

window.onload = function onload() {
  // uso o async para pegar as funções assicronas e trasformalas e sincronas, para chama-las em ordem
   const execute = async () => { 
      try {
        await getProduct();
        await clickAddToCart();
        await apagarCart();
      } catch (error) {
        console.log(error);
      } 
    };

    execute();
    carregarItens(); 
};

// para as funções carregarItens(), salvarItens() e soma() tiva a ajuda do Adelino Junior - Turma 10/A