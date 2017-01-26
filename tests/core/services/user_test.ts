import { UserService } from './../../../core/services/user';
import { CredentialsRepository } from './../../../core/repositories/credentials';
import 'mocha';
import { expect } from 'chai';

describe('UserService', () => {
    let userService: UserService;
    let credentialsRepository: CredentialsRepository;

    beforeEach(function (done: Function) {
        let mongoDbConfig = {
            server: 'localhost',
            database: 'authentication'
        };

        credentialsRepository = new CredentialsRepository(mongoDbConfig);

        userService = new UserService(credentialsRepository);

        credentialsRepository.clear().then((result) => {
            credentialsRepository.create('test-client-id', 'test-username', 'test-password').then((result) => {
                done();
            }).catch((err: Error) => {
                done(err);
            });
        }).catch((err: Error) => {
            done(err);
        });
    });

    describe('create', () => {
        it('should succeed given non-existing username', (done) => {
            let result = userService.create('test-client-id1', 'test-username1', 'test-password1')
                .then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
        
        it('should fail given existing username', (done) => {
            let result = userService.create('test-client-id', 'test-username', 'test-password')
                .then((result) => {
                    done(new Error('Expected Error'));
                }).catch((err: Error) => {
                    done();
                });
        });

        it('should succeed given existing username with different clientId', (done) => {
            let result = userService.create('test-client-id1', 'test-username', 'test-password')
                .then((result) => {
                    done();
                }).catch((err: Error) => {
                    done(err);
                });
        });
    });
});