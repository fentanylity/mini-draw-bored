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

  // Após login, redireciona para a página protegida
  location.href = '/registrar.html';
});