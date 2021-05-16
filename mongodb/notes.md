# mongod => create a mongod server
# mongo => starts the mongo shell
# help
# show dbs
# use
# insert
# find
# update
# remove

C -> Create
R -> Read
U -> Update
D -> Delete/Destroy

Step 1 => Connect to database
Step 2 => declare schema
Step 3 => model a collection from schema

To Create => model.create({});
To Read => fetching many:
            => model.find({}); #find all
            => model.find({filter:filterValue}); #find some entrie(s) that meets the criteria in the object
            returns an array
        fetching one:
            => model.findOne({}); #find one
            returns an object or null
To Update => model.findOneAndUpdate({filter:filterValue},{update(s):updateValue(s)}) #find first entrie that meets the criteria in the object and update using the params in the update object
To Delete => model.deleteOne({})
            Deletes first object
            model.deleteOne({filter:filterValue})
            Deletes first object that matches filter
             