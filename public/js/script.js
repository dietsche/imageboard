new Vue({
    el: "#main",
    data: {
        images: [],
        id: null, //don't need it here???!
        title: "",
        description: "",
        username: "",
        file: null,
        imageLoaded: false,
        currentImage: null
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
                    me.title = "";
                    me.description = "";
                    me.username = "";
                    me.imageLoaded = false;

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
        },
        setCurrentImage: function(image_id) {
            this.currentImage = image_id;
        },
        unsetCurrentImage: function() {
            this.currentImage = null;
        }
    }
});
