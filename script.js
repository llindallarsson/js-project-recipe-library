const radioButtonForFilter = document.querySelectorAll('input[name="filter"]');
const radioButtonForSorting = document.querySelectorAll('input[name="sort"]');
const selectedLabel = document.getElementById("placeholder-box");

const filterTexts = {
  filter1: "Ah, the Mediterranean... where the sun kisses the sea and the food is full of flavor! 🌞",
  filter2: "Welcome to the heart of the Middle East! The spices here tell stories of ancient lands. 🌍",
  filter3: "Let's explore the vast and diverse flavors of Asia! 🍜 From sushi to stir-fry, there's something for everyone.",
  filter4: "Benvenuto in Italia! Here, food is a way of life, and pasta is always the answer. 🇮🇹",
  filter5: "¡Bienvenidos a México! Get ready for vibrant, bold flavors that will spice up your life. 🌶️"
};

const sortTexts = {
  sort1: "The crowd has spoken! These dishes are so loved, they’ve become classics. ⭐",
  sort2: "Got a few minutes? We’ve got you covered with quick and tasty recipes. ⏱️",
  sort3: "Less is more! These recipes keep it simple, but still deliver on taste. 🧑‍🍳"
};

radioButtonForFilter.forEach(button => {
  button.addEventListener('change', () => {
    radioButtonForFilter.forEach(radio => {
      if (radio.checked) {
        const filterText = filterTexts[radio.id];
        selectedLabel.innerHTML += `${filterText} <br /><br />`;
      }
    });
  });
});

radioButtonForSorting.forEach(button => {
  button.addEventListener('change', () => {
    radioButtonForSorting.forEach(radio => {
      if (radio.checked) {
        const sortText = sortTexts[radio.id];
        selectedLabel.innerHTML += `${sortText} <br /><br />`;
      }
    });
  });
});
