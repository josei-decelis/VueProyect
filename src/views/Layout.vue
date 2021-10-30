<template>
  <div class="layout">
    <header>
      <h1>Menú <span>de hamburguesas</span></h1>
    </header>

    <!-- Button trigger modal -->
    <button
      type="button"
      class="btn btn-primary btn-new-burger"
      data-toggle="modal"
      data-target="#modalCreate"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="bi bi-plus-square"
        viewBox="0 0 16 16"
      >
        <path
          d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
        />
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
        />
      </svg>
      <span>Crear nueva hamburguesa</span>
    </button>

    <div class="container">
      <!-- card de prueba -->

      <div v-for="burger in burgers" :key="burger.id">
        <WidgetCard
          v-bind:id="burger.id"
          v-bind:nombre="burger.nombre"
          v-bind:ingredientes="burger.ingredientes.join(',')"
          v-bind:calorias="burger.calorias"
          v-bind:url="burger.url"
          v-bind:precio="burger.precio"
          @updateBurger="updateBurger"
          @deleteBurger="deleteBurger"
          @getHamburgesa="getHamburgesa"
        />
      </div>
    </div>

    <!-- Modal New Burger -->
    <div
      class="modal fade"
      id="modalCreate"
      tabindex="-1"
      aria-labelledby="modalEditLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title text-center w-100" id="modalEditLabel">
              Crear nueva hamburguesa
            </h2>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="burgerName">Nombre</label>
                <input
                  type="text"
                  class="form-control"
                  id="burgerName"
                  aria-describedby="burgerName"
                  v-model="formCreateBurger.nombre"
                />
              </div>
              <div class="form-group">
                <label for="burgerIngredients">Ingredientes</label>
                <input
                  type="text"
                  class="form-control"
                  id="burgerIngredients"
                  aria-describedby="burgerIngredients"
                  v-model="formCreateBurger.ingredientes"
                />
                <small id="burgerIngredients" class="form-text text-muted"
                  >Separar ingredientes con una ","
                  <p>Ej: "Tomate, Palta"</p>
                </small>
              </div>
              <div class="form-group">
                <label for="burgerImage">Imagen</label>
                <input
                  type="text"
                  class="form-control"
                  id="burgerImage"
                  aria-describedby="burgerImage"
                  v-model="formCreateBurger.url"
                />
                <small id="burgerImage" class="form-text text-muted"
                  >Inserte url de la imagen
                  <p>Ej: "https://www.google.cl/hamburguesa-3.jpg"</p>
                </small>
              </div>
              <div class="form-group">
                <label for="burgerCalories">Calorías</label>
                <input
                  type="text"
                  class="form-control"
                  id="burgerCalories"
                  aria-describedby="burgerCalories"
                  v-model="formCreateBurger.calorias"
                />
              </div>
              <div class="d-flex justify-content-end">
                <button
                  type="button"
                  class="btn btn-secondary mx-2"
                  data-dismiss="modal"
                  id="close-create-modal"
                >
                  Cancelar
                </button>
                <button
                  id=""
                  type="submit"
                  class="btn btn-primary mx-2"
                  v-on:click="postHamburgesa(formCreateBurger)"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <footer></footer>
  </div>
  <div></div>
</template>
<script>
import WidgetCard from "@/components/WidgetCard.vue";
export default {
  name: "Layout",
  components: {
    WidgetCard,
  },
  data: function() {
    return {
      burgers: [],
      formCreateBurger: {
        id: 0,
        nombre: "",
        ingredientes: "",
        calorias: 0,
        url: "",
        precio: 0,
      },
    };
  },
  methods: {
    toggleEditionMode(burger, value = true) {
      burger.editionMode = value;
      burger.editionValue = { ...burger };
    },
    updateBurger(data) {
      const burger = this.burgers.find((e) => e.id === data.id);
      burger.nombre = data.nombre;
      burger.ingredientes = data.ingredientes;
      burger.calorias = data.calorias;
      burger.editionMode = false;
    },
    getHamburgesa() {
      this.$http.get("https://prueba-hamburguesas.herokuapp.com/burger").then(
        (response) => {
          this.burgers = this.mapBurgers(response.data);
          console.log(this.burgers);
        },
        (err) => console.log(err)
      );
    },
    mapBurgers(burgers) {
      return burgers.map((e) => {
        e.editionValue = null;
        e.editionMode = false;
        e.url = "https://okdiario.com/img/2021/05/28/hamburguesa-3.jpg";
        e.precio = "2940";
        return e;
      });
    },

    postHamburgesa(hamburgesa) {
      const data = {
        nombre: hamburgesa.nombre,
        ingredientes: hamburgesa.ingredientes,
        calorias: hamburgesa.calorias,
      };
      data.ingredientes = data.ingredientes.split(",");
      this.$http
        .post(`https://prueba-hamburguesas.herokuapp.com/burger/`, data)
        .then(
          () => {
            hamburgesa.nombre = data.nombre;
            hamburgesa.ingredientes = data.ingredientes;
            hamburgesa.calorias = data.calorias;
            hamburgesa.editionMode = false;
            document.getElementById("close-create-modal").click();
            this.clearForm();
            this.getHamburgesa();
          },
          (err) => console.log(err)
        );
    },
    clearForm() {
      this.formCreateBurger.id = 0;
      this.formCreateBurger.nombre = "";
      this.formCreateBurger.ingredientes = "";
      this.formCreateBurger.calorias = 0;
      this.formCreateBurger.url = "";
      this.formCreateBurger.precio = 0;
    },
    addRow() {
      this.burgers.unshift({
        id: null,
        nombre: "",
        ingredientes: [""],
        calorias: 0,
      });
    },
    deleteBurger(id) {
      this.burgers.splice(id, 1);
    },
  },
  created() {
    console.log("componente welcome creado!, llamando a api");
    this.getHamburgesa();
  },
};
</script>
<style>
* {
  box-sizing: border-box;
}

.layout {
  /*     background : rgb(236, 109, 5); */
  box-sizing: border-box;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  position: relative;
  background: rgb(236, 109, 0);
  background: linear-gradient(
    153deg,
    rgba(236, 109, 0, 1) 76%,
    rgba(238, 3, 3, 0.8799894957983193) 100%,
    rgba(255, 255, 255, 1) 100%
  );
}

h1 {
  text-align: center;
}

.container {
  margin-top: 50px;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  margin: auto;
  flex-wrap: wrap;
}

.widget-card {
  min-height: 400px;
  border-radius: 8px;
  background-color: #ffffff;
  width: 220px;
  padding: 24px 16px;
  box-shadow: 0 1px 4px 0 rgba(14, 21, 32, 0.18);
  margin: 24px;
  overflow: hidden;
  cursor: pointer;
}

.widget-card:hover {
  background-color: #fafaf0;
}

.widget-card:hover .price {
  font-size: 24px;
  margin-bottom: 0;
}

.widget-card-header .burger-title {
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
}
.widget-card-header .burger-subtitle {
  font-size: 16px;
  white-space: nowrap;
}

.widget-card-body {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.widget-card-body img {
  margin-top: 16px;
  max-width: 200px;
  height: 100px;
}

.widget-card-body .burger-ingredients {
  margin-top: 8px;
  padding: 8px;
  width: 100%;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.f-bold {
  font-weight: bold;
}

.btn-new-burger {
  font-size: 20px;
  position: fixed;
  top: 28px;
  left: 0;
}

.btn-new-burger svg {
  margin-right: 16px;
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}

.icon-delete {
  background: url("../assets/icons/delete-icon.svg") no-repeat center;
  height: 32px;
  width: 32px;
  border: none;
}

.icon-delete:hover {
  background: rgb(201, 9, 9) url("../assets/icons/delete-icon.svg") no-repeat
    center;
}

.icon-edit {
  background: url("../assets/icons/mode-edit-icon.svg") no-repeat center;
  height: 32px;
  width: 32px;
  border: none;
}

.icon-edit:hover {
  background: rgb(2, 112, 202) url("../assets/icons/mode-edit-icon.svg")
    no-repeat center;
}

.widget-card-footer {
  display: flex;
  justify-content: center;
}

.widget-card-footer button span {
  display: none;
}
form {
  text-align: left;
}
@media (max-width: 680px) {
  .layout {
    background: rgb(213, 235, 18);
  }

  h1 {
    margin-top: 8px;
    font-size: 20px;
    font-weight: bold;
    color: #c40a0a;
  }

  h1 span {
    display: none;
  }

  .widget-card {
    width: 100%;
    min-height: 0;
    margin: 8px 0;
  }

  .btn-new-burger span {
    display: none;
  }

  .btn-new-burger:hover span {
    display: inline;
  }

  .btn-new-burger::selection span {
    display: inline;
  }

  .btn-new-burger svg {
    margin: 0;
    margin-bottom: 4px;
  }

  .container > div {
    width: 100%;
  }
}
</style>
