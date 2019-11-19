new Vue({
    el: "#main",
    data: {
        images: [],
        imageLoaded: false,
        title: "",
        description: "",
        username: "",
        file: null
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
        handleClick: function(e) {
            var me = this;
            e.preventDefault();
            console.log("läuft");
            console.log("this: ", this);
            var fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            axios
                .post("/upload", fd)
                .then(function(resp) {
                    me.images.unshift(resp.data.image);
                    console.log("me.images: ", me.images);
                    console.log("resp from POST /upload: ", resp.data);
                })
                .catch(function(err) {
                    console.log("error in POST /upload: ", err);
                });
        },
        handleChange: function(e) {
            console.log("läuft");
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
            this.imageLoaded = true;
            // if (this.file) {
            //
            // }
        }
    }
});
