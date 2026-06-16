
const cl = console.log;
const productForm = document.getElementById("productForm");
const title = document.getElementById("title");
const price = document.getElementById("price");
const description = document.getElementById("description");
const category = document.getElementById("category");
const image = document.getElementById("image");
const cardContainer = document.getElementById("cardContainer");
const butEdit = document.getElementById("butEdit");
const updatebtn = document.getElementById("updatebtn");
const spinner = document.getElementById('spinner');


let baseURL = "https://fakestoreapi.com";

let productArr = [];

function fetchCart() {
    let xhr = new XMLHttpRequest();
    let postURL = `${baseURL}/products`;
    xhr.open("GET", postURL);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            productArr = JSON.parse(xhr.response);
            creatCart(productArr);
        }
    };
    xhr.onerror = function () {
        cl("Network Error");
    };
}
fetchCart();

function creatCart(arr) {
    let result = "";
    arr.forEach((ele) => {
        result += `
        <div class="col-md-4 mb-4" id="${ele.id}">
            <div class="card h-100 shadow-sm border-0">
                <div class="text-center p-3">
                 <div class="card-header">
                    <img src="${ele.image}" class="img-fluid" alt="${ele.title}">
                 </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${ele.title}</h5>
                    <p class="text-muted small flex-grow-1">
                        ${ele.description}
                    </p>
                    <div class="mb-2">
                        <span class="badge badge-info">
                            ${ele.category}
                        </span>
                    </div>
                    <h4 class="text-primary font-weight-bold mb-3">
                        $${ele.price}
                    </h4>
                </div>
                <div class="card-footer bg-white border-0">
                    <div class="d-flex justify-content-between">
                        <button
                            class="btn btn-outline-primary btn-sm"
                            onclick="onEdit(this)">
                            Edit
                        </button>
                        <button
                            class="btn btn-outline-danger btn-sm"
                            onclick="onremove(this)">
                            Delete
                        </button>
                    </div>
                </div>

            </div>
        </div>
        `;
    });
    cardContainer.innerHTML = result;
}

function onSubmitCard(eve) {
    
    eve.preventDefault();
    
    let newObj = {
        title: title.value,
        price: price.value,
        description: description.value,
        category: category.value,
        image: image.value,
    };
    spinner.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    let postURL = `${baseURL}/products`;
    xhr.open("POST", postURL);
    xhr.send(JSON.stringify(newObj));
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            let div = document.createElement("div");
            div.className = "col-md-4 mb-4";
            div.id = res.id;
            div.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="text-center p-3">
                    <img src="${newObj.image}" class="img-fluid" alt="${newObj.title}">
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${newObj.title}</h5>
                    <p class="text-muted small flex-grow-1">
                        ${newObj.description}
                    </p>
                    <div class="mb-2">
                        <span class="badge badge-info">
                            ${newObj.category}
                        </span>
                    </div>
                    <h4 class="text-primary font-weight-bold mb-3">
                        $${newObj.price}
                    </h4>
                </div>
                <div class="card-footer bg-white border-0">
                    <div class="d-flex justify-content-between">
                        <button
                            class="btn btn-outline-primary btn-sm"
                            onclick="onEdit(this)">
                            Edit
                        </button>
                        <button
                            class="btn btn-outline-danger btn-sm"
                            onclick="onremove(this)">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            `;
            cardContainer.prepend(div);
            Swal.fire({
                title: "Product Added Successfully",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            });
            spinner.classList.add('d-none');

            productForm.reset();
        }
    };
   xhr.onerror = function () {
        cl("Network Error");
    };
}

function onEdit(ele) {
    spinner.classList.remove('d-none');
    let editId = ele.closest(".col-md-4").id;
    localStorage.setItem("editId", editId);
    let editURL = `${baseURL}/products/${editId}`;
    let xhr = new XMLHttpRequest();

    xhr.open("GET", editURL);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let newObj = JSON.parse(xhr.response);
            title.value = newObj.title;
            price.value = newObj.price;
            description.value = newObj.description;
            category.value = newObj.category;
            image.value = newObj.image;
            butEdit.classList.add("d-none");
            updatebtn.classList.remove("d-none");
            spinner.classList.add('d-none');

        }
    };
    xhr.onerror = function () {
        cl("Network Error");
    };
}

function onUpdate() {
    let updateId = localStorage.getItem("editId");
    let updatedObj = {
        title: title.value,
        price: price.value,
        description: description.value,
        category: category.value,
        image: image.value,
    };

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", `${baseURL}/products/${updateId}`);
    xhr.setRequestHeader("Content-Type", "application/json"); 
    xhr.send(JSON.stringify(updatedObj));

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            let div = document.getElementById(updateId);

            div.querySelector("img").src = updatedObj.image;
            div.querySelector("img").alt = updatedObj.title;
            div.querySelector(".card-title").innerText = updatedObj.title;
            div.querySelector(".card-body p").innerText = updatedObj.description;
            div.querySelector(".badge-info").innerText = updatedObj.category;
            div.querySelector("h4").innerText = `$${updatedObj.price}`;

            Swal.fire({
                title: "Product Updated Successfully",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            });

            productForm.reset();
            butEdit.classList.remove("d-none");
            updatebtn.classList.add("d-none");
            localStorage.removeItem("editId");
        }
    };

    xhr.onerror = function () {
        cl("Network Error");
    };
}


function onremove(ele) {
    spinner.classList.remove('d-none');

    let removeId = ele.closest(".col-md-4").id;
    let removeURL = `${baseURL}/products/${removeId}`;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", removeURL);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            ele.closest(".col-md-4").remove();
            Swal.fire({
                title: "Product Deleted Successfully",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            });
            spinner.classList.add('d-none');

        }
    };
    xhr.onerror = function () {
        cl("Network Error");
    };
}

productForm.addEventListener("submit", onSubmitCard);
updatebtn.addEventListener("click", onUpdate);

