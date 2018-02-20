var i = 0;
module.exports = {

    /**
     * @param {String} event
     * @param {Object} subscriber
     * @param {Function} handler
     */
    on: function (event, subscriber, handler) {

        if (!this.hasOwnProperty(event)) {
            this[event] = {};
            if (Object.keys(this[event]).length == 0) {
                this[event][i] = {};
                this[event][i].objSubscriber = subscriber;
                this[event][i].handlerFunc = [];
                this[event][i].handlerFunc.push(handler);
            }
            i++;
        } else {
            var num = '';
            for (var key in this[event]) {
                if (this[event][key].objSubscriber === subscriber) {
                    num = key;

                }
            }
            if (this[event].hasOwnProperty(num)) {
                this[event][num].handlerFunc.push(handler);
            } else {
                this[event][i] = {};
                this[event][i].objSubscriber = subscriber;
                this[event][i].handlerFunc = [];
                this[event][i].handlerFunc.push(handler);

            }

        }
        return this;
    },

    /**
     * @param {String} event
     * @param {Object} subscriber
     */
    off: function (event, subscriber) {
        var num = '';
        if (this.hasOwnProperty(event)) {
            for (var key in this[event]) {
                if (this[event][key].objSubscriber === subscriber) {
                    num = key;
                    break;
                }
            }
            if (this[event].hasOwnProperty(num)) {
                delete this[event][num];
            }
        }
        return this;
    },

    /**
     * @param {String} event
     */
    emit: function (event) {
        for (var key in this[event]) {
            for (var i = 0; i < this[event][key].handlerFunc.length; i++) {
                this[event][key].handlerFunc[i].call(this[event][key].objSubscriber);
            }
        }
        return this;
    }

};
