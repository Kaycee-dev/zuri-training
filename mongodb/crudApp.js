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

var uniqueEmails = [];
getEmails
    // Creat new friends data if email is unique
    .then(res => {
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
        await sleep(1000);
        Friend.find({name:"Glow"},(err,friends) => {
            if (err) console.log({message:"Find operation failed!",data:{err}})
            else {
                console.log({message:"Find operation successful!",data:`${JSON.stringify(friends)}`}
                )
            }
        
        })
        
        // Update a data created
        await sleep(1000);
        Friend
            .findOneAndUpdate({"email": "apiah@gmail.com"}, {name:'Xyluz Apiah',country:"Ghana"},{new: true},
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
        await sleep(1000);
        Friend.deleteOne({name:'Ramos'},(err,friend) => {
            if (err) console.log({message:'An error occured!',data:{err}})
            if (!friend || friend.deletedCount == 0) console.log({message:'Friend to delete does not exist!',data:{friend}})
            else {
                uniqueEmails = uniqueEmails.filter(email => {
                    return email !== "ramosgusto@gmail.com"
                });
                console.log({message:'Friend deleted successfully!',data:{friend}})}
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
    // confirm email is unique
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
        console.log({message:`Ceate new friend failed. Email '${req.body.email}' already registered for another user!`,data:`${JSON.stringify(req.body)}`});
        return res.status(400).json({message:`Ceate new friend failed. Email '${req.body.email}' already registered for another user!`,data:req.body});
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
                    // confirm email in update details is unique
                    let requestfindEmail = req.body.find.email !== undefined || req.body.find.email !== null ? req.body.find.email: "noEmailDetails",
                    requestUpdateEmail = req.body.update.email !== undefined || req.body.update.email !== null ? req.body.update.email: "noEmailDetails";
                    if ((!uniqueEmails.includes(requestUpdateEmail)) && JSON.stringify(req.body.find) !== JSON.stringify(req.body.update)) {
                        
                        friend.save((err,done) => {
                            if (err) {
                                console.log(JSON.stringify({message:'An error occured while trying to save updated friend data!',data:{err}}))
                                return res.status(500).json({message:'An error occured while trying to save updated friend data!',data:{err}})}
                            else {
                                uniqueEmails.push(requestUpdateEmail);
                                uniqueEmails = uniqueEmails.filter(email => {
                                    return email !== requestfindEmail || email !== "noEmailDetails"
                                });
                                console.log(JSON.stringify({message:'Friend updated successfully!',data:{done}}))
                                return res.status(200).json({message:'Friend updated successfully!',data:{done}})}
                        })
                    }
                    else {
                        // console.log({message:`Update friend failed. Email '${req.body.update.email}' already registered for another user!`,data:`${JSON.stringify(req.body.update)}`});
                        // return res.status(400).json({message:`Update friend failed. Email '${req.body.update.email}' already registered for another user!`,data:req.body.update});
                        console.log({message:`Update friend failed.`,data:`${JSON.stringify(req.body.update)}`});
                        return res.status(400).json({message:`Update friend failed`,data:req.body.update});
                    }
                }
            }

        )   
})

// delete an existing friend
app.delete('/', (req,res) => {
    console.log(`DELETE request input:\n${JSON.stringify(req.body)}`);
    var emailToDelete = "";
    // get email of friend to delete stored in db
    getEmails = Friend.find(req.body,async (err,friends) => {
        if (err) console.log({message:"Find operation failed!",data:{err}})
        else  return await friends;
    
    }).lean().exec();
    // delete email from uniqueEmails
    getEmails.then(res => {
        uniqueEmails = uniqueEmails.filter(emails => {
            return emails !== res[0].email
        });
        emailToDelete = res[0].email;
        }
    ).then(() => {
        // finally, delete the friend from db
        Friend.deleteOne(req.body,(err,friend) => {
            if (err) return res.status(500).json({message:'An error occured!',data:{err}})
            if (!friend || friend.deletedCount == 0) {
                console.log({message:'Friend to delete does not exist!',data:`${JSON.stringify(friend)}`})
                return res.status(500).json({message:'Friend to delete does not exist!',data:{friend}})}
            else  {
                console.log({message:'Friend deleted successfully!',data:`${JSON.stringify(friend)}`})
                // status code 204 does not display returned message
                return res.status(200).json({message:'Friend deleted successfully!',data:{friend}})
            };
        })
    }).catch(err => {
        console.log(`Error while getting to delete\n${err}`);
        console.log(`'Friend to delete does not exist!'`);
        if (!uniqueEmails.includes(emailToDelete)) uniqueEmails.push(emailToDelete);
        return res.status(500).json({message:'Friend to delete does not exist!',data:null})
    })
})


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`App connected and running on port ${port}`))