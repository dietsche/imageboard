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
            file: null //?? do i need this??
        };
    },
    props: ["id"],
    mounted: function() {
        var me = this;
        console.log("modal-component has mounted!");
        console.log("id-value: ", this.id);
        axios.get("/current-image/" + this.id).then(function(response) {
            console.log("response get image ", response);
            me.title = response.data[0].title;
            me.description = response.data[0].description;
            me.username = response.data[0].username;
            me.url = response.data[0].url;
            me.date = response.data[0].created_at;
            me.file = response.data[0].file;
            //me.this =....
        });
    },
    methods: {
        closemodal: function() {
            this.$emit("closemodal", {});
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
