
const API = "http://localhost:3000/api/web";

const form = document.getElementById("contactForm");
const contactsList = document.getElementById("contacts");
const submitBtn = form.querySelector('button[type="submit"]');

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

let editingId = null;

// 1. GET: Fetch and display contacts
async function getContacts() {
    try {
        const response = await fetch(`${API}/view`);

        if (!response.ok) {
            throw new Error("Failed to fetch contacts");
        }

        const result = await response.json();

        // Supports either an array or { data: [...] }
        const contacts = result.users;

        if (!Array.isArray(contacts)) {
            throw new Error("Invalid contacts response");
        }

        contactsList.replaceChildren();

        if (contacts.length === 0) {
            const li = document.createElement("li");
            li.className = "empty-state";
            li.textContent = "No contacts saved yet.";
            contactsList.appendChild(li);
            return;
        }

        contacts.forEach(contact => {
            displayContact(contact);
        });

    } catch (error) {
        alert(error.message);
    }
}

// Display one contact
function displayContact(contact) {
    const li = document.createElement("li");

    const name = contact.userName ?? contact.name ?? "";
    const phone = contact.phoneNumber ?? contact.phone ?? "";
    const email = contact.email ?? "";
    const message = contact.message ?? "";
    const id = contact._id ?? contact.id;

    const heading = document.createElement("h3");
    heading.className = "contact-name";
    heading.textContent = name;

    const details = document.createElement("div");
    details.className = "contact-details";

    const phoneText = document.createElement("p");
    phoneText.className = "contact-detail";
    phoneText.textContent = `Phone: ${phone}`;

    const emailText = document.createElement("p");
    emailText.className = "contact-detail";
    emailText.textContent = `Email: ${email}`;

    const messageText = document.createElement("p");
    messageText.className = "contact-message";
    messageText.textContent = message;

    details.append(phoneText, emailText);

    const actions = document.createElement("div");
    actions.className = "contact-actions";

    const updateBtn = document.createElement("button");
    updateBtn.type = "button";
    updateBtn.className = "update-btn";
    updateBtn.textContent = "✏️ Update";

    updateBtn.addEventListener("click", () => {
        // Fill the form with existing details
        nameInput.value = name;
        phoneInput.value = phone;
        emailInput.value = email;
        messageInput.value = message;

        editingId = id;
        submitBtn.textContent = "Update Contact";

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "🗑️ Delete";

    deleteBtn.addEventListener("click", async () => {
        if (!confirm("Delete this contact?")) return;

        try {
            const response = await fetch(
                `${API}/delete/${encodeURIComponent(id)}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Failed to delete contact");
            }

            // Exit edit mode if this contact was being edited
            if (String(editingId) === String(id)) {
                resetForm();
            }

            await getContacts();

        } catch (error) {
            alert(error.message);
        }
    });

    actions.append(updateBtn, deleteBtn);
    li.append(heading, details, messageText, actions);
    contactsList.appendChild(li);
}

// 2. CREATE / UPDATE: Handle form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contact = {
        userName: nameInput.value.trim(),
        phoneNumber: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
    };

    const isEditing = editingId !== null;

    const url = isEditing
        ? `${API}/update/${encodeURIComponent(editingId)}`
        : `${API}/create`;

    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contact)
        });

        if (!response.ok) {
            throw new Error(
                isEditing
                    ? "Failed to update contact"
                    : "Failed to create contact"
            );
        }

        alert(
            isEditing
                ? "Contact updated successfully!"
                : "Contact created successfully!"
        );

        resetForm();
        await getContacts();

    } catch (error) {
        alert(error.message);
    }
});

// Reset form after create/update
function resetForm() {
    form.reset();
    editingId = null;
    submitBtn.textContent = "Save Contact";
}

// Load contacts when page opens
getContacts();


const themeToggle = document.getElementById("themeToggle");

// Load the saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// Set the correct button text
function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark
        ? "☀️"
        : "🌙";
}

updateThemeButton();

// Toggle between light and dark mode
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeButton();
});
