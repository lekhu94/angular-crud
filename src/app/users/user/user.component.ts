import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  isLoader: boolean = false;
  userId: number = NaN;
  isEditForm: boolean = false;
  isAlert: boolean = false;
  alertMessage: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private userService: UserService,
    private location: Location
  ) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(16)]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(16), Validators.pattern("^[0-9]*$")]]
    })
  }

  ngOnInit(): void {
    let url: any = this.route.url.split('/')[2];
    url = Number(url)
    if (url > 0) {
      this.isEditForm = true;
      this.userId = Number(url);
      this.getUser(this.userId);
    } else this.isEditForm = false;
  }

  getUser(id: number) {
    this.userService.get(id).subscribe((res: any) => {
      if (res.status != 200) return;
      this.isLoader = false;
      this.patchForm(res.response[0]);
    }, error => {
      console.log('post error', error);
      this.isLoader = false;
    })
  }

  patchForm(data: any) {
    this.form.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoader = true;
    if (this.userId > 0) this.update();
    else this.save();
  }

  save() {
    this.userService.add(this.form.value).subscribe((res: any) => {
      if (res.status != 200) {
        this.isLoader = false;
        this.isAlert = true;
        this.alertMessage = res.message;
        setTimeout(() => {
          this.isAlert = false;
        }, 1000);
        return;
      };
      this.isAlert = true;
      this.alertMessage = res.message;
      setTimeout(() => {
        this.location.back();
        this.isLoader = false;
      }, 1000);
    }, error => {
      this.isLoader = false;
    })
  }

  update() {
    this.userService.edit(this.form.value, this.userId).subscribe((res: any) => {
      if (res.status != 200) return;
      this.isAlert = true;
      this.alertMessage = res.message;
      setTimeout(() => {
        this.location.back();
        this.isLoader = false;
      }, 1000);
    }, error => {
      this.isLoader = false;
    })
  }

}
