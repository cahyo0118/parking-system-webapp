import { Location } from '@angular/common';
import { Environment } from './../../../../config/environment';
import { FileUploadService } from './../../../../service/file-upload.service';
import { APIService } from './../../../../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  id: any;

  showLoader: boolean = false;
  items = [];
  pageData: any;

  form: FormGroup;
  visibleFieldForm: FormGroup;
  visibleFields = [];

  actions = [];

  isUpdate: boolean = false;

  // Files
  photoPreview: any;
  photoUploadProgress: any = 0;

  menu = {
    name: 'user-form',
    display_name: 'User',
    icon: 'fas fa-users'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private apiService: APIService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private fileUploadService: FileUploadService,
    public env: Environment,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(
      routeData => {
        this.pageData = routeData;
      }
    );

    this.initForm();

    const params = this.activatedRoute.snapshot.params;

    console.log('params', params);

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', []],
      photo: ['', []],
      gender: ['', [Validators.required]],
    });

  }

  getData() {
    this.apiService.get(
      `api/users/${this.id}/detail`
    ).then(
      response => {
        const responseBody = response.data.body;

        this.form.patchValue(responseBody);

        this.form.controls.password.setValidators([]);
        this.form.controls.password.updateValueAndValidity();

      }
    );
  }

  async onPhotoChange(event: any, formControlName) {

    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {

      Swal.fire({
        title: 'Oops!',
        text: 'Only images are supported',
        icon: 'error',
      });

      return;
    }

    const reader = new FileReader();
    reader.onload = (eventReader: any) => {

      switch (formControlName) {
        case 'photo':
          this.photoPreview = eventReader.target.result;
          break;
      }

      const config = {
        onUploadProgress: function (progressEvent) {

          switch (formControlName) {
            case 'photo':
              this.photoUploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              break;
          }

        }.bind(this)
      };


      this.fileUploadService.uploadPhotoTemp(eventReader.target.result, config).then(
        response => {

          this.photoUploadProgress = 0;

          const responseBody = response.data.body;

          this.form.controls[formControlName].setValue(responseBody.fullPath);

          console.log('this.form.value', this.form.value);

          Swal.fire({
            title: 'Success!',
            text: response.data.message,
            icon: 'success',
            toast: true,
            position: 'top',
            timer: 3000
          });

        },
        error => {
          this.photoUploadProgress = 0;

          Swal.fire({
            title: 'Failed upload file',
            text: error.response.data.message,
            icon: 'error',
          });
        }
      );
    };
    reader.readAsDataURL(event.target.files[0]);


  }

  onDeletePhoto(formControlName) {
    switch (formControlName) {
      case 'photo':
        this.photoPreview = '';
        break;
    }

    this.form.controls[formControlName].setValue('');
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
            `api/users/${this.id}/update`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

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
            `api/users/store`,
            requestData
          ).then(
            response => {
              this.spinner.hide();

              Swal.fire(
                'Success!',
                response.data.message,
                'success'
              );

              this.location.back();

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
