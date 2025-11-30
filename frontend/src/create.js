import { client } from "./client.js";

if (!localStorage.getItem("auth_token")) {
  alert("Debes iniciar sesión para publicar un anuncio");
  window.location.href = "/login.html";
}

const form = document.getElementById("create-form");
const errorMessage = document.getElementById("error-message");
const submitButton = document.getElementById("submit-button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Publicando...";
  errorMessage.classList.add("hidden");

  try {
    let photoUrl = "";

    const photoInput = document.getElementById("photo");
    if (photoInput.files.length > 0) {
      const formData = new FormData();
      formData.append("file", photoInput.files[0]);

      const token = localStorage.getItem("auth_token");
      const uploadResponse = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Error al subir la imagen");
      }

      const uploadData = await uploadResponse.json();
      photoUrl = uploadData.path;
    }

    const adData = {
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      price: parseFloat(document.getElementById("price").value),
      type: document.querySelector('input[name="type"]:checked').value,
      photo: photoUrl,
    };

    await client.post("/api/adverts", adData);

    alert("¡Anuncio publicado correctamente!");
    window.location.href = "/";
  } catch (error) {
    errorMessage.textContent = error.message || "Error al publicar el anuncio";
    errorMessage.classList.remove("hidden");
    submitButton.disabled = false;
    submitButton.textContent = "Publicar anuncio";
  }
});
