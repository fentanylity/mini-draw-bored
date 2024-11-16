//import bcrypt from 'bcrypt'

void async function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = "/";
        return;
    }

    try {
        const response = await fetch("/token/verify", {
            method: "POST",
            headers: {
                "Authorization":  `Bearer ${token}`,
            },

        });

        if (!response.ok) {
            console.warn("Sessão invalida, logo você não está logado.")
            localStorage.clear();
            throw new Error("Token inválido ou expirado.");
        }

        //const data = await response.json();
        //console.log("Usuário logado:", data.user); // Exemplo de uso do payload decodificado
    } catch (err) {
        console.error(err);
        window.location.href = "/"; // Redireciona para o login
    }
}()
// Valida sessão

// Seleção de elementos
const tableBody = document.getElementById('user-table-body');
const mainForm = document.getElementById('main-form');
const token = localStorage.getItem('token');

// Função para carregar usuários
async function loadUsers() {
    const url = '/users';
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            console.error('Erro ao carregar usuários:', response.statusText);
            return;
        }
        const users = await response.json();

        // Preencher a tabela com os dados dos usuários
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.id = user.id;
            row.innerHTML = `
        <td class="name">${user.name}</td>
        <td class="email">${user.email}</td>
        <td class="role">${user.role === 1 ? 'Admin' : 'Membro'}</td>
        <td>
          <button class="edit-btn" data-action="update">Editar</button>
          <button class="delete-btn" data-action="delete">Excluir</button>
        </td>
      `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Adiciona funcionalidade de CRUD nos botões
document.addEventListener('click', async (event) => {
    const button = event.target;
    const action = button.dataset.action;

    if (action === 'logoff') {
        localStorage.removeItem("token"); 
        window.location.href = "/"; 
    }

    if (action === 'delete') {
        const row = button.closest('tr');
        const id = row.dataset.id;
        const url = `/users/${id}`;
        const method = 'DELETE';
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const response = await fetch(url, { method, headers });
            if (!response.ok) {
                console.error('Erro ao excluir usuário:', response.statusText);
                return;
            }
            row.remove();
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    if (action === 'update') {
        const row = button.closest('tr');
        const id = row.dataset.id;

        // Abrir formulário para edição
        const name = row.querySelector('.name').textContent;
        const email = row.querySelector('.email').textContent;
        const role = row.querySelector('.role').textContent === 'Admin' ? '1' : '0';

        mainForm.name.value = name;
        mainForm.email.value = email;
        mainForm.role.value = role;
        mainForm.dataset.id = id;
        mainForm.dataset.action = 'update'; // Marcar como modo de atualização
    }
});

// Submissão do formulário principal
document.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const action = form.dataset.action || 'create';
    const url = action === 'create' ? '/users' : `/users/${form.dataset.id}`;
    const method = action === 'create' ? 'POST' : 'PUT';
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
            console.error(`Erro ao ${action === 'create' ? 'cadastrar' : 'atualizar'} usuário:`, response.statusText);
            return;
        }

        const responseData = await response.json();

        if (action === 'create') {
            // Adicionar nova linha à tabela
            const newRow = document.createElement('tr');
            newRow.dataset.id = responseData.id;
            newRow.innerHTML = `
        <td class="name">${responseData.name}</td>
        <td class="email">${responseData.email}</td>
        <td class="role">${responseData.role === 1 ? 'Admin' : 'Membro'}</td>
        <td>
          <button class="edit-btn" data-action="update">Editar</button>
          <button class="delete-btn" data-action="delete">Excluir</button>
        </td>
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

// Carregar os usuários na inicialização
loadUsers();
