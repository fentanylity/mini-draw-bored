document.getElementById("logoff").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/";
});

const token = localStorage.getItem("token");
const tableBody = document.getElementById("user-table-body");

// Validação de sessão
async function validateSession() {

    if (!token) {
        window.location.href = "/";
        return;
    }

    try {
        const response = await fetch("/token/verify", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            localStorage.clear();
            throw new Error("Sessão inválida. Redirecionando...");
        }
        const authResponse = await fetch("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (!authResponse.ok) throw new Error("Erro ao buscar informações do usuário.");
        
        document.body.removeAttribute('style')
    } catch (error) {
        console.error(error);
        location.href = "/";
    }
}
validateSession();

// Função para carregar usuários na tabela
async function loadUsers() {
    try {
        const response = await fetch("/users", {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao carregar usuários.");

        const users = await response.json();

        // Limpar tabela antes de preencher
        tableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.dataset.id = user.id;
            row.innerHTML = `
                <button class="delete-btn" data-action="delete">🗑️</button>
                <td class="name">${user.name}</td>
                <td class="email">${user.email}</td>
                <td class="role">${user.role === 1 ? "Admin" : "Membro"}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}
loadUsers();

const mainForm = document.getElementById('user-form')
// Submissão do formulário principal
mainForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const action = form.dataset.action || 'create';
    const url = '/users' 
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
    };
    const body = JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        role: form.role.value
    });

    try {
        const response = await fetch(url, { method, headers, body });
        if (!response.ok) {
            console.error('Erro ao cadastrar usuário:', response.statusText);
            return;
        }

        const responseData = await response.json();

        if (action === 'create') {
            const newRow = document.createElement('tr');
            newRow.dataset.id = responseData.id;
            newRow.innerHTML = `
        <button class="delete-btn" data-action="delete">🗑️</button>
        <td class="name">${responseData.name}</td>
        <td class="email">${responseData.email}</td>
        <td class="role">${responseData.role === 1 ? 'Admin' : 'Membro'}</td>
      `;
            tableBody.appendChild(newRow);
        } else {
            // Atualizar linha existente
            const row = document.querySelector(`tr[data-id="${form.dataset.id}"]`);
            row.querySelector('.name').textContent = form.name.value;
            row.querySelector('.email').textContent = form.email.value;
            row.querySelector('.role').textContent = form.role.value === '1' ? 'Admin' : 'Membro';
        }

        // Resetar o formulário
        form.reset();
        delete form.dataset.id;
        delete form.dataset.action;
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
});

const dialog = document.getElementById("customDialog");
const dialogInput = document.getElementById("dialogInput");
const dialogField = document.getElementById("dialogField");
const proceedBtn = document.getElementById("proceedBtn");

let currentRow = null;
let currentFieldIndex = 0;
let fieldsToEdit = []
const fieldOrder = ["name", "email", "role"]; // Ordem dos campos para edição

async function deleteRow(clickedElement) {
    const row = clickedElement.closest("tr");
    const id = row.dataset.id;
    const url = `/users/${id}`;
    const method = "DELETE";
    const headers = { Authorization: `Bearer ${token}` };
   
        try {
            const response = await fetch(url, { method, headers });

            if (!response.ok) {
                console.error("Erro ao excluir usuário:", response.statusText);
                return;
            }

            row.remove();
            console.log("Usuário excluído com sucesso!");
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
}
// Abrir o diálogo ao clicar em uma célula
document.getElementById("user-table-body").addEventListener("click", (event) => {
    const clickedElement = event.target;
    if (clickedElement.tagName === "TD") {
        currentRow = clickedElement.closest("tr");
        currentFieldIndex = fieldOrder.indexOf(clickedElement.className);

        if (currentFieldIndex === -1) return; // Clicou fora de campos editáveis

        fieldsToEdit = [...fieldOrder];
        fieldsToEdit.splice(currentFieldIndex, 1);

        // Configurar o diálogo com o campo clicado
        dialogInput.value = clickedElement.textContent;
        dialogField.textContent = `Editar ${clickedElement.className}`;
        dialog.showModal();
    }

    if (clickedElement.classList.contains("delete-btn")) 
        deleteRow(clickedElement)
});

// Atualizar célula no frontend ao clicar em "Prosseguir"
proceedBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (fieldsToEdit.length > 0) {
        // Atualiza o valor do campo atual
        const currentField = fieldOrder[currentFieldIndex];
        currentRow.querySelector(`.${currentField}`).textContent = dialogInput.value;

        // Atualiza os índices e muda o campo atual
        currentFieldIndex = fieldOrder.indexOf(fieldsToEdit.shift());
        const nextField = fieldOrder[currentFieldIndex];
        dialogField.textContent = `Editar ${nextField}`;
        dialogInput.value = currentRow.querySelector(`.${nextField}`).textContent;
    } 
    else {
        dialog.close();
    }
});

// Fazer uma única requisição PUT ao clicar em "Confirmar"
dialog.addEventListener("close", async () => {
    if (dialog.returnValue === "confirm" && currentRow || !fieldsToEdit.length > 0) {
        if(dialog.returnValue === "confirm") 
            currentRow.querySelector(`.${fieldOrder[currentFieldIndex]}`).textContent = dialogInput.value;
        // Coletar os valores atualizados da linha
        const id = currentRow.dataset.id;
        const updatedData = {
            name: currentRow.querySelector(".name").textContent,
            email: currentRow.querySelector(".email").textContent,
            role: currentRow.querySelector(".role").textContent === "Admin" ? 1 : 0,
        };

        // Enviar a requisição PUT com os dados atualizados
        try {
            const response = await fetch(`/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error("Erro ao atualizar usuário.");
            console.log("Atualização concluída:", updatedData);
        } catch (error) {
            console.error(error);
        }
    }
});