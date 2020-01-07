Vue.component("image-modal", {
    template: "#modaltemplate",
    data: function() {
        return {
            title: "",
            description: "",
            username: "",
            url: "",
            date: "",
            nextid: null,
            previd: null
        };
    },
    props: ["id", "tags"],
    watch: {
        id: function() {
            var me = this;
            axios
                .get("/current-image/" + me.id)
                .then(function(response) {
                    me.title = response.data[0].title;
                    me.description = response.data[0].description;
                    me.username = response.data[0].username;
                    me.url = response.data[0].url;
                    me.date =
                        response.data[0].created_at.substr(0, 10) +
                        ", " +
                        response.data[0].created_at.substr(11, 5);
                    me.file = response.data[0].file;
                    me.nextid = response.data[0].nextid;
                    me.previd = response.data[0].previd;
                })
                .then(function() {
                    axios
                        .get("/tags/" + me.id)
                        .then(function(response) {
                            me.tags = response.data;
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                })
                .catch(function(err) {
                    console.log(err);
                    me.closemodal();
                });
        }
    },

    mounted: function() {
        var me = this;
        axios
            .get("/current-image/" + me.id)
            .then(function(response) {
                me.title = response.data[0].title;
                me.description = response.data[0].description;
                me.username = response.data[0].username;
                me.url = response.data[0].url;
                me.date =
                    response.data[0].created_at.substr(0, 10) +
                    ", " +
                    response.data[0].created_at.substr(11, 5);
                me.file = response.data[0].file;
                me.nextid = response.data[0].nextid;
                me.previd = response.data[0].previd;
            })
            .then(function() {
                axios
                    .get("/tags/" + me.id)
                    .then(function(response) {
                        me.tags = response.data;
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
            .catch(function(err) {
                console.log(err);
                me.closemodal();
            });
    },
    methods: {
        closemodal: function() {
            this.$emit("closemodal", {});
        },
        sendtag: function(e) {
            var currentTag = e.target.textContent;
            this.$emit("sendtag", currentTag);
        }
    }
});

Vue.component("comments", {
    template: "#commenttemplate",
    data: function() {
        return {
            comments: [],
            comment: "",
            usernamec: "",
            timec: "",
            newcomment: "",
            newusername: ""
        };
    },
    props: ["id"],
    watch: {
        id: function(currentImage) {
            var me = this;
            axios.get("/comments/" + currentImage).then(function(response) {
                me.comments = response.data;
            });
        }
    },
    mounted: function() {
        var me = this;
        axios.get("/comments/" + this.id).then(function(response) {
            me.comments = response.data;
        });
    },

    methods: {
        addComment: function(e) {
            var me = this;
            e.preventDefault();
            axios
                .post("/add-comment", {
                    comment: this.newcomment,
                    username: this.newusername,
                    image_id: this.id
                })
                .then(function(resp) {
                    me.comments.unshift(resp.data.comment);
                    me.newcomment = "";
                    me.newusername = "";
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    }
});
