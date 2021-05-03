// FUNCÃO ORIGINAL
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// FUNCÃO ORIGINAL
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// FUNCÃO ORIGINAL
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  // console.log(sku, name, image);
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

const itensDoCarrinhoDOM = '.cart__items';

const salvarNoLocalStorage = () => {
  const carrinho = document.querySelector(itensDoCarrinhoDOM); // O endereço da ol
  localStorage.setItem('itensCarrinho', carrinho.innerHTML);// Adiciona todo o html do ol no localStorage
};

function carregarLocalStorage() {
  document.querySelector(itensDoCarrinhoDOM).innerHTML = localStorage.getItem('itensCarrinho');
}

// // FUNCÃO ORIGINAL, PORÉM NÃO UTILIZADA
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function somarItensDocarrinho() {
const nodeListDeProdutos = document.querySelectorAll('.cart__items li');// nodeList com o array de produtos do carrinho
let valorTotalDoCarrinho = 0; // valor inicial do produto
nodeListDeProdutos.forEach((produto) => { // soma todos os produtos recuperando o valor numerico do preço de cada um
  valorTotalDoCarrinho += parseFloat(produto.innerText.split('$')[1]); // Pega o item index=1, do array criado pela separação da string pelo $
});
document.querySelector('span.total-price span') // Captura o endereço onde o valor será colocado
.innerText = valorTotalDoCarrinho; // Insere o valor no span indicado
console.log(valorTotalDoCarrinho); // Apenas teste - Valor total do carrinho
}

// FUNCÃO ORIGINAL - Remove o item ao clicar no produto dentro do carrinho
function cartItemClickListener(event) {
  event.target.remove(); // Remove o item clicado
  salvarNoLocalStorage(); // Salva no local Storage
  somarItensDocarrinho(); // Atualiza a soma do carrinho
}

function adicionarEventoAosItensDoCarrinho() {
  const itensDoCarrinho = document.querySelectorAll(itensDoCarrinhoDOM); // pega o array de elementos da lista
  itensDoCarrinho.forEach((item) => { item.addEventListener('click', cartItemClickListener); }); // adiciona evento a todos os elementos do array
}

// FUNCÃO ORIGINAL
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  // console.log(sku, name, salePrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function esvaziarCarrinho() {
  document.querySelector('.cart__items').innerHTML = ''; // anula o HTML dos itens (mesmo efeito de remover)
  salvarNoLocalStorage();
  somarItensDocarrinho();
}

async function AdicionarProdutoNoCarrinho(produtoid) {
  const id = await produtoid.target.parentNode.firstChild.innerText; // pega o id do produto clicado
  const data = await fetch(`https://api.mercadolibre.com/items/${id}`); // consulta o id na api do mercado livre
  const response = await data.json(); // transforma a requisção no formato json()
  document.querySelector(itensDoCarrinhoDOM).appendChild(createCartItemElement(response)); // Adiciona o produto no carrinho
  salvarNoLocalStorage();
  somarItensDocarrinho();
  // console.log(response); // Apenas pra teste
}

// Adiciona os produtos e os eventos dos produtos
const listarProdutos = (data) => {
  const sectionItens = document.querySelector('section.items'); // Captura o endereço do section.items no html
  data.results.forEach((result, index) => { // HOF pra adicionar o evento a todos os elementos listados
    sectionItens.appendChild( // Adiciona o elemento
      createProductItemElement(result),
    );
    document.querySelectorAll('.item__add')[index] // recupera o endereço do item clicado
    .addEventListener('click', AdicionarProdutoNoCarrinho);// Adiciona o evento no botão clicar em cada produto
  });
};

// REQUISIÇÃO DA API DO MERCADO LIVRE
async function pesquisarProduto() {
const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador}');// Faz a requisição dos dados a API do mercado livre
const listaDeProdutos = await response.json();
document.querySelector('span.loading').remove(); // Remove o texto de loading
listarProdutos(listaDeProdutos); // aplica  aresposta organizada na função setAddress
}

// pesquisarProduto(); // chama a função de requisitar a lista de produtos

// Funções carregadas quando a página é carregada
window.onload = function onload() { 
  document.querySelector('.empty-cart').addEventListener('click', esvaziarCarrinho); // Adiciona o evento ao botão de esvaziar o carrinho
  pesquisarProduto();
  carregarLocalStorage(); // carrega o local storage
  adicionarEventoAosItensDoCarrinho(); // Adiciona os eventos ao carrinho assim que a página é carregada
  somarItensDocarrinho(); // soma os itens do carrinho
  };

// REQUISITO 1
// 1. fetch -> dados -> array -> forEach (tratamento do arrat -> createProductItemElement() )

  // Requisito 2
  // 1. addEventListner - > identificar o item clicado -> captura as informações
  //  -> pega o ID -> fecth -> tratar objeto -> createCartItemElement(obejto)

  // Requisito 3
  // 1. addEventListner - > identificar o item clicado -> excluir da lista

  // Requisito 4
  // Salvar carrinho no localStorage e atualizar em cada evento

  // Requisito 5
  // Usar métodos assincronos para o somar o valor

  // Requisito 6
  // botão pra excluir os li

  // Requisito 7
  // Adicionar texto de load durante a requisição da api
  // Esperar a página inteira