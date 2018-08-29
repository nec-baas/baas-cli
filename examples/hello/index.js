'use strict';

exports.sayHello = function (event, context) {
    let name = "John Doe";
    if (context.clientContext.queryParams.name) {
        name = context.clientContext.queryParams.name[0];
    }

    const response = {
        message: "Hello world, " + name + " !!!"
    };
    context.succeed(response);
};

