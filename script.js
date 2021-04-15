const products = {
  async getProducts() {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const data = await response.json();
    return data.results;
  },
  async getProduct(productId) {
    const response = await fetch(`https://api.mercadolibre.com/items/${productId}`);
    const data = await response.json();
    return data;
  },
  addToCart(cart, cartItem) {
    cart.appendChild(cartItem);
    let localCart = localStorage.getItem('cart');
    if (localCart) {
      localCart = localCart.split(',');
      localCart.push(cartItem.id);
      localStorage.setItem('cart', localCart);
    } else {
      localStorage.setItem('cart', cartItem.id);
    }
  },
  create: {
    createProductImageElement(imageSource) {
      const img = document.createElement('img');
      img.className = 'item__image';
      img.src = imageSource;
      return img;
    },
    createCustomElement(element, className, innerText) {
      const e = document.createElement(element);
      e.className = className;
      e.innerText = innerText;
      return e;
    },
    cartItemClickListener(event) {
      const cartItem = event.target;
      cartItem.remove();
      let localCart = localStorage.getItem('cart').split(',');
      localCart = localCart.filter((item) => item !== cartItem.id);
      localStorage.setItem('cart', localCart);
    },
    createCartItemElement({ id: sku, title: name, price: salePrice }) {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.id = sku;
      li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
      li.addEventListener('click', this.cartItemClickListener);
      return li;
    },
    createProductItemElement({ ...product }) {
      const section = document.createElement('section');
      section.className = 'item';
      const button = this.createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
      const cartItems = document.querySelector('.cart__items');
      const cartItemElement = this.createCartItemElement(product);
      button.onclick = () => products.addToCart(cartItems, cartItemElement);
      section.appendChild(
        this.createCustomElement('span', 'item__sku', product.id),
      );
      section.appendChild(
        this.createCustomElement('span', 'item__title', product.title),
      );
      section.appendChild(
        this.createProductImageElement(product.thumbnail),
      );
      section.appendChild(button);
    
      return section;
    },
    generateListOfProducts(productsFound) {
      const sectionItems = document.querySelector('.items');
      productsFound.map((product) => sectionItems.appendChild(
        this.createProductItemElement(product),
      ));
    },
  },
  async loadCart() {
    const cartItems = document.querySelector('.cart__items');
    let localCart = localStorage.getItem('cart');
    if (localCart) {
      localCart = localCart.split(',');

      localCart.forEach(async (productId) => {
        const productFound = await this.getProduct(productId);
        const cartItem = products.create.createCartItemElement(productFound);
        cartItems.appendChild(cartItem);
      });
    }
  },
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = async function onload() { 
  const productsFound = await products.getProducts();
  products.create.generateListOfProducts(productsFound);
  products.loadCart();
};