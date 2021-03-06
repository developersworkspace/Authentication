// Imports
import * as mongodb from 'mongodb';

// Import models
import { Client } from './../models/client';

export class ClientRepository {

    constructor(private mongoDbConfig: any, private mongoClient: any) { }

    create(name: string, id: string, secret: string): Promise<Boolean> {
        return new Promise((resolve: Function, reject: Function) => {
            this.mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('clients');
                    collection.insertOne({ clientId: id, clientSecret: secret, name: name }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (result == null) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        }
                        db.close();
                    });
                }
            });
        });
    }

    findByIdAndSecret(id: string, secret: string): Promise<Client> {
        return new Promise((resolve: Function, reject: Function) => {
            this.mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('clients');
                    collection.findOne({ clientId: id, clientSecret: secret }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else if (result == null) {
                            resolve(null);
                        } else {
                            resolve(new Client(result.name, result.clientId, result.clientSecret));
                        }
                        db.close();
                    });
                }
            });
        });
    }

    findById(id: string): Promise<Client> {
        return new Promise((resolve: Function, reject: Function) => {
            this.mongoClient.connect('mongodb://' + this.mongoDbConfig.server + ':27017/' + this.mongoDbConfig.database, (err: Error, db: mongodb.Db) => {
                if (err) {
                    reject(err);
                } else {
                    var collection = db.collection('clients');
                    collection.findOne({ clientId: id }, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else if (result == null) {
                            resolve(null);
                        } else {
                            resolve(new Client(result.name, result.clientId, result.clientSecret));
                        }
                        db.close();
                    });
                }
            });
        });
    }
}