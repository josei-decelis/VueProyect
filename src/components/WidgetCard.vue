<template>
  <div>
    <div class="widget-card">
      <div class="widget-card-header">
        <p class="burger-title">
          {{ nombre }}
        </p>
        <p class="burger-subtitle">{{ calorias }} cal</p>
      </div>
      <div class="widget-card-body">
        <img v-bind:src="url" alt="imagen referencial combo {{id}}" />
        <p class="burger-ingredients">{{ ingredientes }}</p>
      </div>
      <p class="f-bold price">Precio: {{ precio }}</p>
      <div class="widget-card-footer">
        <!-- Actions -->
        <button
          class="icon-edit"
          data-toggle="modal"
          :data-target="'#modalEdit' + id"
          v-on:click="loadForm()"
        >
          <span>editar</span>
        </button>
        <button
          class="icon-delete"
          data-toggle="modal"
          :data-target="'#deleteModal' + id"
        >
          <span>eliminar</span>
        </button>
      </div>
    </div>
  </div>
  <!-- Modal Delete -->
  <div
    class="modal fade"
    :id="'deleteModal' + id"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title text-center w-100" id="exampleModalLabel">
            Confirmar
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
          <p>Seguro que quiere eliminar esta hamburgesa del Menú? :O</p>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-secondary mx-2"
              data-dismiss="modal"
              :id="'close-delete-modal' + id"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary mx-2"
              v-on:click="deleteHamburgesa(id)"
            >
              Sí, seguro
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal edit Burger -->
  <div
    class="modal fade"
    :id="'modalEdit' + id"
    tabindex="-1"
    aria-labelledby="modalEditLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title text-center w-100" id="modalEditLabel">
            Editar
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
                v-model="formBurger.nombre"
              />
              <p>{{ formBurger.nombre }}</p>
            </div>
            <div class="form-group">
              <label for="burgerIngredients">Ingredientes</label>
              <input
                type="text"
                class="form-control"
                id="burgerIngredients"
                aria-describedby="burgerIngredients"
                v-model="formBurger.ingredientes"
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
                v-model="formBurger.url"
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
                v-model="formBurger.calorias"
              />
            </div>
            <div class="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-secondary mx-2"
                data-dismiss="modal"
                :id="'close-edit-modal' + id"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary mx-2"
                data-dismiss="modal"
                v-on:click="editBurger()"
              >
                Editar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WidgetCard",
  props: {
    id: Number,
    nombre: String,
    ingredientes: Array,
    calorias: String,
    url: String,
    precio: Number,
  },
  emits: ["updateBurger"],
  data: function() {
    return {
      formBurger: {
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
    editBurger() {
      const hamburgesa = {
        id: this.formBurger.id,
        nombre: this.formBurger.nombre,
        calorias: this.formBurger.calorias,
        ingredientes: this.formBurger.ingredientes,
      };

      this.putHamburgesa(hamburgesa);
    },
    emitUpdateBurger(burger) {
      this.$emit("updateBurger", burger);
    },
    emitGetBurger(burger) {
      this.$emit("getHamburgesa", burger);
    },
    loadForm() {
      this.formBurger.id = this.id;
      this.formBurger.nombre = this.nombre;
      this.formBurger.ingredientes = [...this.ingredientes].split(",");
      this.formBurger.calorias = this.calorias;
      this.formBurger.url = this.url;
      this.formBurger.precio = this.precio;
    },
    putHamburgesa(hamburgesa) {
      const data = { ...hamburgesa };
      data.ingredientes = data.ingredientes.split(",");
      this.$http
        .put(
          `https://prueba-hamburguesas.herokuapp.com/burger/${data.id}/`,
          data
        )
        .then(
          () => {
            document.getElementById(`close-edit-modal${hamburgesa.id}`).click();
            this.emitGetBurger();
            this.emitUpdateBurger(data);
            this.emitBurger(data);
            /* this.burgers = this.burgers.map((e) => {
              if (e.id === response.id) {
                e = response;
                return e;
              }
            }); */
          },
          (err) => console.log(err)
        );
    },
    deleteHamburgesa(id) {
      this.$http
        .delete(`https://prueba-hamburguesas.herokuapp.com/burger/${id}`)
        .then(
          () => {
            this.emitGetBurger();
            document.getElementById(`close-delete-modal${id}`).click();
            this.$emit("deleteBurger", id);
          },
          (err) => console.log(err)
        );
    },
  },
};
</script>
