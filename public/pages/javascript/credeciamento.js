const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const response = await fetch('/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value
    })
  });

  const responseData = await response.json();

  if (!response.ok) {
    alert("O servidor nos disse: " + responseData.message);
    return;
  }

  localStorage.setItem('token', responseData.token);
  const token = responseData.token;
  try {
    const response = await fetch("/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao buscar informações do usuário.");

    const { role } = await response.json();

    console.log(role)
    // Redirecionar com base no cargo
    if (role == 1) {
      location.href = "/registrar.html";
    } else if (role == 0) {
      location.href = "/public_acess.html";
    }
  } catch (error) {
    console.error("Erro ao determinar o cargo do usuário:", error);
    window.location.href = "/";
  }
  //const respondeUrl = await authResponse.json()
  //console.log(respondeUrl)
});