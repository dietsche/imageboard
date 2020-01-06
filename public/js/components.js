//add link in html
Vue.component("image-modal", {
    template: "#modaltemplate", //+ define a template in html!!!!
    data: function() {
        //not an obj (> like in instance), but a func that returns an obj
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
            console.log("WATCHED SUCCESFUL");
            var me = this;
            axios
                .get("/current-image/" + me.id)
                .then(function(response) {
                    console.log("response get image ", response);
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
                            console.log(
                                "das sind die tags die nach  axios-req vom server zurückgegeben werden , ",
                                response.data
                            );
                            me.tags = response.data;
                        })
                        .catch(function(err) {
                            console.log("no tags: ", err);
                        });
                })
                .catch(function(err) {
                    console.log("no image send : ", err);
                    me.closemodal();
                });
        }
    },

    mounted: function() {
        var me = this;
        console.log("modal-component has mounted!");

        console.log("id-value: ", this.id);
        axios
            .get("/current-image/" + me.id)
            .then(function(response) {
                console.log("response get image ", response);
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
                console.log("me.nextid, me.previd: ", me.nextid, me.previd);
            })
            .then(function() {
                axios
                    .get("/tags/" + me.id)
                    .then(function(response) {
                        console.log(
                            "das sind die tags die nach  axios-req vom server zurückgegeben werden , ",
                            response.data
                        );
                        me.tags = response.data;
                    })
                    .catch(function(err) {
                        console.log("no tags: ", err);
                    });
            })
            .catch(function(err) {
                console.log("no image send : ", err);
                me.closemodal();
            });
    },
    methods: {
        closemodal: function() {
            this.$emit("closemodal", {});
        },
        sendtag: function(e) {
            console.log("currentTag: ", e.target.textContent);
            var currentTag = e.target.textContent;
            console.log("EVENT_EMITTER RUNS");
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
            console.log("Watching currentImage: ", currentImage);
            var me = this;
            axios.get("/comments/" + currentImage).then(function(response) {
                me.comments = response.data;
            });
        }
    },
    mounted: function() {
        var me = this;
        console.log("comment-component has mounted!");
        console.log("id-value: ", this.id);
        axios.get("/comments/" + this.id).then(function(response) {
            me.comments = response.data;
            console.log("images-array!!???: ", me.comments);
        });
    },

    methods: {
        addComment: function(e) {
            var me = this;
            e.preventDefault();
            console.log("USERNAME: ", this.newusername);
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
                    console.log("error in send-comment : ", err);
                });
        }
    }
});
