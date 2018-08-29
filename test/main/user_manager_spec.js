"use strict";

const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');

const resetCommander = require('../utils/reset_commander');

const UserManager = require('../../lib/main/user_manager');

const mocks = require('../mock/mocks');
const MockProcess = mocks.MockProcess;

let manager;
let nebula;

describe('UserManager', function() {
    describe('Create User', function () {
        beforeEach(function () {
            resetCommander();
            manager = new UserManager();
            nebula = new mocks.MockNebula();
            manager.setNebula(nebula);
        });

        it("正常にユーザ登録できること", function () {
            const user = new nebula.User();
            const mockUser = sinon.mock(user);
            mockUser.expects("set").withArgs("username", "user1");
            mockUser.expects("set").withArgs("email", "user1@example.com");
            mockUser.expects("set").withArgs("password", "pass1");

            mockUser.expects("register").returns(Promise.resolve(user));

            const mockManager = sinon.mock(manager);
            mockManager.expects("newUser").returns(user);

            manager.process = new MockProcess("-u user1 -e user1@example.com -p pass1");
            manager.create();

            mockUser.verify();
            mockManager.verify();
        });
    });

    describe('Delete User', function() {
        beforeEach(function () {
            resetCommander();
            manager = new UserManager();
            nebula = new mocks.MockNebula();
            manager.setNebula(nebula);
        });

        it("ID指定でユーザ削除できること", function() {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({_id: "id1"}).returns(Promise.resolve([user]));
            sinon.mock(manager).expects("removeUser");

            manager.process = new MockProcess("-i id1");
            manager.delete();
        });
        it("ユーザ名指定でユーザ削除できること", function() {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({username: "user1"}).returns(Promise.resolve([user]));
            sinon.mock(manager).expects("removeUser");

            manager.process = new MockProcess("-u user1");
            manager.delete();
        });

        it("E-mail指定でユーザ削除できること", function() {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({email: "user1@example.com"}).returns(Promise.resolve([user]));
            sinon.mock(manager).expects("removeUser");

            manager.process = new MockProcess("-e user1@example.com");
            manager.delete();
        });

        it("引数指定無し時にエラーになること", function() {
            manager.process = new MockProcess(null);
            (() => manager.delete()).should.throw("exit 1");
        });
    });

    describe('Query User', function() {
        beforeEach(function () {
            resetCommander();
            manager = new UserManager();
            nebula = new mocks.MockNebula();
            manager.setNebula(nebula);
        });

        // TODO:
        /*
        it("ID指定検索できること", function () {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({_id: "id1"}).returns(Promise.resolve([user]));

            manager.process = new MockProcess("-i id1");
            manager.query();
            // TODO: log check
        });
         */

        it("ユーザ名指定検索できること", function () {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({username: "user1"}).returns(Promise.resolve([user]));

            manager.process = new MockProcess("-u user1");
            manager.query();
            // TODO: log check
        });

        it("E-mail指定検索できること", function () {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({email: "user1@example.com"}).returns(Promise.resolve([user]));

            manager.process = new MockProcess("-e user1@example.com");
            manager.query();
            // TODO: log check
        });

        it("全件検索できること", function () {
            const user = new nebula.User();
            sinon.mock(manager).expects("queryUser").withArgs({}).returns(Promise.resolve([user]));

            manager.process = new MockProcess(null);
            manager.query();
            // TODO: log check
        });
    });
});
