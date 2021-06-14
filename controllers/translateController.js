//require parser
const parser = require("fast-xml-parser");

//function to translate xml to json
const translate_json = (request, response, next) => {
    //error handling
    try {
        
        //code here
        var xmlData = request.body.xml;

        const jsonData = parser.parse(
            xmlData,
            {
                ignoreAttributes : true,
                ignoreNameSpace : false,
                allowBooleanAttributes : false,
                parseNodeValue : true,
                parseAttributeValue : false,
                trimValues: true,
                cdataTagName: "__cdata", //default is 'false'
                cdataPositionChar: "\\c",
                parseTrueNumberOnly: false,
                arrayMode: false, //"strict"
                stopNodes: ["parse-me-as-string"]
            },
            true
          );
          
          response.status(200).json(jsonData);

    } catch(err) {
        next(err);
    }
}

module.exports = translate_json;