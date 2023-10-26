function submitLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.error) {
        alert(data.error);
      } else {
        alert("ログインが完了しました");
      }
    })
    .catch((err) => {
      alert(err);
    });
}
