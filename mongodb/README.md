# zuri-training
Repository for solutions to tasks from zuri 2021 training, Back-end track: Node-js

###  SIMPLE DOCUMENTATION OF ROUTES FOR CRUD APP WITH DATABASE
#####
Heroku hosted link https://crud-application-with-database.herokuapp.com/

* In postman, ensure your Headers has the following setting: Content-Type : application/json
* Body should be set as raw and type as JSON from the dropdown to the right
* Set request url to https://crud-application-with-database.herokuapp.com/

### API Endpoints
 | HTTP Verbs | Endpoints | Action |
 | :--- | :---: | :--- |
 | GET | ('/') | Retrieve details of user(s)  |
 | POST | ('/') | Create a new user with **unique email** |
 | PUT | ('/') | Edit details of a user |
 | DELETE | ('/') | Delete a user |

# Use GET to display current entries of friends in the db
* Empty object {} as input equates to find all
* Object with key:value pairs further filters the find request
* Eample JSON API input for filtered find
{
    "name" : "Kennedy"
}

# Example JSON API response for GET

{
    "message": "Operation successful!",
    "data": {
        "friends": [
            {
                "_id": "60a0fd5dd52d7a851881e642",
                "name": "Kennedy",
                "email": "ken@gmail.com",
                "country": "Spain",
                "__v": 0
            }
        ]
    }
}


# Use POST to create a new friend in the db
* Input object should match schema below
{
    "name":String,
    "email":String,
    "country":String
}

* Example JSON API request for POST
{
    "name": "Mike",
    "email": "mike@gmail.com",
    "country": "Nigeria"
}

* Example JSON API response for POST
{
    "message": "Friend added successfully!",
    "data": {
        "friend": {
            "_id": "60a14beb50e6e798e4cb5172",
            "name": "Mike",
            "email": "mike@gmail.com",
            "country": "Nigeria",
            "__v": 0
        }
    }
}

# Use PUT to update a record of a friend in the db
* Example JSON API request for PUT
{
    "find":{
        "name": "Mike",
        "email": "mike@gmail.com",
        "country": "Nigeria"
    },
    "update":{
        "name": "Michael",
        "email": "michael01@gmail.com",
        "country": "Tanzania"
    }
}

* Example JSON API response for PUT
{
    "message": "Friend updated successfully!",
    "data": {
        "done": {
            "_id": "60a14beb50e6e798e4cb5172",
            "name": "Michael",
            "email": "michael01@gmail.com",
            "country": "Tanzania",
            "__v": 0
        }
    }
}



# Use DELETE to delete a record of a friend in the db
* Example JSON API request for DELETE
{
    "name": "Mike"
}
* Example JSON API response for DELETE
{
    "message": "Friend deleted successfully!",
    "data": {
        "friend": {
            "n": 1,
            "ok": 1,
            "deletedCount": 1
        }
    }
}

#####
Heroku hosted link https://crud-application-with-database.herokuapp.com/