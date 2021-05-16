const app = require('express')()
const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/mynewdb';
const {Schema} = mongoose;


const bodyParser = require('body-parser')
app.use(bodyParser.json())


mongoose.connect(connectionString, {
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

const friendsArray = [{
    "name": "Kennedy",
    "email": "ken@gmail.com",
    "country": "Spain"
},
{
    "name": "Glow",
    "email": "glowdexcellence@gmail.com",
    "country": "Nigeria"
},
{
    "name": "Michael",
    "email": "michael01@gmail.com",
    "country": "Tanzania"
},
{
    "name": "Mike",
    "email": "mike@gmail.com",
    "country": "Ghana"
}
];

// Create Data
friendsArray.forEach(element => {
    Friend.create(element, (err,friend) => {
        if (err) {
            console.log({err})
        } else {
            console.log({message:"Friend created successfully!",data:{friend}})
        };
    })
});

// Get the data created
Friend.find({name:"Glow"},(err,friends) => {
    if (err) console.log({message:"Find operation failed!",data:{err}})
    else {
        console.log({message:"Find operation successful!",data:`${JSON.stringify(friends)}`}
        )
    }

})

// Update the data created
Friend
    .findOneAndUpdate({name:"Michael"}, {name:'Xyluz',country:"Ghana",email:"xyluz001@yahoo.com"},{new: true},
            (err,friend) => {
            // console.log(`Here is friend ID ${clientID}`)
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

// Delete the data created
Friend.deleteOne({name:'Mike'},(err,friend) => {
    if (err) console.log({message:'An error occured!',data:{err}})
    if (!friend || friend.deletedCount == 0) console.log({message:'Friend to delete does not exist!',data:{friend}})
    else console.log({message:'Friend deleted successfully!',data:{friend}})
}
)

// Create four routes;

// fetch all friends in the database
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
    Friend.create(req.body, (err,friend) => {
        if (err) {
            console.log({message:"An error occured on post attempt!",data:{err}});
            return res.status(500).json({message:'An error occured!',data:{err}})
        }
        else console.log({message:"Friend added successfully!",data:{friend}});
        return res.status(200).json({message:"Friend added successfully!",data:{friend}});
    })
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
                // return res.json(friend);
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

app.listen(5000, () => console.log('app connected'))