YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "JSXAxisTokens",
        "JSXOperatorTokens",
        "JSXPath",
        "JSXPathFunctions",
        "JSXProcessor",
        "JSXReplacer"
    ],
    "modules": [
        "JSXPath",
        "Parser",
        "Processor",
        "Tokens"
    ],
    "allModules": [
        {
            "displayName": "JSXPath",
            "name": "JSXPath",
            "description": "JSXPath\n=======\nJSXPath is an adaptation of XPath, a querying language for XML documents, to query JSON document.\nIf you are already familiar with the construct of [XPath], using this should be a simple.\n### TODO list\n[ ] Date Time functions\n[ ] Incorporate Date Time durations into existing operators: -, +, =, != , >, >=, <, <=\n\n## Contents\n- Home\n\t- [Why JSXPath?](#why-jsx-path)\n\t- [Installation](#installation)\n\t- [Differences & Limitations](#differences-amp-limitations)\n\t- [Features](#features)\n\t\t- [Predicate Expressions](#predicate-expressions)\n\t\t- [Variables](#variables)\n\t\t- [Custom Functions](#custom-functions)\n\t\t- [Object Comparison](#object-comparison)\n- [Axis](md/AXIS.html)\n- [Functions](md/FUNCTIONS.html)\n- [Node Selection](md/NODESELECTION.html)\n- [Operators](md/OPERATORS.html)\n\n## Why JSXPath?\nIF you only require a simple retrieval of a value in an object without the need of interrigating it, eg with the json = { a: 1, b: 2}, to get the value of a, then `json.a` is enough. But if you require a more complex conditioning, sure you can write your own functions to handle it, or why not let JSXPath do that?\n\nExample return the value of json.c if the sum of values json.a and json.b is equal to 3;\n```js\nlet js = {a:1, b:2, c: \"pass\"}\n//without JSXPath\nfunction sum(pa, pb) {\nif (!isNumber(pa) || isNumber(pb)) {\n\tthrow new Error(\"an argument is not a number\");\n}\n\treturn pa + pb;\n}\n\nfunction isNumber(num) {\n\treturn !isNaN(num) && isFinite(num);\n}\n\nlet result = sum(js.a, js.b) === 3 ? js.c : null;\n----------\n// result => 'pass'\n\n// with JSXPath\nlet JSXPath = require(\"JSXPath\");\nlet jsxpath = new JSXPath(json);\n\nlet path = '/c[sum(/a, /b) = 3]';\nlet result = jsxpath.process(path);\n----------\n// result => 'pass';\n```\n\n## Installation\n\n## Differences & Limitations\nThere are some notable differences and limiations between xml and json that the query langauge do not support.\n- The '@' symbol is not used in JSXPath expression since JSON only consists of key value pair. '@' in XML denotes an attribute.\n- The axis 'preceding', 'preceding-sibling', 'following', and 'following-sibling' is currently not supported. JSON is a hash map, the keys are not always returned in a particular order. (although future implentations may involve sorting the the node set and returns the relevant siblings and nodes based on this order). \n- The operator token keywords are reserved. This means that the keys in the json cannot contain the following symbols (|,/,+, -, %, *, =, >, <) and spaces (future implemenation may cater for this using quotes to denote a key)\n\n## Features\n\n#### Node Selections, Operators, and Axes\nJSXPath supports most of the expressions found in xpath.\n\n| Node Selection | Operators | Axes \t\t\t\t|\n| -------------- | --------  | ----------------- |\n| key  \t\t\t| &#124; (todo)| self \t\t|\n| . \t \t\t \t| + \t\t| ancestor \t\t\t|\n| .. \t \t\t| - \t\t| ancestor-or-self\t|\n| / \t\t \t \t| * \t\t| child\t\t\t\t|\n| // \t\t\t| div \t\t| descendant \t\t|\n| *\t\t\t\t| = \t\t| descendant-or-self|\n| \t\t\t\t| != \t\t| parent\t\t\t|\n| \t\t\t\t| < \t\t|\t\t\t\t\t|\n| \t\t\t\t| <= \t\t|\t\t\t\t\t|\n| \t\t\t\t| > \t\t|\t\t\t\t\t|\n| \t\t\t\t| >= \t\t|\t\t\t\t\t|\n| \t\t\t\t| or \t\t|\t\t\t\t\t|\n| \t\t\t\t| and \t\t|\t\t\t\t\t|\n| \t\t\t\t| mod \t\t|\t\t\t\t\t|\n\n#### Predicate Expressions\nPredicate expressions are used to filter out node sets based on conditions within '[' ']'.\n```js\nlet JSXPath = require(\"JSXPath\");\n\nlet js = {\n\ttic: 1,\n\ttac: 10,\n\ttoe: 100,\n\tfoo: {\n\t\ttic: 2,\n\t\ttac: 20,\n\t\ttoe: 200\n\t}\n};\nlet path = '/toe[/tic = 1 and /tac > 9]';\n\nlet jsxpath = new JSXPath(js);\nlet result = jsxpath.process(path);\n----------\n// result => 100\n\nlet path = '//tac[.>1]'\nlet result = jsxpath.process(path)\n----------\n// result => [10, 20];\n\nlet path = '/toe[/tac = 3]'\nlet result = jsxpath.process(path);\n----------\n// result => [];\n```\n+ If the predicate expression resolved to be true, and the result is a single value, then that is returned.\n+ If the predicate expression resolved to be true, and the result contains multiple values, then the returned value will be an array of values.\n+ If the predicate expression resolved to false, then the returned result will be an empty array.\n\n#### Variables\nJSXPath supports variables denoted by the '$' sign.\nThe process function accepts a varible object as a second argument.\n```js\nlet JSXPath = require(\"JSXPath\");\n\nlet js = { a: 18 };\nlet path = '/a + $v1 - $v2';\nlet vars = { $v1: 19, $v2: 20 };\n\nlet jsxpath = new JSXPath(js);\nlet result = jsxpath.process(path, vars);\n----------\n// result => 17\n```\n#### Custom Functions\nAlong with predefined JSXPath functions, JSXPath can also support custom functions.\nThe new JSXPath constructor accepts a custom function object as a second argument.\n\n`note` the custom function will overwrite the predefined functions if they both share the same function name.\n```js\nlet JSXPath = require(\"JSXPath\");\nlet customFunctions = {\n    max: (args, validator) => {\n\t\tlet max = validator.validateNumber(args[0], \"max()\", true);\n\t\tfor (let i = 1; i < args.length; i++) {\n\t\t\tlet n = validator.validateNumber(args[i], \"max()\", true);\n\t\t\tif (n > max) {\n\t\t\t  max = n;\n\t\t\t}\n\t\t}\n\t\treturn max;\n    }\n};\nlet js = {\n\ta: 1,\n\tb: 2,\n\tc: 3\n};\n\nlet jsxpath = new JSXPath(js, customFunctions);\nlet path = 'max(/a, /b, /c)';\nlet result = jsxpath.process(path);\n----------\n// result => 3\n```\n*__Note:__ the arguments passed in the function can be a number of values:*\n- a primitive data type (number, string, boolean, undefined, null) value,\n- a node object in the form of {parent:.., name:..., children:[...], value:...},\n- an array or a node that has a value of an array of values. TODO: relook at above and this current point.\n\nJSXPath provides a number of handy validate helper that can check if an argument is a certain dataType. If it is a valid type then it will return the value otherwise returns null. This can be accessed via the second argument in the custom function.\n\n- `validateString( val, caller, throwError )`\n\t- returns the value string if valid otherwise returns null or throw an error if throwError is set to true\n- `validateNumber( val, caller, throwError )`\n\t- returns the number value if valid otherwise returns null or throw an error if throwError is set to true\n- `validateNode( val, caller, throwError )`\n\t- returns the node object if valid otherwise returns null or throw an error if throwError is set to true\n- `validateBoolean( val, caller, throwError )`\n\t- returns the boolean value if valid otherwise returns null or throw an error if throwError is set to true\n- `validateObject( val, caller, throwError )`\n\t- returns the object value if valid otherwise returns null or throw an error if throwError is set to true\n- `isArray( val, caller, throwError )`\n\t- returns the array value if valid otherwise returns null or throw an error if throwError is set to true\n\nThe `val` argument can either be a primitive, array or a node object value. If it's a node object, it will look for and check against val.value in order to determine if it is a valid data type.\n\n#### Object Comparison\nJSXPath has the ability to compare pure JSON objects in the path expression.\n```js\nlet JSXPath = require(\"JSXPath\");\nlet js = {\n\ta: 1,\n\tb: {c: 2}\n};\nlet jsxpath = new JSXPath(js);\nlet path = '/b = {\"c\": 2}';\nlet result = jsxpath.process(path);\n----------\n// result => true\n```\n//or by using varibles to store the object;\n\n```js\nlet vars = { $c: {c:2} };\nlet path = '/b = $c';\nlet result = jsxpath.process(path, vars);\n----------\n// result => true\n```\n*__Note:__  The json expression must be a valid json format. Only equal (=) and not equal (!=) can be used for object comparison."
        },
        {
            "displayName": "Parser",
            "name": "Parser"
        },
        {
            "displayName": "Processor",
            "name": "Processor"
        },
        {
            "displayName": "Tokens",
            "name": "Tokens",
            "description": "JSXPath \n=======\n- [Home](../README.html)\n- Axis\n- [Functions](FUNCTIONS.html)\n- [Node Selection](NODESELECTION.html)\n- [Operators](OPERATORS.html)\n\n# Axis\n#### [*](#) , [..](#) , [siblings](#) , [descendant](#) , [descendant-or-self](#) , [ancestor](#) , [ancestor-or-self](#) , [//](#) , [self](#) , [parent](#)\nAxis expressions are used to navigate around the node tree to retrieve a node set relative to the current node"
        }
    ],
    "elements": []
} };
});