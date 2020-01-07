new Vue({
    el: "#main",
    data: {
        images: [],
        id: null,
        title: "",
        description: "",
        username: "",
        tags: "",
        currentTag: null,
        file: null,
        imageLoaded: false,
        currentImage: location.hash.slice(1)
    },

    mounted: function() {
        var me = this;
        this.getImages();
        window.addEventListener("hashchange", function() {
            me.currentImage = location.hash.slice(1);
        });
    },

    methods: {
        getImages: function() {
            var me = this;
            axios.get("/images").then(function(response) {
                me.images = response.data;
            });
        },
        handleClick: function(e) {
            var me = this;
            e.preventDefault();
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
                    me.imageLoaded = false;
                    me.tags = me.tags.split(", ");
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
                    console.log(err);
                });
        },
        handleChange: function(e) {
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
            var me = this;
            var startid = this.images[this.images.length - 1].id;
            var offset = 9;
            axios
                .get("/more-images/" + startid + "/" + offset)
                .then(function(response) {
                    me.images = me.images.concat(response.data);
                })
                .catch(function(err) {
                    console.log(err);
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
            var me = this;
            me.currentTag = currentTag;
            axios
                .get("/image_ids-with-tag/" + currentTag)
                .then(function(response) {
                    me.currentImage = null;
                    me.images = response.data;
                    location.hash = "";
                })
                .catch(function(err) {
                    console.log(err);
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
