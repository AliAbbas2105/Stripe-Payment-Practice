const button = document.querySelector("button")
button.addEventListener("click", async () => {
  try {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Something went wrong.")
    }

    const data = await response.json()
    window.location = data.url
  } catch (error) {
    console.error("Checkout Error:", error.message)
    alert("Failed to start checkout.")
  }
})
