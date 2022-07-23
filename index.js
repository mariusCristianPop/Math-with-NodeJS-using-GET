//Lets require/import the HTTP module
var http = require("http")

//Lets define a port we want to listen to
const PORT = 3000

//Create a server
var server = http.createServer(handleRequest)

//We need a function which handles requests and send response
function handleRequest(request, response) {
    let string = request.url.toString()
    string = string.substring(1) //remove the "\" char
    let sign = findSign(string)
    if (sign !== "Unknown format") {
        let signIndex = string.indexOf(sign)
        let leftNumber = findNumber(string, signIndex, "left")
        let rightNumber = findNumber(string, signIndex, "right")
        let result = math_it_up[sign](leftNumber, rightNumber)
        response.end(result.toString())
    } else {
        response.end(`Expecting format: "a+b", "a-b", "a/"b, "a*b" `)
    } 
}

// Function to find the numbers from both sides of the operator
function findNumber(string, signIndex, side) {
    let number = 0;
    let decimalsCounter = 0;
    if (side === "left") {
        for (let i = 0; i < signIndex; ++i) { // parse the number from 0 until signIndex - 1
            if (string[i] === ".") { // store the number of decimals after the "."
                decimalsCounter = signIndex - i - 1
            } else {
                number *= 10
                number += parseInt(string[i])
            }
        }
    } else {
        for (let i = signIndex + 1; i < string.length; ++i) { // parse the number from signIndex + 1 for the rest of the string's length
            if (string[i] === ".") { // store the number of decimals after the "."
                decimalsCounter = string.length - i - 1
            } else {
                number *= 10
                number += parseInt(string[i])
            }
        }
    }
    return number / (10 ** decimalsCounter) // used exponentiation js function to return the number as a float. 
}

// Function to make a mathematical operation based on sign
let math_it_up = {
    "+": function (x, y) {
        return x + y
    },
    "-": function (x, y) {
        return x - y
    },
    "/": function (x, y) {
        return x / y
    },
    "*": function (x, y) {
        return x * y
    },
}

//Function for finding the mathematical operator inside a string
function findSign(string) {
    let occurencesCounter = 0
    let sign = ""
    for (let i = 0; i < string.length, occurencesCounter > 1; ++i) {
        if (string[i] === "/") {
            ++occurencesCounter
            sign = "/"
        }
        if (string[i] === "*") {
            ++occurencesCounter
            sign = "*"
        }
        if (string[i] === "-") {
            ++occurencesCounter
            sign = "-"
        }
        if (string[i] === "+") {
            ++occurencesCounter
            sign = "+"
        }
    }

    const pattern = /[^0-9+\-\/*]/i
    if (!pattern.test(string)) {
        if (occurencesCounter === 1) {
            return sign
        }
        return "Unknown format"
    } 
    return "Unknown format"
}

//Lets start our server
server.listen(PORT, function () {
  //Callback triggered when server is successfully listening!
  console.log("Server listening on: http://localhost:%s", PORT)
});
