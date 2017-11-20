var config = {
  apiKey: "AIzaSyAi_yuJciPXLFr_PYPeU3eTvtXf8jbJ8zw",
  authDomain: "vue-demo-537e6.firebaseapp.com",
  databaseURL: "https://vue-demo-537e6.firebaseio.com"
}
firebase.initializeApp(config)

var usersRef = firebase.database().ref('users')

// create Vue app
var app = new Vue({
  // element to mount to
  el: '#app',
  // initial data
  data: {
    newUser: {
      name: '',
      email: ''
    }
  },
  // firebase binding
  // https://github.com/vuejs/vuefire
  firebase: {
    users: usersRef
  },
  // computed property for form validation state
  computed: {
    validation: function () {
      return {
        name: !!this.newUser.name.trim(),
        email: emailRE.test(this.newUser.email)
      }
    },
    isValid: function () {
      var validation = this.validation
      return Object.keys(validation).every(function (key) {
        return validation[key]
      })
    }
  },
  // methods
  methods: {
    addUser: function () {
      if (this.isValid) {
        usersRef.push(this.newUser)
        this.newUser.name = ''
        this.newUser.email = ''
      }
    },
    removeUser: function (user) {
      usersRef.child(user['.key']).remove()
    }
  }
})

import Firebase from 'firebase'

const firebaseConfig = {
        apiKey: "AIzaSyCYJyU1XclnBo9XeXJ-vw9dY2cF-4bFlk4",
        authDomain: "fat-stacks-leaderboard.firebaseapp.com",
        databaseURL: "https://fat-stacks-leaderboard.firebaseio.com",
        storageBucket: "fat-stacks-leaderboard.appspot.com",
        messagingSenderId: "639031374175"
}
Firebase.initializeApp(firebaseConfig)
const db = Firebase.database()
const scoreboard = db.ref('scoreboard')

export default db
export { leaderboard }
