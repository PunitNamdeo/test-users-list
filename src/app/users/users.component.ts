import { Component, OnInit } from '@angular/core';
import { FilterOption } from './filter-option.interface';
import {UsersService} from '../users.service';
import {IUserData} from '../data/schema/userData';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersService]
})

// UsersComponent class to interact with User Data API calls with the help of UsersService DI
export class UsersComponent implements OnInit {

  userList: IUserData[] = []; // user data list array
  errorMessageOfUsersData: string; // error message if api gets fail
  filteredUserList: IUserData[] = []; // filtered users data
  userForm: FormGroup; // Reactive user form
  options: FilterOption[] = [
    {
      value: 'name',
      text: 'Name'
    },
    {
      value: 'username',
      text: 'User Name'
    },
    {
      value: 'email',
      text: 'Email'
    },
    {
      value: 'phone',
      text: 'Phone'
    },
    {
      value: 'website',
      text: 'Website'
    }
  ];

  constructor(private usersService: UsersService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // set the reactive form input value
    this.userForm = this.fb.group({
      option: [null, Validators.required],
      searchText: ['']
    });
    // call the users data and filter method
    this.getUsersData();
    this.applyFilter();
  }

  // get the users data
  getUsersData(): void {
    this.usersService.getUserDataList().subscribe(data => {
      data.map(dataObj => {
        this.userList.push(dataObj);
        this.filteredUserList = this.userList;
      });
    }, (err: string) => this.errorMessageOfUsersData = err);
  }

  // filtering the user data based on column
  applyFilter(): void {
    let searchedValue: string;
    this.userForm.get('option').valueChanges.subscribe((dropdownOptionVal: string) => {
        this.userForm.get('searchText').valueChanges.subscribe((val: string) => {
            searchedValue = val.toLowerCase();
            this.filteredUserList = this.userList.filter((user: IUserData) => {
                if (dropdownOptionVal === 'name' && searchedValue) {
                  return user.name.toLowerCase().includes(searchedValue);
                }
                if (dropdownOptionVal === 'username' && searchedValue) {
                  return user.username.toLowerCase().includes(searchedValue);
                }
                if (dropdownOptionVal === 'email' && searchedValue) {
                  return user.email.toLowerCase().includes(searchedValue);
                }
                if (dropdownOptionVal === 'website' && searchedValue) {
                  return user.website.toLowerCase().includes(searchedValue);
                }
                if (dropdownOptionVal === 'phone' && searchedValue) {
                return user.phone.toLowerCase().includes(searchedValue);
                }
                return this.filteredUserList = this.userList;
            });
        });
    });
  }
}
