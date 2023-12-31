
const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-ACC-PT-WEB-PT-A/events';

const state = {
    parties: [],
};

const partiesList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

//Sync state with render
async function render() {
    await getParties();
    renderParties();
}
render();

//Update state with recipes from API
async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.error(error);
    }
}

//form submission for adding a recipe
async function addParty(event) {
    event.preventDefault();
    await createParty(
        addPartyForm.title.value,
        new Date(addPartyForm.date.value).toISOString(),
        addPartyForm.location.value,
        addPartyForm.description.value,
    );
}

//Ask API to create a new recipe
async function createParty(name, date, location, description) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, date, location, description }),
        });
        const json = await response.json();

        // if (json.error) {
        //     throw new Error(json.message);
        // }

        render();
    } catch (error) {
        console.error(error);
    }
}

//Ask API to update an existing recipe
async function updateParty(id, name, date, location, description) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, date, location, description }),
        });
        const json = await response.json();

        if (json.error) {
            throw new Error(json.message);
        }
        render();
    } catch (error) {
        console.error(error);
    }
}

//Ask API to delete a recipe and render
async function deleteParty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Party could not be deleted.");
        }
        render();
    } catch (error) {
        console.log(error);
    }
}

//Render recipes from state
function renderParties() {
    if (!state.parties.length) {
        partiesList.innerHTML = `<li>No recipes found.</li>`;
        return;
    }

    const partyCards = state.parties.map((party) => {
        const partyCard = document.createElement("li");
        partyCard.classList.add("party");
        partyCard.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.date}</p>
            <p>${party.location}</p>
            <p>${party.description}</p>
        `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    partyCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteParty(party.id));

    return partyCard;
    });

    partiesList.replaceChildren(...partyCards);
}
