new Vue({
    el: "#main",
    data: {
        images: [],
        id: null, //don't need it here???!
        title: "",
        description: "",
        username: "",
        tags: "",
        currentTag: null,
        file: null,
        imageLoaded: false,
        currentImage: location.hash.slice(1) //don't need it ???!
    },

    mounted: function() {
        console.log("vue component has mounted!");
        var me = this;
        this.getImages();
        window.addEventListener("hashchange", function() {
            me.currentImage = location.hash.slice(1);
            console.log("The hash has changed!: ", me.currentImage);
        });
    },

    methods: {
        getImages: function() {
            var me = this;
            axios.get("/images").then(function(response) {
                console.log("response from /images: ", me.images);
                me.images = response.data;
            });
        },
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
                    me.id = resp.data.image.id;
                    me.title = "";
                    me.description = "";
                    me.username = "";
                    // me.tags = "";
                    me.imageLoaded = false;
                    me.tags = me.tags.split(", ");
                    console.log("me.images: ", me.images);
                    console.log("resp from POST /upload: ", resp.data);
                    console.log("WARUM HIER NICHT MEHR?");
                    console.log("das wird an addTAgs übergeben: ", me.tags);

                    axios
                        .post("/addTags", {
                            tags: me.tags,
                            image_id: me.id
                        })
                        .then(function() {
                            me.tags = "";
                        });
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
        handleScroll: function() {
            var scrollPosition = window.scrollY;
            var windowsHeight = window.innerHeight;
            var documentHeight = document.documentElement.scrollHeight;
            if (
                windowsHeight + scrollPosition >= documentHeight - 1 &&
                this.images.length > 8
            ) {
                this.getMoreImages();
            }
        },

        getMoreImages: function() {
            console.log("click!");
            var me = this;
            var startid = this.images[this.images.length - 1].id;
            var offset = 9;
            axios
                .get("/more-images/" + startid + "/" + offset)
                .then(function(response) {
                    console.log("response from /more-images: ", response.data);
                    me.images = me.images.concat(response.data);
                })
                .catch(function(err) {
                    console.log("error in GET /more-img: ", err);
                });
        },
        setCurrentImage: function(image_id) {
            this.currentImage = image_id;
        },
        unsetCurrentImage: function() {
            this.currentImage = null;
            location.hash = "";
        },
        getImagesWithTag: function(currentTag) {
            console.log("TAG FUNCTION RUNS");
            var me = this;
            me.currentTag = currentTag;
            console.log("WITH CURRENT TAG...", currentTag);
            // var imagesWithTags = [];
            axios
                .get("/image_ids-with-tag/" + currentTag)
                .then(function(response) {
                    console.log("Setting to null");
                    me.currentImage = null;
                    me.images = response.data;
                    location.hash = "";
                })
                .catch(function(err) {
                    console.log("error in GET /image_ids-with-tag: ", err);
                });
        },
        showAll: function() {
            this.currentTag = null;
            this.getImages();
        }
    },
    created() {
        window.addEventListener("scroll", this.handleScroll);
    }
});
