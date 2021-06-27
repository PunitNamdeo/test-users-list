import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsersService } from './users.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {IUsersData} from './data/schema/userData';

const baseUrl = 'https://jsonplaceholder.typicode.com/users';


describe('test-users-list: UsersService unit test with mock data', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let usersDataFromServer: IUsersData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test
      providers: [UsersService]
    });
    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users data', () => {
    // dummy data of UsersService api
    usersDataFromServer = [{
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
    }];

    service.getUserDataList().subscribe(usersData => {
      expect(usersData).toEqual(usersDataFromServer, 'should return expected userData');
      expect(usersData.length).toBeGreaterThan(0);
      expect(usersData[0].name).toBe('Leanne Graham'); }, fail
    );
    // UserService should have made one request to GET user data from expected URL
    const req = httpTestingController.expectOne(`${baseUrl}`);
    expect(req.request.method).toEqual('GET');

    // fires the request using data usersDataFromServer
    req.flush(usersDataFromServer);
  });

  it('should return an error when the server returns a 404', () => {
    const msg = 'Error Code: 404';
    spyOn(service, 'handleError').and.callThrough();

    service.getUserDataList().subscribe(
      usersData => fail('expected to fail'),
      (error: HttpErrorResponse) => {
        expect(service.handleError).toHaveBeenCalled();
        expect(error).toContain(msg);
      });

    const retryCount = 2;
    for (let i = 0 ; i < retryCount; i++) {
      const req = httpTestingController.expectOne(`${baseUrl}`);
      // respond with a 404 and the error message in the body
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    }
  });

  it('should turn network error into user-facing error', () => {
    const msg = 'simulated network error';
    spyOn(service, 'handleError').and.callThrough();

    // Create mock ErrorEvent, raised when something goes wrong at the network level.
    // Connection timeout, DNS error, offline, etc
    const errorEvent = new ErrorEvent('so sad', {
      message: msg,
      // The rest of this is optional and not used.
      // Just showing that you could provide this too.
      filename: 'users.service.ts'
    });

    service.getUserDataList().subscribe(
      userData => fail('expected to fail'),
      (error: HttpErrorResponse)  => {
        expect(service.handleError).toHaveBeenCalled();
        expect(errorEvent.message).toContain(msg);
      });

    const retryCount = 2;
    for (let i = 0 ; i < retryCount; i++) {
      const req = httpTestingController.expectOne(`${baseUrl}`);

      // Respond with mock error
      req.error(errorEvent);
    }
  });

});
