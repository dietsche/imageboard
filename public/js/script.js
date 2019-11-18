new Vue({
    el: "#main",
    data: {
        images: []
    },
    mounted: function() {
        console.log("vue component has mounted!");
        var me = this;
        axios.get("/images").then(function(response) {
            console.log("response from /images: ", me.images);
            me.images = response.data;
        });
    },
    methods: {
        myFunction: function() {
            console.log("my functions runs. Images: ", this.images);
        }
    }
});
