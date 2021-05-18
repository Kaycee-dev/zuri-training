const app = require('express')()
const mongoose = require('mongoose');
// const connectionString = 'mongodb://localhost:27017/mynewdb';
// const connectionString = 'mongodb+srv://dev-kelechi:**************@zuritraining-nodejs.ccyw2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// const uri = process.env.MONGODB_URI || 'mongodb+srv://dev-kelechi:**************@zuritraining-nodejs.ccyw2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const uri = process.env.MONGODB_URI;
const {Schema} = mongoose;


const bodyParser = require('body-parser')
app.use(bodyParser.json())


mongoose.connect(uri, {
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
}, (err) => {
    if (err) {
        console.log({ err })
    } else {
        console.log("Database Connected!")
    }
})

const friendSchema = new Schema({
    name:String,
    email:String,
    country:String
});

const payloadSchema = new Schema({
    message:String,
    data:Object
});

const Friend = mongoose.model('Friend', friendSchema);
const Payload = mongoose.model('Payload', payloadSchema);

var friendsArray = [{
    "name": "Ramos",
    "email": "ramosgusto@gmail.com",
    "country": "Spain"
},
{
    "name": "Glow",
    "email": "glowdexcellence@gmail.com",
    "country": "Nigeria"
},
{
    "name": "Takwe",
    "email": "t4takwel01@gmail.com",
    "country": "Tanzania"
},
{
    "name": "Apiah",
    "email": "apiah@gmail.com",
    "country": "Rwanda"
}
];

// Get existing data if any
var getEmails = Friend.find({},async (err,friends) => {
    if (err) console.log({message:"Find operation failed!",data:{err}})
    else  return await friends;

}).lean().exec();

getEmails
    // Creat new friends data if email is unique
    .then(res => {
        var uniqueEmails = [];
        res.forEach(element => {
            uniqueEmails.push(element.email);
        })
        
        friendsArray.forEach(element => {

            if (!uniqueEmails.includes(element.email)) {
                uniqueEmails.push(element.email);
                Friend.create(element, (err,friend) => {
                    if (err) {
                        console.log({err})
                    } else {
                        console.log({message:"Friend created successfully!",data:{friend}})
                    };
                })
            } else {
                console.log({message:"Unique email constraint violated!"})
            }
        });
    })
    .then(async () => {
        // Get a data created
        await sleep(2000);
        Friend.find({name:"Glow"},(err,friends) => {
            if (err) console.log({message:"Find operation failed!",data:{err}})
            else {
                console.log({message:"Find operation successful!",data:`${JSON.stringify(friends)}`}
                )
            }
        
        })
        
        // Update a data created
        await sleep(2000);
        Friend
            .findOneAndUpdate({name:"Apiah"}, {name:'Xyluz Apiah',country:"Ghana"},{new: true},
                    (err,friend) => {
                    if (err) console.log({message:'An error occured during findOneAndUpdate!',data:{err}})
                        if (!friend) console.log({message:'Friend to update does not exist!',data:{friend}})
                        else {
                            friend.save((err,done) => {
                                if (err) console.log(err)
                                else console.log({message:"Friend updated successfully!",data:{done}})
                            })
                        }
                }
        
        )
        
        // Delete a data created
        await sleep(2000);
        Friend.deleteOne({name:'Ramos'},(err,friend) => {
            if (err) console.log({message:'An error occured!',data:{err}})
            if (!friend || friend.deletedCount == 0) console.log({message:'Friend to delete does not exist!',data:{friend}})
            else console.log({message:'Friend deleted successfully!',data:{friend}})
        })
    })
    .catch(err => console.log(err))

// Create four routes;

// fetch one/all friends in the database
app.get('/', (req,res) => {
    Friend.find(req.body, (err,friends) => {
        console.log(`GET request input:\n${JSON.stringify(req.body)}`);
        if (err) {
            console.log({message:"An error occured on get attempt!",data:{err}});
            return res.status(500).json({message:'An error occured!',data:{err}})
        }
        if (!friends || friends == []) return res.status(500).json({message:'No matching friend found!',data:{friends}})
        else return res.status(200).json({message:'Operation successful!',data:{friends}})
    })
})

// add a new friend to the database
app.post('/', (req,res) => {
    console.log(`POST request input:\n${JSON.stringify(req.body)}`);
    if (!uniqueEmails.includes(req.body.email)) {
        uniqueEmails.push(req.body.email);
        Friend.create(req.body, (err,friend) => {
            if (err) {
                console.log({message:"An error occured on post attempt!",data:{err}});
                return res.status(500).json({message:'An error occured!',data:{err}})
            }
            else console.log({message:"Friend added successfully!",data:{friend}});
            return res.status(200).json({message:"Friend added successfully!",data:{friend}});
        })
    }
    else {
        console.log({message:"Email address already in use!",data:`${JSON.stringify(req.body)}`});
        return res.status(400).json({message:"Email address already in use!",data:req.body});
    }
})

// update an existing friend
app.put('/', (req,res) => {
    console.log(`PUT request input:\n${JSON.stringify(req.body)}`);
    Friend
        .findOneAndUpdate(req.body.find,
            req.body.update,{new: true}, (err,friend) => {
                if (err) return res.status(500).json({message:'An error occured!',data:{err}})
                if (!friend) return res.status(200).json({message:'Friend to update does not exist!',data:{friend}})
                else {
                    friend.save((err,done) => {
                        if (err) {
                            console.log(JSON.stringify({message:'An error occured while trying to save updated friend data!',data:{err}}))
                            return res.status(500).json({message:'An error occured while trying to save updated friend data!',data:{err}})}
                        else {
                            console.log(JSON.stringify({message:'Friend updated successfully!',data:{done}}))
                            return res.status(200).json({message:'Friend updated successfully!',data:{done}})}
                    })
                }
            }

        )   
})

// delete an existing friend
app.delete('/', (req,res) => {
    console.log(`DELETE request input:\n${JSON.stringify(req.body)}`);
    Friend.deleteOne(req.body,(err,friend) => {
        if (err) return res.status(500).json({message:'An error occured!',data:{err}})
        if (!friend || friend.deletedCount == 0) {
            console.log({message:'Friend to delete does not exist!',data:`${JSON.stringify(friend)}`})
            return res.status(500).json({message:'Friend to delete does not exist!',data:{friend}})}
        else  {
            console.log({message:'Friend deleted successfully!',data:`${JSON.stringify(friend)}`})
            return res.status(200).json({message:'Friend deleted successfully!',data:{friend}})
        };
    })
})

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`App connected and running on port ${port}`))