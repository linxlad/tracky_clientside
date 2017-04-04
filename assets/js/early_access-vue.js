// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

let emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    $form = document.querySelectorAll('#signup-form')[0];

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
            let validation = this.validation;

            return Object.keys(validation).every(function (key) {
                return validation[key]
            })
        }
    },
    methods: {
        addInterest: function (event) {
            event.stopPropagation();
            event.preventDefault();

            let ws = new WebSocket('ws://localhost:4001');
            let message= {
                name: 'EARLY_ACCESS',
                data: {
                    email: this.email
                }
            };

            ws.onopen = () => {
                this.messageRemove();
                ws.send(JSON.stringify(message))
            };

            ws.onmessage = (e) => {
                let response = JSON.parse(e.data);
                console.info(response);

                if (response.name === 'success') {
                    this.messageShow('success', 'Thank you!');
                } else if (response.name === 'error' && response.data === 'EMAIL_EXISTS') {
                    this.messageShow('failure', 'That email has already been used!');
                } else if (response.name === 'error') {
                    this.messageShow('failure', response.data);
                }
            };
        },
        messageShow: function(type, text) {
            let $message = document.createElement('span');

            $message.innerHTML = text;
            $message.classList.add(type);
            $message.classList.add('message');
            $message.classList.add('visible');
            document.querySelectorAll('#signup-form')[0].appendChild($message);

            $_this = this;
            window.setTimeout(function() {
                $_this.messageRemove();
            }, 8000);
        },
        messageRemove: function () {
            let $form = document.querySelectorAll('#signup-form')[0],
            $messageSpan = $form.querySelectorAll(":scope > .message")[0];

            if ($messageSpan !== undefined) {
                $messageSpan.remove();
            }
        }
    }
});