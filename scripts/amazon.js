import { cart , addToCart} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "../utils/money.js";

let productHTML = '';

products.forEach((product)=>{
    const html = `
        <div class="product-container">
        <div class="product-image-container">
            <img class="product-image"
            src=${product.image}>
        </div>

        <div class="product-name limit-text-to-2-lines">
            ${product.name}
        </div>

        <div class="product-rating-container">
            <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
            ${product.rating.count}
            </div>
        </div>

        <div class="product-price">
        $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-quantity-container">
            <select class = "js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">
            Add to Cart
        </button>
        </div>
   `
   productHTML += html;
})


// Function to update the cart quantity and store/retrieve cart data from local storage.
// export function updateCart() {
//     // Retrieve the cart data from local storage (if it exists).
//     const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
//     // Calculate the cart quantity from the retrieved data.
//     let cartQuantity = 0;
//     storedCart.forEach((cartItem) => {
//         cartQuantity += cartItem.quantity;
//     });

//     // Update the cart quantity on the page.
//     document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
// }

// // Call the updateCart function when the page loads.
// window.addEventListener('load', updateCart);


// The code below works perfectly but the one above is an upgrade to keep cart updated across pages
function updateCart() {
    let cartQuantity = 0; // Initialize cartQuantity to zero.

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity; // Update cartQuantity with each cart item's quantity.
    });

    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}







const productDisplay = document.querySelector(".js-products-grid").innerHTML = productHTML;

const addToCartBtn = document.querySelectorAll(".js-add-to-cart")


addToCartBtn.forEach((button)=>{
    button.addEventListener('click' , ()=>{
        const productId = button.dataset.productId;
        addToCart(productId,button);
        updateCart();
    })
})

window.addEventListener('load', updateCart);

