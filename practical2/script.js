const shopName = "SneakPeak";     // const
var gst = 18;                     // var
let cart = [];                    // let


const products = [
    {
        id: 1,
        name: "Nike Air Max",
        price: 5999
    },
    {
        id: 2,
        name: "Adidas Ultraboost",
        price: 7499
    },
    {
        id: 3,
        name: "Puma RS-X",
        price: 4999
    },
    {
        id: 4,
        name: "Vans Old Skool",
        price: 4299
    }
];



function addToCart(id) {

    let product = products.find(item => item.id === id);

    let qty = Number(document.getElementById("qty" + id).value);
    let size = document.getElementById("size" + id).value;

    if (qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    // Object Destructuring
    const { name, price } = product;

    cart.push({
        name,
        price,
        qty,
        size
    });

    displayCart();

    document.getElementById("qty" + id).value = 0;

    alert(name + " added to cart!");
}


function displayCart() {

    let output = "";

    if (cart.length === 0) {

        document.getElementById("cartItems").innerHTML =
            "<p>Your cart is empty.</p>";

        return;
    }

    cart.forEach((item, index) => {

        output += `
        <p>
        <b>${index + 1}. ${item.name}</b><br>
        Size : ${item.size}<br>
        Quantity : ${item.qty}<br>
        Price : ₹${item.price}
        </p>
        <hr>
        `;

    });

    document.getElementById("cartItems").innerHTML = output;

}


function generateBill() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let subtotal = 0;
    let bill = `<h2>${shopName} Bill</h2>`;

    cart.forEach(item => {

        let total = item.price * item.qty;

        subtotal += total;

        bill += `
        <p>
        ${item.name}<br>
        Size : ${item.size}<br>
        ₹${item.price} × ${item.qty} = ₹${total}
        </p>
        <hr>
        `;

    });

    let gstAmount = subtotal * gst / 100;

    let discount = 0;

    if (subtotal >= 10000) {

        discount = 1000;

    }

    let finalAmount = subtotal + gstAmount - discount;

    bill += `
    <h3>Subtotal : ₹${subtotal.toFixed(2)}</h3>

    <h3>GST (${gst}%) : ₹${gstAmount.toFixed(2)}</h3>

    <h3>Discount : ₹${discount}</h3>

    <hr>

    <h2>Total : ₹${finalAmount.toFixed(2)}</h2>

    <br>

    <h3>Thank You for Shopping!</h3>
    `;

    document.getElementById("billOutput").innerHTML = bill;

}



function clearCart() {

    cart = [];

    document.getElementById("cartItems").innerHTML =
        "<p>Your cart is empty.</p>";

    document.getElementById("billOutput").innerHTML = "";

}