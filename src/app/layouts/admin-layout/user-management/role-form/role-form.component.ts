import { APIService } from './../../../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {

  id: any;

  showLoader: boolean = false;
  items = [];
  pageData: any;

  form: FormGroup;
  visibleFieldForm: FormGroup;
  visibleFields = [];

  actions = [];

  isUpdate: boolean = false;

  menu = {
    name: 'role-form',
    display_name: 'Role',
    icon: 'fas fa-user-tag'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        console.log('routeData', routeData);
        this.pageData = routeData;
      }
    );

    this.initForm();

    const params = this.activatedRoute.snapshot.params;

    if (params.id) {
      this.isUpdate = true;
      this.id = params.id;

      this.getData();
    } else {
      this.isUpdate = false;
    }

  }

  initForm() {

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      display_name: ['', [Validators.required]],
      description: ['', []],
    });

  }

  getData() {
    this.apiService.get(
      `api/roles/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.form.patchValue(responseBody);
      }
    );
  }

  onSubmit() {

    Swal.fire({
      title: 'Submit data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {

      if (result.value) {

        const requestData = JSON.parse(JSON.stringify(this.form.value));

        if (this.isUpdate) {
          this.spinner.show();
          this.apiService.put(
            `api/roles/${this.id}/update`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.router.navigate(['/admin/user-management/role']);

            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Failed!',
                error.response.data.message,
                'error'
              );
            }
          );
        } else {
          this.spinner.show();
          this.apiService.post(
            `api/roles/store`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.router.navigate(['/admin/user-management/role']);

            },
            error => {
              this.spinner.hide();

              Swal.fire(
                'Failed!',
                error.response.data.message,
                'error'
              );
            }
          );
        }
      }

    });

  }

}
