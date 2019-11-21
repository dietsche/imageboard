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
    props: ["id"],
    watch: {
        id: function() {
            console.log("WATCHED SUCCESFUL");
            var me = this;
            axios.get("/current-image/" + me.id).then(function(response) {
                console.log("response get image ", response);
                me.title = response.data[0].title;
                me.description = response.data[0].description;
                me.username = response.data[0].username;
                me.url = response.data[0].url;
                me.date = response.data[0].created_at;
                me.file = response.data[0].file;
                me.nextid = response.data[0].nextid;
                me.previd = response.data[0].previd;
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
                me.date = response.data[0].created_at;
                me.file = response.data[0].file;
                me.nextid = response.data[0].nextid;
                me.previd = response.data[0].previd;
                console.log("me.nextid, me.previd: ", me.nextid, me.previd);
                //me.this =....
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
        changeToNextImage: function() {
            var me = this;
            me.currentImage = me.nextid;
            axios
                .get("/current-image/" + me.currentImage)
                .then(function(response) {
                    console.log("response get image ", response);
                    me.title = response.data[0].title;
                    me.description = response.data[0].description;
                    me.username = response.data[0].username;
                    me.url = response.data[0].url;
                    me.date = response.data[0].created_at;
                    me.nextid = response.data[0].nextid;
                    me.previd = response.data[0].previd;
                    console.log("me.nextid, me.previd: ", me.nextid, me.previd);
                    //me.this =....
                });
        },
        changeToNextPrev: function() {
            var me = this;
            me.currentImage = me.nextid;
            axios
                .get("/current-image/" + me.currentImage)
                .then(function(response) {
                    console.log("response get image ", response);
                    me.title = response.data[0].title;
                    me.description = response.data[0].description;
                    me.username = response.data[0].username;
                    me.url = response.data[0].url;
                    me.date = response.data[0].created_at;
                    me.nextid = response.data[0].nextid;
                    me.previd = response.data[0].previd;
                    console.log("me.nextid, me.previd: ", me.nextid, me.previd);
                    //me.this =....
                });
        }
    }
});

Vue.component("comments", {
    template: "#commenttemplate", //+ define a template in html!!!!
    data: function() {
        //not an obj (> like in instance), but a func that returns an obj
        return {
            comments: [],
            comment: "",
            usernamec: "",
            newcomment: "",
            newusername: ""
        };
    },
    props: ["id"], //bezieht sich auf Elternkomponente! nicht auf main!
    watch: {
        id: function(currentImage) {
            console.log("Watching currentImage: ", currentImage);
            var me = this;
            axios.get("/comments/" + currentImage).then(function(response) {
                me.comments = response.data;

                // me.comment = response.data[0].comment;
                // me.usernamec = response.data[0].usernamec;
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
            // me.comment = response.data[0].comment;
            // me.usernamec = response.data[0].usernamec;
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
                })
                .catch(function(err) {
                    console.log("error in send-comment : ", err);
                });
        }

        // closemodal: function() {
        //     this.$emit("closemodal", {});
    }
});
