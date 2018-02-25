<template>
  <div class="dashboard">
    <h1>{{ msg }}</h1>

    <div v-if="netIdString" class="message is-primary">
      <div class="message-header">
        <p>Connected To:</p>
      </div>
      <div class="message-body">
        {{ netIdString }}
      </div>
    </div>
    <div v-if="defaultEthWallet" class="message is-primary">
      <div class="message-header">
        <p>Wallet Address:</p>
      </div>
      <div class="message-body">
        {{ defaultEthWallet }}
      </div>
    </div>

    <div class="gallery">

    </div>

  </div>
</template>

<script>

  export default {
    name: 'dashboard',
    data() {
      return {
        msg: 'Welcome to your truffle-vue dApp',
        pseudo: undefined
      }
    },
    computed: {
      userExists: function () {
        return (typeof this.pseudo !== 'undefined')
      },
      netIdString() {
        return this.$store.state.netIdString;
      },
      defaultEthWallet() {
        return this.$store.state.defaultEthWallet;
      }
    },
    beforeCreate: function () {

    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
    display: block;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
