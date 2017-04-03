var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

new Vue({
    el: '#signup-form',
    data: {
        email: ''
    },
    computed: {
        validation: function () {
            return {
                email: emailRE.test(this.email)
            }
        },
        isValid: function () {
            var validation = this.validation;
            return Object.keys(validation).every(function (key) {
                return validation[key]
            })
        }
    },
    methods: {
        addInterest: function (event) {
            event.preventDefault();
            let ws = new WebSocket('ws://localhost:4001');

            let message= {
                name: 'EARLY_ACCESS',
                data: {
                    email: this.email
                }
            }

            ws.onopen = () => {
                ws.send(JSON.stringify(message))
            }

            ws.onmessage = (e) => {
                console.log(JSON.parse(e.data));
            }
        }
    }
});