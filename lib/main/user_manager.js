/*
 * NEC Mobile Backend Platform
 *
 * Copyright (C) 2014-2018, NEC Corporation
 */
/**
 * ユーザ管理
 */
'use strict';

const BaseManager = require('./base_manager');

let program;

class UserManager extends BaseManager {
    constructor() {
        super();
        program = require('commander');
    }

    setNebula(nebula) {
        this.Nebula = nebula;
        return this;
    }

    newUser() {
        return new this.Nebula.User();
    }

    queryUser(query) {
        return this.Nebula.User.query(query);
    }

    removeUser(user) {
        return this.Nebula.User.remove(user);
    }

    create() {
        program
            .option("-u, --username <username>", "username")
            .option("-e, --email <email>", "E-mail address")
            .option("-p, --password <password>", "password")
            .parse(this.process.argv);

        if (!program.username) {
            console.error("No --username option.");
            this.exit(1);
        }
        if (!program.email) {
            console.error("No --email option.");
            this.exit(1);
        }
        if (!program.password) {
            console.error("No --password option.");
            this.exit(1);
        }

        const user = this.newUser();
        user.set("username", program.username);
        user.set("email", program.email);
        user.set("password", program.password);

        return user.register()
            .then((user) => {
                console.log(user);
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    delete() {
        program
            .option("-i, --userid <userid>", "user id")
            .option("-u, --username <username>", "username")
            .option("-e, --email <email>", "E-mail address")
            .parse(this.process.argv);

        const query = {};
        if (program.userid) {
            query._id = program.userid;
        }
        else if (program.username) {
            query.username = program.username;
        }
        else if (program.email) {
            query.email = program.email;
        } else {
            console.error("No userid, username, nor email option.");
            this.exit(1);
        }

        this.queryUser(query)
            .then((users) => {
                if (users.length == 0) {
                    console.error("No such user");
                    this.exit(1);
                }
                return this.removeUser(users[0]);
            })
            .then(() => {
                console.log("Successfully deleted.");
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

    query() {
        program
            .option("-u, --username <username>", "username")
            .option("-e, --email <email>", "E-mail address")
            .option("-i, --userid", "user id")
            .parse(this.process.argv);

        const query = {};
        if (program.userid) {
            query._id = program.userid;
        }
        else if (program.username) {
            query.username = program.username;
        }
        else if (program.email) {
            query.email = program.email;
        }

        this.queryUser(query)
            .then((users) => {
                for (let i = 0; i < users.length; i++) {
                    // remove unused fields
                    delete users[i].password;
                    delete users[i].sessionToken;
                    delete users[i].expire;
                }
                console.log(JSON.stringify(users, null, "  "));
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}

module.exports = UserManager;

