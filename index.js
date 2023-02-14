const express = require('express')
const bodyParser = require("body-parser");
var lodash = require('lodash');
const homeStartingContent = "If you’ve ever struggled to remember a great idea you had in the past or wished you had a more concrete recollection of important life events, you might want to consider keeping a journal. Journals are a great way to catalogue the everyday events of your life as well as formulate and record new creative ideas as they occur to you. Journals are an invaluable place for you to practice your craft as a writer and develop your writing skills.";
const mongoose = require('mongoose');
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const app = express();

app.set('view engine', 'ejs');
app.get('/contact', (req, res) => {
    res.render('index', {});

})

mongoose.Promise = global.Promise;
// Connect MongoDB at default port 27017.
mongoose.connect('mongodb+srv://habib-admin:habib1234@cluster0.fz59ulb.mongodb.net/journalsDb?retryWrites=true&w=majority', {
    useNewUrlParser: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});
// Declare the Schema of the Mongo model
var JournalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
//Export the model
const journal = mongoose.model('Journal', JournalSchema);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use('/static', express.static(__dirname + '/public'));
app.use(express.static('views'))
app.get('/', (req, res) => {

    res.render('home', {});
});

app.get('/view', (req, res) => {
    journal.find({

    }, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err)
        } else {
            if (docs.length === 0) {
                console.log("message")
                res.render('view', { startingContent: homeStartingContent, posts: docs });
            } else {
                res.render('view', { startingContent: homeStartingContent, posts: docs });
            }
        }
    });

});
app.get('/contact', (req, res) => {
    res.render('contact', { aboutContent: aboutContent });
});
app.get('/compose', (req, res) => {
    res.render('compose', { aboutContent: aboutContent });
});
app.post('/compose', (req, res) => {
    const obj = new journal({ title: lodash.upperFirst(req.body.title), content: req.body.textArea })
    obj.save();
    res.redirect('/');
});

app.get('/posts/:subString', (req, res) => {
    subString = req.params.subString;
    subString = lodash.upperFirst(subString);
    journal.findOne({
        title: subString,
    }).then((doc) => {
        if (!doc) {
            console.log("message")
            res.redirect('/');
        } else {
            res.render('post', { title: doc.title, content: doc.content });
        }
    });
});
app.listen(process.env.PORT || 3000)