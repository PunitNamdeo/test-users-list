import { Component, OnInit } from '@angular/core';
import { FilterOption } from './filter-option.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
  }

}
