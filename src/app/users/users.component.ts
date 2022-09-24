import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from './user.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  isLoader: boolean = false;
  isModel: boolean = false;
  users: any = [];
  errorMsg: any;
  userId: any;
  isAlert: boolean = false;
  pageSize: number = 3;
  pageIndex: number = 0;
  searchText: string = '';
  pagination: any = [];

  @ViewChild('input') input: any;


  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
        tap((text) => {
          this.searchText = this.input.nativeElement.value;
          this.getUsers();
        })
      )
      .subscribe();
  }

  getUsers() {
    this.isLoader = true;
    this.pagination = [];
    this.userService.getAll(this.pageSize, this.pageIndex, this.searchText).subscribe((res: any) => {
      if (res.status != 200) return;
      this.users = res.response;
      this.isLoader = false;
      this.isAlert = false;
      for (let index = 0; index < res.pageCount; index++) this.pagination.push(index);        
    }, error => {
      this.errorMsg = error.message;
      this.isLoader = false;
    })
  }

  paginate(type:any, event: any) {
    if(type == 'limit') this.pageSize = event.target.value;
    else this.pageIndex = event;
    this.getUsers();
  }

  deleteItem(id: number) {
    this.isModel = true;
    this.userId = id;
  }

  onConfirm() {
    this.closeModel();
    this.isLoader = true;
    this.userService.delete(this.userId).subscribe((res: any) => {
      if (res.status != 200) return;
      this.isAlert = true;
      this.isLoader = true;
      setTimeout(() => {
        this.getUsers();
      }, 2000);
      this.isLoader = false;
    }, error => {
      console.log('error', error);
      this.errorMsg = error.message;
      this.isLoader = false;
    })
  }

  closeModel() {
    this.isModel = false;
  }

}
