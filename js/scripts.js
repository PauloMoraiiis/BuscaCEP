const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#addres");
const cityInput = document.querySelector("#city")
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

const fadeElemnt = document.querySelector("#fade");

// Validade CEP input
cepInput.addEventListener("keypress", (e) => {
    const onlyNumbers = /[0-9]/;
    const key = String.fromCharCode(e.keyCode);

    // allow only numbers
    if(!onlyNumbers.test(key)) {
        e.preventDefault();
        return;
    }
});

// Get addres event
cepInput.addEventListener("keyup", (e) => {
    const inputValue = e.target.value

    // Chek if we have the correto
    if(inputValue.length === 8) {
        getAddress(inputValue);
    }
});

// Get customer addres from API
const getAddress = async (cep) => {
    toggleLoader();

    cepInput.blur();

    const apiUrl = `https://viacep.com.br/ws/${cep}/json`

    const response = await fetch(apiUrl);

    const data = await response.json()

    // Show error and reset form
    if(data.erro === "true") {
        if(!addressInput.hasAttribute("disabled")) {
            togleDisabled();
        }
        addressForm.reset();
        toggleLoader();
        toggleMessage("CEP inválido, tente novamente.")
        return;
    }

    if (addressInput.value === "") {
        togleDisabled();
    }

    addressInput.value = data.logradouro;
    cityInput.value = data.localidade;
    neighborhoodInput.value = data.bairro;
    regionInput.value = data.uf;

    toggleLoader()
};

// Add or remove disable attribute
    const togleDisabled = () => {
        if(regionInput.hasAttribute("disabled")) {
            formInputs.forEach((input) => {
                input.removeAttribute("disabled");
            });
        } else {
            formInputs.forEach((input) => {
                input.setAttribute("disabled", "disabled");
            });
        }
    }

// Show or hiede loader
const toggleLoader = () => {
    
    const loaderElement = document.querySelector("#loader");

    fadeElemnt.classList.toggle("hide");
    loaderElement.classList.toggle("hide");
};

// show or hide message
const toggleMessage = (msg) => {
    const messageElement = document.querySelector("#message");

    const messageElementText = document.querySelector("#message p");

    messageElementText.innerHTML = msg

    fadeElemnt.classList.toggle("hide");
    messageElement.classList.toggle("hide");
};

// Close message modal
closeButton.addEventListener("click", () => toggleMessage());

// Save address
addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    toggleLoader();

    setTimeout(() => {
        toggleLoader();
        toggleMessage("Endereço salvo com sucesso!");
        addressForm.reset();
        togleDisabled();
    }), 1500;
});
