const axios = require("axios");
const fs = require("fs");
const URL = "http://jsonplaceholder.typicode.com/posts"

const getPost3 = async () => {
    try {const result = await axios.get(URL)
    // return result.data
    return JSON.stringify(result.data)
    }
    catch(err) {
      return err.message
    }
}

const getAwaitedResult = async () => {
return await getPost3()
}

getAwaitedResult().then(res => {
    fs.writeFile('result/posts.json', res, (err) => {
        if (err) throw err;
    })
    })
    .catch(err => console.log(err))

// var data = getAwaitedResult()
//     .then(res => {
//         return res})
//     .catch(err => console.log(err))

// console.log(getAwaitedResult);