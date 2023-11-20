export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 3,
        deliveryOptionId: '2'
    }
];

}


function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart))
}

export function addToCart(productId,button) {
    let matchingItem;
    let selectValue = document.querySelector(`.js-quantity-selector-${productId}`).value;
    const addedMessageDisplay = document.querySelector(`.js-added-to-cart-${productId}`);
    addedMessageDisplay.classList.add('show-message');

    clearTimeout(button.timeOutId);

    // Set a new timeout for this specific button
    button.timeOutId = setTimeout(() => {
        addedMessageDisplay.classList.remove('show-message');
    }, 2000);

    cart.forEach((cartItem) =>{
        if (productId === cartItem.productId){
            matchingItem = cartItem;
        }
    })
    if (matchingItem) {
        matchingItem.quantity += Number(selectValue) ;
    } else {
        cart.push({
            productId : productId,
            quantity : Number(selectValue),
            deliveryOptionId: '1'
        });
    }

    saveToStorage();

}



export function removeFromCart(productId){
    const newCart = [];
    cart.forEach((cartItem)=>{
        if (cartItem.productId !== productId ){
            newCart.push(cartItem)
        }
    })
    cart = newCart;

    saveToStorage();

}

export function updateQuantity(productId , newQuantity){
   let matchingProduct;
   cart.forEach((cartItem)=>{
    if(cartItem.productId === productId){
        matchingProduct = cartItem;
        matchingProduct.quantity = newQuantity;
    }
   })
   saveToStorage();

   console.log(matchingProduct.quantity);
}

export function updateDeliveryOption(productId , deliveryOptionId){
  let matchingItem;

  cart.forEach((cartItem)=>{
    if(productId === cartItem.productId){
        matchingItem = cartItem;
    }
  })
  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}