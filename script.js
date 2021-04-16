// Nota mental para eu do Futuro: usar Promise e tratar os dados em outra função async
const fetchProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const compuiter = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
          price: element.price
          };
        // Depois de 3 dias descobri que era aqui que eu puxava a criação dos elementos
        document.querySelector('.items').appendChild(createProductItemElement(compuiter));

        });
    });
  };

// const products = async {
//   await fetchProducts()
// }

// Aqui começa o Bloco que coloca as coisa na tela
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
    addEventListener("click",cartItemClickListener);

  return section;
}
// Aqui termina o Bloco que coloca as coisa na tela



function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // const item = event.target.parentNode;
  console.log('deu certo')
  // const cartClick = () => {
  //   fetch(`https://api.mercadolibre.com/items/${ItemID}`)



  // }
}

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = async () => {
  await fetchProducts();
};