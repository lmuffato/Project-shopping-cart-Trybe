window.onload = function onload() { };

// cria a imagem do computador dentro da seção criada
// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }

// cria o elemento com a classe e o texto passados como parametro.
// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// cria uma seçao na pagina referente a cada computador que é resposta da pesquisa na API, com uma classe, um span com ID, o nome e uma figura.
// function createProductItemElement({ sku, name, image }) {
//   const section = document.createElement('section');
//   section.className = 'item';

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

//   return section;
// }

// pega o texto (o ID em si) dentro da seçao span do item
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// ao clicar no item no carrinho, remove ele da lista.
// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// cria o item dentro da seçao do carrinho de compras com as infos do produto.
// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
