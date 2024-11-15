const form = document.querySelector('form')
form.addEventListener('submit', async (event) => {
  event.preventDefault()
  
  const response = await fetch('/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value
    })
  })

  const resposeData = await response.json()

  if (!response.ok) {
    alert("o servidor nos disse: " + resposeData.message)
    return
  }

  localStorage.setItem('token', resposeData.token)
  //location.href = '/home.html'
})