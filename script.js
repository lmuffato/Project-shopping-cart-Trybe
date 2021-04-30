// Cria a imagem de cada produto
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria um elemento na página de forma customizada
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Cria o produto na página, com base nos dados extraídos da API
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Itera os dados e cria objeto para passar à função createProduct, melhora resolução das imagens dos produtos (dica do colega Renzo Sevilha)
const iterandoMeusDados = (dados) => {
  dados.forEach((dado) => {
    const image = `https://http2.mlstatic.com/D_NQ_NP_${dado.thumbnail_id}-O.webp`;
    const objt = { id: dado.id, title: dado.title, thumbnail: image };
    createProductItemElement(objt);
  });
};

// Cria o texto com classe .loading na página para aparecer antes da requisição de dados da API
function startLoading() {
  const loading = document.createElement('h1');
  loading.classList.add('loading');
  loading.textContent = 'loading...';
  const loader = document.createElement('div');
  loader.className = 'loader';
  document.body.appendChild(loading);
  loading.appendChild(loader);
}

// Remove o elemento de classe .loading da página quando a requisição na API é feita
const stopLoading = async () => {
  const loadingItem = document.querySelector('.loading');
  loadingItem.remove();
};

// --> Para as funções somaItensDoCarrinho e precoTotal, tomei como base as soluções elaboradas pelo colega Wanderson Salles
// e refatorei utilizando o método reduce

// Soma todo os itens adicionados ao carrinho
const somaItensDoCarrinho = () => {
  const itensDoCarrinho = document.querySelectorAll('.cart__item');
  return [...itensDoCarrinho].reduce((sum, curr) => sum + parseFloat(curr.innerText.substr(
      curr.innerText.indexOf('PRICE') + 8,
  )), 0);
};

// Pega o container do carrinho de compras (o elemento HTML ol)
const fetchMyCartContainer = () => document.querySelector('ol.cart__items');

// Formata o preço total e atribui o valor ao elemento HTML com classe .total-price
const precoTotal = () => {
  const total = document.querySelector('.total-price');
  total.innerHTML = (Math.round(somaItensDoCarrinho() * 100) / 100);
  const myCart = fetchMyCartContainer();
  if (!myCart.childElementCount) total.innerHTML = '';
  return total;
};

// Salva todo o carrinho no local Storage - função adaptada do projeto To Do List
const saveMyCart = () => {
  const cart = fetchMyCartContainer();
  localStorage.setItem('cart', cart.innerHTML);
};

// Remove um único elemento do carrinho
function cartItemClickListener(event) {
  event.target.remove();
  precoTotal();
  saveMyCart();
}

// Cria um elemento li no carrinho
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return ol.appendChild(li);
}

// Recupera o carrinho do local Storage - função adaptada do projeto To Do List
const getMyCart = () => {
  const cart = fetchMyCartContainer();
  if (typeof Storage !== 'undefined' && localStorage.cart) {
    cart.innerHTML = localStorage.getItem('cart');
  }
};

// Cria o evento de clique para adicionar cada item ao carrinho
const addToMyCartClickEvent = (btn, indice, dados) => {
  btn.addEventListener('click', () => {
    const shoppingCart = fetchMyCartContainer();
    const addItemstoCart = createCartItemElement(dados[indice]);
    shoppingCart.appendChild(addItemstoCart);
    precoTotal();
    saveMyCart();
  });
};

// Itera sobre os itens e adiciona itens ao carrinho de compras 
const addToMyCart = (data) => {
  const btns = document.querySelectorAll('.item button');
  btns.forEach((btn, index) => {
    addToMyCartClickEvent(btn, index, data);
   });  
};

// Limpa tudo do local Storage - função adaptada do projeto To Do List
const clearLocalStorage = () => localStorage.clear();

// Remove todos os itens do carrinho - função adaptada do projeto To Do List
function eraseAll() {
  const totalPrice = document.querySelector('.total-price');
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', () => {
    const itensDoCarrinho = fetchMyCartContainer();
    while (itensDoCarrinho.childElementCount > 0) {
      itensDoCarrinho.firstElementChild.remove();
      totalPrice.innerHTML = '';
    }
    clearLocalStorage();
  });
}

const iteraItensBuscados = (products) => {
  const input = document.querySelector('.search-input');
  products.forEach((product) => {
    const image = `https://http2.mlstatic.com/D_NQ_NP_${product.thumbnail_id}-O.webp`;
    const objt = { id: product.id, title: product.title, thumbnail: image };
    createProductItemElement(objt);
    input.value = '';
   });
};

// Faz a requisição à API, com base numa busca digitada no campo input da página
function onSearch() {
  const input = document.querySelector('.search-input');
  const sectionItems = document.querySelector('.items');
  sectionItems.innerHTML = '';
  let products;
    startLoading();
    return new Promise((resolve) => {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${input.value}`)
      .then((response) => {
        response.json().then((data) => {
         stopLoading();
         products = data.results;
         resolve(products);
         iteraItensBuscados(products);
         localStorage.setItem('items', sectionItems.innerHTML);
        addToMyCart(products);
      });
    });
  });
}

// Adiciona evento de clique à requisição da função onSearch
const clickEventToOnSearch = () => {
  const button = document.querySelector('#search');
  button.addEventListener('click', onSearch);
};

// Agrupa e estipula a ordem de execução das funções assíncronas
const fetchSoughtProducts = async () => {
  try {
    const resposta = await clickEventToOnSearch();
    iterandoMeusDados(resposta);
    addToMyCart(resposta);
    precoTotal();
  } catch (error) {
    console.log('failure');
  }
};

// Faz a requisição dos dados - com auxílio do plantão do Eliezer Queiroz e do Jackson Pires
const productPromise = (productName) => {
  startLoading();
  let products;
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${productName}`)
    .then((response) => {
      response.json().then((data) => { 
        stopLoading();
        products = data.results;
        resolve(products);
    });
  });
  });  
};

const fetchProducts = async () => {
  try {
    const data = await productPromise('computador');
    iterandoMeusDados(data);
    addToMyCart(data);
    precoTotal();
  } catch (error) {
    console.log('Fail...');
  }
};

window.onload = function onload() { 
  fetchProducts();
  fetchSoughtProducts();
  eraseAll();
  getMyCart();
};

// Referências:
// Para entender como tratar os dados extraídos com o fetch, foi consultado o PR da estudante Ana Luiza Machado (turma 9):
// -- https://github.com/tryber/sd-09-project-shopping-cart/pull/93/files
// Para compreender a lógica do requisito 5, foi consultado o PR do colega Wanderson Salles (Turma 10 | Tribo A): 
// -- https://github.com/tryber/sd-010-a-project-shopping-cart/pull/37/files
// Sobre indexOf():
// -- https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
// Sobre subtring():
// -- https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String/substring
// Para ajustes nas funções saveMyCart e getMyCart, foram consultadas as seguintes referências:
// -- Livro: IEPSEN, Edécio Fernando. Lógica de programação e algoritmos com JavaScript. Ed. Novatec 2018 (cap. 8 - Persistência de dados com local Storage)
// -- Meu repositório do projeto To Do List: https://github.com/anaventura1811/minhas-tarefas
// Inspirada pela ideia da colega Elisa França, compartilhada no linkedin, implementei a função onSearch
// que gera os itens na página a partir de uma busca enviada pelo campo input