<template>
  <div>
    <h1>Menú</h1>
  </div>
  <button class="btn btn-primary" v-on:click="addRow">+</button>
  <table class="table">
    <tr>
      <th>ID:</th>
      <th>Nombre:</th>
      <th>Ingredientes:</th>
      <th>Calorias</th>
      <th>Acción</th>
    </tr>
    <tr v-for="(burger, key) in burgers" :key="burger.id">
      <td v-if="!burger.editionMode && burger.id !== null">{{ burger.id }}</td>
      <td v-if="!burger.editionMode && burger.id !== null">
        {{ burger.nombre }}
      </td>
      <td v-if="!burger.editionMode && burger.id !== null">
        {{ burger.ingredientes?.join(", ") }}
      </td>
      <td v-if="!burger.editionMode && burger.id !== null">
        {{ burger.calorias }}
      </td>

      <td v-if="burger.editionMode">{{ burger.id }}</td>
      <td v-if="burger.editionMode">
        <label for="nombre"></label>
        <input type="text" id="nombre" v-model="burger.editionValue.nombre" />
      </td>
      <td v-if="burger.editionMode">
        <label for="ingredientes"></label>
        <input
          type="text"
          id="ingredientes"
          v-model="burger.editionValue.ingredientes"
        />
      </td>
      <td v-if="burger.editionMode">
        <label for="calorias"></label>
        <input
          type="text"
          id="calorias"
          v-model="burger.editionValue.calorias"
        />
      </td>

      <td v-if="burger.id === null">
        <label for="id"></label>
        <input type="text" id="id" v-model="burger.id" />
      </td>
      <td v-if="burger.id === null">
        <label for="nombre"></label>
        <input type="text" id="nombre" v-model="burger.nombre" />
      </td>
      <td v-if="burger.id === null">
        <label for="ingredientes"></label>
        <input type="text" id="ingredientes" v-model="burger.ingredientes" />
      </td>
      <td v-if="burger.id === null">
        <label for="calorias"></label>
        <input type="text" id="calorias" v-model="burger.calorias" />
      </td>

      <td>
        <div v-if="!burger.id">
          <button v-on:click="postHamburgesa(burger)">guardar</button>
          <button v-on:click="deleteRow(key)">cancelar</button>
        </div>
        <div v-if="burger.editionMode">
          <button v-on:click="putHamburgesa(burger.editionValue)">
            actualizar
          </button>
          <button v-on:click="toggleEditionMode(burger, false)">
            cancelar
          </button>
        </div>

        <div v-if="burger.id && !burger.editionMode">
          <button v-on:click="toggleEditionMode(burger)">editar</button>
          <button v-on:click="deleteHamburgesa(burger.id)">eliminar</button>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "Burgers",
  data() {
    return {
      saludo: "...Nada todavía",
      burgers: [],
    };
  },
  methods: {
    toggleEditionMode(burger, value = true) {
      burger.editionMode = value;
      burger.editionValue = { ...burger };
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
        return e;
      });
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
            const burger = this.burgers.find((e) => e.id === data.id);
            burger.nombre = data.nombre;
            burger.ingredientes = data.ingredientes;
            burger.calorias = data.calorias;
            burger.editionMode = false;
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
    postHamburgesa(hamburgesa) {
      const data = { ...hamburgesa };
      data.ingredientes = data.ingredientes.split(",");
      this.$http
        .post(`https://prueba-hamburguesas.herokuapp.com/burger/`, data)
        .then(
          () => {
            hamburgesa.nombre = data.nombre;
            hamburgesa.ingredientes = data.ingredientes;
            hamburgesa.calorias = data.calorias;
            hamburgesa.editionMode = false;
          },
          (err) => console.log(err)
        );
    },
    deleteHamburgesa(id) {
      this.$http
        .delete(`https://prueba-hamburguesas.herokuapp.com/burger/${id}`)
        .then(
          () => {
            this.burgers = this.burgers.filter((e) => e.id !== id);
          },
          (err) => console.log(err)
        );
    },
    addRow() {
      this.burgers.unshift({
        id: null,
        nombre: "",
        ingredientes: [""],
        calorias: 0,
      });
    },
    deleteRow(id) {
      console.log(id);
      this.burgers.splice(id, 1);
    },
  },
  created() {
    console.log("componente welcome creado!, llamando a api");
    this.getHamburgesa();
  },
};
</script>

<style scope></style>
