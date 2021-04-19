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
  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
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
  event.target.remove(event); 
}

function createCartItemElement({ id, title, price }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
}

function clearCart() {
const btnClearCart = document.querySelector('.empty-cart');
btnClearCart.addEventListener('click', () => {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerText = '';
});
}

// const getPrice = () => {
//   const cartPrice = document.querySelector('li.cart__item');
//   cartPrice.innerText.split('PRICE');
// };

// API DO ID DO PRODUTO
const productCartPromisse = (id) => {
  let productCart;
  fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((data) => {
            productCart = data;
            createCartItemElement(productCart);
      });     
};

// const fetchProductCart = () =>{
//   try {
//     productCartPromisse();
//   } catch (error) {
//     console.log(error);
//   }
// }

const productListPromisse = async () => (
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((data) => data)
      
);
const fetchProductList = async () => {
  try {
    const data = await productListPromisse();
    const loadProducts = document.querySelector('.loading'); 
    loadProducts.remove();
    data.results.forEach((product) => {
        createProductItemElement(product);
    });
      const btnAddCart = document.querySelectorAll('.item__add');
      btnAddCart.forEach((element) => {
        element.addEventListener('click', () => {
          productCartPromisse(getSkuFromProductItem(element.parentNode));
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

window.onload = async function onload() {
  fetchProductList();
  clearCart();
};
