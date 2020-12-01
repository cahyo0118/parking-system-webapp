import { APIService } from './../../service/api.service';
import { Router } from '@angular/router';
import { Helpers } from './../../service/helper';
import { AuthService } from './../../service/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Environment } from 'src/app/config/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  credential: any;
  user: any;
  form: FormGroup;
  loading: any;
  input: any

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private apiService: APIService,
    private router: Router,
    public helpers: Helpers,
    public env: Environment,
  ) { }



  ngOnInit() {
    this.credential = JSON.parse(localStorage.getItem('credential'));
    this.user = JSON.parse(localStorage.getItem('user'));
    this.initForms();
    this.onCheckLogin();
  }
  initForms() {
    this.form = this.formBuilder.group({
      // username: ['admin@mail.com', [Validators.required]],
      // password: ['123456', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      keepLoggedIn: [true, [Validators.required]],
    });
  }

  onCheckLogin() {
    if (this.credential && this.user) {
      this.router.navigate(['/admin']);
    }
  }

  async onSubmit() {

    this.spinner.show();

    this.authService.login(this.form.value).then(
      response => {
        this.spinner.hide();
        console.log('response', response.data.data);

        localStorage.setItem('credential', JSON.stringify(response.data.body.credential));
        localStorage.setItem('user', JSON.stringify(response.data.body.user));

        Swal.fire(
          'Success!',
          response.data.message,
          'success'
        );

        this.router.navigate(['/admin']);
      },
      error => {
        this.spinner.hide();
        console.log('error', error.response.data);

        Swal.fire(
          'Error!',
          error.response.data.message,
          'error'
        );
      }
    );

  }

  ngOnDestroy() {

  }

}
